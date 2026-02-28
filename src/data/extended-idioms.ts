import type { Idiom } from "./seed-idioms";

// Extended idiom data covering all idioms in the index.
// When scrapers can't reach external sites, this provides complete fallback.
export const extendedIdioms: Record<string, Idiom> = {
  "抛砖引玉": {
    idiom: "抛砖引玉", pinyin: "pāo zhuān yǐn yù",
    meaning: "比喻用自己不成熟的意见或作品引出别人更好的意见或好作品。",
    origin: "宋·释道原《景德传灯录》",
    example: "我先说几句，算是抛砖引玉吧。",
    synonyms: ["引玉之砖"], antonyms: []
  },
  "铁杵磨针": {
    idiom: "铁杵磨针", pinyin: "tiě chǔ mó zhēn",
    meaning: "比喻只要有决心，肯下功夫，多么难的事也能做成功。",
    origin: "明·郑之珍《目连救母·刘氏斋尼》",
    example: "只要功夫深，铁杵磨成针。",
    synonyms: ["持之以恒", "锲而不舍"], antonyms: ["半途而废"]
  },
  "水滴石穿": {
    idiom: "水滴石穿", pinyin: "shuǐ dī shí chuān",
    meaning: "水不停地滴，石头也能被滴穿。比喻只要有恒心，不断努力，事情就一定能成功。",
    origin: "宋·罗大经《鹤林玉露》",
    example: "水滴石穿，绳锯木断，只要坚持不懈，必能成功。",
    synonyms: ["绳锯木断", "锲而不舍"], antonyms: ["半途而废"]
  },
  "精卫填海": {
    idiom: "精卫填海", pinyin: "jīng wèi tián hǎi",
    meaning: "旧时比喻仇恨极深，立志报复。后比喻意志坚决，不畏艰难。",
    origin: "《山海经·北山经》",
    example: "他以精卫填海的精神，坚持了二十年的科学研究。",
    synonyms: ["矢志不渝", "愚公移山"], antonyms: ["知难而退"]
  },
  "夸父逐日": {
    idiom: "夸父逐日", pinyin: "kuā fù zhú rì",
    meaning: "比喻人有大志，也比喻不自量力。",
    origin: "《山海经·海外北经》",
    example: "有人说他的理想是夸父逐日，但他从未放弃。",
    synonyms: ["夸父追日"], antonyms: []
  },
  "女娲补天": {
    idiom: "女娲补天", pinyin: "nǚ wā bǔ tiān",
    meaning: "神话故事，伏羲的妹妹女娲炼五色石补天。形容改造天地的雄伟气魄和大无畏的斗争精神。",
    origin: "《淮南子·览冥训》",
    example: "面对灾难，救援人员展现出女娲补天般的勇气。",
    synonyms: ["炼石补天"], antonyms: []
  },
  "后羿射日": {
    idiom: "后羿射日", pinyin: "hòu yì shè rì",
    meaning: "古代神话。形容为民除害的英勇行为。",
    origin: "《淮南子·本经训》",
    example: "他一直是人们心目中后羿射日般的英雄。",
    synonyms: [], antonyms: []
  },
  "大禹治水": {
    idiom: "大禹治水", pinyin: "dà yǔ zhì shuǐ",
    meaning: "禹：三皇五帝时中原的领袖。大禹治理水患为百姓谋福。",
    origin: "《史记·夏本纪》",
    example: "大禹治水三过家门而不入的精神令人敬佩。",
    synonyms: [], antonyms: []
  },
  "负荆请罪": {
    idiom: "负荆请罪", pinyin: "fù jīng qǐng zuì",
    meaning: "背着荆条向对方请罪。表示向人认错赔罪。",
    origin: "《史记·廉颇蔺相如列传》",
    example: "他意识到自己的错误后，主动负荆请罪。",
    synonyms: ["引咎自责"], antonyms: ["兴师问罪"]
  },
  "完璧归赵": {
    idiom: "完璧归赵", pinyin: "wán bì guī zhào",
    meaning: "本指蔺相如将和氏璧完好地从秦国送回赵国。后比喻把原物完好地归还本人。",
    origin: "《史记·廉颇蔺相如列传》",
    example: "这本书我看完了，现在完璧归赵。",
    synonyms: ["物归原主"], antonyms: ["久假不归"]
  },
  "围魏救赵": {
    idiom: "围魏救赵", pinyin: "wéi wèi jiù zhào",
    meaning: "原指战国时齐军用围攻魏国的方法，迫使魏国撤回攻赵部队而使赵国得救。后指袭击敌人后方的据点以迫使进攻之敌撤退的战术。",
    origin: "《史记·孙子吴起列传》",
    example: "这招围魏救赵真是高明。",
    synonyms: ["声东击西"], antonyms: []
  },
  "退避三舍": {
    idiom: "退避三舍", pinyin: "tuì bì sān shè",
    meaning: "比喻退让和回避，避免冲突。",
    origin: "《左传·僖公二十三年》",
    example: "面对他的咄咄逼人，我决定退避三舍。",
    synonyms: ["委曲求全"], antonyms: ["针锋相对"]
  },
  "一鸣惊人": {
    idiom: "一鸣惊人", pinyin: "yī míng jīng rén",
    meaning: "比喻平时没有突出的表现，一下子做出惊人的成绩。",
    origin: "《史记·滑稽列传》",
    example: "这位新人一鸣惊人，首次参赛就夺得冠军。",
    synonyms: ["一飞冲天", "一举成名"], antonyms: ["默默无闻"]
  },
  "老马识途": {
    idiom: "老马识途", pinyin: "lǎo mǎ shí tú",
    meaning: "比喻有经验的人对事情比较熟悉。",
    origin: "《韩非子·说林上》",
    example: "这件事还是请老张来办吧，老马识途嘛。",
    synonyms: ["识途老马", "驾轻就熟"], antonyms: ["初出茅庐"]
  },
  "毛遂自荐": {
    idiom: "毛遂自荐", pinyin: "máo suì zì jiàn",
    meaning: "比喻自告奋勇，自己推荐自己担任某项工作。",
    origin: "《史记·平原君列传》",
    example: "既然没有人报名，那我就毛遂自荐吧。",
    synonyms: ["自告奋勇"], antonyms: ["自惭形秽"]
  },
  "朝三暮四": {
    idiom: "朝三暮四", pinyin: "zhāo sān mù sì",
    meaning: "原指玩弄手法欺骗人。后用来比喻常常变卦，反复无常。",
    origin: "《庄子·齐物论》",
    example: "做事情不能朝三暮四，要有始有终。",
    synonyms: ["反复无常", "翻云覆雨"], antonyms: ["始终不渝"]
  },
  "买椟还珠": {
    idiom: "买椟还珠", pinyin: "mǎi dú huán zhū",
    meaning: "买下木匣，退还了珍珠。比喻没有眼力，取舍不当。",
    origin: "《韩非子·外储说左上》",
    example: "他只看外表不看内在，简直是买椟还珠。",
    synonyms: ["舍本逐末"], antonyms: ["去粗取精"]
  },
  "郑人买履": {
    idiom: "郑人买履", pinyin: "zhèng rén mǎi lǚ",
    meaning: "用来讥讽只信教条，不顾实际的人。",
    origin: "《韩非子·外储说左上》",
    example: "他做事总是按部就班，不知变通，真是郑人买履。",
    synonyms: ["刻舟求剑"], antonyms: ["随机应变"]
  },
  "拔苗助长": {
    idiom: "拔苗助长", pinyin: "bá miáo zhù zhǎng",
    meaning: "比喻违反事物发展的客观规律，急于求成，反而把事情弄糟。",
    origin: "《孟子·公孙丑上》",
    example: "教育孩子不能拔苗助长，要循序渐进。",
    synonyms: ["揠苗助长", "欲速不达"], antonyms: ["循序渐进"]
  },
  "滥竽充数": {
    idiom: "滥竽充数", pinyin: "làn yú chōng shù",
    meaning: "比喻无本领的冒充有本领，次货冒充好货。",
    origin: "《韩非子·内储说上》",
    example: "我对音乐一窍不通，在合唱团里只能滥竽充数。",
    synonyms: ["名不副实", "鱼目混珠"], antonyms: ["名副其实", "货真价实"]
  },
  "黔驴技穷": {
    idiom: "黔驴技穷", pinyin: "qián lǘ jì qióng",
    meaning: "比喻有限的一点本领也已经用完了。",
    origin: "唐·柳宗元《三戒·黔之驴》",
    example: "面对这道难题，他已经黔驴技穷了。",
    synonyms: ["江郎才尽", "无计可施"], antonyms: ["神通广大"]
  },
  "鹬蚌相争": {
    idiom: "鹬蚌相争", pinyin: "yù bàng xiāng zhēng",
    meaning: "比喻双方相持不下，而使第三者从中得利。",
    origin: "《战国策·燕策二》",
    example: "两家公司鹬蚌相争，最终让第三家渔翁得利。",
    synonyms: ["两败俱伤"], antonyms: ["相辅相成"]
  },
  "螳螂捕蝉": {
    idiom: "螳螂捕蝉", pinyin: "táng láng bǔ chán",
    meaning: "螳螂正要捉蝉，不知黄雀在它后面正要吃它。比喻只看到前面的利益而不顾身后的危险。",
    origin: "《庄子·山木》",
    example: "螳螂捕蝉，黄雀在后，做事要顾及后果。",
    synonyms: ["鼠目寸光"], antonyms: ["瞻前顾后"]
  },
  "惊弓之鸟": {
    idiom: "惊弓之鸟", pinyin: "jīng gōng zhī niǎo",
    meaning: "被弓箭吓怕了的鸟不容易安定。比喻经过惊吓的人碰到一点动静就非常害怕。",
    origin: "《战国策·楚策四》",
    example: "他被骗过一次后，现在成了惊弓之鸟。",
    synonyms: ["草木皆兵"], antonyms: ["处之泰然"]
  },
  "高山流水": {
    idiom: "高山流水", pinyin: "gāo shān liú shuǐ",
    meaning: "比喻知音难遇或乐曲高妙。",
    origin: "《列子·汤问》",
    example: "两人一见如故，有高山流水般的默契。",
    synonyms: ["知音难觅"], antonyms: []
  },
  "伯牙绝弦": {
    idiom: "伯牙绝弦", pinyin: "bó yá jué xián",
    meaning: "比喻知己丧亡后，弃绝某种专长爱好，表示悼念。",
    origin: "《吕氏春秋·本味》",
    example: "朋友离世后，他伯牙绝弦，再也不碰画笔。",
    synonyms: ["知音难觅"], antonyms: []
  },
  "囊萤映雪": {
    idiom: "囊萤映雪", pinyin: "náng yíng yìng xuě",
    meaning: "原是车胤用口袋装萤火虫来照书本，孙康利用雪的反光勤奋苦学的故事。后形容刻苦攻读。",
    origin: "《晋书·车胤传》",
    example: "古人囊萤映雪的精神激励着后人。",
    synonyms: ["凿壁偷光", "悬梁刺股"], antonyms: ["不学无术"]
  },
  "凿壁偷光": {
    idiom: "凿壁偷光", pinyin: "záo bì tōu guāng",
    meaning: "原指西汉匡衡凿穿墙壁引邻舍之烛光读书。后用来形容家贫而读书刻苦。",
    origin: "《西京杂记》",
    example: "他凿壁偷光的求学精神令人感动。",
    synonyms: ["囊萤映雪", "悬梁刺股"], antonyms: ["不学无术"]
  },
  "程门立雪": {
    idiom: "程门立雪", pinyin: "chéng mén lì xuě",
    meaning: "旧指学生恭敬受教。比喻尊师重教。",
    origin: "《宋史·杨时传》",
    example: "程门立雪的故事体现了古人对老师的尊敬。",
    synonyms: ["尊师重道"], antonyms: []
  },
  "孟母三迁": {
    idiom: "孟母三迁", pinyin: "mèng mǔ sān qiān",
    meaning: "孟子的母亲为了教育孟子，三次迁居。形容家长教子有方。",
    origin: "汉·赵歧《孟子题词》",
    example: "为了孩子的教育，她不惜孟母三迁。",
    synonyms: ["三迁之教"], antonyms: []
  },
  "老当益壮": {
    idiom: "老当益壮", pinyin: "lǎo dāng yì zhuàng",
    meaning: "年纪虽老而志气更旺盛，干劲更足。",
    origin: "《后汉书·马援传》",
    example: "他虽年过七旬，但老当益壮，仍活跃在科研一线。",
    synonyms: ["宝刀未老"], antonyms: ["未老先衰"]
  },
  "大器晚成": {
    idiom: "大器晚成", pinyin: "dà qì wǎn chéng",
    meaning: "指能担当重任的人物要经过长期的锻炼，所以成就较晚。也用做对长期不得志的人的安慰话。",
    origin: "《老子》四十一章",
    example: "他四十岁才开始创业，真是大器晚成。",
    synonyms: ["后来居上"], antonyms: ["初露锋芒"]
  },
  "投笔从戎": {
    idiom: "投笔从戎", pinyin: "tóu bǐ cóng róng",
    meaning: "扔掉笔去参军。指文人从军。",
    origin: "《后汉书·班超传》",
    example: "国难当头，许多学生投笔从戎。",
    synonyms: ["弃文就武"], antonyms: ["弃武从文"]
  },
  "鸡鸣狗盗": {
    idiom: "鸡鸣狗盗", pinyin: "jī míng gǒu dào",
    meaning: "比喻微不足道的本领。也指偷偷摸摸的行为。",
    origin: "《史记·孟尝君列传》",
    example: "别小看鸡鸣狗盗之徒，关键时刻也能派上用场。",
    synonyms: ["旁门左道"], antonyms: ["正人君子"]
  },
  "一字千金": {
    idiom: "一字千金", pinyin: "yī zì qiān jīn",
    meaning: "增损一字，赏予千金。称赞文辞精妙，不可更改。",
    origin: "《史记·吕不韦列传》",
    example: "这篇文章字字珠玑，堪称一字千金。",
    synonyms: ["字字珠玑"], antonyms: ["一文不值"]
  },
  "一诺千金": {
    idiom: "一诺千金", pinyin: "yī nuò qiān jīn",
    meaning: "许下的一个诺言有千金的价值。比喻说话算数，极有信用。",
    origin: "《史记·季布栾布列传》",
    example: "他是个一诺千金的人，答应的事一定做到。",
    synonyms: ["言而有信"], antonyms: ["言而无信"]
  },
  "一鼓作气": {
    idiom: "一鼓作气", pinyin: "yī gǔ zuò qì",
    meaning: "第一次击鼓时士气振奋。比喻趁劲头大的时候鼓起干劲，一口气把工作做完。",
    origin: "《左传·庄公十年》",
    example: "我们一鼓作气，把这个项目完成。",
    synonyms: ["一气呵成"], antonyms: ["一败涂地"]
  },
  "草船借箭": {
    idiom: "草船借箭", pinyin: "cǎo chuán jiè jiàn",
    meaning: "运用智谋，凭借他人的人力或财力来达到自己的目的。",
    origin: "《三国演义》第四十六回",
    example: "他巧妙地草船借箭，利用竞争对手的资源完成了目标。",
    synonyms: ["借力打力"], antonyms: []
  },
  "乐不思蜀": {
    idiom: "乐不思蜀", pinyin: "lè bù sī shǔ",
    meaning: "比喻在新环境中得到乐趣，不再想回到原来环境中去。",
    origin: "《三国志·蜀书·后主传》",
    example: "他在国外生活得乐不思蜀，完全不想回来。",
    synonyms: ["流连忘返"], antonyms: ["叶落归根"]
  },
  "鞠躬尽瘁": {
    idiom: "鞠躬尽瘁", pinyin: "jū gōng jìn cuì",
    meaning: "指恭敬谨慎，竭尽心力。",
    origin: "三国·蜀·诸葛亮《后出师表》",
    example: "他为公司鞠躬尽瘁，付出了毕生心血。",
    synonyms: ["呕心沥血"], antonyms: ["敷衍了事"]
  },
  "刮目相看": {
    idiom: "刮目相看", pinyin: "guā mù xiāng kàn",
    meaning: "指别人已有进步，不能再用老眼光去看他。",
    origin: "《三国志·吴志·吕蒙传》",
    example: "经过一年的努力，他的进步令人刮目相看。",
    synonyms: ["另眼相看"], antonyms: ["视同一律"]
  },
  "吴下阿蒙": {
    idiom: "吴下阿蒙", pinyin: "wú xià ā méng",
    meaning: "比喻人学识尚浅。",
    origin: "《三国志·吴志·吕蒙传》",
    example: "他已非吴下阿蒙，如今学识渊博。",
    synonyms: ["初出茅庐"], antonyms: ["学富五车"]
  },
  "万事俱备只欠东风": {
    idiom: "万事俱备，只欠东风", pinyin: "wàn shì jù bèi, zhǐ qiàn dōng fēng",
    meaning: "一切都准备好了，只差最后一个重要条件。",
    origin: "《三国演义》第四十九回",
    example: "项目万事俱备只欠东风，就等领导批准了。",
    synonyms: [], antonyms: []
  },
  "手不释卷": {
    idiom: "手不释卷", pinyin: "shǒu bù shì juàn",
    meaning: "书本不离手。形容勤奋好学。",
    origin: "《三国志·吴书·吕蒙传》",
    example: "他是个手不释卷的人，随时都在阅读。",
    synonyms: ["学而不厌", "爱不释手"], antonyms: ["不学无术"]
  },
  "三人成虎": {
    idiom: "三人成虎", pinyin: "sān rén chéng hǔ",
    meaning: "比喻说的人多了，就能使人们把谣言当事实。",
    origin: "《战国策·魏策二》",
    example: "谣言止于智者，不要三人成虎。",
    synonyms: ["众口铄金"], antonyms: ["眼见为实"]
  },
  "邯郸学步": {
    idiom: "邯郸学步", pinyin: "hán dān xué bù",
    meaning: "比喻模仿人不到家，反把原来自己会的东西忘了。",
    origin: "《庄子·秋水》",
    example: "学习他人的长处要取其精华，不要邯郸学步。",
    synonyms: ["东施效颦"], antonyms: ["标新立异"]
  },
  "南辕北辙": {
    idiom: "南辕北辙", pinyin: "nán yuán běi zhé",
    meaning: "想往南而车子却向北行。比喻行动和目的正好相反。",
    origin: "《战国策·魏策四》",
    example: "你这样做是南辕北辙，方向完全错了。",
    synonyms: ["背道而驰"], antonyms: ["殊途同归"]
  },
  "揠苗助长": {
    idiom: "揠苗助长", pinyin: "yà miáo zhù zhǎng",
    meaning: "比喻违反事物发展规律，急于求成，反而坏事。",
    origin: "《孟子·公孙丑上》",
    example: "教育不可揠苗助长，要尊重孩子的成长规律。",
    synonyms: ["拔苗助长"], antonyms: ["循序渐进"]
  },
  "削足适履": {
    idiom: "削足适履", pinyin: "xuē zú shì lǚ",
    meaning: "因为鞋小脚大，就把脚削去一块来凑合鞋的大小。比喻不合理地迁就凑合或不顾具体条件，生搬硬套。",
    origin: "《淮南子·说林训》",
    example: "制度应该适应实际情况，不能削足适履。",
    synonyms: ["生搬硬套"], antonyms: ["因地制宜"]
  },
  "东施效颦": {
    idiom: "东施效颦", pinyin: "dōng shī xiào pín",
    meaning: "比喻模仿别人，不但模仿不好，反而出丑。",
    origin: "《庄子·天运》",
    example: "不顾自身条件盲目模仿别人，只会东施效颦。",
    synonyms: ["邯郸学步"], antonyms: ["独辟蹊径"]
  },
  "掩目捕雀": {
    idiom: "掩目捕雀", pinyin: "yǎn mù bǔ què",
    meaning: "遮着眼睛捉麻雀。比喻自己骗自己。",
    origin: "《三国志·魏志·陈琳传》",
    example: "这种做法无异于掩目捕雀，骗不了人。",
    synonyms: ["自欺欺人", "掩耳盗铃"], antonyms: []
  },
  "返老还童": {
    idiom: "返老还童", pinyin: "fǎn lǎo huán tóng",
    meaning: "由衰老恢复青春。形容老年人充满了活力。",
    origin: "汉·史游《急就篇》",
    example: "爷爷退休后每天锻炼，看起来像返老还童一样。",
    synonyms: ["老当益壮"], antonyms: ["未老先衰"]
  },
  "天衣无缝": {
    idiom: "天衣无缝", pinyin: "tiān yī wú fèng",
    meaning: "比喻事物周密完善，找不出什么毛病。",
    origin: "五代·前蜀·牛峤《灵怪录》",
    example: "他的计划天衣无缝，滴水不漏。",
    synonyms: ["完美无缺"], antonyms: ["漏洞百出"]
  },
  "价值连城": {
    idiom: "价值连城", pinyin: "jià zhí lián chéng",
    meaning: "形容物品十分贵重。",
    origin: "《史记·廉颇蔺相如列传》",
    example: "这幅古画价值连城，是博物馆的镇馆之宝。",
    synonyms: ["无价之宝"], antonyms: ["一文不值"]
  },
  "鹏程万里": {
    idiom: "鹏程万里", pinyin: "péng chéng wàn lǐ",
    meaning: "比喻前程远大。",
    origin: "《庄子·逍遥游》",
    example: "祝你鹏程万里，前途无量！",
    synonyms: ["前程似锦"], antonyms: ["前途渺茫"]
  },
  "坚韧不拔": {
    idiom: "坚韧不拔", pinyin: "jiān rèn bù bá",
    meaning: "形容意志坚定，不可动摇。",
    origin: "宋·苏轼《晁错论》：古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。",
    example: "他以坚韧不拔的毅力，克服了一个又一个困难。",
    synonyms: ["坚定不移", "百折不挠"], antonyms: ["半途而废", "知难而退"]
  },
  "矢志不渝": {
    idiom: "矢志不渝", pinyin: "shǐ zhì bù yú",
    meaning: "表示永远不变心。",
    origin: "《晋书·谢安传》",
    example: "他矢志不渝地追求自己的理想。",
    synonyms: ["坚定不移", "始终不渝"], antonyms: ["朝三暮四"]
  },
  "始终不渝": {
    idiom: "始终不渝", pinyin: "shǐ zhōng bù yú",
    meaning: "自始自终一直不变。",
    origin: "《晋书·谢安传》",
    example: "两国人民始终不渝地保持着友好关系。",
    synonyms: ["矢志不渝"], antonyms: ["反复无常"]
  },
  "持之以恒": {
    idiom: "持之以恒", pinyin: "chí zhī yǐ héng",
    meaning: "长久坚持下去。",
    origin: "清·曾国藩《家训喻纪泽》",
    example: "学习外语贵在持之以恒。",
    synonyms: ["锲而不舍", "坚持不懈"], antonyms: ["半途而废"]
  },
  "锲而不舍": {
    idiom: "锲而不舍", pinyin: "qiè ér bù shě",
    meaning: "不停地雕刻。比喻有恒心，有毅力。",
    origin: "《荀子·劝学》：锲而舍之，朽木不折；锲而不舍，金石可镂。",
    example: "锲而不舍地努力，终于迎来了成功。",
    synonyms: ["坚持不懈"], antonyms: ["半途而废"]
  },
  "风雨同舟": {
    idiom: "风雨同舟", pinyin: "fēng yǔ tóng zhōu",
    meaning: "在狂风暴雨中同乘一条船，一起与风雨搏斗。比喻共同经历患难。",
    origin: "《孙子·九地》",
    example: "我们风雨同舟这么多年，一起走过来的。",
    synonyms: ["同舟共济", "患难与共"], antonyms: ["各奔东西"]
  },
  "春风化雨": {
    idiom: "春风化雨", pinyin: "chūn fēng huà yǔ",
    meaning: "比喻良好的薰陶和教育。",
    origin: "《孟子·尽心上》",
    example: "老师春风化雨般的教导，让学生们受益匪浅。",
    synonyms: ["润物无声"], antonyms: []
  },
  "桃李满天下": {
    idiom: "桃李满天下", pinyin: "táo lǐ mǎn tiān xià",
    meaning: "比喻学生很多，各地都有。",
    origin: "《资治通鉴·唐纪·武后久视元年》",
    example: "张教授桃李满天下，学生遍布各行各业。",
    synonyms: [], antonyms: []
  },
  "众志成城": {
    idiom: "众志成城", pinyin: "zhòng zhì chéng chéng",
    meaning: "万众一心，像坚固的城墙一样不可摧毁。比喻团结一致，力量无比强大。",
    origin: "《国语·周语下》",
    example: "面对灾难，全国人民众志成城，共渡难关。",
    synonyms: ["万众一心", "齐心协力"], antonyms: ["一盘散沙"]
  },
  "势如破竹": {
    idiom: "势如破竹", pinyin: "shì rú pò zhú",
    meaning: "形势就像劈竹子，头上几节破开以后，下面各节顺着刀势就分开了。比喻节节胜利，毫无阻碍。",
    origin: "《晋书·杜预传》",
    example: "我军势如破竹，一路高歌猛进。",
    synonyms: ["摧枯拉朽", "锐不可当"], antonyms: ["节节败退"]
  },
  "明察秋毫": {
    idiom: "明察秋毫", pinyin: "míng chá qiū háo",
    meaning: "形容目光敏锐，连极小的事物都看得很清楚。",
    origin: "《孟子·梁惠王上》",
    example: "他明察秋毫，任何蛛丝马迹都逃不过他的眼睛。",
    synonyms: ["洞若观火", "火眼金睛"], antonyms: ["视而不见"]
  },
  "实事求是": {
    idiom: "实事求是", pinyin: "shí shì qiú shì",
    meaning: "指从实际对象出发，探求事物的内部联系及其发展的规律性，认识事物的本质。",
    origin: "《汉书·河间献王刘德传》",
    example: "做学问要实事求是，不能弄虚作假。",
    synonyms: ["脚踏实地"], antonyms: ["弄虚作假"]
  },
  "虚怀若谷": {
    idiom: "虚怀若谷", pinyin: "xū huái ruò gǔ",
    meaning: "胸怀像山谷一样深广。形容十分谦虚，能容纳别人的意见。",
    origin: "《老子》：敦兮其若朴，旷兮其若谷。",
    example: "他虽然已是大师，但仍虚怀若谷。",
    synonyms: ["谦虚谨慎"], antonyms: ["自高自大"]
  },
  "光明磊落": {
    idiom: "光明磊落", pinyin: "guāng míng lěi luò",
    meaning: "胸怀坦白，正大光明。",
    origin: "宋·朱熹《朱子语类》",
    example: "他为人光明磊落，从不做亏心事。",
    synonyms: ["坦坦荡荡"], antonyms: ["鬼鬼祟祟"]
  },
  "一言九鼎": {
    idiom: "一言九鼎", pinyin: "yī yán jiǔ dǐng",
    meaning: "一句话抵得上九鼎重。比喻说话力量大，能起很大作用。",
    origin: "《史记·平原君列传》",
    example: "他在业界一言九鼎，说的话很有分量。",
    synonyms: ["一字千钧"], antonyms: ["人微言轻"]
  },
  "气吞山河": {
    idiom: "气吞山河", pinyin: "qì tūn shān hé",
    meaning: "气势可以吞没山河。形容气魄很大。",
    origin: "元·金仁杰《追韩信》",
    example: "那首诗气吞山河，读来令人热血沸腾。",
    synonyms: ["气壮山河"], antonyms: ["气息奄奄"]
  },
  "万紫千红": {
    idiom: "万紫千红", pinyin: "wàn zǐ qiān hóng",
    meaning: "形容百花齐放，色彩艳丽。也比喻事物丰富多彩。",
    origin: "宋·朱熹《春日》：等闲识得东风面，万紫千红总是春。",
    example: "春天来了，花园里万紫千红，美不胜收。",
    synonyms: ["百花齐放", "姹紫嫣红"], antonyms: ["枯枝败叶"]
  },
  "世外桃源": {
    idiom: "世外桃源", pinyin: "shì wài táo yuán",
    meaning: "原指与现实社会隔绝、生活安乐的理想境界。后也指环境幽静生活安逸的地方。",
    origin: "晋·陶渊明《桃花源记》",
    example: "这个小村庄宛如世外桃源，远离城市喧嚣。",
    synonyms: ["人间仙境"], antonyms: ["人间地狱"]
  },
  "深入浅出": {
    idiom: "深入浅出", pinyin: "shēn rù qiǎn chū",
    meaning: "指讲话或文章的内容深刻，语言文字却浅显易懂。",
    origin: "清·俞樾《湖楼笔谈》",
    example: "他讲课深入浅出，连初学者都能听懂。",
    synonyms: ["通俗易懂"], antonyms: ["深奥难懂"]
  },
  "胆小如鼠": {
    idiom: "胆小如鼠", pinyin: "dǎn xiǎo rú shǔ",
    meaning: "胆子小得像老鼠。形容非常胆小。",
    origin: "《魏书·汝阴王天赐传》",
    example: "他胆小如鼠，连一个人走夜路都不敢。",
    synonyms: ["畏首畏尾"], antonyms: ["胆大包天"]
  },
  "如鱼得水": {
    idiom: "如鱼得水", pinyin: "rú yú dé shuǐ",
    meaning: "好像鱼得到水一样。比喻有所凭借，也比喻得到跟自己十分投合的人或对自己很合适的环境。",
    origin: "《三国志·蜀志·诸葛亮传》",
    example: "他到了新公司如鱼得水，很快就适应了。",
    synonyms: ["得心应手"], antonyms: ["寸步难行"]
  },
  "龙飞凤舞": {
    idiom: "龙飞凤舞", pinyin: "lóng fēi fèng wǔ",
    meaning: "形容山势蜿蜒雄壮，也形容书法笔势有力，灵活舒展。",
    origin: "宋·苏轼《表忠观碑》",
    example: "他的书法龙飞凤舞，极具气势。",
    synonyms: ["笔走龙蛇"], antonyms: []
  },
  "虎头蛇尾": {
    idiom: "虎头蛇尾", pinyin: "hǔ tóu shé wěi",
    meaning: "头大如虎，尾细如蛇。比喻开始时声势很大，到后来劲头很小，有始无终。",
    origin: "元·康进之《李逵负荆》",
    example: "做事不能虎头蛇尾，要善始善终。",
    synonyms: ["有始无终"], antonyms: ["善始善终"]
  },
  "马到成功": {
    idiom: "马到成功", pinyin: "mǎ dào chéng gōng",
    meaning: "形容工作刚开始就取得成功。",
    origin: "元·郑廷为《楚昭公》",
    example: "祝你马到成功，旗开得胜！",
    synonyms: ["旗开得胜"], antonyms: ["出师不利"]
  },
  "沉鱼落雁": {
    idiom: "沉鱼落雁", pinyin: "chén yú luò yàn",
    meaning: "鱼见之沉入水底，雁见之降落沙洲。形容女子容貌美丽。",
    origin: "《庄子·齐物论》",
    example: "她有沉鱼落雁之容，闭月羞花之貌。",
    synonyms: ["闭月羞花", "国色天香"], antonyms: ["其貌不扬"]
  },
  "闭月羞花": {
    idiom: "闭月羞花", pinyin: "bì yuè xiū huā",
    meaning: "闭：藏。使月亮躲藏，使花儿羞惭。形容女子容貌美丽。",
    origin: "元·王子一《误入桃源》",
    example: "她闭月羞花，是远近闻名的美人。",
    synonyms: ["沉鱼落雁"], antonyms: ["其貌不扬"]
  },
  "国色天香": {
    idiom: "国色天香", pinyin: "guó sè tiān xiāng",
    meaning: "原形容颜色和香气不同于一般花卉的牡丹花。后也形容女子的美丽。",
    origin: "唐·李浚《摭异记》",
    example: "这位女子国色天香，令人倾倒。",
    synonyms: ["沉鱼落雁", "闭月羞花"], antonyms: []
  },
  "才高八斗": {
    idiom: "才高八斗", pinyin: "cái gāo bā dǒu",
    meaning: "比喻人极有才华。",
    origin: "南朝·宋·无名氏《释常谈·斗之才》",
    example: "他才高八斗，诗词文章样样精通。",
    synonyms: ["学富五车"], antonyms: ["才疏学浅"]
  },
  "学富五车": {
    idiom: "学富五车", pinyin: "xué fù wǔ chē",
    meaning: "形容读书多，学识丰富。",
    origin: "《庄子·天下》",
    example: "这位教授学富五车，是学术界的权威。",
    synonyms: ["博学多才", "才高八斗"], antonyms: ["目不识丁"]
  },
  "锦上添花": {
    idiom: "锦上添花", pinyin: "jǐn shàng tiān huā",
    meaning: "比喻好上加好，美上添美。",
    origin: "宋·黄庭坚《了了庵颂》",
    example: "获得这个奖项，对他来说是锦上添花。",
    synonyms: ["好上加好"], antonyms: ["雪上加霜"]
  },
  "雪中送炭": {
    idiom: "雪中送炭", pinyin: "xuě zhōng sòng tàn",
    meaning: "在下雪天给人送炭取暖。比喻在别人急需时给以物质上或精神上的帮助。",
    origin: "宋·范成大《大雪送炭与芥隐》",
    example: "朋友在我最困难的时候雪中送炭，让我十分感动。",
    synonyms: ["雪里送炭"], antonyms: ["落井下石"]
  },
  "上善若水": {
    idiom: "上善若水", pinyin: "shàng shàn ruò shuǐ",
    meaning: "最高的善就像水一样。水善于帮助万物而不与万物相争。",
    origin: "《老子》第八章",
    example: "做人当如上善若水，利万物而不争。",
    synonyms: ["厚德载物"], antonyms: []
  },
  "道法自然": {
    idiom: "道法自然", pinyin: "dào fǎ zì rán",
    meaning: "道以自然为法则。指要顺应自然规律行事。",
    origin: "《老子》第二十五章",
    example: "中国传统文化讲究道法自然，天人合一。",
    synonyms: ["顺其自然"], antonyms: ["逆天行事"]
  },
  "大智若愚": {
    idiom: "大智若愚", pinyin: "dà zhì ruò yú",
    meaning: "某些才智出众的人，看来好像愚笨，不露锋芒。",
    origin: "宋·苏轼《贺欧阳少师致仕启》",
    example: "他大智若愚，从不张扬自己的才能。",
    synonyms: ["大巧若拙"], antonyms: ["锋芒毕露"]
  },
  "居安思危": {
    idiom: "居安思危", pinyin: "jū ān sī wēi",
    meaning: "处在安乐的环境中，要想到可能有的危险。指要提高警惕，防止祸患。",
    origin: "《左传·襄公十一年》",
    example: "企业发展顺利时也要居安思危，未雨绸缪。",
    synonyms: ["未雨绸缪", "防患未然"], antonyms: ["高枕无忧"]
  },
  "未雨绸缪": {
    idiom: "未雨绸缪", pinyin: "wèi yǔ chóu móu",
    meaning: "天还没有下雨，先把门窗绑牢。比喻事先做好准备工作。",
    origin: "《诗经·豳风·鸱鸮》",
    example: "做事情要未雨绸缪，提前做好准备。",
    synonyms: ["居安思危", "有备无患"], antonyms: ["临渴掘井"]
  },
  "举一反三": {
    idiom: "举一反三", pinyin: "jǔ yī fǎn sān",
    meaning: "比喻从一件事情类推而知道其他许多事情。",
    origin: "《论语·述而》：举一隅不以三隅反，则不复也。",
    example: "好学生应该学会举一反三，灵活运用所学知识。",
    synonyms: ["触类旁通", "闻一知十"], antonyms: ["囫囵吞枣"]
  },
  "温故知新": {
    idiom: "温故知新", pinyin: "wēn gù zhī xīn",
    meaning: "温习旧的知识，得到新的理解和体会。",
    origin: "《论语·为政》：温故而知新，可以为师矣。",
    example: "经常温故知新，才能把知识融会贯通。",
    synonyms: ["数往知来"], antonyms: []
  },
  "厚积薄发": {
    idiom: "厚积薄发", pinyin: "hòu jī bó fā",
    meaning: "多多积蓄，慢慢放出。形容只有准备充分才能办好事情。",
    origin: "宋·苏轼《稼说送张琥》",
    example: "他厚积薄发，多年的积累终于在这部作品中爆发。",
    synonyms: ["蓄势待发"], antonyms: ["急于求成"]
  },
  "登峰造极": {
    idiom: "登峰造极", pinyin: "dēng fēng zào jí",
    meaning: "登上顶峰，到达最高点。比喻学问、技能等达到最高的境界或成就。",
    origin: "南朝·宋·刘义庆《世说新语·文学》",
    example: "他的书法艺术已经登峰造极。",
    synonyms: ["炉火纯青", "出神入化"], antonyms: ["初出茅庐"]
  },
  "独树一帜": {
    idiom: "独树一帜", pinyin: "dú shù yī zhì",
    meaning: "单独树起一面旗帜。比喻独特新奇，自成一家。",
    origin: "清·袁枚《随园诗话》",
    example: "他的画风独树一帜，自成一派。",
    synonyms: ["别具一格", "标新立异"], antonyms: ["如出一辙"]
  },
  "百折不挠": {
    idiom: "百折不挠", pinyin: "bǎi zhé bù náo",
    meaning: "无论受到多少打击都不退缩或屈服。形容意志坚强。",
    origin: "汉·蔡邕《太尉乔玄碑》",
    example: "他百折不挠的精神感染了身边的每一个人。",
    synonyms: ["坚韧不拔", "不屈不挠"], antonyms: ["知难而退"]
  },
  "滴水穿石": {
    idiom: "滴水穿石", pinyin: "dī shuǐ chuān shí",
    meaning: "水不断下滴，可以闹穿石头。比喻只要有恒心，不断努力，事情一定成功。",
    origin: "宋·罗大经《鹤林玉露》",
    example: "滴水穿石非一日之功，坚持就是胜利。",
    synonyms: ["水滴石穿"], antonyms: ["半途而废"]
  },
  "日积月累": {
    idiom: "日积月累", pinyin: "rì jī yuè lěi",
    meaning: "一天一天地、一月一月地不断积累。指长时间不断地积累。",
    origin: "明·冯梦龙《醒世恒言》",
    example: "知识的积累需要日积月累，不能急于求成。",
    synonyms: ["积少成多", "聚沙成塔"], antonyms: ["一曝十寒"]
  },
  "不耻下问": {
    idiom: "不耻下问", pinyin: "bù chǐ xià wèn",
    meaning: "不以向地位比自己低、学识比自己差的人请教为耻。形容虚心好学。",
    origin: "《论语·公冶长》",
    example: "做学问要不耻下问，三人行必有我师。",
    synonyms: ["虚心求教"], antonyms: ["自以为是"]
  },
  "海纳百川": {
    idiom: "海纳百川", pinyin: "hǎi nà bǎi chuān",
    meaning: "大海可以容纳千百条河流。比喻包容的东西非常广泛，而且数量很大。",
    origin: "晋·袁宏《三国名臣序赞》",
    example: "海纳百川，有容乃大。我们要以开放的心态接纳不同的意见。",
    synonyms: ["有容乃大"], antonyms: ["心胸狭隘"]
  },
  "两袖清风": {
    idiom: "两袖清风", pinyin: "liǎng xiù qīng fēng",
    meaning: "衣袖中除清风外，别无所有。比喻做官廉洁。",
    origin: "元·陈基《次韵吴江道中》",
    example: "他一生两袖清风，从未贪过一分钱。",
    synonyms: ["一尘不染", "廉洁奉公"], antonyms: ["贪赃枉法"]
  },
  "开门见山": {
    idiom: "开门见山", pinyin: "kāi mén jiàn shān",
    meaning: "打开门就能看见山。比喻说话或写文章直截了当谈本题，不拐弯抹角。",
    origin: "唐·刘得仁《青龙寺僧院》",
    example: "我就开门见山地说吧，我们需要你的帮助。",
    synonyms: ["直截了当", "单刀直入"], antonyms: ["拐弯抹角"]
  },
  "朝气蓬勃": {
    idiom: "朝气蓬勃", pinyin: "zhāo qì péng bó",
    meaning: "形容充满了生命和活力的样子。",
    origin: "邓小平《在中国新民主主义青年团第三次全国代表大会上的祝词》",
    example: "这群年轻人朝气蓬勃，充满了创造力。",
    synonyms: ["生机勃勃"], antonyms: ["暮气沉沉"]
  },
  "山清水秀": {
    idiom: "山清水秀", pinyin: "shān qīng shuǐ xiù",
    meaning: "形容风景优美。",
    origin: "宋·黄庭坚《蓦山溪·赠衡阳陈湘》",
    example: "这里山清水秀，是个度假的好去处。",
    synonyms: ["湖光山色", "风景如画"], antonyms: ["穷山恶水"]
  },
  "坐井观天": {
    idiom: "坐井观天", pinyin: "zuò jǐng guān tiān",
    meaning: "坐在井底看天。比喻眼界小，见识少。",
    origin: "唐·韩愈《原道》",
    example: "不出去看看外面的世界，就是坐井观天。",
    synonyms: ["井底之蛙", "管中窥豹"], antonyms: ["高瞻远瞩"]
  },
  "盲人摸象": {
    idiom: "盲人摸象", pinyin: "máng rén mō xiàng",
    meaning: "比喻对事物只凭片面的了解或局部的经验，就乱加猜测，想做出全面的判断。",
    origin: "《大般涅槃经》",
    example: "只看一个方面就下结论，无异于盲人摸象。",
    synonyms: ["以偏概全", "管中窥豹"], antonyms: ["洞若观火"]
  },
  "一目了然": {
    idiom: "一目了然", pinyin: "yī mù liǎo rán",
    meaning: "一眼就看得很清楚。",
    origin: "明·张岱《皇华考序》",
    example: "这张图表做得很好，数据一目了然。",
    synonyms: ["了如指掌"], antonyms: ["雾里看花"]
  }
};
