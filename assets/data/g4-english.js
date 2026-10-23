/* 知闯岛 · 内置题库：四年级英语 */
(function (ZCD) {
  'use strict';
  ZCD.registerPack({
    pack: {
      id: 'english-g4',
      name: '英语探索号',
      grade: 4,
      subject: 'english',
      intro: '教室、家庭、时间和天气的表达，学会用完整句子介绍自己的生活。',
      difficulty: 2,
      levelNames: ['关卡1 · 教室码头', '关卡2 · 家庭花园', '关卡3 · 时间钟楼', '关卡4 · 天气站台', '关卡5 · 句子工坊']
    },
    questions: [
      /* ---------- 关卡 1 · 教室码头 ---------- */
      {
        id: 'g4-english-l1-01',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 1,
        point: '教室物品词汇',
        type: 'single',
        stem: '“黑板”用英语怎么说？',
        options: [
          { key: 'A', text: 'light' },
          { key: 'B', text: 'door' },
          { key: 'C', text: 'picture' },
          { key: 'D', text: 'blackboard' }
        ],
        answer: 'D',
        hint: '想一想这个词由哪两个简单单词拼在一起，一个表示颜色，一个表示板子。',
        analysis: 'blackboard 由 black（黑的）和 board（板）组成，意思是“黑板”；light 是电灯，door 是门，picture 是图画。',
        difficulty: 1
      },
      {
        id: 'g4-english-l1-02',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 1,
        point: '指示代词用法',
        type: 'single',
        stem: '“这是我的教室。”用英语怎么说？',
        options: [
          { key: 'A', text: 'These are my classroom.' },
          { key: 'B', text: 'This is my classroom.' },
          { key: 'C', text: 'This are my classroom.' },
          { key: 'D', text: 'These is my classroom.' }
        ],
        answer: 'B',
        hint: '先看主语是单数还是复数，再决定 be 动词用哪一个，让前后配成一对。',
        analysis: 'this 指离说话人较近的单数事物，后面用 is；these 是复数，后面要用 are。classroom 是单数，所以用 This is my classroom.',
        difficulty: 1
      },
      {
        id: 'g4-english-l1-03',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 1,
        point: '名词单复数',
        type: 'judge',
        stem: '"This are my new books." 这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先看名词是单数还是复数，再检查前面的指示词和 be 动词配不配得上。',
        analysis: 'books 是复数名词，前面要用 These are...；this 只能指单数事物，后面接 is，所以这句话是错误的。',
        difficulty: 1
      },
      {
        id: 'g4-english-l1-04',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 1,
        point: '存在句型用法',
        type: 'single',
        stem: 'There ___ five pencils in my pencil box. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'is' },
          { key: 'B', text: 'am' },
          { key: 'C', text: 'are' },
          { key: 'D', text: 'be' }
        ],
        answer: 'C',
        hint: '存在句型里 be 动词跟着后面的名词走，先看这个名词是单数还是复数。',
        analysis: 'there be 句型中 be 动词要和后面的名词保持一致，five pencils 是复数，所以用 are；单数名词才用 is。',
        difficulty: 1
      },
      {
        id: 'g4-english-l1-05',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 1,
        point: '可数名词复数',
        type: 'single',
        stem: 'How many ___ are there in your classroom?（教室里有多少扇窗户？）',
        options: [
          { key: 'A', text: 'windows' },
          { key: 'B', text: 'window' },
          { key: 'C', text: 'windowes' },
          { key: 'D', text: 'a window' }
        ],
        answer: 'A',
        hint: '提问数量的短语后面要接可数名词的复数，注意这个词该加 -s 还是 -es。',
        analysis: 'How many 后面要接可数名词的复数形式，window 的复数直接加 -s 变成 windows，不能加 -es。',
        difficulty: 1
      },

      /* ---------- 关卡 2 · 家庭花园 ---------- */
      {
        id: 'g4-english-l2-01',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 2,
        point: '房间与家具',
        type: 'single',
        stem: '“厨房”用英语怎么说？',
        options: [
          { key: 'A', text: 'bedroom' },
          { key: 'B', text: 'living room' },
          { key: 'C', text: 'kitchen' },
          { key: 'D', text: 'bathroom' }
        ],
        answer: 'C',
        hint: '回忆家里各个房间的名称，找出专门用来做饭的那一个词。',
        analysis: 'kitchen 是厨房；bedroom 是卧室，living room 是客厅，bathroom 是浴室，它们都是家里房间的名称。',
        difficulty: 1
      },
      {
        id: 'g4-english-l2-02',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 2,
        point: 'have 与 has',
        type: 'judge',
        stem: '"My home has three bedrooms and a big living room." 这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先看主语是不是第三人称单数，再检查表示有的动词形式用得是否恰当。',
        analysis: '主语 My home 是第三人称单数，表示“有”要用 has；bedroom 是卧室，living room 是客厅，句子表达正确。',
        difficulty: 1
      },
      {
        id: 'g4-english-l2-03',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 2,
        point: '方位介词',
        type: 'single',
        stem: '“我的书包在椅子下面。”用英语怎么说？',
        options: [
          { key: 'A', text: 'My schoolbag is on the chair.' },
          { key: 'B', text: 'My schoolbag is in the chair.' },
          { key: 'C', text: 'My schoolbag is near the chair.' },
          { key: 'D', text: 'My schoolbag is under the chair.' }
        ],
        answer: 'D',
        hint: '先想清楚书包和椅子的位置关系，再挑表示在下面意思的那个介词。',
        analysis: 'under 表示“在……下面”，on 是在……上面，in 是在……里面，near 是在……附近，所以“在椅子下面”要用 under the chair。',
        difficulty: 1
      },
      {
        id: 'g4-english-l2-04',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 2,
        point: '职业词汇',
        type: 'single',
        stem: '“护士”用英语怎么说？',
        options: [
          { key: 'A', text: 'doctor' },
          { key: 'B', text: 'nurse' },
          { key: 'C', text: 'driver' },
          { key: 'D', text: 'farmer' }
        ],
        answer: 'B',
        hint: '回忆医院里照顾病人的工作人员用哪个词，别和医生的词混在一起。',
        analysis: 'nurse 是护士；doctor 是医生，driver 是司机，farmer 是农民，这些词都可以用来介绍家人的职业。',
        difficulty: 1
      },
      {
        id: 'g4-english-l2-05',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 2,
        point: '介词 in 与 on',
        type: 'judge',
        stem: '"The picture is in the wall." 这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想图画是挂在墙的表面还是放进墙里面，再判断介词用得是否合适。',
        analysis: '图画挂在墙的表面，要用 on the wall；in 表示在某个空间的里面，所以这句话是错误的。',
        difficulty: 1
      },

      /* ---------- 关卡 3 · 时间钟楼 ---------- */
      {
        id: 'g4-english-l3-01',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 3,
        point: '整点时间表达',
        type: 'single',
        stem: '“现在是七点钟。”用英语怎么说？',
        options: [
          { key: 'A', text: "It is seven thirty." },
          { key: 'B', text: "It is six o'clock." },
          { key: 'C', text: "It is seven o'clock." },
          { key: 'D', text: "It is seven o'clocks." }
        ],
        answer: 'C',
        hint: '整点时间要用数字加上哪个固定说法来读，先确定小时数再想那个词的写法。',
        analysis: '整点时间用“数字 + o\'clock”表示，七点钟就是 seven o\'clock；o\'clock 本身已经表示“点钟”，不能再加 -s。',
        difficulty: 2
      },
      {
        id: 'g4-english-l3-02',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 3,
        point: '数字表达',
        type: 'single',
        stem: '“六十五”用英语怎么说？',
        options: [
          { key: 'A', text: 'fifty-six' },
          { key: 'B', text: 'six five' },
          { key: 'C', text: 'sixteen-five' },
          { key: 'D', text: 'sixty-five' }
        ],
        answer: 'D',
        hint: '两位数要用十位加个位来说，中间还要加一个连字符把两部分连起来。',
        analysis: '两位数的英语是先说十位再说个位，中间加连字符：六十五是 sixty-five，不能写成 six five。',
        difficulty: 2
      },
      {
        id: 'g4-english-l3-03',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 3,
        point: '动词短语',
        type: 'judge',
        stem: '"I get up at six o\'clock every morning." 的意思是“我每天早上六点起床”。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '把句中的动词短语和时间状语分别翻译出来，再拼成一句完整的中文意思。',
        analysis: 'get up 意为“起床”，at six o\'clock 表示“在六点钟”，every morning 是“每天早上”，所以这句话的意思正确。',
        difficulty: 2
      },
      {
        id: 'g4-english-l3-04',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 3,
        point: '第三人称单数',
        type: 'judge',
        stem: '"My brother go to school by bus." 这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先看主语是第几人称，再检查一般现在时里动词需不需要变形。',
        analysis: '主语 My brother 是第三人称单数，一般现在时中动词要加 -s 或 -es，应该说 goes to school，所以这句话错误。',
        difficulty: 2
      },
      {
        id: 'g4-english-l3-05',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 3,
        point: '第三人称单数',
        type: 'single',
        stem: '“她每天看电视。”用英语怎么说？',
        options: [
          { key: 'A', text: 'She watch TV every day.' },
          { key: 'B', text: 'She watches TV every day.' },
          { key: 'C', text: 'She watching TV every day.' },
          { key: 'D', text: 'She watchs TV every day.' }
        ],
        answer: 'B',
        hint: '主语是第三人称单数时动词要加什么，注意以 ch 结尾的词又该怎么变。',
        analysis: '主语 she 是第三人称单数，一般现在时中动词要变化：watch 以 ch 结尾，加 -es 变成 watches。',
        difficulty: 2
      },

      /* ---------- 关卡 4 · 天气站台 ---------- */
      {
        id: 'g4-english-l4-01',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 4,
        point: '天气词汇',
        type: 'judge',
        stem: '"It is rainy today." 的意思是“今天下雨”。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先想表示下雨的形容词是由哪个天气名词变来的，再核对整句中文意思。',
        analysis: 'rainy 是形容词，意思是“下雨的”，It is rainy today 就是“今天下雨”，说法正确。',
        difficulty: 2
      },
      {
        id: 'g4-english-l4-02',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 4,
        point: '情态动词 can',
        type: 'single',
        stem: '“我会游泳。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I can swim.' },
          { key: 'B', text: 'I can swimming.' },
          { key: 'C', text: 'I can to swim.' },
          { key: 'D', text: 'I can swims.' }
        ],
        answer: 'A',
        hint: '情态动词后面的动词要用原形，注意不加 to、不加 -ing 也不加 -s。',
        analysis: 'can 是情态动词，后面直接跟动词原形，不加 to，也不加 -ing 或 -s，所以是 I can swim.',
        difficulty: 2
      },
      {
        id: 'g4-english-l4-03',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 4,
        point: '特殊疑问词',
        type: 'single',
        stem: '“你喜欢什么颜色？”用英语怎么说？',
        options: [
          { key: 'A', text: 'How many colours do you like?' },
          { key: 'B', text: 'Where is your colour?' },
          { key: 'C', text: 'What colour do you like?' },
          { key: 'D', text: 'How much colour do you like?' }
        ],
        answer: 'C',
        hint: '问颜色要用哪个疑问词开头，先弄清是在问颜色还是问数量、地点。',
        analysis: '询问“什么颜色”要用 What colour 开头，colour 用单数；How many 问数量，Where 问地点，How much 问价钱。',
        difficulty: 2
      },
      {
        id: 'g4-english-l4-04',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 4,
        point: '服装词汇',
        type: 'single',
        stem: '“我在冬天穿毛衣。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I wear sweater in winter.' },
          { key: 'B', text: 'I wearing a sweater in winter.' },
          { key: 'C', text: 'I wear a sweaters in winter.' },
          { key: 'D', text: 'I wear a sweater in winter.' }
        ],
        answer: 'D',
        hint: '可数名词单数前面要加冠词，一般现在时的动词用原形，按这两条逐一检查。',
        analysis: 'sweater 是可数名词单数，前面要加 a；主语 I 在一般现在时中用动词原形 wear，不能加 -ing。',
        difficulty: 2
      },
      {
        id: 'g4-english-l4-05',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 4,
        point: '天气与穿着',
        type: 'single',
        stem: '“今天很冷，请穿上你的外套。”用英语怎么说？',
        options: [
          { key: 'A', text: "It's hot today. Take off your coat." },
          { key: 'B', text: "It's cold today. Take off your coat." },
          { key: 'C', text: "It's cold today. Put on your coat." },
          { key: 'D', text: "It's cold today. Put on you coat." }
        ],
        answer: 'C',
        hint: '先分清穿和脱各用哪个短语，再检查物主代词后面能不能直接接名词。',
        analysis: 'cold 表示“冷”，穿上用 put on，脱下用 take off；your 是物主代词，后面要接名词 coat，不能用 you。',
        difficulty: 2
      },

      /* ---------- 关卡 5 · 句子工坊 ---------- */
      {
        id: 'g4-english-l5-01',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 5,
        point: '祈使句用法',
        type: 'single',
        stem: '“请关上窗户。”用英语怎么说？',
        options: [
          { key: 'A', text: 'Closes the window, please.' },
          { key: 'B', text: 'Close the window, please.' },
          { key: 'C', text: 'Closing the window, please.' },
          { key: 'D', text: 'To close the window, please.' }
        ],
        answer: 'B',
        hint: '祈使句要用动词的哪种形式开头，表示客气时又在句末加哪个词。',
        analysis: '祈使句用动词原形开头，表示请求时可在句末加 please，所以是 Close the window, please.，动词不能加 -s 或 -ing。',
        difficulty: 3
      },
      {
        id: 'g4-english-l5-02',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 5,
        point: '数量提问用法',
        type: 'judge',
        stem: '"How much apples do you have?" 这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先看这个名词可数还是不可数，再判断问数量的疑问词用得是否合适。',
        analysis: 'How much 用来问不可数名词的数量或物品的价钱，apples 是可数名词复数，应该问 How many apples，所以错误。',
        difficulty: 3
      },
      {
        id: 'g4-english-l5-03',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 5,
        point: '物主代词',
        type: 'single',
        stem: '“这是我的书，那是她的书。”用英语怎么说？',
        options: [
          { key: 'A', text: 'This is my book. That is she book.' },
          { key: 'B', text: 'This is I book. That is her book.' },
          { key: 'C', text: 'This is mine book. That is hers book.' },
          { key: 'D', text: 'This is my book. That is her book.' }
        ],
        answer: 'D',
        hint: '形容词性物主代词后面可以直接接名词，注意别把主格或者名词性物主代词用上。',
        analysis: 'my 和 her 是形容词性物主代词，后面直接接名词；she 和 I 是主格，mine 和 hers 后面不能再接名词。',
        difficulty: 3
      },
      {
        id: 'g4-english-l5-04',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 5,
        point: '疑问词辨析',
        type: 'judge',
        stem: '"How many books do you have?" 问的是书的数量。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先看疑问词是问数量还是问价钱，再看后面的名词可数还是不可数。',
        analysis: 'How many 用来询问可数名词的数量，这个句子问的是“你有多少本书”，所以说法正确。',
        difficulty: 3
      },
      {
        id: 'g4-english-l5-05',
        grade: 4,
        subject: 'english',
        packId: 'english-g4',
        level: 5,
        point: '不可数名词',
        type: 'single',
        stem: '“我想要一些面包和牛奶。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I want some bread and milk.' },
          { key: 'B', text: 'I want some breads and milks.' },
          { key: 'C', text: 'I wants some bread and milk.' },
          { key: 'D', text: 'I want any bread and milk.' }
        ],
        answer: 'A',
        hint: '先看主语后面用动词原形还是加 -s，再想不可数名词能不能有复数，肯定句里用哪个表示一些的词。',
        analysis: '主语 I 用动词原形 want；bread 和 milk 是不可数名词，没有复数形式，肯定句中用 some 而不是 any。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);