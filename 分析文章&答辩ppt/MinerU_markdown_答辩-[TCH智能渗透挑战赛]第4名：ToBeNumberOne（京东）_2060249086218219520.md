# AI 渗透 Agent 的减法哲学

京东科技 张孝林

AI 

# ToBeNumberOne

京东科技云安全团队是京东集团旗下专注于云计算安全领域的核心技术团队。依托京东在电商、物流、金融、工业、健康、云计算等超大规模业务场景中积累的安全实战经验，团队致力于为产业界提供国内一流的企业级全栈安全解决方案。

团队成员深耕一线攻防实战，聚焦 AI for Security 与 Security for AI 领域，以新一代智能技术构筑全链路安全底座。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/97a78554e87b05f7a81d4375ce7b8d144c4dfd9d05f6a68c77c34437136752e1.jpg)



以技术为矛，以安全为盾


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/bba977faff951cda478dbd66e855888ff41bcd616a9a15477e828449788bac3a.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/3845c1d82bf9386f6f3b0ea5555b28a441ae84e2c52357497a35f900aa00b70f.jpg)



Lucifer_0


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/b891d7fe51b87b69205a9c5b9f5c5e45384f3c8fcb06182ebab93a0c4d49d823.jpg)



Archive


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/f290552b043823e77e9de3e99594a6063fdba547a0917ebd4db132fa75160e61.jpg)



Loki


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/3d6ffbb1084d4e3e0bcc20ec8d319be6e2060398cbac93d7916800cae008316a.jpg)



梅苑


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/fd4b88cee5794f611d6ad9ea76ba99100f96d9f8838bf3c4924cab9e18c24d4c.jpg)



Z5


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/fc686106e4fcae04aeecd3beebd6ef8373cdef8c803493c5e8df332df16bb805.jpg)



b40du


# 目录

PART 01 设计理念

PART 02 架构实现

PART 03 未来展望

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/e14b77afb87f0607aa31f426e42c48c59ea8fc0e9e1950ae824d60b558f037ec.jpg)


# PART 01

# 设计理念

# AI

# Agent 设计的减法哲学

# Less Structure More Intelligence

# Less Tech More Business

# One Agent, All Scenarios

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/8f66be58fb36fdb61a1bd40f4c4252553eda17c5f7e0a65f68b929a151a632bd.jpg)


# PART 02

# 架构实现

# AI

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/8c0d99da376f86a25f3f8d908c01c98e6156dbdc9ae18eb325922bb0e681a6bf.jpg)


# 传统人工/Agent 红队攻击思路

情报收集 [OSINT]

边界突破〔初始权限〕

权限维持 + 隧道代理

权限提升+凭据获取

内网侦查〔横向移动〕

核心控制〔痕迹清理〕

# 核心问题

1. 在长链路的红队攻防流程中，如何指挥一支 Agent 军队，自主、持续、协同地打一整张内网？传统C2 架构是否能接入AI能力。

2. 如何在全链路攻防中快速适配各类渗透环境〔Web应用、服务集群、云上云下内网、域环境〕。

3. Agent如何去感知环境、如何更好的识别网站的业务意图，进行贴近业务向的漏洞挖掘。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/7a2f00694a0cc992ffcfcc1adb978458dacb344aabac57b8e949970158c88a69.jpg)


# Agentic C2 Server

# Agent Brain · LLM

等待事件 → 分析决策 → 下发任务 → 更新状态
Wait Decide Dispatch Update

# Global State

网络拓扑: 192.168.10.0/24 · 网段

已扫描：24 alive·端口/指纹/服务

已RCE: 172.19.0.4 [web] · 172.19.0.3 [redis]

Core Info: 凭据摘要·高价值标签·票据

# Tools Gateway

Scan: fscanf · adinfo · ladon · nuclei 

Basic: python · zip · nc 

AD: zerologon · Rubeus · mimikatz 

Exploit: yso · impacket 

# Legacy C2 Core

Command And Control 

File Manager 

Task 下发

Heart Beat 

Flag / logs 

# Node Agent

# Agentic Node #1

Independent Agent [自主/受控]

Agent Loop · Perceive -> Plan -> Act -> Reflect 

RCE -> 自主传播策略->投递Node Agent

Common Skills 

Logs · Core info 

Custom Skills 

Flag · Tools-help 

# Agentic Node #2

Independent Agent [自主/受控]

Agent Loop · Perceive -> Plan -> Act -> Reflect 

RCE -> 自主传播策略->投递Node Agent

Common Skills 

Logs · Core info 

Custom Skills 

Flag · Tools-help 

Golang - Windows · Linux · MacOS 

Request 

Response 

# Target

# Attack Surface

Web / API 

Web Attack surface · Swagger API ... 

Port 

SSH / FTP / SMB / RDP / MongoDB ... 

Framework 

Shiro、Struts2、Fastjson、Weblogic … 

Active Directory 

DC · Exchange · Kerberos · PrintSpooler 

Cloud 

K8s · Container Escape · IAM … 

Agent列表

下发命令

执行结果

全部Flag

扫描 / RCB

日志

# Agent列表

上次更新17:33:01

0 在线 / 4 台

筛选 按 agent ID、IP、状态、时间过滤...

<table><tr><td>AGENT ID</td><td>连接</td><td>上报状 态</td><td>主机IP</td><td>最近心跳时间</td><td>队 列</td><td>心跳摘要</td><td>操作</td></tr><tr><td>2df803dd2412-1672</td><td>离线</td><td>idle</td><td>172.19.0.4</td><td>2026-04-16T15:47:23.5387800 74+08:00 1 小时前</td><td>0</td><td>{&quot;agent_id&quot;:&quot;2df803dd2412-1672&quot;,&quot;h...}</td><td>复制 ID</td></tr><tr><td>2df803dd2412-1699</td><td>离线</td><td>idle</td><td>172.19.0.4</td><td>2026-04-16T15:47:34.5507733 04+08:00 1 小时前</td><td>0</td><td>{&quot;agent_id&quot;:&quot;2df803dd2412-1699&quot;,&quot;h...}</td><td>复制 ID</td></tr><tr><td>654aa4b188f8-1981</td><td>离线</td><td>idle</td><td>172.18.0.5</td><td>2026-04-16T16:29:39.596575 021+08:00 1 小时前</td><td>0</td><td>{&quot;agent_id&quot;:&quot;654aa4b188f8-1981&quot;,&quot;h...}</td><td>复制 ID</td></tr><tr><td>654aa4b188f8-1990</td><td>离线</td><td>idle</td><td>172.18.0.5</td><td>2026-04-16T16:29:53.668666 759+08:00 1 小时前</td><td>0</td><td>{&quot;agent_id&quot;:&quot;654aa4b188f8-1990&quot;,&quot;h...}</td><td>复制 ID</td></tr></table>

# 已扫描

RCE 

Flags 

列表JSON

```json
[
    {
    "target": "172.18.0.5",
    "first_seen": "2026-04-16T11:04:20.551329781+08:00",
    "last_seen": "2026-04-16T11:59:49.439664945+08:00",
    "last_reported_by_agent_id": "741c61d3b35e-32156",
    "report_count": 4
    },
    {
    "target": "http://172.18.0.1:8083",
    "first_seen": "2026-04-16T11:43:38.113862013+08:00",
    "last_seen": "2026-04-16T11:43:38.113862013+08:00",
    "last_reported_by_agent_id": "741c61d3b35e-1197",
    "report_count": 1
    },
    {
    "target": "http://172.18.0.2:8089",
    "first_seen": "2026-04-16T11:43:38.113658343+08:00",
    "last_seen": "2026-04-16T11:43:38.113658343+08:00",
    "last_reported_by_agent_id": "741c61d3b35e-1197",
    "report_count": 1
    },
    {
    "target": "ssh://172.18.0.1:22",
    "first_seen": "2026-04-16T11:43:38.113616487+08:00",
    "last_seen": "2026-04-16T11:43:38.113616487+08:00", 
```

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/75b4ff0bcec89816668fceb404e93f8d51324e274d06411f2fde1f3c5dfa635a.jpg)


# Subagent 管理端

Bearer Token（与 -token 一致

刷新列表

选中 agent 后自动加载最近结果；也可手动填写后点「刷新结果」。

# 全部Flag（去重）

合并展示：POST /api/agent/flag 主动上报与 POST /api/agent/logs 的 content 正则扫描（flag {...} / flag-{...} / hws {...} / ctf {...} 等，flag/hws 与 -）。同一 flag 字符串只保留一行，「来源」会累计多条渠道。

查看范围

全部（去重）

赛题正确1条

赛题判定正确的 Flag (data.correct === true)

flag{2a8ff91af8a2a41a081788e29a552bd5} 

<table><tr><td>#</td><td>FLAG</td><td>来源</td><td>AGENT</td><td>目标</td><td>次数</td><td>首次发现</td><td>最近</td></tr><tr><td>1</td><td>flag{2a8ff91af8a2a41a081788e29a552bd5}复制</td><td>POST /api/agent/flag</td><td>2df803dd2412-1699</td><td>172.19.0.3:8080</td><td>4</td><td>2026-04-16T15:46:56.40962964+08:00</td><td>2026-04-16T15:46:59.555490931+08:001小时前</td></tr><tr><td>2</td><td>flag{253a974aa772a6d06fd11e7b62f483b8}复制</td><td>POST /api/agent/flag</td><td>2df803dd2412-1699</td><td>172.19.0.3:8080</td><td>4</td><td>2026-04-16T15:41:48.174445804+08:00</td><td>2026-04-16T15:41:49.551818614+08:001小时前</td></tr><tr><td>3</td><td>flag{2bc2ddce96964984bbd272a116d210e5}复制</td><td>POST /api/agent/flag·POST /api/agent/logs 正文扫描</td><td>654aa4b188f8-1990</td><td>main_agent_autonomous-agent.log</td><td>13</td><td>2026-04-16T14:52:14.324390299+08:00</td><td>2026-04-16T15:36:19.02991934+08:001小时前</td></tr><tr><td>4</td><td>flag{5c1fa950a4d79fda71f93a7fc5188441}复制</td><td>POST /api/agent/flag·POST /api/agent/logs 正文扫描</td><td>2df803dd2412-1699</td><td>172.19.0.2:6379</td><td>21</td><td>2026-04-16T14:21:41.947479084+08:00</td><td>2026-04-16T15:14:02.41844857+08:002小时前</td></tr><tr><td>5</td><td>flag{f2efebe0081b073e89665b829c7c5454}复制</td><td>POST /api/agent/flag</td><td>host-1234</td><td>main_agent_autonomous-agent.log</td><td>8</td><td>2026-04-16T14:52:14.338280726+08:00</td><td>2026-04-16T15:07:01.619666141+08:002小时前</td></tr><tr><td>6</td><td>flag{22647c307a1a2f6c8fc84085938be232}复制</td><td>POST /api/agent/flag</td><td>host-1234</td><td>main_agent.log</td><td>4</td><td>2026-04-16T14:19:06.278093106+08:00</td><td>2026-04-16T14:19:52.298887855+08:003小时前</td></tr></table>

# 上下文 [Context]

# 对话历史自动压缩

摘要旧段，保留最新step详细信息

上下文窗口不溢出，语义不丢失

# 工具结果压缩

压缩tool I/O, 消减冗余输出

避免工具噪声污染上下文

# 持久化记忆 [MEMORY.MD]

长期记忆/跨会话记忆 落盘

# Agent Loop

Perceive 

Plan 

Act 

Reflect 

append 

# Basic Function

# C2基本能力

C2 Heartbeat [命令与控

制心跳]

日志上报与回传 [scan、

rce、agent log、flag) 

# Node 基本能力

HTTP API · SHELL & File 

Scan / RCE List去重

SOCKS代理·跳板流量出口

call 

# 内置工具-扩展

# 原生Tools:

bash 

script 

Ai search 

read 

write 

edit 

# 原生Skills:

rce-follow·用于node agent的传播

Tools-help · 用于Agent自行决策tools调用

# Skills能力补充:

Skill 动态注册，能力可热插拔。

# Node Agent

Agent Loop: 

Perceive -> Plan -> Act -> Reflect 

# 需要工具时

→ 查询工具平台

→ 读 README → 执行

上下文干净，专注任务本身

查询工具

工具返回

# Unified Tools Gateway [统一工具网关]

tools/<name>/<name>_linux<name>.exe<name>_darwin 

# qscan

Qscan.exe 

qscan_linux 

Qscan_386.exe 

README.md 

# nuclei

nuclei.exe 

nuclei_linux_amd 

nuclei_linux_386 

README.md 

# Adinfo

Adinfo_win_x64 

Adinfo_linux_adm 

Adinfo_linux_386 

README.md 

...... 

# README 是 Agent 调用 Tools 的契约

统一目录结构，Agent/Tools/<name>自动注册调用，无需固定集成

README 按需读取，需要工具时才读入获取路径·参数·格式

统一规范多平台 Win / Linux / macOS 工具命名方式，跨平台统一分发，自动适配

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/82dd405c086d7cdb3dddb442b00f81d6413ec1a775151bb8727ba796a4a7b637.jpg)


# Plan Resolve 编排器

Plan 阶段·Task Planner

基于意图+配置生成最小TaskPlan

基于browser-agent 抽象场景+API

Resove阶段·RunPlan

基于Task Plan·并行调度 SubAgent

动态更新 Task Plan

GlobalMemory·全局共享记忆

业务场景·Api接口·Neo4j知识图谱

Key Finding·凭据·漏洞

# Browser

# 浏览器能力

页面渲染·JS执行

XHR · Fetch 拦截

登陆态注入·Cookie

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/099d48659f4a8e7dc58b8578597c91acc43d827dbe9768df150073fbc54aa0ec.jpg)


# 知识图谱构建

SQLite · Neo4j 

菜单场景 -> API -> 参赛

全局 Request / Response关联

接口描述·业务逻辑

# Vuln-Test Agent · ReAct

# Scenario & Idea Generator · Plan 最小化

1. Global Memory: 业务场景·API信息·网站基本信息

2. 基于细颗粒度生成三个维度的测试

# Agent loop Detector

单API接口测试

Sql注入·SSRF·文件上传·命令注入

参赛篡改·代码执行·反射X55

# Agent loop Detector

场景安全测试

登陆场景·支付场景·订单场景

注册场景·营销场景·用户管理

# Agent loop Detector

全局漏洞测试

跨场景·多步关联·全局关联

# Review Scenario Vuln Findings & 置信度

LLM 二次审核 + 二次验证 + 置信度打分 · 漏洞信息追加 全局 Global Memory

# 节点类型定义

# Scenario Node-业务场景

Id · {task_id} login 

Name·场景

path_display · Login -> index 

Entry · 入口 URL

Depth·层级深度

# API Node

Method·请求方法

url / path 完整 URL · 归一化路径

source_page·来源页

Headers·请求头 JSON

body / status · 请求体 · 状态码

Request json · request 对象

Description·接口描述

# 关系边定义

NEXT_STEP 

CONTAINS 

USES API 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/c03595143eeac4a236d47d88b8f5cb0db2b3883502b475c667ffd9a7b616de8a.jpg)


# Agent Security Organization 安全机制设计

# 执行策略

rm -rf / · sudo · dd · shutdown · reboot 拦截 Shell 管道、多行注入、控制字符

# 熔断机制

CPU / 内存 / 磁盘资源 阈值 熔断

# 输出隔离 & 防注入

超大输出自动落盘，仅保留路径引用落盘文件权限 0o600，目录 0o700

# 限制指定目录 & 内置调用约束

文件系统：路径规范化 + 符号链接检测内置调用约束，可对内生工具进行配置

# PART 03

# 未来展望

# AI

# AI For Security

1. 攻击范式核心转变：从“人”到“智能体”

-- 攻击主体从人转变为 7×24 自主运行的 AI Agent 集群，速度、规模、持续性全面突破人类上限；

2. 新型智能对抗：AI 驱动的主动防御反制

-- 以智能对抗智能，智能蜜罐（LLM Honeypot）、智能体反制（Agent Counter-Agent）

# Security For AI

1. AI Agent 的可信执行与运行时防护

2. AI Agent 身份与行为审计体系

3. AI-SDL：面向智能体的安全开发生命周期

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/888ba98c-1a6b-4a19-bb6b-5e082bb82400/5e8342406fe8c4b70865e70dfeb27b4961a85681315c6bed57fd1a40dfab2b51.jpg)


# THANKS

# AI