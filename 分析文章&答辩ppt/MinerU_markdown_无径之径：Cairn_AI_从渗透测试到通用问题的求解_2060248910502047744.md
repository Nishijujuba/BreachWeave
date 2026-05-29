# 无径之径：Cairn AI 从渗透测试到通用问题的求解

原创 l3yx 涙笑的赛博日记-起零衍迹实验室 2026年4月26日 16:38 北京

这是我在第二届 TCH·腾讯云黑客松智能渗透挑战赛 获得线上唯一 AK 成绩的线下决赛答辩 PPT，最终总成绩为全国第三。

"无径之径"的含义是——我没有给系统预设任何固定路径、流程定义和角色分工，路径本身从黑板上涌现出来。我的PPT写的比较详细，基本交代了我整个设计理念和工程实现，本系统全部代码近期也会在起零衍迹开源，如果有任何问题欢迎在本公众号该文章评论区留言，或者加入「起零衍迹AI社区」微信群讨论，我本人会一一回答。

「起零衍迹」是我们专注于 AI 应用与 Agent 工程前沿探索的开源组织，我们致力于技术开源与社区共建。安全攻防是我们深耕的方向之一。

# 无径之径：Cairn AI 从渗透测试到通用问题的求解

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/8cb7731a363eb18d001ff389aa3734aadbb732b8bc2d4aa7f82b361e77e2dbac.jpg)


# About me

# About me

第二届戰鬥追撃戰賽·決賽
铸刃止戈 以智御危

# 贾宇阳

- 涙笑 @ 起零衍迹实验室

- 成信大三叶草战队成员

- 前阿里攻防紫军

- 独立安全研究者

- TCH 第一届 第四名 [Antix]

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/6a405bb178a8c2c1036ee99e6cf6a4845b9fab3984ebd66e599689b4b448e6fa.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/cd02f3469b25419b50ae35c934cb1607bba68252abf1df8ee26cf7bf9ebd18c3.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/731a6160ea497a30ac53c311a2f68f621361a7e307cccead98042a2f9ccf69ae.jpg)


公众号·淚笑的赛博日记-起零衍迹实验室

# 目录

第二届展览巡检战赛·决赛
铸刃止戈 以智御危

# 目录

PART 01 问题的本质

PART 02 系统设计 — 黑板、蚁群、和涌现

PART 03 Agent 角色分工是人类局限的投影

PART 04 总结

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/6b75d56d601561723b16acd4dccc3d60eb63f3e0d54379e9710ec42f2b0e719b.jpg)


公众号·淚笑的赛博日记-起零衍迹实验室

# 问题的本质

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/13b3241305bc54596a299fa3505cbb84afd32a541cb59a1ceb443d4fbf1697e8.jpg)


# 开场

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/c20c859f1609942a9acc4df08025d697c5600f828f5c95e7008e8bd40f5d4f69.jpg)


# 经典回答

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/966ae0e219f67ae32b714e57af3fd57d073a75154430af4144055328c92c320a.jpg)



状态空间搜索


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/152ec6151faedc57e7a029cc7f4dd6d7229a7ec1b03acf30676cda04883970e8.jpg)



不只是渗透测试


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/01d8d65164011be37b343a1c637a49f9b98a234c5ee286b42dee2fe8f7144bfa.jpg)


系统设计—黑板、蚁群、和涌现

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/39f57550702d4103f36336d99e48f34c4460b0d4db9e649da911e33f020ae746.jpg)



一个画面——侦探破案


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/748ab34e80d0ca1f7982e8f976f1829dfedb67a75985258de58526b6c1818c53.jpg)



我设计出来，才发现它有名字——黑板架构


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/6308b1d5dd3dd4a40adc0c1c03730073c21547a9052f1b92f49096494f4464ff.jpg)


# Cairn 的黑板

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/56076446f10f1e0d7bc473eafb66b886763832dc570e2c746bb3d179c9de58fe.jpg)


# Agent 的工作循环

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/4902c382481bba26dfc9d637a2ec409894672f620a433f54ad102573d1fc9179.jpg)


# 一道题的完整生命周期

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/0813b114b7391239163e449b46b5c4ac430b8295466c77f9046f79f39e9fd2a3.jpg)


# 设定起点 Origin

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/81b343ded29137aee003238ea58ff4556d82702bc016a952a82cf55b0b126702.jpg)


# 设定终点 Goal

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/925e3adbc983793d9c643551e6b4c793666274e0f7bc5cf00f212a2f3785da9e.jpg)


# 系统初始时要求直接完成 Goal

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/bc6dc7b8b2fc4e2768af45f908d76bf5bae7951ddee8b437e55e42c844f23607.jpg)


# Worker 尝试直接从 Origin 到达 Goal (Bootstrap)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/e739f7b49d1408fa849459c5f7848f94f7f210382029fb931646f6b1b1211649.jpg)


# 没有在指定时间内到达 Goal，但也写下了结论 Fact

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/a10bafc9c8b01d1be28da5b7078d2df159eba168c05b7bca8ae605a890ac2078.jpg)


# Worker 开始思考下一步应该做什么（Reason）

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/601db211dcedbc1e9ac33893a0bf34dc2b2a236cdc5d735d985311ad653f5941.jpg)


# Worker 写下下一步 Intent

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/2e549d956cb1fd37d42cd22b92840c1c5b3785ab06b4e0f99abadbeb3595ac78.jpg)


# Worker 执行指定 Intent（Explore）

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/97052f416ac60c0595db33aa19c4916b0ad81f43171924db889506f1ecd96fcf.jpg)


# Worker 执行指定 Intent 完成后写下结论 Fact

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/78cbd918b0d77ea9a34fe80b2648236e15ae81d18e88add59c42caa67a3ccc0d.jpg)


# 态势变化，Worker 重新思考下一步做什么（Reason）

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/11c828a9b24cdb9db822589ca76a080d27e811fdce7907ee0e6897643ad756ec.jpg)


# Worker 写下下一步 Intent

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/9181c63dbffe861200648215f57866c870103795d35ee0fdf3e501f9e772af5b.jpg)


# Worker 执行指定 Intent（Explore）

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/be93165438b3e7e72d9219553ab782c803db4e565ee48fc6d4d21f5efc987d5c.jpg)


# Worker 判定完成，连接到 Goal，项目结束

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/0171813bea817a3427b3597537ae70031cd421ec5fd94ed7384c31a4b8795d67.jpg)


# 一个更复杂的案例

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/ad9388de4a737d7bf60466bc027ba89dd88d41308e9cdadab168ad177c56e44e.jpg)


# 我从来没有限制他怎么做渗透测试

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/2a16833ec35686005e206fd6f354c47803ee31af75d96abab86306b07e80fabd.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/6405d769d9575962bf3a0c22000150ac453f693244f3ed90b1f03be077c28b6e.jpg)



平等的 Worker，动态的任务


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/679ef7d867b283ea3380944b25f3dc5f4734e3e2cb0f151a4d549c38cf9c1d7d.jpg)



Agent 之间如何协调


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/7be6355893c32bed06e4b4dd20e6559b7d408184a8bdc949441dbb484b6cc279.jpg)



Agent 角色分工是人类局限的投影


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/b108fdceb1e546b2104f67a7e20ac2e37c9e795e237d35902eb8201e97843073.jpg)



传统多 Agent 架构的角色分工是人类局限的投影


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/8c1fa862d71b0f9fa2ccd56e295d3a0fec09f2191aa673c392493176736f59d9.jpg)



Less Is More


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/621374d5837d851b110ca79a00193605a44f872c19fad83ad98f3ca5f15a7e91.jpg)



总结


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/b29a6b3c22f64b99d1d6590c24adbee03e7e985eb61fdb639dbb744d44c0df7f.jpg)



比赛表现


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/cfd6858377717b97052ef3aee0de3711c98c38828c7a96a9e36ae799bfafc007.jpg)


# 总结

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/358ae390e4bc77f7f393277c8b60ed7d54fbfafd0e0dbe044ae90f0d0c5e0919.jpg)


# 结语

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/ee02efc3eeca814a5d124dfa87dece4e02d87c7baabebd5877a72d5c5c65e36f.jpg)


附.

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/b81d4de7a11948fd681c8a5b04dcec44f8fe75e11eb9432c52a7ec6c378de5b5.jpg)



THANKS


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/47e6bd2d-9548-46a5-83b1-55c6343187f6/3d51eca7f19319d50c75a40a38a19f62bff6c978ecfc93e5a479ab09e1809ad4.jpg)


喜欢作者

AI·目录

上一篇

国内最强 AI 渗透测试 Agent —— TCH·腾讯云黑客松第二届智能渗透挑战赛 唯一 AK 战...

下一篇

两届TCH之后——AI渗透测试Agent的Harness工程演进、防御与我的思考

作者提示: 个人观点，仅供参考