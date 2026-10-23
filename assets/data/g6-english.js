/* 知闯岛 · 内置题库：六年级英语 */
(function (ZCD) {
  'use strict';

  ZCD.registerPack({
    pack: {
      id: 'english-g6',
      name: '英语环游号',
      grade: 6,
      subject: 'english',
      intro: '交通出行、周末计划、过去的事情和比较级，用英语讲述经历与计划。',
      difficulty: 3,
      levelNames: ['关卡1 · 出行港口', '关卡2 · 计划航线', '关卡3 · 过去时光', '关卡4 · 比较高地', '关卡5 · 综合灯塔']
    },
    questions: [
      {
        id: 'g6-english-l1-01',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 1,
        point: '交通方式',
        type: 'single',
        stem: '“我每天骑自行车上学。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I go to school by bike every day.' },
          { key: 'B', text: 'I go to school by bike yesterday.' },
          { key: 'C', text: 'I am go to school by bike every day.' },
          { key: 'D', text: 'I going to school by bike every day.' }
        ],
        answer: 'A',
        hint: '句中有表示经常发生的时间词，要用一般现在时，动词用原形。',
        analysis: 'every day 表示经常发生的事，用一般现在时；by bike 表示骑自行车这种交通方式，主语 I 后面动词用原形 go。',
        difficulty: 1
      },
      {
        id: 'g6-english-l1-02',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 1,
        point: '问路与交通',
        type: 'single',
        stem: '— ___ do you go to Beijing? — By train. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'What' },
          { key: 'B', text: 'How' },
          { key: 'C', text: 'Where' },
          { key: 'D', text: 'When' }
        ],
        answer: 'B',
        hint: '看答语说的是出行方式，问句就该用问方式的疑问词。',
        analysis: '询问出行方式要用 How，答语 By train 表示乘火车，所以问句是 How do you go to Beijing?',
        difficulty: 1
      },
      {
        id: 'g6-english-l1-03',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 1,
        point: '问路指路',
        type: 'judge',
        stem: '“Go along this street and turn left at the cinema.”可以用来给别人指路。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '从句子里的动词短语判断它是在描述路线还是别的事情。',
        analysis: 'Go along this street 意思是沿着这条街走，turn left at the cinema 表示在电影院处左转，是常见的指路表达。',
        difficulty: 1
      },
      {
        id: 'g6-english-l1-04',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 1,
        point: '交通方式辨析',
        type: 'judge',
        stem: '“I go to school by foot.”这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想表示步行时介词该用哪一个，再检查句中的搭配。',
        analysis: '表示步行要用 on foot，不能说 by foot，句子应改成 I go to school on foot. 才对。',
        difficulty: 1
      },
      {
        id: 'g6-english-l1-05',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 1,
        point: '方位介词',
        type: 'single',
        stem: '“图书馆在邮局和银行之间。”横线处应填哪个词？The library is ___ the post office and the bank.',
        options: [
          { key: 'A', text: 'next to' },
          { key: 'B', text: 'behind' },
          { key: 'C', text: 'between' },
          { key: 'D', text: 'in front of' }
        ],
        answer: 'C',
        hint: '句子说图书馆夹在两个地方中间，要选和后面那个词搭配的方位介词。',
        analysis: 'between ... and ... 表示“在两者之间”；next to 是紧邻，behind 是在后面，in front of 是在前面。',
        difficulty: 1
      },
      {
        id: 'g6-english-l2-01',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 2,
        point: '一般将来时',
        type: 'single',
        stem: '“下周末我打算去远足。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I am going to go hiking next weekend.' },
          { key: 'B', text: 'I go hiking next weekend.' },
          { key: 'C', text: 'I went hiking next weekend.' },
          { key: 'D', text: 'I am go hiking next weekend.' }
        ],
        answer: 'A',
        hint: '看到将来的时间，要用表示打算的结构，后面跟动词原形。',
        analysis: 'be going to 表示打算、计划做某事，next weekend 是将来时间，am going to 后面要用动词原形 go。',
        difficulty: 1
      },
      {
        id: 'g6-english-l2-02',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 2,
        point: '特殊疑问句',
        type: 'single',
        stem: '— ___ are you going to do this weekend? — I am going to visit my grandparents. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'Where' },
          { key: 'B', text: 'When' },
          { key: 'C', text: 'What' },
          { key: 'D', text: 'Who' }
        ],
        answer: 'C',
        hint: '答语说的是打算做的事情，提问就要用问事情的疑问词。',
        analysis: '答语说的是周末打算做的事情，所以用 What 提问；Where 问地点，When 问时间，Who 问人。',
        difficulty: 1
      },
      {
        id: 'g6-english-l2-03',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 2,
        point: '天气与将来',
        type: 'judge',
        stem: '“It will be sunny tomorrow.”表示“明天将是晴天”，其中 will 后面接动词原形。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '检查句子里的将来时标志词后面接的是不是动词原形。',
        analysis: 'will 是一般将来时的标志词，后面接动词原形，be sunny 在这里表示天气晴朗。',
        difficulty: 1
      },
      {
        id: 'g6-english-l2-04',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 2,
        point: '将来时结构',
        type: 'judge',
        stem: '“I am going to played football tomorrow.”这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '检查将来时结构后面接的动词形式，留意别用过去式。',
        analysis: 'be going to 后面必须用动词原形，played 是过去式，应改为 play 句子才正确。',
        difficulty: 1
      },
      {
        id: 'g6-english-l2-05',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 2,
        point: '职业与梦想',
        type: 'single',
        stem: '— What are you going to ___ when you grow up? — I am going to be a doctor. 横线处应填哪个词？（你长大后打算做什么？）',
        options: [
          { key: 'A', text: 'is' },
          { key: 'B', text: 'been' },
          { key: 'C', text: 'are' },
          { key: 'D', text: 'be' }
        ],
        answer: 'D',
        hint: '空处是「成为」的意思，要用动词原形，不能跟着主语随便变形。',
        analysis: 'be going to 后面接动词原形；问长大后打算从事什么职业，用 be going to be a ... 的结构，这里的 be 表示“成为”。',
        difficulty: 1
      },
      {
        id: 'g6-english-l3-01',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 3,
        point: '不规则过去式',
        type: 'single',
        stem: '“上周日我看了一部电影。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I see a film last Sunday.' },
          { key: 'B', text: 'I saw a film last Sunday.' },
          { key: 'C', text: 'I am seeing a film last Sunday.' },
          { key: 'D', text: 'I will see a film last Sunday.' }
        ],
        answer: 'B',
        hint: '句中有表示过去的时间，动词要用过去式，注意它变化不规则。',
        analysis: 'last Sunday 表示过去的时间，句子用一般过去时，see 的过去式是不规则变化 saw。',
        difficulty: 2
      },
      {
        id: 'g6-english-l3-02',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 3,
        point: '过去时否定',
        type: 'single',
        stem: '“昨天他没有去上学。”He ___ to school yesterday. 横线处应填哪一项？',
        options: [
          { key: 'A', text: 'does not go' },
          { key: 'B', text: 'did not went' },
          { key: 'C', text: 'did not go' },
          { key: 'D', text: 'was not go' }
        ],
        answer: 'C',
        hint: '过去时的否定句要借用助动词，后面那个动词要回到原形。',
        analysis: '一般过去时的否定句用 did not 加动词原形，did not 后面不能再出现过去式 went。',
        difficulty: 2
      },
      {
        id: 'g6-english-l3-03',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 3,
        point: '动词过去式',
        type: 'judge',
        stem: '“He goed to school by bus yesterday.”这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '回忆这个动词的过去式是不是按规则加的，注意它的特殊变化。',
        analysis: 'go 是不规则动词，过去式是 went，不能加 -ed，应改成 He went to school by bus yesterday.',
        difficulty: 2
      },
      {
        id: 'g6-english-l3-04',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 3,
        point: '过去时疑问句',
        type: 'judge',
        stem: '“Did you have a cold last week?”是一般过去时的疑问句，意思是“上周你感冒了吗”。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '看看疑问句里助动词和动词原形搭得是否合适，再留意时间词。',
        analysis: 'Did 引导一般疑问句，后面用动词原形 have，last week 说明事情发生在过去，句子正确。',
        difficulty: 2
      },
      {
        id: 'g6-english-l3-05',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 3,
        point: '一般过去时',
        type: 'single',
        stem: '— ___ you go to the park last weekend? — Yes, I did. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'Do' },
          { key: 'B', text: 'Are' },
          { key: 'C', text: 'Was' },
          { key: 'D', text: 'Did' }
        ],
        answer: 'D',
        hint: '句中有表示过去的时间，一般疑问句要用过去式的助动词开头。',
        analysis: '答语 Yes, I did 说明问句由 Did 引导，后面用动词原形 go，时间是 last weekend。',
        difficulty: 2
      },
      {
        id: 'g6-english-l4-01',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 4,
        point: '形容词比较级',
        type: 'single',
        stem: '“我比我弟弟高。”I am ___ than my brother. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'taller' },
          { key: 'B', text: 'tall' },
          { key: 'C', text: 'tallest' },
          { key: 'D', text: 'more tall' }
        ],
        answer: 'A',
        hint: '句中有 than，前面要用比较级，单音节形容词直接加词尾。',
        analysis: 'than 前面要用比较级，tall 是单音节形容词，比较级直接加 -er 变成 taller。',
        difficulty: 2
      },
      {
        id: 'g6-english-l4-02',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 4,
        point: '最高级用法',
        type: 'single',
        stem: '“他是我们班最好的学生。”He is the ___ student in our class. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'better' },
          { key: 'B', text: 'best' },
          { key: 'C', text: 'good' },
          { key: 'D', text: 'well' }
        ],
        answer: 'B',
        hint: '句中有表示比较范围的说法，三者以上比较要用最高级。',
        analysis: 'in our class 表示比较的范围，三者以上作比较用最高级，good 的最高级是 best。',
        difficulty: 2
      },
      {
        id: 'g6-english-l4-03',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 4,
        point: '不规则比较级',
        type: 'judge',
        stem: '“many”的比较级是“more”，最高级是“most”，这属于不规则变化。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '回忆表示「多」的词比较时怎么变，它属于要特别记住的类型。',
        analysis: 'many 和 much 的比较级都是 more，最高级都是 most，变化形式不规则，需要特别记住。',
        difficulty: 2
      },
      {
        id: 'g6-english-l4-04',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 4,
        point: '比较级辨析',
        type: 'judge',
        stem: '“She is more taller than her sister.”这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '检查比较级前面有没有多余的词，重复表达就说明有问题。',
        analysis: 'taller 本身已经是比较级，前面不能再加 more，去掉 more 以后句子才正确。',
        difficulty: 2
      },
      {
        id: 'g6-english-l4-05',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 4,
        point: '比较级用法',
        type: 'single',
        stem: '“今天比昨天冷。”It is ___ today than yesterday. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'cold' },
          { key: 'B', text: 'coldest' },
          { key: 'C', text: 'more cold' },
          { key: 'D', text: 'colder' }
        ],
        answer: 'D',
        hint: '两者相比要用比较级，注意这个形容词该加词尾还是加别的词。',
        analysis: 'than 表示两者作比较，要用比较级，cold 的比较级是 colder，不能说 more cold。',
        difficulty: 2
      },
      {
        id: 'g6-english-l5-01',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 5,
        point: '情态动词建议',
        type: 'single',
        stem: '“他感冒了，应该去看医生。”He has a cold. He ___ see a doctor. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'should' },
          { key: 'B', text: 'should not' },
          { key: 'C', text: 'is not' },
          { key: 'D', text: 'did not' }
        ],
        answer: 'A',
        hint: '给别人提建议要用情态动词，后面接动词原形。',
        analysis: 'should 表示“应该”，常用来提建议，后面接动词原形；have a cold 是感冒，see a doctor 是看医生。',
        difficulty: 3
      },
      {
        id: 'g6-english-l5-02',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 5,
        point: '过去时存在句',
        type: 'single',
        stem: '“昨天教室里有许多学生。”There ___ many students in the classroom yesterday. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'is' },
          { key: 'B', text: 'were' },
          { key: 'C', text: 'was' },
          { key: 'D', text: 'are' }
        ],
        answer: 'B',
        hint: '句首是存在句，时间在过去，主语是复数，看 be 动词该用哪个。',
        analysis: 'yesterday 是过去时间，there be 句型要用过去式；students 是复数，所以用 were。',
        difficulty: 3
      },
      {
        id: 'g6-english-l5-03',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 5,
        point: '原因连词',
        type: 'single',
        stem: '“她很难过，因为她丢了书包。”She is sad ___ she lost her schoolbag. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'but' },
          { key: 'B', text: 'so' },
          { key: 'C', text: 'because' },
          { key: 'D', text: 'and' }
        ],
        answer: 'C',
        hint: '后半句说的是原因，要选能引导原因的连词。',
        analysis: '后半句说明难过的原因，用 because 引导；but 表示转折，so 表示结果，and 表示并列。',
        difficulty: 3
      },
      {
        id: 'g6-english-l5-04',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 5,
        point: '过去时综合',
        type: 'judge',
        stem: '“What did you do last weekend?”是询问上周末做了什么，答语要用动词的过去式。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '看问句和答语是不是都围绕过去的事，动词形式是否一致。',
        analysis: '疑问词 What 加 did 构成一般过去时的问句，last weekend 指过去，答语要用动词的过去式。',
        difficulty: 3
      },
      {
        id: 'g6-english-l5-05',
        grade: 6,
        subject: 'english',
        packId: 'english-g6',
        level: 5,
        point: '现在进行时',
        type: 'single',
        stem: '“听！孩子们正在唱歌。”Listen! The children ___ singing. 横线处应填哪个词？',
        options: [
          { key: 'A', text: 'is' },
          { key: 'B', text: 'are going' },
          { key: 'C', text: 'sings' },
          { key: 'D', text: 'are' }
        ],
        answer: 'D',
        hint: '句中有提示动作正在进行的词，用现在进行时，注意主语是复数。',
        analysis: 'Listen 提示动作正在发生，用现在进行时 be 加动词的 -ing 形式；children 是复数，be 动词用 are。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);