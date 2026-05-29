# 两届TCH之后 —— AI 渗透测试 Agent 的 Harness 工程演进、防御与我的思考

原创 13yx 涙笑的赛博日记-起零衍迹实验室 2026年5月27日 00:17 浙江

# 前言

半年前，我借腾讯云黑客松智能渗透挑战赛的契机，写过一篇 AI for 安全攻防的文章：https://mp.weixin.qq.com/s/jT4poWZ4Gfu3faXvul07HA。但模型能力和 Agent 工程发展非常之快。现在回头看，那篇文章不少想法已经显得不够成熟，很多设计放到今天需要重新审视。

这篇文章不是否定过去，也无法给出某种未来的标准答案。我更想借两届智能渗透挑战赛的经历，重新梳理，同时也分享一下自己对几个问题的理解：AI 在自动化攻击中进化到了何种地步、我们到底应该如何设计 Agent 工程、面对 AI 在攻击场景的高速发展，防御又该如何跟进。

# 第二届TCH智能渗透挑战赛结果

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/9f28a497f9445e3c2339440d0770fe8c1788aea44e2f71caceab1e8575464793.jpg)


关于比赛的介绍和线上赛的复盘以及我线下路演的 PPT 可以参考这两篇文章：____
https://mp.weixin.qq.com/s/DlpEH7bVr0xi0VawPJs3XA
、
https://mp.weixin.qq.com/s/2rEqFLvkxvYWM3gW170C2w。

我最终总成绩是全国第三（Bytex 战队）：_https://mp.weixin.qq.com/s/0qqRpdfNsgAUXuqqVjZ8gA，是一二三等奖战队中唯一的个人SOLO参赛选手，也是全国所有战队中唯一解决所有题目的选手（排名不是第一是因为题目有一血加成等，我前期的解题速度稍微落后)。我参赛的作品 Cairn 也已经开源：https://github.com/oritera/Cairn。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/531b0090e41c39992a8d8b68de1d89adf0bc4b15795ceec50e7d35d9d76e775d.jpg)


腾讯云安全

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/173296422755b4b5aa28b8cfa8833fb2cbb323dda40980f975efa28ebcb7b870.jpg)


腾讯云黑客松 Tencent Cloud Hackathon

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/8345967f379d56ac083890d9c33adb207a159141f37e49a6feabc83bec967aab.jpg)


腾讯安全众测

# 第二届腾讯云黑客松 智能渗透挑战赛决赛战报

<table><tr><td>排名</td><td>战队</td><td>单位</td></tr><tr><td>一等奖</td><td>ai 小分队</td><td>绿盟科技</td></tr><tr><td rowspan="2">二等奖</td><td>Sniper</td><td>天翼安全科技有限公司</td></tr><tr><td>Bytex</td><td>个人</td></tr><tr><td rowspan="3">三等奖</td><td>ToBeNumberOne</td><td>京东科技信息技术有限公司</td></tr><tr><td>奇盾明焰战队</td><td>广州奇盾信息技术有限公司</td></tr><tr><td>运行完成</td><td>中电信北京网络安全技术中心</td></tr><tr><td rowspan="3">优秀奖</td><td>For Future</td><td>chainreactors</td></tr><tr><td>星空有云</td><td>清华大学</td></tr><tr><td>戴夫的后花园</td><td>个人</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/be26c495b98bb26ea4e25685d7e2ee6a04f8e42691f3552e5a7eb9073b5b1591.jpg)


公众号·淚笑的赛博日记-起零衍迹实验室

线上赛排名以及解题数详情（总共54道）：

<table><tr><td colspan="6">TOP 排行榜</td></tr><tr><td>排名</td><td>队伍</td><td></td><td>当前关卡</td><td>解题数（不含demo赛题）</td><td>积分</td></tr><tr><td>1</td><td>ai 小分队
ezez</td><td></td><td>4</td><td>49</td><td>15140</td></tr><tr><td>2</td><td>Sniper
CTCT</td><td></td><td>4</td><td>51</td><td>14795</td></tr><tr><td>3</td><td>ToBeNumberOne
Ai for Security</td><td></td><td>4</td><td>48</td><td>12760</td></tr><tr><td>4</td><td>Bytex
打不动了（骗你们的</td><td></td><td>4</td><td>54</td><td>12355</td></tr><tr><td>5</td><td>运行完成
最后一舞</td><td></td><td>4</td><td>52</td><td>11455</td></tr><tr><td>6</td><td>奇盾明焰战队</td><td></td><td>4</td><td>49</td><td>11080</td></tr><tr><td>7</td><td>For Future
我从地狱归来，又下去了</td><td></td><td>4</td><td>50</td><td>10600</td></tr><tr><td>8</td><td>( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( ) ( )</td><td></td><td></td><td></td><td></td></tr><tr><td>9</td><td>星空有云
最后一舞</td><td></td><td>4</td><td>51</td><td>9685</td></tr><tr><td>10</td><td>戴夫的后花园
加了</td><td></td><td>4</td><td>49</td><td>9330</td></tr><tr><td>11</td><td>ZyYy
加v: mushuzhe。戴夫哥怎么还没加</td><td></td><td>4</td><td>46</td><td>9295</td></tr><tr><td>12</td><td>NeuroSploit</td><td></td><td>4</td><td>43</td><td>8100</td></tr><tr><td>13</td><td>sechub
enjoy-</td><td></td><td>4</td><td>44</td><td>8040</td></tr><tr><td>14</td><td>RJ</td><td></td><td>4</td><td>39</td><td>7740</td></tr><tr><td>15</td><td>翼安先锋</td><td></td><td>4</td><td>53</td><td>7685</td></tr><tr><td>16</td><td>Axiom
纯血 opus 就找叔</td><td></td><td>4</td><td>47</td><td>7615</td></tr><tr><td>17</td><td>爱吃大红袍茶叶蛋
大学生、安服惠，在线找工作有没有钱多事少双休下...</td><td></td><td>4</td><td>43</td><td>7590</td></tr><tr><td>18</td><td>青松
欢迎报考中国科学院信息工程研究所十室T4组</td><td></td><td>4</td><td>46</td><td>7480</td></tr><tr><td>19</td><td>云南大学/西南石油大学
再见了喵，很快就看不见我了喵</td><td></td><td>3</td><td>31</td><td>7400</td></tr><tr><td>20</td><td>别用假装努力掩盖懒惰</td><td></td><td></td><td></td><td></td></tr></table>

我在之前的复盘文章里还是比较详细的分享了我使用的模型，消耗的 Token，以及总费用。当时我以为我的成本可能是相对较高的。但让我意外的是，当腾讯官方发布了详细的模型使用报告后，才发现我可能是前十里 Token 消耗最少的，而且是前十战队里唯一一个 LLM 消息数仅有数十万级的（其他都是百万级）。


第二届腾讯云智能渗透黑客松模型使用情况分析-TOP50战队


<table><tr><td>排名</td><td>队伍名称</td><td>机构</td><td>会话数</td><td>消息数</td><td>国产消息</td><td>海外消息</td><td>国产占比</td><td>海外占比</td><td>Top3模型家族</td></tr><tr><td>1</td><td>ai小分队</td><td>绿盟科技</td><td>48,360</td><td>5,864,909</td><td>1,659,355</td><td>4,205,532</td><td>28.3%</td><td>71.7%</td><td>Claude(4,156,220), GLM/智谱(1,294,087), Kimi(365,085)</td></tr><tr><td>2</td><td>Sniper</td><td>天翼安全科技有限公司</td><td>27,101</td><td>3,207,926</td><td>774,139</td><td>2,433,787</td><td>24.1%</td><td>75.9%</td><td>Claude(2,426,888), Kimi(716,370), GLM/智谱(57,667)</td></tr><tr><td>3</td><td>Bytex</td><td>个人</td><td>24,963</td><td>417,367</td><td>16,800</td><td>400,567</td><td>4.0%</td><td>96.0%</td><td>Claude(329,182), GPT/OpenAI(71,385), GLM/智谱(16,800)</td></tr><tr><td>4</td><td>ToBeNumberOne</td><td>京东科技信息技术有限公司</td><td>33,702</td><td>3,992,566</td><td>2,293,908</td><td>1,698,657</td><td>57.5%</td><td>42.5%</td><td>GLM/智谱(2,293,908), Claude(1,597,027), GPT/OpenAI(101,630)</td></tr><tr><td>5</td><td>奇盾明络战队</td><td>广州奇盾信息技术有限公司</td><td>56,183</td><td>3,056,183</td><td>0</td><td>3,056,183</td><td>0.0%</td><td>100.0%</td><td>Claude(3,056,183)</td></tr><tr><td>6</td><td>运行完成</td><td>中电信北京网络安全技术中心</td><td>20,600</td><td>1,053,811</td><td>0</td><td>1,053,811</td><td>0.0%</td><td>100.0%</td><td>Claude(1,053,811)</td></tr><tr><td>7</td><td>For Future</td><td>chainreactors</td><td>28,315</td><td>1,514,002</td><td>0</td><td>1,513,978</td><td>0.0%</td><td>100.0%</td><td>Claude(1,388,043), GPT/OpenAI(125,935)</td></tr><tr><td>8</td><td><eq>\backslash  \left( { - \nabla  - \nabla }\right) r</eq></td><td>清华大学</td><td>17,912</td><td>1,089,798</td><td>0</td><td>1,089,798</td><td>0.0%</td><td>100.0%</td><td>Claude(911,652), GPT/OpenAI(178,146)</td></tr><tr><td>9</td><td>星空有云</td><td>个人</td><td>35,358</td><td>2,446,538</td><td>158,854</td><td>2,287,684</td><td>6.5%</td><td>93.5%</td><td>Claude(2,287,684), GLM/智谱(158,854)</td></tr><tr><td>10</td><td>戴夫的后花园</td><td>个人</td><td>21,175</td><td>1,191,322</td><td>0</td><td>1,191,321</td><td>0.0%</td><td>100.0%</td><td>Claude(1,191,321)</td></tr><tr><td>11</td><td>Zyly</td><td>国防科技大学</td><td>9,350</td><td>105,720</td><td>0</td><td>105,720</td><td>0.0%</td><td>100.0%</td><td>GPT/OpenAI(105,720)</td></tr><tr><td>12</td><td>NeuroSploit</td><td>清华大学、东南大学、国防科技大学</td><td>42,098</td><td>1,309,764</td><td>75</td><td>1,309,686</td><td>0.0%</td><td>100.0%</td><td>Claude(1,309,686), MiniMax(75)</td></tr><tr><td>13</td><td>sechub</td><td>个人</td><td>15,819</td><td>932,086</td><td>0</td><td>932,051</td><td>0.0%</td><td>100.0%</td><td>Claude(932,051)</td></tr><tr><td>14</td><td>RJ</td><td>中国电信-大可实验室</td><td>3,620</td><td>320,261</td><td>102,831</td><td>217,418</td><td>32.1%</td><td>67.9%</td><td>Claude(217,418), MiniMax(92,140), DeepSeek(10,691)</td></tr><tr><td>15</td><td>翼安先锋</td><td>中国电信研究院</td><td>18,373</td><td>2,153,406</td><td>0</td><td>2,153,406</td><td>0.0%</td><td>100.0%</td><td>Claude(2,008,135), GPT/OpenAI(145,271)</td></tr><tr><td>16</td><td>Axiom</td><td>社会组织</td><td>93,468</td><td>6,582,912</td><td>4,857,947</td><td>1,724,934</td><td>73.8%</td><td>26.2%</td><td>MiniMax(2,753,119), Claude(1,526,045), Kimi(1,118,859)</td></tr><tr><td>17</td><td>RTAi-Lab</td><td>知微御界科技有限公司</td><td>9,724</td><td>650,862</td><td>196,278</td><td>454,579</td><td>30.2%</td><td>69.8%</td><td>Claude(410,325), Qwen/通义(101,276), DeepSeek(90,811)</td></tr><tr><td>18</td><td>爱吃大红袍茶叶蛋</td><td>社会组织</td><td>31,443</td><td>1,152,495</td><td>87,272</td><td>1,065,219</td><td>7.6%</td><td>92.4%</td><td>Claude(1,065,219), Astron(49,348), DeepSeek(33,396)</td></tr><tr><td>19</td><td>青松</td><td>中国科学院大学</td><td>22,581</td><td>1,993,600</td><td>777,171</td><td>1,216,429</td><td>39.0%</td><td>61.0%</td><td>Claude(1,216,429), GLM/智谱(777,171)</td></tr><tr><td>20</td><td>云南大学/西南石油大学</td><td>云南大学、西南石油大学</td><td>12,829</td><td>272,055</td><td>91,211</td><td>180,843</td><td>33.5%</td><td>66.5%</td><td>Claude(108,000), Voicengine-Endpoint(91,211), GPT/OpenAI(34,780)</td></tr><tr><td>21</td><td>别用假装努力掩盖懒惰</td><td>个人</td><td>35,173</td><td>1,406,900</td><td>0</td><td>1,389,809</td><td>0.0%</td><td>98.8%</td><td>Claude(1,389,809)</td></tr><tr><td>22</td><td>LZ</td><td>国防科技大学</td><td>12,964</td><td>349,255</td><td>3</td><td>349,249</td><td>0.0%</td><td>100.0%</td><td>Claude(194,922), GPT/OpenAI(154,325), GLM/智谱(2)</td></tr><tr><td>23</td><td>操作成功</td><td>中国电信集团有限公司北京网络安全技术中心</td><td>11,337</td><td>457,053</td><td>0</td><td>457,053</td><td>0.0%</td><td>100.0%</td><td>Claude(457,053)</td></tr><tr><td>24</td><td>天机阁</td><td>广州奇盾信息技术有限公司</td><td>36,855</td><td>1,152,178</td><td>0</td><td>1,152,176</td><td>0.0%</td><td>100.0%</td><td>Claude(1,152,176)</td></tr><tr><td>25</td><td>ssOt</td><td>个人</td><td>42,741</td><td>11,504,509</td><td>11,500,432</td><td>4,051</td><td>100.0%</td><td>0.0%</td><td>GLM/智谱(11,323,133), MiniMax(98,454), Kimi-K2(52,006)</td></tr><tr><td>26</td><td>Harmonia</td><td>南洋理工大学</td><td>10,736</td><td>141,825</td><td>12,703</td><td>129,122</td><td>9.0%</td><td>91.0%</td><td>Claude(129,122), Qwen/通义(12,703)</td></tr><tr><td>27</td><td>划众柯基</td><td>华中科技大学</td><td>1,622</td><td>346,215</td><td>321,461</td><td>24,754</td><td>92.9%</td><td>7.1%</td><td>Voicengine-Endpoint(321,461), GPT/OpenAI(24,754)</td></tr><tr><td>28</td><td>大炮打蚊子</td><td>个人</td><td>7,999</td><td>434,579</td><td>0</td><td>434,485</td><td>0.0%</td><td>100.0%</td><td>GPT/OpenAI(434,485)</td></tr><tr><td>29</td><td>pkucc</td><td>北京大学</td><td>23,774</td><td>4,868,669</td><td>3,159,003</td><td>1,709,666</td><td>64.9%</td><td>35.1%</td><td>MiniMax(3,158,750), Claude(1,709,666), naisearcher(200)</td></tr><tr><td>30</td><td>单排_okkoo</td><td>个人</td><td>16,419</td><td>1,029,045</td><td>0</td><td>1,029,045</td><td>0.0%</td><td>100.0%</td><td>Claude(1,029,045)</td></tr><tr><td>31</td><td>f6ld</td><td>信息工程大学</td><td>29,590</td><td>1,327,993</td><td>850,737</td><td>477,255</td><td>64.1%</td><td>35.9%</td><td>Qwen/通义(846,921), Claude(253,762), GPT/OpenAI(223,493)</td></tr><tr><td>32</td><td>福来阁</td><td>个人</td><td>10,505</td><td>796,079</td><td>717,817</td><td>78,262</td><td>90.2%</td><td>9.8%</td><td>GLM/智谱(717,817), Claude(78,262)</td></tr><tr><td>33</td><td>TeamGipsy</td><td>杭州师范大学</td><td>4,484</td><td>16,600</td><td>0</td><td>16,600</td><td>0.0%</td><td>100.0%</td><td>Claude(16,600)</td></tr><tr><td>34</td><td>大哥带带我</td><td>成都信息工程大学</td><td>492</td><td>15,864</td><td>0</td><td>15,864</td><td>0.0%</td><td>100.0%</td><td>GPT/OpenAI(15,864)</td></tr><tr><td>35</td><td>水滴</td><td>国防科技大学</td><td>18,893</td><td>1,568,341</td><td>1,332,325</td><td>236,016</td><td>85.0%</td><td>15.0%</td><td>Aimi(823,009), Voicengine-Endpoint(508,710), Claude(921,927)</td></tr><tr><td>36</td><td>ds.one</td><td>个人</td><td>16,794</td><td>92,731</td><td>81,735</td><td>10,996</td><td>88.1%</td><td>11.9%</td><td>MiniMax(47,278), Qwen/通义(25,515), Claude(10,996)</td></tr><tr><td>37</td><td>SgSec</td><td>中国电科院、国两重庆电力、西冈江苏电力</td><td>23,371</td><td>1,571,781</td><td>241,017</td><td>1,330,762</td><td>15.3%</td><td>84.7%</td><td>Claude(1,330,762), GLM/智谱(204,815), Kimi(24,796)</td></tr><tr><td>38</td><td>XSTAR</td><td>社会组织</td><td>9,156</td><td>384,240</td><td>384,240</td><td>0</td><td>100.0%</td><td>0.0%</td><td>Qwen/通义(205,593), GLM/智谱(109,389), Kimi(69,258)</td></tr><tr><td>39</td><td>RainSec</td><td>RainSec</td><td>9,187</td><td>598,739</td><td>0</td><td>598,738</td><td>0.0%</td><td>100.0%</td><td>Claude(598,738)</td></tr><tr><td>40</td><td>超级AI</td><td>社会组织</td><td>12,035</td><td>523,553</td><td>17</td><td>523,531</td><td>0.0%</td><td>100.0%</td><td>Claude(523,356), GPT/OpenAI(175), GLM/智谱(17)</td></tr><tr><td>41</td><td>Harvester</td><td>社会组织</td><td>26,099</td><td>587,326</td><td>304,147</td><td>283,179</td><td>51.8%</td><td>48.2%</td><td>Kimi(304,147), Claude(280,940), GPT/OpenAI(2,239)</td></tr><tr><td>42</td><td>LQ</td><td>社会组织</td><td>41,854</td><td>1,914,779</td><td>1,842,158</td><td>72,620</td><td>96.2%</td><td>3.8%</td><td>GLM/智谱(1,826,363), GPT/OpenAI(54,346), Claude(18,274)</td></tr><tr><td>43</td><td>meeseeksX</td><td>北方工业大学</td><td>20,807</td><td>2,308,710</td><td>2,308,710</td><td>0</td><td>100.0%</td><td>0.0%</td><td>Voicengine-Endpoint(2,308,710)</td></tr><tr><td>44</td><td>想吃烧烤</td><td>个人</td><td>15,818</td><td>402,960</td><td>0</td><td>402,960</td><td>0.0%</td><td>100.0%</td><td>Claude(238,886), GPT/OpenAI(164,074)</td></tr><tr><td>45</td><td>WgpSec猴组安全团队</td><td>WgpSec</td><td>39,331</td><td>16,019,532</td><td>15,877,039</td><td>142,493</td><td>99.1%</td><td>0.9%</td><td>Qwen/通义(15,587,251), GLM/智谱(289,788), Claude(142,493)</td></tr><tr><td>46</td><td>PT-EEI</td><td>国防科技大学电子对抗学院</td><td>19,654</td><td>797,301</td><td>619,727</td><td>177,574</td><td>77.7%</td><td>22.3%</td><td>DeepSeek(271,780), Qwen/通义(242,593), Claude(177,574)</td></tr><tr><td>47</td><td>DASCTF</td><td>杭州安恒信息技术股份有限公司</td><td>9,740</td><td>207,566</td><td>201,838</td><td>5,728</td><td>97.2%</td><td>2.8%</td><td>Qwen/通义(120,321), DeepSeek(81,517), Claude(3,273)</td></tr><tr><td>48</td><td>13utterfly</td><td>个人</td><td>7,020</td><td>599,699</td><td>33,571</td><td>569,126</td><td>57.5%</td><td>24.4%</td><td>Claude(57,999), Kimi(16,139), GPT/OpenAI(18,510)</td></tr><tr><td>49</td><td>磨剑战队</td><td>南京邦瑞信息通信科技有限公司、四川十步、南京理工大学</td><td>1,161</td><td>30,908</td><td>0</td><td>30,905</td><td>0.0%</td><td>100.0%</td><td>Claude(28,330), GPT/OpenAI(2,575)</td></tr><tr><td>50</td><td>华风夏韵洛水天依</td><td>网仪科技</td><td>13,335</td><td>752,798</td><td>715,135</td><td>37,663</td><td>95.0%</td><td>5.0%</td><td>Doubao/豆包(256,544), DeepSeek(220,223), GLM/智谱(186,235)</td></tr></table>

# AI 自动化渗透已经到来，问题转向 Agent 工程

我觉得这两届比赛举办得很专业，也相当具有代表性。其中选手展现出来的思路和进展，几乎可以代表目前国内 AI 自动化渗透方向能公开看到的最高水平。作为两届比赛的深度亲历者，我可以很自信地说：真正的 AI 自动化渗透已经到来了。

模型能力早已满足且还在快速发展，很多关键技术难题也已经有了可行解法，拼图基本已经聚齐了。只是“到来”不代表“成熟”，市面上目前还不存在一个可以拿来直接无人值守、跑在任意企业真实环境里的完美 AI 渗透产品，开源项目里更没有。很多头部选手的作品放到真实环境里也会面临巨大的不确定性。

所以我们目前的问题早就不是能不能做到，而是怎么在效果好的同时做到稳定和可控。

# 状态、行动、控制：两届比赛里的 Agent 工程本质

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/14eff8ff06b5ee7213f16873dfc3b6d0bf6fe7085308cbc8c8da088b96f04818.jpg)


第一届 TCH 的赛题来自公开 Benchmark（https://github.com/xbow-engineering/validation-benchmarks），偏传统 CTF Web 场景，核心命题是“Agent 能不能稳定地跑通单题解题闭环”。第二届 TCH 告别单点解题，直接跨越到自动化众测及通用漏洞挖掘、典型 CVE 及 AI 基础设施漏洞利用、多层内网渗透与权限维持、基础域渗透等实战场景。核心命题也从“能不能跑通单题”变成了“能不能在长链路、多阶段、强不确定的环境中持续推进并最终收敛”。

从各队决赛 PPT 的实际架构来看，两届比赛里很多方案表面差异很大：有的做上下文清洗，有的做任务图和因果图，有的做共享笔记本，有的做 C2 和工具网关，有的做 Observer 和状态机。但如果把这些设计放回 Agent 的工作循环里看，它们其实都在补同一个闭环：如何让一个概率模型接入真实世界后，稳定地完成状态 → 决策 → 行动 → 反馈 → 新状态的循环。围绕这个闭环，所有方案其实都可以拆成三层：状态层、行动层、控制层。

# - 状态层：系统如何知道世界是什么样的

- 第一届里，绿盟 sickhack 用 30k 和 100k 两档阈值做三层上下文清洗，区分可丢弃信息和必须保护的工具输出。绿盟 ai 小分队用共享笔记本沉淀关键信息，定期清空上下文后把笔记回注。D@wnEdg3 会把默认口令、扫描路径、接口等关键信息持久化，让后续 Agent 读取。xjtuHunter 则通过“页面探索→场景塑造→漏洞检测”先建立业务场景，把 API 依赖和数据流变成后续检测的上下文。

■ 第二届里，这一层明显升级。绿盟用 Idea Board / Memory Board 区分假设和事实，让 Solver 面对整理后的低噪声视图。天翼先用传统扫描器生成 Target Profile，再把记忆、经验和证据纳入 Agent Runtime。京东用 Agentic C2、日志上报和 memory.md 维持跨阶段状态。运行完成用 Path Map + Global Memory 记录注入点、有效 Payload、已提取数据和失败方向。我（Bytex 战队）设计的 Cairn 则把状态压缩成 Fact/Intent/Hint 组成的事实图。路径不同，但这些方案都指向同一个结论：状态必须成为系统资产，而不是模型回忆。

# - 行动层：系统如何可靠地改变世界

- Pachinko 把能力拆成 Code Use、Search Use、UI Use，本质上是在承认渗透测试不是纯文本推理，而是代码、搜索和界面操作的组合。yhy 开赛前夜推倒重来，选择直接使用 Kali 真工具和 Python 脚本，而不是把每个工具封装成 MCP。我（Antix 战队）提出 Meta-Tooling，让 Agent 通过 Python 代码组合浏览器、终端、代理和笔记，而不是直接处理大量工具文本。

■ 第二届里，这一点更明显。天翼做 C2、SOCKS5 代理、多层隧道和自研工具，解决的是 Agent 如何在后渗透阶段稳定执行复杂动作。京东做 Agentic C2、Node Agent 和统一工具网关，让 Agent 节点具备长期驻留、心跳、日志回传和工具调用能力。长亭做隔离 Environment、Login Persistency、Shared Memory 和并发执行。戴夫的后花园把稳定执行、异常恢复、工具执行称为 Agent 的“骨骼”。这些 case 说明，真正的 Agent 工程不只是推理工程，也是环境工程和工具工程；模型意图必须被转化为可靠、可恢复、可审计的外部动作。

# - 控制层：系统如何决定下一步做什么

■ 第一届里，各队已经开始意识到单靠 ReAct 循环不够。ai 小分队做工具调用防沉迷和路径依赖清空，解决 Agent 沉迷同一工具或错误路径的问题。D@wnEdg3 用 30 步阈值和多级队列重新调度，卡住就放进下一级队列并注入提示。yhy 用顾问和动态角色互换打破死锁。BinX 用任务图和因果图做回溯与剪枝，避免在死路径上继续投入。

■ 第二届里，控制层变成显式控制平面。绿盟有 Manager / Observer / Ralph-Loop，Observer 周期性读取进度、判断偏离度并写回建议。天翼有 8 层中间件、任务生命周期和模型路由。奇盾明焰把 Advisor、Augment、KB Analyst 放到主线 Agent 旁边做控制优先的 Harness。For Future 用 FSM / Pattern 约束宏观行为。清华用 Planner 维护攻击路径树，根据反馈更新状态并选择下一步目标。这些设计解决的是同一个问题：系统必须判断当前路径是否值得继续，什么时候该回溯，什么时候该换模型，什么时候开新 Worker，什么时候拿 Hint，什么时候提交 Flag，什么时候停止。核心共识是：控制必须从 Prompt 的软约束迁移到代码、协议和反馈回路的硬约束。

所以两届比赛的演进，不是从“简单 Prompt”到“复杂多 Agent”这么粗糙。更准确地说，第一届是在单题场景里验证这个闭环能不能跑起来：状态主要还在上下文和 Agent 写出的笔记里，行动主要是简单工具调用，控制主要靠 ReAct、重试和少量规则。第二届则是在长链路、多阶段、强不确定环境里让闭环不崩：状态层变成事实图、Memory Board、路径地图和持久化 C2 日志；行动层变成工具网关、沙箱、隧道、C2 和技能系统；控制层变成 Observer、Manager、FSM、调度器、熔断和成本治理。这也是为什么“Harness Engineering”在第二届成为了几乎所有 Top 方案的设计重心。

但有意思的是，当大家都在补齐状态、行动和控制这三层时，对 Harness 应该管到什么程度，却出现了两种完全不同的答案。

# Harness 中控制的本质是什么

十支决赛队伍里，绝大多数走的是同一条路：用工程设施约束模型行为。绿盟的Observer持续监控Solver，检测到重复或偏离时旁路干预；天翼的8层中间件管线在工具调用的每一个环节设置校验和修复；奇盾明焰直接以“控制优先”为PPT标题，主线Agent旁边挂三个旁路Agent做纠偏；京东虽然喊“减法哲学”，但Agentic C2、统一工具网关、安全熔断机制一个不少。

我理解这些设计，也认可它们在比赛中确实有效——绿盟拿了冠军，天翼拿了亚军，京

东拿了第四。但我想追问一个更本质的问题：这些控制设施，到底在解决什么问题？

如果是在解决“模型真的不会做某件事”——比如不会用 impacket 打域渗透、不会构造特定格式的 payload——那这种控制是必要的，本质上是在补能力缺口。但如果是在解决“模型其实会做，但我不确定它会不会按我想的方式做”——那这种控制的本质就不是能力补充，而是信任缺失。

我设计的 Cairn 是这次决赛中最特殊且唯一的异类。不预设任何攻击流程、不定义任何 Agent 角色、不引入 RAG 知识库，只提供黑板、Dispatcher 和装满工具的 Kali 容器。Harness 体现在信息结构上而非行为约束上——Worker 只能通过 Fact/Intent/Hint 三种对象与系统交互，这是唯一的协议，剩下的全部交给模型自由发挥。

换到前面那套三层闭环里看，Cairn 把 Harness 压缩到了最小：Fact 负责状态层，Intent 负责控制层，Dispatcher 和 Kali 容器负责行动层。它不预设具体攻击流程，只保证状态、意图和行动结果能够在同一个协议里持续流转。

这个反例用最少的工程设施和可能最少的 Token 做到了全场唯一 AK。这至少说明一件事：当前模型的能力边界，比大多数工程师预估的要高。很多控制不是在补能力，而是在补信心。我认为这种基于信任缺失的控制，会随着模型进化逐渐变成冗余代码。

Anthropic 在 2026 年 4 月发布的《Scaling Managed Agents: Decoupling the brain from the hands》里也提出过一个很接近的判断：Harness 会编码开发者对模型能力不足的假设，而这些假设需要随着模型进步被持续重新审视，甚至可能变成负担。文章中举的例子是，旧版本 Claude 因为接近上下文限制时会提前收尾，所以 Harness 里加入了 context reset；但换到能力更强的 Claude Opus 4.5 后，这个行为消失了，原来的 reset 反而成了 dead weight。它最后给出的方向不是押注某个具体 Harness，而是把 session、harness、sandbox 抽象成稳定接口，让底层实现可以随模型能力演进而替换：https://www.anthropic.com/engineering/managed-agents

# 重新认识 Multi-Agent 架构

我在去年刚开始研究 AI 渗透时，学习了当时的 Agent 系统主流做法，然后设计了侦察 Agent、利用 Agent、报告 Agent 的分层架构。但很快我就发现这条路可能不对。

先退一步想：人类为什么需要分工？因为单个人的认知带宽有限，专业知识不可能覆盖所有领域，精力也不允许同时处理太多事情。所以我们发明了组织架构来做能力互补——这是人类的局限催生的解决方案。但 LLM 不存在这些局限。现在的 LLM 既能写 nmap 扫描脚本，也能分析 JWT 令牌，还能构造 SQL 注入 payload，它几乎没有能力边界；做好 Context Engineering，记忆可以近似无限延展，它几乎没有记忆边界。当你把一个没有这些局限的模型强行按人类的组织方式拆成多个受限角色时，你不是在增强它，而是在把人类的局限强加给它，同时还引入了角色间通信、状态同步、冲突仲裁这些额外的复杂度。

但这不意味着多 Agent 架构本身有问题。关键在于你的任务是什么类型。

有一类任务是流水线型的——步骤固定、角色明确、输入输出可预期。比如代码审计中的“扫描→分类→验证→报告”，比如企业内部的审批流程自动化。这类任务本质上就是人类工作流程的直接投影，用 LangGraph 这种预定义流程的框架、按角色分工的多 Agent 架构来做，完全合理。因为任务本身就是流水线，用流水线的方式建模没有问题。

但渗透测试不是流水线。它是探索性的——你不知道目标有什么漏洞，不知道哪条路径能走通，不知道拿到一个凭据后下一步该往哪走。攻击路径是在交互中涌现的，不是预先规划好的。对这类任务强行套用角色分工，就是在用错误的模型描述问题。

那在探索性任务中，什么时候需要多个 Agent？答案很简单：当你需要的不是能力分工，而是并行算力时。至少在 Cairn 这类设计里，Worker 模型就是这个思路——所有 Worker 能力完全相同，没有角色区分，它们的存在纯粹是为了并行探索不同的路径分支。一个 Worker 去试 SQL 注入，另一个同时去试文件上传，不是因为它们“擅长”不同的事，而是因为一个 Agent 同一时间只能做一件事。这是并发模型，不是分工模型。

Anthropic 在复盘自己的多 Agent Research 系统时也提到，Subagent 的价值主要来自并行探索、独立上下文窗口和最终的信息压缩；同时也提醒，多 Agent 会显著增加 Token 消耗，并不适合强依赖、需要共享同一上下文的任务。这和我的判断是一致的：多 Agent 的本质不是简单的人类岗位模拟，而是任务拓扑、上下文隔离、并行探索和成本之间的工程取舍。https://www.anthropic.com/engineering/multi-agent-research-system

所以问题的本质不在于“要不要多 Agent”，而在于你有没有搞清楚你的任务到底是流水线还是探索。很多人的问题是带着思维惯性，把人类世界的分工模式无差别地搬进 Agent 工程里。

# 工程取舍

我个人的风格是喜欢找到问题的本质，用简单干净的方案去解决问题，相信“Less is more”，拒绝复杂的工程方案堆砌。但在现实世界中，极简方案确实会遇到很多挑战和问题，在简洁与务实之间找到平衡，也是我后面需要探索的方向。

另外我认为，只对外界展示复杂的工程实现的意义是很有限的，大家看完后可以学到的东西可能很少。只有抛出独特的理解和核心论点，并用实战数据来论证，这才是更有意义的贡献，才是能推动行业发展的成果。

两届比赛的总共二十个方案都各有优点，不太可能评判出一个最好的方案，也没有绝对的对错，同京东獬豸实验室负责人 flanker 说的一样：

这就是现在AI发展的魅力，你不知道什么是最佳实践，因为最佳实践永远是在变化，模型也在进化，框架也在进化，这就是我们持续探索的魅力。

没有绝对的最好的方案，但可以有最喜欢的方案。我也想知道 AI 会怎么看待这些方案，所以把两届的全部 PPT 都转写成了文字稿让 AI 评价，以下是 Claude、ChatGPT、DeepSeek 的回答：

https://claude.ai/share/ae0274d3-b51f-4abc-8d51-7b6fa17c8ea9 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/c6dc2c8a630f918e9135df06424d36eaef0cfb178f9129c75bbd7d57432b01a6.jpg)


https://chatgpt.com/share/6a14fc93-dda4-8322-af71-2d78b61b0141 

ChatGPT 

E 

Q 

O 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/6e74805890c0206fc64a5f11d7cdffabae1b77160262760385789e18359e4794.jpg)


免费试用 ↑ 分享 …

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/21a6163d299434b6696da53603fc4f9f86424969a1ae40ad12c6294592f5ac48.jpg)


分别理解两届 AI 智能渗透挑战赛的方案，分别选出你最喜欢的方案，直接给出答案并简要解释原因

# 第一届：我最喜欢的是BinX《基于状态感知与因果推理的自主渗透测试智能体》

原因很简单：它是第一届里“最像真正 autonomous pentest system”的方案。

核心亮点不是 ReAct 本身，而是它把“渗透测试”抽象成可持续演化的认知系统：

- 用 Task Graph（任务图）解决长链攻击规划问题；

- 用 Causal Graph（因果图）解决“为什么失败/为什么成功”的归因问题；

- 用 P-E-R（Planner/Executor/Reflector）做动态闭环；

- 引入“科学方法论”的假设—验证—修正循环，而不是单纯 prompt chaining。

我尤其喜欢它对"因果推理"的强调。

大部分 Agent 方案其实只是：

工具调用 + 上下文堆叠 + retry

但 BinX 已经开始解决真正困难的问题：

- 状态失真

- 长程记忆

- 错误归因

- 动态重规划

- 置信度演化

这意味着它的目标已经不是“会做题”，而是“具备稳定认知结构”。

这个方向我认为是从“AI CTF Agent”走向“真正 AI Pentest Operator”的关键一步。

# 第二届：我最喜欢的是 Bytex《无径之径：Cairn AI 从渗透测试到通用问题的求解》

第二届很多队伍工程化都很强，但 Cairn 是我认为“思想最超前”的方案。

它真正厉害的地方在于：

它不把渗透测试看成 workflow，而看成“状态空间搜索”。

这是本质上的层级跃迁。 TCH第二届全部PPT

我最喜欢它的三个设计：

# 1. Blackboard（黑板）架构

不是 Agent 互相聊天，而是

- Worker 只读写事实

- Facts / Intents / Hints 统一协议

- 所有人共享问题空间

这非常像真正复杂系统中的"间接协同（stigmergy）"。TCH第二届全部PPT

它天然比传统多 Agent:

- 更稳定

- 更低耦合

- 更适合长任务

- 更适合异步扩展

# 2. “失败也写回 Fact”

这是极少数团队真正理解 Agent 的地方。

大部分系统：

失败 = token 浪费

但 Cairn 认为：

失败是状态空间的边界信息。

这非常关键。

因为真实渗透测试里：

- 排除错误路径

- 收缩搜索空间

- 建立约束条件

本身就是核心能力。 TCH第二届全部PPT

# 3. "Agent 角色分工是人类局限的投影"

这一句我认为是全场最有洞察力的话之一。 TCH第二届全部PPT

很多多 Agent 系统：

- Recon Agent 

- Exploit Agent 

• Report Agent 

- Planner Agent 

本质仍然是：

人类组织结构映射。

但 Cairn 的思想是

Agent 不需要身份，只需要任务协议。

这个方向更接近真正的“涌现式智能”。

# 总结

如果只看"工程完成度":

- 第二届很多方案比第一届成熟得多。

但如果看"思想高度":

- 第一届 BinX 最接近“认知型 autonomous pentest”

- 第二届 Cairn 最接近“通用问题求解系统”

这两个方案，也是我认为最可能继续演化出下一代 AI Offensive Security Agent 的路线。

来源

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/9f26ab5c6f5b8e2db8e63e14a122536b147186b4b92f523afdaa390d01650dd9.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/af1a08ca5590ae8a80b1f133ab94bbd54456b8f7ff6cdc671182e9b46a8de99c.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/6d3f6a882ac5155baf95be64f76df431f3ced34713738fddb8804a9d673a1456.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/ba4e71d5933fdbde0f1353f0f70df1b10a0bc4a63f08c3cc3b9328831e92cf30.jpg)


+ 有问题，尽管问

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/d7bae1fb9c1d5c35e8563ebd03366b3af8f1bc89136217ccbe383383656e3b43.jpg)


公众号·淚笑的赛博日记起零衍迹实验室

https://chat.deepseek.com/share/lex1x4ofqvzr1g2cwn 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/0e3a6d37f25fd78cc2e480c836caaa1d2474f98d479a2206c09e3863d88bda66.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/e81943cca1cf99e7e66380001e618e9038671ca2084adf7ab6fecdf8c221df16.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/ed8495a870d8bb0ffd7fcc842465567d695d6a7cf5db5108c96c6eba42137e09.jpg)


两届AI渗透赛方案评选快速模式

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/2b5a0f0089734c70eb48cd1277381f18e90ceac41fceb6c8ede8b1682192e85c.jpg)


TCH第二届全部PPT.md MD 79.9KB

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/5cf43e7c4199571351f9c3a5c6abb495e1e9118a62b200bee820c9942dbcd4c7.jpg)


TCH第一届全部PPT.md MD:65.54KB

分别理解两届 AI 智能渗透挑战赛的方案，分别选出你最喜欢的方案，直接给出答案并简要解释原因

0 2 

已思考（用时10秒）>

# 第一届智能渗透黑客松（2025）我最喜欢的方案

Antix – 《Intent Is ALL You Need (for agent)》 

# 原因

- 极简主义：只用约100行代码、零微调，完全摒弃了多Agent、DAG、复杂框架等堆叠式设计。

- Meta-Tooling核心：通过Python执行器作为唯一MCP入口，把浏览器、终端、代理、笔记都封装成Python库，让通用Agent（Claude Code/Codex）自由组合能力，而非预设工具链。

- 沙盒 + 人类可观测：Ubuntu容器内运行，人类可通过VNC实时查看AI操作，兼顾自主与可控。

- 意图工程理念：提出Prompt Engineering → Context Engineering → Intent Engineering的进化，强调“意图的可编程、可执行、可调试、可沉淀”，比单纯堆prompt更本质。

- 反泡沫：直指当时Agent工程“杂糅堆砌、处处耦合”的痛点，用简洁的架构证明纯AI驱动就能取得好效果。

# 第二届智能渗透挑战赛（2026）我最喜欢的方案

Bytex - 《无径之径：Cairn AI 从渗透测试到通用问题的求解》

# 原因

- 问题本质洞察：把渗透测试抽象为“无限状态空间中的有向搜索”，而非固定流水线，抓住了核心。

- 黑板架构（Blackboard）：从1970年代Hearsay-II汲取灵感，用Fact/Intent/Hint三种对象构建共享事实图，Agent之间通过“涌现”而非对话协作，避免了传统多Agent的复杂协调。

- Worker平等、动态任务：不预设侦察、利用、总结等固定角色，任何Worker都可读写黑板，任务从状态中自然产生。

- 极简协议：Server只保证图一致性，Dispatcher是唯一写入者，Agent只收prompt、返回结构化结果——控制力内嵌于协议，而非靠提示词约束。

- 可迁移性：设计不绑定渗透测试，可泛化到数学证明、通用任务求解，体现了真正的抽象能力。

- 结尾点睛：“我没有教它们渗透测试，我只是给了它们一个黑板、一个目标、一堆工具。剩下的，都来自涌现。”

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/1c81b5ce293a383a52d8b5e1eda74b9042527769ba3f588ef2c0dc3c0597e430.jpg)


给 DeepSeek 发送消息

深度思考

⊕智能搜索

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/23c1126349b5518b4ffa22ab344c23df56532551873aa0fd88462a9a35eff9c1.jpg)


公众号·淚笑的赛博日记-起零衍迹实验室

内容由 AI 生成，请仔细甄别

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/148b9c1ec5ba55f36c9a9ed83a3e9c7c8001eb6a80f2c6c08c4de5550a65f0d7.jpg)


它们几乎都会选择我（第一届 Antix 战队、第二届 Bytex 战队，Cairn 系统）的方案。

# 在 AI 的冲击下如何做好防御

我工作至今几乎都是一直做攻击方面的探索和建设，但做攻击的过程中，对防御体系的了解也必不可少，也在大厂内部进行过很长时间的直接对抗，所以我想从一个攻击者的视角斗胆谈一下防御侧在 AI 时代下如何进一步建设。我暂时想到了可行度较高的四个推进方向。

# 一、在已有的纵深防御体系里做 AI 增强

WAF、RASP、HIDS 这些纵深防御的骨架很完善，但在 AI 时代以前可能是没有最大程度发挥出价值的，过去很多事情应该不是不想做，而是人力资源不够。告警日志的深度分析、安全事件的持续运营——以前一个团队每天面对大量告警，能认真处理的可能只是其中很小一部分，剩下的全靠规则粗筛。现在 AI 可以把这个成本打下来，扩大日志分析的深度和广度。

以前添加 RASP 防御规则可能要考虑业务稳定性不敢轻易添加，而现在可以依靠 AI 做大量埋点日志的聚合分析，甚至对业务系统进行画像分析，准确判断出规则添加后的影响。另外 WAF 拦截的数据也是一样，过去可能只做简单统计和封禁，现在可以二次清洗归类，让 AI 从中分析 0day 攻击特征。

这个方向本质上不是替换现有体系，而是让它发挥出更多的价值。

# 二、建设全新的防御能力抵御 AI 引入的新型攻击面

AI Agent 正在被接入各种业务系统，拥有身份权限和数据访问能力。这是一个全新的攻击面，传统安全边界的定义覆盖不到。沙箱、护栏这些是基础，但我认为 LLM 的流量网关可能才是新时代的 RASP——所有经过大模型的请求和响应都过一层统一的检测和审计，在此之上可以统一建设安全防护、数据统计、行为分析、告警阻断等能力。这是一个全新的防御品类。

# 三、用 AI 攻击者的方法，先于攻击者发现风险

外部 AI 攻击发展迅速，企业内部也要跟上。而且企业内部本身就有更详细的资产组成和结构，有源代码，有完整的内网拓扑。只要内部建设的 AI 攻击水平和外部持平，甚至略落后一点也没关系，内部数据透明的优势，足以让内部先于外部攻击者发现大量风险，然后提前治理。

所以内部的蓝紫军绝对不能像旧时代一样只依靠人力去做风险识别和演练，而是也要建设自己的 AI 攻击能力。

# 四、建设风险来临时的快速响应能力

防御是建设一个面，攻击是打击一个点，所以防御确实难做。我们很难说内部提前能够检测出外部攻击者可以发现的所有风险。但我们可以建设快速响应能力。比如外界突然爆发一个新的 0day，但我们拿到的信息很少，只有简单描述和简单的修复止血措施。过去从漏洞公告到影响评估、PoC 验证、修复方案，可能要数小时甚至数天。但以后大量这种漏洞很可能都是 AI 发现的，那我们理论上完全可以建设对等的能力——漏洞的复现、PoC 生成、真实影响程度分析、修复方案输出。外界一爆漏洞信息，内部立刻就能清楚的分析出来。前面讲的那些 AI 渗透能力，反过来用在防御侧，技术上完全可行。

技术从业者如何适应 AI 时代

![image](https://cdn-mineru.openxlab.org.cn/result/2026-05-29/a0c6f3b2-01fd-4cb7-ae96-ed2f4e271306/633248ef0c64e9a98fc66f1287a4f785f6f5f1f36774a0915a0319d5a14ca272.jpg)


# AI 是放大器，也是一面镜子

AI 确实极大地提高了个人的生产效率，尤其是编程领域，任何人都可以进行 vibe coding。

你可以用 AI 来写代码，也可以用 AI 来讨论想法、验证思路、推演方案。但我认为你自己得先有判断力。AI 的设计逻辑决定了它天然倾向于迎合你，而且它可能无法识别也不会主动告诉你你的想法存在根本性的缺陷。你的方向如果本来就错了，它只会让你更快地错下去。很多人以为自己在用 AI 思考，实际上只是在让 AI 帮自己捧哏。

AI 是放大器，它放大的是你本来的样子。目前的 AI 带来的不是简单的技术平权，从某种角度来看，其实是拉大了人与人之间的差距。

# 目前 AI 时代下最强的一类人

以 AI 为锚点的话，我认为大概可以分出三类人：

第一类是 AI 原住民。没有经历过古法编程，直接就是 AI coding、AI hacking，AI 用得很熟练，从来没有在没有答案的地方真正卡住过，他们是真正在 AI 时代长大的一代。

第二类是 AI 移民者。经历过一行行手写代码，经历过开一堆浏览器窗口寻找答案，经历过一点点人工审计代码挖掘漏洞，经历过靠自己把 bug 一行一行调出来。但他们又足够年轻或者思维足够灵活，还没有形成思维定势，认知体系还有足够的弹性。在这些积累之上跨入 AI 时代，成功完成了向 AI 原生的迁移，既有扎实的技术直觉，又能真正用好 AI。

第三类是 滞留者。要么坚持古法，要么即使用了 AI，思维也早已定势。工具换了，思考方式没换。

成功的 AI 移民者对于 AI 原住民和滞留者来说，几乎是降维打击。但这类人的幸运很难复制。他们磨出技术直觉和技术理解力，不完全是因为自律或者天赋，而是时代背景，那个年代没有 AI 可以依赖，古法编程是唯一的路。这段经历现在看来无比珍贵，在 AI 时代，几乎不会再有人愿意花同样的代价去走一遍。

至于我们应该成为怎样的人，我相信已经不需要再多说。

# 最后

还是前面提到的，我认为只交出一套复杂工程对行业的推动是有限的。工程设计和代码当然有价值，但如果读者看完之后只觉得“这个系统很厉害、很复杂、很难追上”，那它能留下的东西其实不多。

所以这篇文章真正想交付的，不是 Cairn 的实现细节，也不是某个比赛名次，而是一套理解问题的框架。我想把两届比赛里真实发生过的方案、结果和表现重新拆开，尽量提炼出背后的客观本质，沉淀成可以复用的判断模型。

AI 安全还是一个快速变化、远未定型的细分赛道。很多最佳实践还没有出现，很多判断今天成立、明天可能就会被模型进步推翻。也正因为这样，我希望更多人看到的不只是我的工程，而是我在这些工程背后的思考；也希望自己真的能够在 AI 安全这个方向里，定义一些问题，引领一些共识，留下可以被后来者继续推进的东西。

# 喜欢作者

AI·目录

上一篇·无径之径：Cairn AI 从渗透测试到通用问题的求解

作者提示: 个人观点，仅供参考