# 无径之径

# Cairn AI 从渗透测试到通用问题的求解

演讲人 涕笑 @ 起零衍迹

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d4e70e091ed05e5ac1dcd5ccca670014c225a4dcde732cc2e64b3cab1ec6620e.jpg)


# 贾宇阳

- 涙笑 @起零衍迹实验室

- 成信大三叶草战队成员

- 前阿里攻防紫军

- 独立安全研究者

- TCH 第一届 第四名 [Antix]

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9ad6b5b30ef9089758cac7403cedf0b7e097f0aa21da021f825e6ba15a76c690.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/94b2710b116956fe09194fd07d6886976d4aa592214312431b58abb41f61743c.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/61c2f02d4f3ffe653ae988a476c3b91909d7b0f2cc82597b484da59b91ba428d.jpg)


# PART 01 问题的本质

# 目录

PART 02 系统设计 — 黑板、蚁群、和涌现

PART 03 Agent 角色分工是人类局限的投影

PART 04 总结

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/abdc6fed2a81ba1c8d9a2620caebaf1719ef55e2cc8f304cf2c90f663d3915f4.jpg)


# PART 01

# 问题的本质

# AI

# 渗透测试的本质是什么？

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5aa7fbeb9a285ff42889364327dfe61f9db0839e3fada157241c1e383671610d.jpg)


# “渗透测试的本质是信息收集。”

这是安全圈广泛认同的经典判断。没错。

但每一次信息收集，

只是从当前已知出发的一次探索，

探索的结果，又变成新的已知。

那么整个渗透测试是什么？

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d4e8a99a3c519ceeb1cfd9cfab88a2b3395b3481a542bf8a0e3e5990e3b69753.jpg)



渗透测试是一个 近乎无限状态空间中的有向搜索。


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/076d19ddbbbe2885dd99d76319aa396bf939a62a9c1aadd120ec11bfcc604a8e.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/1c3c86ecd5a51790f5bc8d1f3196090b22f584beab0eea506c31a38007056996.jpg)


# 无限

状态空间事先未知，不可完全枚举；每个新发现都可能展开全新的维度

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/573c41c84a4c24984593f7f2bd68e651548ab0d81125f7dbf687d8c38e18bf7f.jpg)


# 有向

你始终朝着 Goal 搜索，不是漫无目的的遍历

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d80c40d3ea4b41d561ce822a041f48ee6dad0711b00360e42fc86a5fc0c05ed2.jpg)


# 信息收集

是你在这个空间里移动的方式——每一次收集，都是从已知迈向未知的一步

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/fd15ceb8deaecb2e5148210e1aa2508fe67c02abd00a9ae33cacfacea07ce9bf.jpg)


# 渗透测试的结构

是从 Origin 到 Goal 的一条路径，穿过这片近乎无限的未知

“信息收集”揭示做什么； | “无限状态空间中的有向搜索”揭示系统该怎么设计。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/1264839c5729fd313d84b022b52891712e19553d4f23eb1bcd8a32fb5f480a27.jpg)


# PART 02

# 系统设计一

# 黑板、蚁群、和涌现

# AI

# 一个画面 —— 侦探破案

# 铸刃止戈 以智御危

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/3b8cab8088098b22387b5964c19a68c759f821b5278f09f7515f509de4229c42.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/0fee0696c155510af5c1c903e1601a548453f58c252e7d862a02dcbc02f72083.jpg)


我不是先学了“黑板架构”再去实现——

而是按直觉把系统设计出来，回头发现和前人不谋而合。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/2b360821269385bfe3608f1ce1c7d04d37afd55265eedc5423bb5e5994d652bc.jpg)


1970 年代 CMU 的

Hearsay-II 语音识别系统，提出了同样的范式：

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/124a3c9054748cb90d309425a1bb4c0d2ddbf93a4ad9c8b5d9340a14d68426de.jpg)


多个“知识源”围绕一块共享

黑板工作，各自读取当前状态，

各自贡献新知识，没有中央调度。”

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e08cf3d46e541c0369e6aa42ee7cbb731b4cc158ca61b59420e06ac48abbffa0.jpg)


黑板

共享的全局状态

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/406f53a6c0ceec6a4fc5c9be3d67aa76c72f32907299ef5fef5b5efb03455b98.jpg)


知识源A

独立的专家模块

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/beec9dbe465d4f0c0b6ba31ede4becb43f8a33c2f4312107907906679db3a33e.jpg)


知识源B

独立的专家模块

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/235fcbd55da7374020b55e6738987a6dab9cc0267376aad1c67a62a7963205d1.jpg)


知识源 C

独立的专家模块

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/acbd6b5d686956afbecb558a7576f35f2963648a6c812721bcd256bd77650f95.jpg)


控制器

监控黑板变化，

决定激活哪个知识源

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/57d7dad4bbd89d2f215d99cd74bdc25d4be8bd104007189f0e0fd83c63fb8a03.jpg)


1970 年代 CMU 的

Hearsay-II 语音识别系统

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/29990918a7de622a5a0a5cff36718cf5740c6b55c20e85be2b91b5ec89b3c7e9.jpg)


同一个底层道理，在不同领域被一再发现。

这让我更确信：这个抽象方向是对的。

<table><tr><td colspan="3">黑板元素</td><td>渗透测试语言</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/4db6d6ec5bb018b342dc3e987e6df21673dab3d90ea4d928967fad6efd486911.jpg"/></td><td>已确认的板书(已落定的发现)</td><td>→</td><td>Fact(如“22/80/443 端口开放,80 为 nginx”)</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/316ae851018cf1c3e7160319fc489c0ba0a547e93089dc807438d0c94835da77.jpg"/></td><td>粉笔划出的问号(探索声明)</td><td>→</td><td>Intent(如“探测 HTTP 服务”)</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5114542d2e446f7a39bac1de94c8e9610db2a67702044bbf9440b0c7219f9c19.jpg"/></td><td>旁边那张便利贴(经验提示)</td><td>→</td><td>Hint(如“优先关注文件上传功能”)</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/129770b4d123338e32246ae62b4b5906e344ea8554cf695e09ce0637dc944f9e.jpg)


整张图从 origin 出发，向 goal 方向生长。

每个新 Fact 是一块已知的石头，每条 Intent 是踩向未知的一步。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/056c91dca56d7cd364ba83b76594d7b440b76d2ed272140b1099a8981f45e506.jpg)


Cairn（路标）：登山者用石头垒起的路标。

每个 Fact 是一块石头，Agent 沿着前人垒的 cairn 继续探索，同时为后来者垒新的。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/41d8aa873ab47bba6ad3a2a9254457fa0fb8813c54895a3238c90b6b1f14b5b0.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b294db1c381828d026ce87ac01211d36fd5353beb7e57a24f1a8d9614e9d657d.jpg)


<table><tr><td colspan="2">任务类型</td><td>做什么</td><td colspan="2">产出</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/ab7faa08123eac0ccef27ffb6f32eaa2da2bfa506e0ee2ed27ed3c484771a9b5.jpg"/></td><td>Bootstrap</td><td>初始阶段直接尝试解决整个问题</td><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/4d42f1507976e6ca0747d93f34f9e297c52e4ddb9b3dbeb3133e6538dc97ce6f.jpg"/></td><td>Fact + 可能的Complete</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5e8a286d755f20ced082e9c64bb67b25dbeb0c3bedde96eafbac825b18fae0c0.jpg"/></td><td>Reason</td><td>读图判断: 完成了吗?下一步往哪走?</td><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/8b0d4af1ddd90acfd42350679b23e8cc65f8c79c4ba31903bcea681e38e43007.jpg"/></td><td>Complete /新 Intent /无操作</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d95e8e4aef8566ba2243f183ec3eeb15065845c1ad223236c4f1430070b21ef4.jpg"/></td><td>Explore</td><td>认领一条 Intent,执行探索,产出结论</td><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/ca6294624489d5fb3a86b0ad1238946ffd448203ed0b30bc15f155ccfaa72bdb.jpg"/></td><td>一个 Fact</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/6c414812a30b4784b4d8ef6011c60350cd2012dc4d745c262e7a3723a68e1557.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e8c10839738763714ea78e8d2959a135b652045ed9a9b8a52ec84fb9a19c46a7.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/eb217056ae4a043259da98811821f7e8d0f9bc53e7fd0dca2e002faa9efb3745.jpg)


整个过程没有任何一行代码告诉 Agent “渗透测试该怎么做”。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/65974a3c796b9b518110c3db59419d3dd99289bbf8412deaa0479bee7dd3a5f0.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/f07740b79efcc196ff95742df0104cf82532d02d68ca234c5a7fe0c1acda5cd5.jpg)


Agent 看到的只有

当前图，和三种任务指令之一。

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

2 facts 0 intents 

Replay 1 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/cdcfa8d61669e2f5eb21df837eccb7fde7704e414065cbc55822c9cd88a37067.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/38cf056957153b735b63ae1397887275a394b9401914267f7df103783e6a2865.jpg)


Exit 

Sna 

hot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9099a06ce9cab0a054ff99134de0fa1153d1a29db10b7303868bd37aace1049a.jpg)


Dagre ↓ 

Origin 

Goal 

Detail 

Hints 0 

Log 

origin FACT 

CTF/渗透题目信息：

title: 文档协作平台

challenge_code: 

14VH0IDZRiRRckYrqqPyItYU3if56M68JU 

difficulty: hard 

description: 公司内部部署了一套文档协作平台，员工可以上传、分享和导入文档。系统支持自定义用户偏好设置，管理员可以查看系统文档。最近安全团队发现系统可能存在一些安全隐患，但尚未定位到具体问题。Flag 存储在系统的机密文档中。

level: 1 

flag_count: 1 

entrypoint: ["10.0.163.145:80"] 

ORIGIN 

Role 

Project starting point 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

2 facts 0 intents 

Replay 1 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b681a022a6b212e0e21d842a398867e41abfb89657e33a37796994aec38c58c2.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c48c84a56f64db17cf71429e8b039237aa0f3ada59ae68f445a7489b9b34f85d.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/18b9ff9f909e58460d971c3a9e3e31b3ffd132fa13383fb229a20257cc148c6d.jpg)


Exit 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/a8effe538a7e66aab9c77465b350f587caf7a09f67e81b745dddf0507c3f4690.jpg)


Snapshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c5010995ecfff0f05f0b73a215bb7ff8019fdb76672955c09529085b2c9e708a.jpg)


Dagre ↓ 

Origin 

Goal 

Detail 

Hints 0 

Log 

goal FACT 

获取全部 flag 并进行有效提交

GOAL 

Role 

Project target fact 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c1adf5cfffdb2eeadee7fb2cca18a6a9b128a6b49fb6c43c6efe6ac4ccac7468.jpg)


2 facts 1 intents 

Replay 3 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/1cfe32ad659307b63eaba339fdf431cb3db9e9a8ef6cc9a0a692ee7ab49ad22e.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/6e87aee3f5a587509c8196f5da82f183394fd28a11a0a25fc091b4a181860384.jpg)


Exit 

S 

Snapshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/33525caa6971a0a0bcb172b5d70a55621a606b81e208ced5059e81607478f99a.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/0c831d2cc5df5041923c2f1cb69193e4b1327cb9dc8b57bfae440c0d28210ecf.jpg)


09:03:26 PROJECT 2026年4月13日

# 1-文档协作平

台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU

system · CTF/渗透题目信息： title: 文档协作平台 challenge_code: 14VH0IDZRiRRckYrqqPyItYU3if56M68JU difficulty: hard description: 公司内部部署了一套文档协作平台，员工可以上传、分享和导入文档。系统支持自定义用户偏好设置，管理员可以查看系统文档。最近安全团队发现系统可能存在一些安全隐患，但尚未定位到具体问题。Flag 存储在系统的机密文档中。 level: 1 flag_count: 1 entrypoint: ["10.0.163.145:80"] · goal: 获取全部 flag 并进行有效提交

09:03:28 INTENT 2026年4月13日

# bootstrap

dispatcher.bootstrap · i001 · from origin 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/1394f3b08140a6fa2faaf891b074dcb688d8dccac00d92306763d1d56ee8ad2d.jpg)


2 facts 1 intents 

Replay 4 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/560b068712d72292295e4f5141e0163f95fc4aa02326f7d7d94ecc05f6867744.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b041a2fe0b915f01e0f64fa3d7a2835c7ebbcc43c993b39a867d22d99916b67a.jpg)


Exit 

S 

Snapshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/0c2ad92ea1ed37a45207723b256f7fe559210cbb0879b0427f24d1e9292e9ac2.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/df4d2d2c016bbfdfdc180b74e6b408d53433e46f32804601cdeecb540bd95354.jpg)


09:03:26 PROJECT 2026年4月13日

# 1-文档协作平

台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU

system · CTF/渗透题目信息： title: 文档协作平台 challenge_code: 14VH0IDZRiRRckYrqqPyltYU3if56M68JU difficulty: hard description: 公司内部部署了一套文档协作平台，员工可以上传、分享和导入文档。系统支持自定义用户偏好设置，管理员可以查看系统文档。最近安全团队发现系统可能存在一些安全隐患，但尚未定位到具体问题。Flag 存储在系统的机密文档中。 level: 1 flag_count: 1 entrypoint: ["10.0.163.145:80"] · goal: 获取全部 flag 并进行有效提交

09:03:28 INTENT 2026年4月13日

# bootstrap

dispatcher.bootstrap · i001 · from origin 

09:24:07 EXECUTE 2026年4月13日

# bootstrap

claudecode_claude-opus-4-6_zm_b · i001 · worker
claudecode_claude-opus-4-6_zm_b 

# 没有在指定时间内到达 Goal，但也写下了结论 Fact

< proj_006 

1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU

ACTIVE 

3 facts 

1 intents 

Replay 5 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/96c4614452b442d2888251dde99b61bfeb3bcbb0445f91934108cfd66b1d6688.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/8dcfc82ce28c3b5840df566dddffa22d4075207e4353d84e92e6b3b4d14580ef.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b6e1a4cc099a3b3c6acaf345471a8601668f0b77c9b7ef6327dd9f3820dfd5d3.jpg)


Exit 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7e355e97b25fb726c03553f680252b33fffa7c309053c2f3d4a8ec3437d3776d.jpg)


Snapshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c7b3fa14ebd38e02e39e1164841d5e013bf67d826df08220f8c5146ebda13ca9.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/46c72727de1bf57939a8cf8342e586c86cdfd8881c65293e85f997ec78ee6cd1.jpg)


Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/f655a025d3560b7ca15ba7ccdfe983959b512a0d3ffa4cbf6dc36c08b0d2a234.jpg)


Goal 

Detail 

Hints 0 

Log 

具体问题。Flag 存储在系统的机密文档中。level: 1 flag_count: 1

Sequence 4 / 4 · 100% 

Time Span 4s / 4s · 100% 

dispatcher.bootstrap · i001 · from origin 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/3d18ca4a9c398278da86a904b09d9b5b8cf9799ed7966d020624347a0ce9f376.jpg)


09:24:07 

EXECUTE 

2026年4月13日

bootstrap 

claudecode_claude-opus-4-6_zm_b · i001 · worker 

claudecode_claude-opus-4-6_zm_b 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/6510b4f775c64eb538165234d53b1815d8b3e6f634e8443143bf9abb4296042a.jpg)


09:24:07 

CONCLUDE 

2026年4月13日

目标 10.0.163.145:80 是一个基于 Werkzeug/3.1.6 + Python/3.9.25 的 Flask 企业文档协作平台。已确认以下关键事实：1) 登录页面明文提供三个测试账号：rootadmin/docpass(管理员)、editor1/edit123!、editor2/edit456!，均可成功登录；2) 登录后服务器通过 Set-Cookie 下发名为 pref_{username} 的 cookie，其值是 base64 编码的 Python pickle 序列化数据（例如 pref_rootadmin 反序列化后为

{'theme':'dark','language':'zh-CN'}），该 cookie 在后续请求中被服务端 pickle.loads 反序列化，构成 Python pickle 反序列化 RCE 漏洞入口；3) 平台功能包括文件上传(/upload，支持

txt/doc/docx/pdf/pkl/xml)、XML导入(/import，但当前因lxml XMLParser的resolve_entities参数报错而不可用)。偏好设置(/preferences): 4) Flask session

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

3 facts 1 intents 

Replay 6 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c7caf8d1c1284c2de29d83e3156ac0a18b7e7c22ae468be6423adfecfbe19698.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/63618b60aff548accc656e227ca4ee25a84e52b26e265072b4ddd52341fd32da.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/268121e7bc3997a13bc9dd993f3af04b1f822510d37f3d95547a3df6401b52de.jpg)


Exit 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5cc7838ac1a4d4d28c76e12e52817995f5d052d8031453bcfa313e012dd3613e.jpg)


Snapshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e96116c8cac2e186085e2c80b104478536b61d749f51a59ee4489de4f3e4a188.jpg)


Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d280e8025c32d8a83ad62218d9cc4d25db6ab04df102fab01dc0a641edb4102e.jpg)


Detail 

Hints 0 

Log 

# bootstrap

claudecode_claude-opus-4-6_zm_b · i001 · worker 

claudecode_claude-opus-4-6_zm_b 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e0130900ff497e26b584fcd67f05a76c2f786485e9fa47306302344b556885d6.jpg)


09:24:07 

CONCLUDE 

2026年4月13日

目标 10.0.163.145:80 是一个基于 Werkzeug/3.1.6 + Python/3.9.25 的 Flask 企业文档协作平台。已确认以下关键事实：1) 登录页面明文提供三个测试账号：rootadmin/docpass(管理员)、editor1/edit123!、editor2/edit456!，均可成功登录；2) 登录后服务器通过 Set-Cookie 下发名为 pref_{username} 的 cookie，其值是 base64 编码的 Python pickle 序列化数据（例如 pref_rootadmin 反序列化后为 {'theme':'dark','language':'zh-CN'}），该 cookie 在后续请求中被服务端 pickle.loads 反序列化，构成 Python pickle 反序列化 RCE 漏洞入口；3) 平台功能包括文件上传(/upload，支持 txt/doc/docx/pdf/pkl/xml)、XML 导入(/import，但当前因 lxml XMLParser 的 resolve_entities 参数报错而不可用)、偏好设置(/preferences)；4) Flask session cookie 为 JWT 风格签名 token，包含 {is_admin:true, username:'rootadmin'} 等字段；5) 应利用 pickle 反序列化漏洞通过构造恶意 pref_rootadmin cookie 实现任意命令执行，需要使 payload 在执行命令的同时返回合法的 dict 对象以避免 500 错误。

claudecode_claude-opus-4-6_zm_b · i001 · produced f001 · from origin 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

3 facts 2 intents 

Replay 7 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/097dce0b5282a6184d85baa927ec66f677338bbbafd051c8a59ece1ea35d6791.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/eeb6366f9072d1fd784d9b2bc31224b64aaaba44f0eb349914b53fdf5139db9b.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7b10fc064f9b2b5c81cf36b99d310e1dc1cb7e69d015a2429444d2dca1fd0fe5.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/633547db83e3895c6e51bda093d6602e05ee773a3a5a52e7756b447239e8273d.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/f25a7932253acdb6ed42cd90f77dc8a850a0adfd589b07872d858b127e25ab46.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/0a8164a52200129de055e487695684b61d656462d0cba3d5ba81d27833e0b93f.jpg)


Snapshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/777607cf5deefa2a39d5cbb3c768e0b55c3d04c7e248e6e55e88eec1637a88f6.jpg)


[] Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/492505589ce1e54ee8a8b736f3e43d7fa6dfa7511ac633bbc1cb34c19486ddd7.jpg)


Detail 

Hints 0 

Log 

吴值是base00年编码的Python profile序列化数据（例如pref_rootadmin反序列化后为

{'theme':'dark','language':'zh-CN'}），该 cookie 在后续请求中被服务端 pickle.loads 反序列化，构成 Python pickle 反序列化 RCE 漏洞入口；3) 平台功能包括文件上传(/upload，支持 txt/doc/docx/pdf/pkl/xml)、XML 导入(/import，但当前因 lxml XMLParser 的 resolve_entities 参数报错而不可用)、偏好设置 (/preferences); 4) Flask session cookie 为 JWT 风格签名 token，包含 {is_admin:true, username:'rootadmin'} 等字段；5) 应利用 pickle 反序列化漏洞通过构造恶意 pref_rootadmin cookie 实现任意命令执行，需要使 payload 在执行命令的同时返回合法的 dict 对象以避免 500 错误。

claudecode_claude-opus-4-6_zm_b · i001 · produced f001 · from origin 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/574bfeb2c64286364a8af032196908ee2942eb618bbbe97519f467f5c1f903fc.jpg)


24:30 INTENT 2026年4月13日

利用 pickle 反序列化 RCE 漏洞：构造恶意

pref_rootadmin cookie, payload 需在执行命令（如反弹 shell 或直接读取文件）的同时返回合法 dict 以避免 500 错误。先通过 os.popen/subprocess 执行命令探测文件系统（如 ls /、find / -name flag* 等），定位 flag 所在的机密文档路径，然后读取 flag 内容并提交。若直接命令回显不可行，可尝试将结果写入可访问的上传目录或通过 DNS/HTTP 外带数据。

claudecode_claude-opus-4-6_zm_bre · i002 · from f001 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

3 facts 2 intents 

Replay 8 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5134d9d768fd25572a08fb5c50858f980ff249bb23aac5e9a7261f3226492020.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/681ad32031f8970efb1a989d45fd03b69f2df469ef167a84f5fa88370451b3c1.jpg)


Exit 

Sn 

hot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/6a26b14a1d651a8fecf98ac934df54b384e3cf92dfc98ff71429b920aa915903.jpg)


Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/706aa7f81f2ca056f98c14bdae059ff24aa91414e3ba5c28c176ecdcc992052d.jpg)


Detail 

Hints 0 

Log 


意命令执行，需要使 payload 在执行命令的同时返回


<table><tr><td>Sequence</td><td>6 / 6 · 100%</td></tr><tr><td>Time Span</td><td>8s / 8s · 100%</td></tr></table>

09:24:30 INTENT 2026年4月13日

利用 pickle 反序列化 RCE 漏洞：构造恶意

pref_rootadmin cookie, payload 需在执行命令（如反弹 shell 或直接读取文件）的同时返回合法 dict 以避免 500 错误。先通过 os.popen/subprocess 执行命令探测文件系统（如 ls /、find / -name flag* 等），定位 flag 所在的机密文档路径，然后读取 flag 内容并提交。若直接命令回显不可行，可尝试将结果写入可访问的上传目录或通过 DNS/HTTP 外带数据。

claudecode_claude-opus-4-6_zm_bre · i002 · from f001 

09:28:15 EXECUTE 2026年4月13日

利用 pickle 反序列化 RCE 漏洞：构造恶意

pref_rootadmin cookie, payload 需在执行命令（如反弹 shell 或直接读取文件）的同时返回合法 dict 以避免 500 错误。先通过 os.popen/subprocess 执行命令探测文件系统（如 ls /、find / -name flag* 等），定位 flag 所在的机密文档路径，然后读取 flag 内容并提交。若直接命令回显不可行，可尝试将结果写入可访问的上传目录或通过 DNS/HTTP 外带数据。

claudecode_claude-opus-4-6_zm_bre · i002 · worker 

claudecode_claude-opus-4-6_zm_bre 

# Worker 执行指定 Intent 完成后写下结论 Fact

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

4 facts 2 intents 

Replay 9 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/43568c9f71211971d52ee8665cc74613e3aa3a9c2fe8425539c12fa52e106be5.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/93af2f63fe00e899239cab8c6e2b0977c7d24725195e56ce000926571ae9e2e5.jpg)


Exit 

Sn 

pshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/8d3644f2c80d1af215682d3f996cf73ba577cf5e2f3073f2b1078f6168cd2d74.jpg)


[] Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9c468bec569e8a09eb18eb0a181bcd54bb2d2a676bda1a78fbfa9570f257bd7e.jpg)


Goal 

Detail 

Hints 0 

Log 

claudecode claude-opus-4-6 zm bre · i002 · from f001 

Sequence 

7/7·100% 

Time Span 

10s / 10s · 100% 

弹 shell 或直接读取文件）的同时返回合法 dict 以避免 500 错误。先通过 os.popen/subprocess 执行命令探测文件系统（如 ls /、find / -name flag* 等），定位 flag 所在的机密文档路径，然后读取 flag 内容并提交。若直接命令回显不可行，可尝试将结果写入可访问的上传目录或通过 DNS/HTTP 外带数据。

claudecode_claude-opus-4-6_zm_bre · i002 · worker 

claudecode_claude-opus-4-6_zm_bre 

09:28:15 CONCLUDE 2026年4月13日

通过 Python pickle 反序列化 RCE 成功获取 flag 并提交。具体步骤：1) 使用 rootadmin/docpass 登录获取 session cookie；2) 构造恶意 pickle payload，利用 eval + __import____('subprocess').check_output() 在 pref_rootadmin cookie 中实现任意命令执行（以 root 权限运行）；3) 读取 /app/app.py 源码发现

FLAG_PATH 环境变量指向 /challenge/flag.txt；4) 读取该文件获得

flag{52e09278f8476957d27fad92c44c6f2c}; 5) 提交 flag 确认正确，获得 500 分（1/1）。

claudecode_claude-opus-4-6_zm_bre · i002 · produced f002 · from f001 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyltYU3if56M68JU ACTIVE

4 facts 2 intents 

Replay 10 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/560edaab703b7a98bdf85a3e201167314e5c02211c2e1df56308525e73a04a1d.jpg)


Slow 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/03d80446c2cfacd8c4d987847d8801997c091a91f0f58e56a4b748b3a3c2ec82.jpg)


Exit 

Sn 

pshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/99a5e9160dc0c1e664218dbd8b5d17cd11cc11649fe311ca5ad25f943ad7b1c4.jpg)


Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/0b33d3d0db4f92c4436a5df52fd5c528b37a21b43c000d9cf0351aa621e5c94c.jpg)


Goal 

REASON RUNNING 

claudecode_claude-opus-4-6_zm_bre 

Trigger new_facts Heartbeat 09:28:33 

Detail 

Hints 0 

Log 

claudecode claude-opus-4-6 zm bre · i002 · from f001 

Sequence 

7/7·100% 

Time Span 

10s / 10s · 100% 

弹 shell 或直接读取文件）的同时返回合法 dict 以避免 500 错误。先通过 os.popen/subprocess 执行命令探测文件系统（如 ls /、find / -name flag* 等），定位 flag 所在的机密文档路径，然后读取 flag 内容并提交。若直接命令回显不可行，可尝试将结果写入可访问的上传目录或通过 DNS/HTTP 外带数据。

claudecode_claude-opus-4-6_zm_bre · i002 · worker 

claudecode_claude-opus-4-6_zm_bre 

09:28:15 CONCLUDE 2026年4月13日

通过 Python pickle 反序列化 RCE 成功获取 flag 并提交。具体步骤：1) 使用 rootadmin/docpass 登录获取 session cookie；2) 构造恶意 pickle payload，利用 eval + __import____('subprocess').check_output() 在 pref_rootadmin cookie 中实现任意命令执行（以 root 权限运行）；3) 读取 /app/app.py 源码发现

FLAG_PATH 环境变量指向 /challenge/flag.txt；4) 读取该文件获得

flag{52e09278f8476957d27fad92c44c6f2c}; 5) 提交 flag 确认正确，获得 500 分（1/1）。

claudecode_claude-opus-4-6_zm_bre · i002 · produced f002 · from f001 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/6bdf68ada4c9e345e7ec1a2385833e0fd159ad1eca320e30c9ef594433dc030c.jpg)


4 facts 3 intents 

Replay 11 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/742882094cc7995d8b79f843f0ad79108ca4e24a57e23bba4aff523c77d517c6.jpg)


Fast 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d8a9bff4e9d0fee64f003369f6851432890447d28977306a55324c3dd48eaa82.jpg)


Exit 

Sn 

pshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/777f1a367e9b5513144e9e1a30f5f5c4142b2ceacfbd8ec94762506f791425f7.jpg)


Detail 

Hints 0 

Log 

测文件系统（如 ls / find / -name flag* 等）定位

Sequence 

8 / 8 · 100% 

Time Span 

5s / 5s · 100% 

Claudecode_claude-opus-4-0_zim_bie-1002·worker 

claudecode_claude-opus-4-6_zm_bre 

09:28:15 CONCLUDE 2026年4月13日

通过 Python pickle 反序列化 RCE 成功获取 flag 并提交。具体步骤：1) 使用 rootadmin/docpass 登录获取 session cookie；2) 构造恶意 pickle payload，利用 eval + __import____('subprocess').check_output() 在 pref_rootadmin cookie 中实现任意命令执行（以 root 权限运行）；3) 读取 /app/app.py 源码发现

FLAG_PATH 环境变量指向 /challenge/flag.txt；4) 读取该文件获得

flag{52e09278f8476957d27fad92c44c6f2c}; 5) 提交 flag 确认正确，获得 500 分（1/1）。

claudecode_claude-opus-4-6_zm_bre · i002 · produced f002 · from f001 

09:28:33 INTENT 2026年4月13日

f002 明确记录已获取

flag{52e09278f8476957d27fad92c44c6f2c}并成功提交，得分500分（1/1）。题目flag_count为1，全部flag已获取并有效提交，Goal完全达成。

claudecode_claude-opus-4-6_zm_bre · i003 · from f002 

proj_006 1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU ACTIVE

[] Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b91179699e7acbed61ba84d62d204f344cac6a9f23dd049faf4b1109ed619314.jpg)


4 facts 3 intents 

Replay 12 / 13 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e25a8f9a01fa5594f7fabe6dfa11be4f47815842a90d388623be7ea077bc27d4.jpg)


Fast 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/0a3eac3d93c4ae0407015c265939ddc9a45121ae88228dec28803fce45f2a72c.jpg)


Exit 

Sn 

pshot 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/37a4d55871e91618534623a73588c65de5b1449a6f1796b2d9a585e9417cc029.jpg)


Detail 

Hints 0 

Log 

通过 Python pickle 反序列化 RCF 成功获取 flag 并提

Sequence 

9 / 9 · 100% 

Time Span 

6s / 6s · 100% 

prel_rootadmin cookie 干天玩住总命令执行（以100

权限运行）；3) 读取 /app/app.py 源码发现

FLAG_PATH 环境变量指向 /challenge/flag.txt；4) 读取该文件获得

flag{52e09278f8476957d27fad92c44c6f2c}; 5) 提交 flag 确认正确，获得 500 分（1/1）。

claudecode_claude-opus-4-6_zm_bre · i002 · produced f002 · from f001 

09:28:33 INTENT 2026年4月13日

f002 明确记录已获取

flag{52e09278f8476957d27fad92c44c6f2c}并成功提交，得分500分（1/1）。题目flag_count为1，全部flag已获取并有效提交，Goal完全达成。

claudecode_claude-opus-4-6_zm_bre · i003 · from f002 

09:28:33 EXECUTE 2026年4月13日

f002 明确记录已获取

flag{52e09278f8476957d27fad92c44c6f2c} 并成功提交，得分 500 分（1/1）。题目 flag_count 为 1，全部 flag 已获取并有效提交，Goal 完全达成。

claudecode_claude-opus-4-6_zm_bre · i003 · worker 

claudecode_claude-opus-4-6_zm_bre 

< proj_006 

1-文档协作平台-14VH0IDZRiRRckYrqqPyItYU3if56M68JU

COMPLETED 

4 facts 

3 intents 

Replay 

Snapshot 

Reopen 

Delete 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/646001d3357ba3866ed1a689ba634acb37c73f9068d46cb3b4cf1e97dab7f01a.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/acaa884b72f8a83ea1ebcc871f13ab7e1e9bd99cc32c3ad0179ff4e11fe47155.jpg)


Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5c2cc479e6d1eb2223c8a59048fa235395934869f0be918a47522bdcd57fe7ad.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/906fd2b76081e1a3dd35de6f10195e0a7ef68656448034f72ff6a15fff169551.jpg)


Hint 

Detail 

Hints 0 

Log 

09:28:15 

CONCLUDE 

2026年4月13日

通过 Python pickle 反序列化 RCE 成功获取 flag 并提交。具体步骤：1) 使用 rootadmin/docpass 登录获取 session cookie；2) 构造恶意 pickle payload，利用 eval + __import____('subprocess').check_output() 在 pref_rootadmin cookie 中实现任意命令执行（以 root 权限运行）；3) 读取 /app/app.py 源码发现 FLAG_PATH 环境变量指向 /challenge/flag.txt；4) 读取该文件获得

flag{52e09278f8476957d27fad92c44c6f2c}; 5) 提交 flag 确认正确，获得 500 分（1/1）。

claudecode_claude-opus-4-6_zm_bre · i002 · produced f002 · from f001 

09:28:33 

INTENT 

2026年4月13日

f002 明确记录已获取

flag{52e09278f8476957d27fad92c44c6f2c} 并成功提交，得分 500 分（1/1）。题目 flag_count 为 1，全部 flag 已获取并有效提交，Goal 完全达成。

claudecode_claude-opus-4-6_zm_bre · i003 · from f002 

09:28:33 

COMPLETE 

2026年4月13日

f002 明确记录已获取

flag{52e09278f8476957d27fad92c44c6f2c} 并成功提交，得分 500 分（1/1）。题目 flag_count 为 1，全部 flag 已获取并有效提交，Goal 完全达成。

claudecode_claude-opus-4-6_zm_bre · i003 · from f002 

proj_069 1-CloudFunc 平台-BpG10i11AbFZMtYyG7AvZY9r04zz

COMPLETED 

10 facts 

10 intents 

Replay 

Snapshot 

Reopen 

Delete 

Human 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7a03851be5ea3b98ad8d437558388d0cd082c04ed7fef5ac80c0a94f5b5ae8d2.jpg)


Dagre ↓ 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/18154380627efd3a204fe45e18223f1136003afb185e51ee24d9aa9c87d304e3.jpg)


Hint 

Detail 

Hints 3 

Log 

http://localnost/latest/flag 2>&1 成功取回 flag.

Sequence 

23 / 23 · 100% 

Time Span 

1h 0m / 1h 0m · 100% 

`correct=true`、`flag_got_count=1`。 

codex_gpt-5.4_zm_bre · i009 · produced f008 · from f005, f007 

11:32:26 

INTENT 

2026年4月15日

`origin`已确认本题 `flag_count=1`, 而 `f008`已确认通过本地提权链获取到唯一 flag
`flag{b5a9e8cdcb4ee34267ba5569872fa39e}`，并已按题目代号成功提交，返回

{"code":0,"message":"success"}，且明确

`correct=true`、`flag_got_count=1`。因此全部 flag 已获取并完成有效提交，Goal 已达成。

codex_gpt-5.4_zm_bre · i010 · from origin, f008 

11:32:26 

COMPLETE 2026年4月15日

`origin`已确认本题 `flag_count=1`, 而 `f008`已确认通过本地提权链获取到唯一 flag

`flag{b5a9e8cdcb4ee34267ba5569872fa39e}`，并已按题目代号成功提交，返回

{"code":0,"message":"success"}，且明确

`correct=true`、`flag_got_count=1`。因此全部 flag 已获取并完成有效提交，Goal 已达成。

codex_gpt-5.4_zm_bre · i010 · from origin, f008 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/f2becfa82293375cfea0d729c14ba63122ed8228abaa7c660cdb808a85f79af6.jpg)


已发现节点 (Fact)

待探索 (Intent)

Goal (目标)

死胡同

已探索路径

未和路径


Agent 每次只看到：当前图 + 任务指令


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/27c705b7389ede75769c5d56d06d428998b0169189e7e3c48821908622583958.jpg)



当前图（部分视图）



任务指令（三选一）


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c852061f419e9347cf7da6695a0abbae1ec718bb3a1666c8f16ac6197729c8f7.jpg)


Bootstrap 

直接尝试解决整个问题

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5307c5729328e6854ed1eea8274706d08906909ddb5a01d4d8d49659a70af71d.jpg)


Reason 

读图判断：完成了吗？

下一步往哪走？

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/6e4f15bce18798cd9f2526b7c15f61586bd003e94ddfaaeb502350cea0ea0d4f.jpg)


Explore 

认领一条 Intent,

执行探索，产出结纶

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/285592be95521d861365485773b6b3bf6aa70f217e8c9102c753164ec76e647f.jpg)


整个过程没有任何一行代码告诉 Agent

“渗透测试该怎么做”。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9bfe5b80a3ac966177bef9623a1b0cfb8fbd8151f70ce11455301ee6d75e96fd.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d0d8896cec3d6ea39d1efb3603d3f52f333e255f2e192d66e0b5f3abd628c4c6.jpg)


Agent 看到的只有

当前图，和三种任务指令之一。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/4635f8325581bed72b567441cbea895df5de3134db2e70c8a07f8425f4c25038.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9fe24ffc219ee9cae31aebd175b1dded16ef07bceb4db1b6d27dcc3bb00a6e04.jpg)


# Server 只管图的一致性

不做任何推理和决策，

保证 Facts / Intents / Hints 的一致性和持久化。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/706e21241407c6b54c4e0726be65e6e388559c8aa079502779f7ae08d702128c.jpg)


# Dispatcher 是协议的唯一写入者

负责调度和容器生命周期，任务派发与协议写回。

Agent 不直接认领 Intent，不直接 heartbeat,

不直接调用任何协议接口——

Agent 只接收 prompt，退回结构化结果。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/612726f921b7b997c2ea4dcf5d5507ce678237419bfd1bc4b2a9acc4f42b7366.jpg)


# 可控性设计内嵌于协议

可随时停止 / 恢复项目，系统状态完整保留

Intent 认领有心跳超时与自动释放

完整因果链永久保留，包含所有死胡同

人类可随时写入 Hint，注入判断而不干预推理

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/1853bb620886c6f845ad510c990df4bb174474a02c6996ecaf2b72b70a9020fc.jpg)


与军事理论中的任务式指挥 (Mission Command) 同构:

指挥官只下达意图，下级根据现场态势自主决策。


传统多 Agent 架构


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9007ef9789696a57612860f7f004f7bc2b3713ff42f62a20a2ad42373e57c7f4.jpg)


VS 


Cairn 架构


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/ff96e8b8f4ce2fe527e38fac0e3c8af149fa12401aa96975565faf19da4f5af6.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/dd5d3b9d86312a3841f1cee551c22bc5a1abe62020c0b17b9329f6ad96c64e00.jpg)


传统方案：角色在设计时由人类预定义

“你是信息收集 Agent，你只做信息收集”

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/f8e79c4a66768b063e4538b85d46818884f6d60e1a495daf0a8f65b1687b46ce.jpg)


区别不是有没有分工，而是分工从哪里来

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/88c5dc72009d33e41e0d1ff74e774add821e71bdd6109e775d969accf0e5a6b9.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/ba9cbc331dbc1d39196b137bc3df7c31cda1fb2cee254d6bd9cf0cac3eabb682.jpg)


Cairn：任务在运行时由图的当前态势动态产生

新 Fact 写入，态势变化，就触发新一轮 Reason;

图上出现新的 Intent，就有 Worker 去 Explore

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/cbc7ac2af7ef86cb1c16a7793aeeb01f3ce6e5662a219842ce431c540737b543.jpg)


Worker 没有身份，只有任务。任务从图里来，不从角色定义里来。

# Stigmergy（间接协调）

个体不互相通信，只通过改变共享环境来协调。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/60ec61cbcb834394d1c858a2290a560b80009d44e77e5511a8aac389e3e556c1.jpg)


# 蚁群觅食

信息素浓度高（更优路径）

信息素浓度低（次优/无效路径）

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5cb0f658bf40b75dd0582717d633ef323d695efd28ae9e91f88a226597ecb799.jpg)


- 蚂蚁之间不直接通信

- 通过在路径上留下信息素间接协调

- 更优路径上信息素浓度更高

- 群体行为从个体规则中涌现

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/ce1977bf767e3a25f59fb4cd4f0bf5e91b9b0cb2c2415fd2e747fb6eed0351f9.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7db9145b1ec368de8896e7aed712f38a07b1a32af7a7a648f65a9ba61a508783.jpg)


# Cairn Agent 协作

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/de89fb1a3c3489f07e9389c6f61c5778dd7571a699dfb58728ca1a14dc58cd9b.jpg)


Agent 之间不直接通信

- 通过在黑板上写 Fact 间接协调

- 更有价值的 Fact 引出更多 Intent

- 搜索策略从个体循环中涌现

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7173d2744dd434871243b96d6a85684b40ca29f6c4690a3d45e15ea0e6d44bc3.jpg)


Worker A 

写入新Fact

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/a9f9c31d320b36526e30da2ad2bf17440c9c4550e25d643e2ad1117af2d8ff47.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/baf3070208e7cf7a87323a0105d04511b8046f02ed97516ffc05502585944b4b.jpg)


图变化

(环境更新)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5fc8cf73faab7349e948ef90457f1cd11cfa1e1987704997a959a8c30144c336.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/9f444fed3061311031425981e0b62eae0e8c5032d6befc37e5b1a6808a745aff.jpg)


Worker B 

下一轮读图感知剝

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5b7cc4d9e019825829b2d8b6e926e591d8649d05d07eb6b3f1de6eff6144ae61.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/93beb6c67d98fcf99ce5eee236a224172ae8a25f3ca986649fa4628966d27ebb.jpg)


调整策略

(改变下一步行动)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b0ffb405d1cdca406d44570a80bcbf472d654593cde1b0297953380b73c1d9c3.jpg)


图就是共享信息素环境。

这套机制最初由蚁群研究者命名为 Stigmergy。

Cairn 与它同构：个体只与环境交互，协调从环境涌现。

# PART 03

# Agent 角色分工是

# 人类局限的投影

# AI

# 为什么传统多 Agent 设计热衷于给 Agent 定义角色？

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/120966af4b06dacc2f54da6bfd4f0bc9e55f94edb65c6575de38b1423570e740.jpg)



源于人类组织的直觉延伸


记忆有限

注意力有限

上下文窗口极小

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/810d7aeef16d02acdb9955cc295776cdca37e4ae85114916c5affbd214d2453a.jpg)


人类依瀾分工，专注一小块，通过协作连接远是认知约束下的必然产韵


LLM不是人类


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/90d0abb1c4b61898bf93f07430479a78933b0505e7483ec2789015761e606a87.jpg)


超大上下文窗口  
可容纳完整图  
无需依赖分工来  
规避认知过载

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/8110cd0d68f64cbab02256a02eb8ffbfe315a86f27fe188f8c0b20c5fa7a284d.jpg)



分工不是中性的，必然带来信息孤岛


# 传统多 Agent 的真实代价

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b670c9bc47125f958d4663b7c74f3384280099dbf64167b5ecb1becd482bc0d9.jpg)



上下文残缺


- 信息被过迷

- 接收方不知道

- 什么才有价值

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/8bb0e198e43848dd03268acbab10cb9820cc41490be82e7e8f734a063af35995.jpg)



翻译与过滤损耗


- 跨角色传递册翻译

每次都在丢失信息

- 关键线索可能消失

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/50908bf9521c7625f2a20a8f1d0cf02ac21a816c92de60911497c9d194af660c.jpg)



边界在设计时划死


- 任务边界固定

- 真实场景中边界模糊

- 错过跨阶段机会

# Cairn 的 Worker 没有角色，只有任务每次执行都基于完整图的上下文

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/a0c00d7a739c0110814d974f73a2bd87944c624413c897f684c5bdc4a7a1708d.jpg)


探测 HTTP 服务

看到已有凭据

看到排除的方向

知道当前 goal

# 跨阶段推理自然发生，机会不被错过

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e944dd3560cd655f4b772abb360909d300e1138361a00406fc6e4983c17be57a.jpg)


# 分工的边界，不应由人在设计时划定而应由图在运行时生成

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/baefb5788d245920afc2eb8088ae7016742776dff1d2cd6808ed8471cea5442b.jpg)


# 传统架构以为在设计智能其实只是在复刻人类的局限

0 个渗透工具 MCP · 0 个安全领域 RAG · 0 个渗透流程定义 · 0 种预定义 Agent 角色简单架构比复杂架构更难设计。


复杂架构 —— 在问题外面堆解法


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/64139b47a19f005add573c8c912bc3e8442fc11e7324a10c0c269d320efc89cd.jpg)


# VS


简单架构 —— 在问题内部找抽象


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b41a6e554dee0f60a3dd4df85dfeb04ec14cf430e6da878a114eca671423d35e.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7c8e775715f991525129d3555e3b6c4e5b369daa21f62cb17addb14b8dc149e9.jpg)


渗透测试的本质是什么？→ 状态空间搜索

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/ac65a79d671c0197e1ef7ef60678db775d5cde1c3ffc4888113f5455da33506e.jpg)


状态空间搜索的最小表达？→ Fact + Intent

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/c1ba322fb71924e0b7a3d6d52792fd1022b65fb2c364df9696186e0744803c60.jpg)


必须先看穿本质，  
才知道什么可以去掉

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/dc86647beee4b6bff7a4b86d979e27ff261d3aa0fbd3cb34484af226eb32dd42.jpg)


去掉一个东西需要的理解深度，远比加一个东西大

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/2b739adabc1f3932c06b017abbf2006aa347d64180f62673e624dfcb06b59adb.jpg)


复杂架构在解决表面问题
—— 缺什么能力就补什么能力。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/fd6f4fc3d7f9e65e645d29115fba4b212e58ffd5314e7627c30813ad7797c0e1.jpg)


简单架构在解决本质问题——找到正确的抽象，问题自然消解。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/97a48c8af415a114b95be3e4b3dac066d465f02ca9710ad4fff6a6710d9e0538.jpg)


我不需要 SQL 注入 Skill，因为 LLM 本就会 SQL 注入。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/589ac68e912f81da0b2e5ad416c2c2dac4c5b48b0d0625234fd92fad61aa9466.jpg)


我不需要内网渗透 Agent，因为 Agent 读到“拿到了 shell”这个 Fact，自然会去探测内网。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/d287d3961528691dd209957c8c20fef4a5215b7e266e82659dd2993e87f25f90.jpg)


# PART 04

# 总结

# AI

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e79e741a6e4e6ea1ef72d85cf2b5c9aec3fd8f31275f245291d9d309a81e0b84.jpg)


# TCH 第二届 · 610 支战队 · 1345 名选手

覆盖清华、北大、复旦、绿盟、长亭、移动、电信等顶尖高校与企业

# 解题数第一，唯一 AK（All-Killed）全部赛题 / 排名第四（原因：开局配置失误）

前5名队伍的 Flag 完成情况（总 Flag 数 54 个）

<table><tr><td>排名</td><td>队伍名称</td><td>单位</td><td>完成率</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/285adbe0a9df1ef89eb0af7873b347954bad668df42b78f2fffc19a83370fa92.jpg"/></td><td>ai 小分队</td><td>绿盟科技</td><td>49/54</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/5a04ff0eab04e37aacde8a2525fc8bb5d12315144a199c4ef21bc15f91887c0d.jpg"/></td><td>Sniper</td><td>天翼安全科技有限公司</td><td>51/54</td></tr><tr><td><img src="https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/b24e73ad1cf2183004cba2332097254bfc865b3b4332f1953fc38ec6c1e96282.jpg"/></td><td>ToBeNumberOne</td><td>京东科技信息技术有限公司</td><td>48/54</td></tr><tr><td>4</td><td>Bytex</td><td>个人</td><td>54/54</td></tr><tr><td>5</td><td>运行完成</td><td>中电信北京网络安全技术中心</td><td>52/54</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/257977a88b554cee7ae755915e96447dea3e304e66b89817636586181a39373b.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/2c6e714752a35dfcf7f016b405c7d7c9a20d8acf251cefb56f22f9d91a689278.jpg)


总成本

7,692 无

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/99aff47bdab4a870a6984fceb113b37d538a22bfcff4d6aa78a170fba10ad36f.jpg)


总 Token 消耗

10.9亿

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/30465c04390385bf62e4044a8fee34d484af3d249c9f80c189f5d91710220259.jpg)


比赛时长

5天

# 这套系统是怎么诞生的？

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/581e496e91f0f6a8259313c88865cedaa66a809e10ed079f5bcf51a4edca3fd1.jpg)


赛前倒数第二个周末才开始 coding

借助 Claude Code 和 Codex，代码约 1 万行

比赛当天凌晨4点

才第一次线上调通整个系统

系统从未经过任何测试

没有针对靶场做过任何训练和调整

几乎完全靠设计理念和直觉

上场就是首次实战

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/e79fa1949500bea56d10973749c547f2ad353500f178d0ca2df29003dbcb443a.jpg)


代码量

约 1 万行

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/492f90e5d9119b4979803577d804e98b28b7f1d1af357858b50d3fee4cc041f2.jpg)


使用模型

Claude Opus 

+ GPT 

# 1. 渗透测试是无限状态空间中的有向搜索

- 状态空间搜索需要：已确认的发现（Fact）、待探索的方向（Intent）、因果链保留

- 黑板架构是这个需求的最自然载体

- 这不是渗透测试独有的结构，Cairn 是通用问题求解引擎，渗透测试是第一个靶场

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/aca16e3b540b6497363f7da57d3032199710d43ee64617dfb9e807d56d24c4d3.jpg)


# 2. 完整上下文的 Worker, 动态生成的任务

- 没有预设角色，任务由图的当前态势在运行时产生

- Agent 之间通过黑板间接协调（Stigmergy），无需互相通信

- 完整图作为每次任务的上下文，让跨阶段推理自然发生

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/f85f56e64163dace8e1e8b6582cff8a163fb60b26b98686e9216585356f99052.jpg)


# 3. 在问题内部找抽象，而非在问题外面堆解法

- 0个MCP，0个RAG，0种预定义Agent角色

- 可控性内嵌于协议：Hint注入、心跳超时、完整因果审计、随时停止/恢复

- Less Is More，不只是设计风格，也是看到本质后的自然结果

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/76add894a739b6731ca4d05d52f0f1f93a3b76af5ea45c1646d0a82468d8088f.jpg)


“ 

我没有教它们渗透测试。

我只是给了它们一块黑板、一个目标、和一堆工具。

剩下的，都来自涌现。

” 

开源地址：

https://github.com/oritera/Cairn 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/fbc3775f-a9fd-4067-982f-1e0801737d41/7ef6a383e4e24f9abaff940ff91d1c9d9e3e7d9da8f42b9da06c04ed30735ab8.jpg)


# THANKS

# AI