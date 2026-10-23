/* 知闯岛 · 内置题库：五年级语文 */
(function (ZCD) {
  'use strict';

  ZCD.registerPack({
    pack: {
      id: 'chinese-g5',
      name: '文心闯关岛',
      grade: 5,
      subject: 'chinese',
      intro: '字音字形、词语成语、修辞说明方法、古诗文与课文常识，在语言运用中体会表达的妙处。',
      difficulty: 2,
      levelNames: ['关卡1 · 字音字词林', '关卡2 · 词语成语谷', '关卡3 · 句子修辞桥', '关卡4 · 古诗文驿站', '关卡5 · 课文人物馆']
    },
    questions: [
      {
        id: 'g5-chinese-l1-01',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 1,
        point: '多音字读音',
        type: 'single',
        stem: '“默而识之”中的“识”应读作（　）。',
        options: [
          { key: 'A', text: 'zhì' },
          { key: 'B', text: 'shí' },
          { key: 'C', text: 'zhī' },
          { key: 'D', text: 'shì' }
        ],
        answer: 'A',
        hint: '这个字是多音字，先弄清它在句子里是「记住」的意思，再确定读音。',
        analysis: '“识”在这里同“志”，意思是记住，读zhì；读shí时表示认识、知识。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l1-02',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 1,
        point: '字形辨析',
        type: 'single',
        stem: '下面词语书写完全正确的一项是（　）。',
        options: [
          { key: 'A', text: '完壁归赵' },
          { key: 'B', text: '顾名思意' },
          { key: 'C', text: '完璧归赵' },
          { key: 'D', text: '美不盛收' }
        ],
        answer: 'C',
        hint: '逐个词想想它的来历和意思，再检查哪个字写错了部件。',
        analysis: '“完璧归赵”的“璧”是古代玉器，不能写成“壁”；“顾名思义”“美不胜收”也各写错了一个字。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l1-03',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 1,
        point: '易错字读音',
        type: 'single',
        stem: '“胆怯”中“怯”的读音是（　）。',
        options: [
          { key: 'A', text: 'què' },
          { key: 'B', text: 'qiè' },
          { key: 'C', text: 'qù' },
          { key: 'D', text: 'jié' }
        ],
        answer: 'B',
        hint: '容易读错的字要按字典读音来，先分清它的声母，别和形近字混在一起。',
        analysis: '“怯”读qiè，声母是q，不要读成què；“胆怯”就是胆小、害怕的意思。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l1-04',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 1,
        point: '多音字读音',
        type: 'judge',
        stem: '“便宜”中的“便”和“方便”中的“便”读音相同。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '同一个字在不同词语里读音可能不一样，先分别想想两个词的意思。',
        analysis: '“便宜”的“便”读pián，“方便”的“便”读biàn，两个读音不同，所以说法错误。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l1-05',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 1,
        point: '易错字读音',
        type: 'judge',
        stem: '“侮辱”中的“侮”读wǔ，不要读成wū。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '遇到读音题先想想字义，再回忆课文里是怎么读的，不要凭字形猜。',
        analysis: '“侮”读wǔ，“侮辱”指使人蒙受耻辱，它的读音和写法都要特别注意。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l2-01',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 2,
        point: '成语感情色彩',
        type: 'single',
        stem: '下面成语中，感情色彩与其他三项不同的一项是（　）。',
        options: [
          { key: 'A', text: '足智多谋' },
          { key: 'B', text: '同心协力' },
          { key: 'C', text: '阴谋诡计' },
          { key: 'D', text: '舍己为人' }
        ],
        answer: 'C',
        hint: '先判断每个成语是夸人还是批评人，再找出跟其他几个不一样的那个。',
        analysis: '“阴谋诡计”指暗中害人的坏主意，是贬义词；其余三项都是褒义词。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l2-02',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 2,
        point: '关联词运用',
        type: 'single',
        stem: '“（　）天气很冷，同学们（　）坚持晨跑。”填入关联词最恰当的一项是（　）。',
        options: [
          { key: 'A', text: '不但……而且……' },
          { key: 'B', text: '虽然……但是……' },
          { key: 'C', text: '因为……所以……' },
          { key: 'D', text: '只要……就……' }
        ],
        answer: 'B',
        hint: '先体会前后两个分句的意思是不是相反，再挑合适的关联词填进去。',
        analysis: '天气冷与坚持晨跑之间是转折关系，要用“虽然……但是……”；换成因果关联词就不合逻辑了。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l2-03',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 2,
        point: '词语搭配',
        type: 'single',
        stem: '“（　）的掌声”中，括号里填写最恰当的一项是（　）。',
        options: [
          { key: 'A', text: '激烈' },
          { key: 'B', text: '猛烈' },
          { key: 'C', text: '热烈' },
          { key: 'D', text: '剧烈' }
        ],
        answer: 'C',
        hint: '想一想掌声听起来是什么样的，哪个词专门用来形容它。',
        analysis: '“掌声”常与“热烈”搭配，说成“热烈的掌声”；激烈、猛烈、剧烈都不能用来形容掌声。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l2-04',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 2,
        point: '成语运用',
        type: 'judge',
        stem: '“他做事三心二意，所以经常出错。”句中“三心二意”使用正确。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先弄清这个成语的意思，再看它和句子里人物的做法配不配。',
        analysis: '“三心二意”指做事不专心，与句子中“做事不专心导致出错”的意思相符，使用正确。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l2-05',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 2,
        point: '成语感情色彩',
        type: 'judge',
        stem: '“老师处心积虑地帮助我们。”句中“处心积虑”使用恰当。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '成语有褒有贬，先分清它是夸人还是贬人，再放回句子里体会。',
        analysis: '“处心积虑”是贬义词，指长期谋划坏主意，用来赞美老师不恰当，应改为“呕心沥血”。',
        difficulty: 1
      },
      {
        id: 'g5-chinese-l3-01',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 3,
        point: '说明方法',
        type: 'single',
        stem: '“地球的表面积约5.1亿平方千米。”这句话运用的说明方法是（　）。',
        options: [
          { key: 'A', text: '打比方' },
          { key: 'B', text: '举例子' },
          { key: 'C', text: '列数字' },
          { key: 'D', text: '作比较' }
        ],
        answer: 'C',
        hint: '看看句中是列出具体数据，还是拿别的事物来比，说明方法就藏在表达里。',
        analysis: '句中用“5.1亿”这样具体的数字来说明地球表面积的大小，运用的是列数字的说明方法。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l3-02',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 3,
        point: '修辞手法',
        type: 'single',
        stem: '“白鹭是一首精巧的诗。”这句话运用的修辞手法是（　）。',
        options: [
          { key: 'A', text: '拟人' },
          { key: 'B', text: '排比' },
          { key: 'C', text: '夸张' },
          { key: 'D', text: '比喻' }
        ],
        answer: 'D',
        hint: '看看句子里把什么当成了什么，有没有把一样事物比作另一样。',
        analysis: '这句话把白鹭比作“一首精巧的诗”，用比喻写出了白鹭的优美，所以是比喻句。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l3-03',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 3,
        point: '病句修改',
        type: 'single',
        stem: '下面句子没有语病的一项是（　）。',
        options: [
          { key: 'A', text: '我们要养成讲卫生的好习惯。' },
          { key: 'B', text: '通过这次活动，使我明白了团结的重要。' },
          { key: 'C', text: '他大约十岁左右。' },
          { key: 'D', text: '昨天下午下了一场大雨，天气很热闹。' }
        ],
        answer: 'A',
        hint: '逐句检查成分是否齐全、意思是否重复、词语搭配是否合适。',
        analysis: 'B句“通过……使……”缺少主语，C句“大约”和“左右”语意重复，D句“天气热闹”搭配不当。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l3-04',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 3,
        point: '标点符号',
        type: 'judge',
        stem: '“我喜欢读《西游记》这本书。”句中的书名号使用正确。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想想书名号是用来标明什么的，再看句中被标出的部分属于哪一类。',
        analysis: '书名号用来标明书名、篇名、报刊名等，“《西游记》”是书名，使用正确。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l3-05',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 3,
        point: '说明方法',
        type: 'judge',
        stem: '“这座桥长50米，比旁边那栋楼还要长。”这句话只用了列数字的说明方法。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '把句子里的表达逐一找出来，看看除了数据，有没有把两样事物放在一起比。',
        analysis: '句中的“50米”是列数字，“比旁边那栋楼还要长”是作比较，所以这句话的说法是错误的。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l4-01',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 4,
        point: '古诗作者',
        type: 'single',
        stem: '“死去元知万事空，但悲不见九州同。”这两句诗出自（　）。',
        options: [
          { key: 'A', text: '林升《题临安邸》' },
          { key: 'B', text: '龚自珍《己亥杂诗》' },
          { key: 'C', text: '王维《山居秋暝》' },
          { key: 'D', text: '陆游《示儿》' }
        ],
        answer: 'D',
        hint: '先体会这两句诗写的是什么心情，再回忆课文里它的题目和作者。',
        analysis: '这两句出自南宋诗人陆游的《示儿》，诗中表达了诗人盼望祖国统一的心愿。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l4-02',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 4,
        point: '古诗名句',
        type: 'single',
        stem: '“山外青山楼外楼，______？”横线上应填（　）。',
        options: [
          { key: 'A', text: '但悲不见九州同' },
          { key: 'B', text: '直把杭州作汴州' },
          { key: 'C', text: '万马齐喑究可哀' },
          { key: 'D', text: '西湖歌舞几时休' }
        ],
        answer: 'D',
        hint: '想想这两句诗出自哪一课，把整首诗从头到尾再背一遍。',
        analysis: '这两句出自林升的《题临安邸》，原句是“山外青山楼外楼，西湖歌舞几时休？”',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l4-03',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 4,
        point: '文言词义',
        type: 'single',
        stem: '“敏而好学，不耻下问”中“耻”的意思是（　）。',
        options: [
          { key: 'A', text: '耻辱' },
          { key: 'B', text: '以……为耻' },
          { key: 'C', text: '可耻' },
          { key: 'D', text: '羞愧' }
        ],
        answer: 'B',
        hint: '文言词的意思要放回整句话里体会，先想清楚这句话讲的是什么态度。',
        analysis: '“不耻下问”指不把向学问不如自己的人请教当作耻辱，“耻”是以……为耻的意思。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l4-04',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 4,
        point: '文言字音',
        type: 'judge',
        stem: '“知之为知之，不知为不知，是知也”中最后一个“知”读zhì，同“智”，意思是智慧。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '同一个字在文中出现了好几次，要分别想它们的意思，注意最后一个是否通假。',
        analysis: '《古人谈读书》中这个“知”同“智”，读zhì，指智慧；前面几个“知”都读zhī，意思是知道。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l4-05',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 4,
        point: '词作常识',
        type: 'judge',
        stem: '《长相思》是唐代诗人李白写的一首词。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先想这首词是谁写的、属于哪个朝代，再核对题目里的说法。',
        analysis: '《长相思》是清代词人纳兰性德的作品，写的是行军途中的思乡之情，不是李白的诗。',
        difficulty: 2
      },
      {
        id: 'g5-chinese-l5-01',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 5,
        point: '课文作者',
        type: 'single',
        stem: '《白鹭》一文的作者是（　）。',
        options: [
          { key: 'A', text: '郭沫若' },
          { key: 'B', text: '许地山' },
          { key: 'C', text: '琦君' },
          { key: 'D', text: '老舍' }
        ],
        answer: 'A',
        hint: '按课文顺序回忆这一单元几篇课文的作者，别把相近的篇目弄混。',
        analysis: '《白鹭》的作者是郭沫若；《落花生》的作者是许地山，《桂花雨》的作者是琦君。',
        difficulty: 3
      },
      {
        id: 'g5-chinese-l5-02',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 5,
        point: '课文主旨',
        type: 'single',
        stem: '《落花生》一文告诉我们，做人要做（　）的人。',
        options: [
          { key: 'A', text: '外表体面' },
          { key: 'B', text: '争强好胜' },
          { key: 'C', text: '对别人有用' },
          { key: 'D', text: '沉默寡言' }
        ],
        answer: 'C',
        hint: '回想父亲借花生讲道理的那一段，抓住他真正想让孩子明白的东西。',
        analysis: '文章借花生说明道理：人要像花生一样朴实无华，做对别人有用的人，而不是只讲体面。',
        difficulty: 3
      },
      {
        id: 'g5-chinese-l5-03',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 5,
        point: '课文常识',
        type: 'single',
        stem: '《将相和》中的“将”和“相”分别指（　）。',
        options: [
          { key: 'A', text: '蔺相如、廉颇' },
          { key: 'B', text: '廉颇、赵王' },
          { key: 'C', text: '秦王、蔺相如' },
          { key: 'D', text: '廉颇、蔺相如' }
        ],
        answer: 'D',
        hint: '先分清谁带兵打仗、谁出使别国，再按题目里的顺序对应。',
        analysis: '“将”指大将军廉颇，“相”指宰相蔺相如，《将相和》讲的是两人由不和到和好的故事。',
        difficulty: 3
      },
      {
        id: 'g5-chinese-l5-04',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 5,
        point: '文学常识',
        type: 'single',
        stem: '下面作品中，不属于我国四大民间故事的一项是（　）。',
        options: [
          { key: 'A', text: '《牛郎织女》' },
          { key: 'B', text: '《孟姜女》' },
          { key: 'C', text: '《梁山伯与祝英台》' },
          { key: 'D', text: '《西游记》' }
        ],
        answer: 'D',
        hint: '先回忆四大民间故事分别是哪几个，再把选项一个个对上去。',
        analysis: '四大民间故事是《牛郎织女》《孟姜女》《梁山伯与祝英台》《白蛇传》，《西游记》是神话小说。',
        difficulty: 3
      },
      {
        id: 'g5-chinese-l5-05',
        grade: 5,
        subject: 'chinese',
        packId: 'chinese-g5',
        level: 5,
        point: '课文常识',
        type: 'judge',
        stem: '《少年中国说》的作者是龚自珍。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先回忆这两篇文章各自的作者是谁，别把作者和作品对错了位置。',
        analysis: '《少年中国说》的作者是清代梁启超，龚自珍写的是《己亥杂诗》，两者不能混淆。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);