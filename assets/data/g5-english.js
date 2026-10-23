/* 知闯岛 · 内置题库：五年级英语 */
(function (ZCD) {
  'use strict';

  ZCD.registerPack({
    pack: {
      id: 'english-g5',
      name: '英语远航号',
      grade: 5,
      subject: 'english',
      intro: '日常作息、课程、饮食和一般现在时、现在进行时，用英语聊自己的生活。',
      difficulty: 2,
      levelNames: ['关卡1 · 作息港湾', '关卡2 · 课程甲板', '关卡3 · 美食码头', '关卡4 · 进行时海峡', '关卡5 · 对话灯塔']
    },
    questions: [
      /* ---------- 关卡 1 · 作息港湾 ---------- */
      {
        id: 'g5-english-l1-01',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 1,
        point: '一般现在时三单',
        type: 'single',
        stem: '“他每天晚上做作业。”用英语怎么说？',
        options: [
          { key: 'A', text: 'He does his homework every evening.' },
          { key: 'B', text: 'He do his homework every evening.' },
          { key: 'C', text: 'He doing his homework every evening.' },
          { key: 'D', text: 'He is do his homework every evening.' }
        ],
        answer: 'A',
        hint: '句中有表示经常的时间词，要用一般现在时，主语是第三人称单数时动词要变形。',
        analysis: 'every evening 表示经常发生的动作，句子用一般现在时；主语 He 是第三人称单数，动词要用 does。',
        difficulty: 1
      },
      {
        id: 'g5-english-l1-02',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 1,
        point: '作息与时间表达',
        type: 'single',
        stem: '“我六点半起床。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I get up in six thirty.' },
          { key: 'B', text: 'I go up at six thirty.' },
          { key: 'C', text: 'I get up at six thirty.' },
          { key: 'D', text: 'I getting up at six thirty.' }
        ],
        answer: 'C',
        hint: '先想「起床」用哪个固定短语，再注意具体时刻前面该用哪个介词。',
        analysis: '“起床”是固定短语 get up；具体时刻前用介词 at，所以是 get up at six thirty。',
        difficulty: 1
      },
      {
        id: 'g5-english-l1-03',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 1,
        point: '作息短语理解',
        type: 'judge',
        stem: '“I go to bed at nine.”的意思是“我九点上床睡觉”。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先弄清表示「上床睡觉」的固定短语是什么意思，再核对句中的时间。',
        analysis: 'go to bed 是固定短语，意思是“上床睡觉”，常用来描述每天的作息安排。',
        difficulty: 1
      },
      {
        id: 'g5-english-l1-04',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 1,
        point: 'have 的三单形式',
        type: 'single',
        stem: '“她七点吃早饭。”用英语怎么说？',
        options: [
          { key: 'A', text: 'She have breakfast at seven.' },
          { key: 'B', text: 'She has breakfast in seven.' },
          { key: 'C', text: 'She having breakfast at seven.' },
          { key: 'D', text: 'She has breakfast at seven.' }
        ],
        answer: 'D',
        hint: '主语是第三人称单数，表示「吃」的动词要换成特殊形式，时刻前面也别用错介词。',
        analysis: '主语 She 是第三人称单数，一般现在时中 have 要变成 has；具体时刻前用 at。',
        difficulty: 1
      },
      {
        id: 'g5-english-l1-05',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 1,
        point: '一般现在时三单',
        type: 'judge',
        stem: '“He go to school by bike every day.”这句话的语法完全正确。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先看主语是不是第三人称单数，再看动词有没有跟着一起变化。',
        analysis: '主语 He 是第三人称单数，一般现在时中动词要用 goes，应改为 He goes to school。',
        difficulty: 1
      },

      /* ---------- 关卡 2 · 课程甲板 ---------- */
      {
        id: 'g5-english-l2-01',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 2,
        point: '星期前用 on',
        type: 'single',
        stem: '“我们星期三有英语课。”用英语怎么说？',
        options: [
          { key: 'A', text: 'We have English class in Wednesday.' },
          { key: 'B', text: 'We has English class on Wednesday.' },
          { key: 'C', text: 'We have English class on Wednesday.' },
          { key: 'D', text: 'We are have English class on Wednesday.' }
        ],
        answer: 'C',
        hint: '星期几前面该用哪个介词，主语是复数时动词用什么形式，两处都要查。',
        analysis: '星期几前面用介词 on；主语 We 是复数，一般现在时中动词用原形 have。',
        difficulty: 1
      },
      {
        id: 'g5-english-l2-02',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 2,
        point: '课程名称认读',
        type: 'judge',
        stem: '“We have maths, Chinese and art on Thursday.”这句话提到星期四有三门课。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '把句子里的科目名称一个个译出来，再数一数一共提到了几门课。',
        analysis: 'maths、Chinese、art 分别是数学、语文和美术，正好三门课，说法正确。',
        difficulty: 1
      },
      {
        id: 'g5-english-l2-03',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 2,
        point: '询问最喜欢的科目',
        type: 'single',
        stem: '“你最喜欢的科目是什么？”用英语怎么说？',
        options: [
          { key: 'A', text: 'What your favourite subject?' },
          { key: 'B', text: 'What is your favourite subject?' },
          { key: 'C', text: 'What are your favourite subject?' },
          { key: 'D', text: 'What is you favourite subject?' }
        ],
        answer: 'B',
        hint: '疑问句里be动词要放到主语前面，单数名词搭配哪个be动词也要想清楚。',
        analysis: 'subject 是单数，be 动词用 is；疑问句要把 is 放在主语前面，“你的”用 your。',
        difficulty: 1
      },
      {
        id: 'g5-english-l2-04',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 2,
        point: '课程与时间段表达',
        type: 'single',
        stem: '“我们星期二下午上体育课。”用英语怎么说？',
        options: [
          { key: 'A', text: 'We have PE in Tuesday afternoon.' },
          { key: 'B', text: 'We has PE on Tuesday afternoon.' },
          { key: 'C', text: 'We have PE at Tuesday afternoon.' },
          { key: 'D', text: 'We have PE on Tuesday afternoon.' }
        ],
        answer: 'D',
        hint: '某天的上午下午前面用哪个介词，主语是复数时动词该用原形还是三单。',
        analysis: '“在星期二下午”用 on Tuesday afternoon；主语 We 是复数，动词用原形 have。',
        difficulty: 1
      },
      {
        id: 'g5-english-l2-05',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 2,
        point: 'have 的复数形式',
        type: 'judge',
        stem: '“We has four lessons in the morning.”这句话的动词形式是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先看主语是单数还是复数，再决定动词该用哪种形式。',
        analysis: '主语 We 是复数，一般现在时中动词要用原形 have，不能用第三人称单数形式 has。',
        difficulty: 1
      },

      /* ---------- 关卡 3 · 美食码头 ---------- */
      {
        id: 'g5-english-l3-01',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 3,
        point: '不可数名词用 some',
        type: 'single',
        stem: '“你想要一些果汁吗？”用英语怎么说？',
        options: [
          { key: 'A', text: 'Do you like any juice?' },
          { key: 'B', text: 'Would you like some juices?' },
          { key: 'C', text: 'Would you like some juice?' },
          { key: 'D', text: 'Do you would like some juice?' }
        ],
        answer: 'C',
        hint: '表示「你想要……吗」要用专门的句型，再想想果汁这类不可数名词能不能加复数。',
        analysis: 'juice 是不可数名词，没有复数形式；Would you like 表示“你想要……吗”，后面用 some；Do you would like 两个助动词连用是错的。',
        difficulty: 2
      },
      {
        id: 'g5-english-l3-02',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 3,
        point: '可数与不可数名词',
        type: 'judge',
        stem: '“I would like some bread and milk for breakfast.”中的 bread 和 milk 都是不可数名词。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先判断这两个词能不能一个一个数出来，再想它们前面可以用哪个词修饰。',
        analysis: 'bread（面包）和 milk（牛奶）都是不可数名词，前面可以直接用 some 来修饰。',
        difficulty: 2
      },
      {
        id: 'g5-english-l3-03',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 3,
        point: '可数名词数量提问',
        type: 'single',
        stem: '“冰箱里有多少个鸡蛋？”用英语怎么说？',
        options: [
          { key: 'A', text: 'How much eggs are there in the fridge?' },
          { key: 'B', text: 'How many egg is there in the fridge?' },
          { key: 'C', text: 'How much egg are there in the fridge?' },
          { key: 'D', text: 'How many eggs are there in the fridge?' }
        ],
        answer: 'D',
        hint: '问可数东西的数量用哪个短语，名词要用什么形式，后面的be动词也要跟着变。',
        analysis: 'eggs 是可数名词的复数形式，提问数量用 How many，be 动词用 are。',
        difficulty: 2
      },
      {
        id: 'g5-english-l3-04',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 3,
        point: '一般现在时否定',
        type: 'single',
        stem: '“我不喜欢洋葱。”用英语怎么说？',
        options: [
          { key: 'A', text: 'I don\'t like onions.' },
          { key: 'B', text: 'I not like onions.' },
          { key: 'C', text: 'I doesn\'t like onions.' },
          { key: 'D', text: 'I am not like onions.' }
        ],
        answer: 'A',
        hint: '一般现在时的否定句要借助助动词，主语是I时用哪个，后面动词用什么形式。',
        analysis: '一般现在时的否定用 don\'t 加动词原形；主语是 I 时不能用 doesn\'t；“洋葱”表示一类事物时通常用复数 onions。',
        difficulty: 2
      },
      {
        id: 'g5-english-l3-05',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 3,
        point: '名词复数与be动词',
        type: 'judge',
        stem: '“How much is the apples?”这句话的语法是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '看看主语是单数还是复数，再检查be动词和它搭配得合不合适。',
        analysis: 'apples 是复数，be 动词要用 are；询问价格应说 How much are the apples?',
        difficulty: 2
      },

      /* ---------- 关卡 4 · 进行时海峡 ---------- */
      {
        id: 'g5-english-l4-01',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 4,
        point: '现在进行时与拼写',
        type: 'single',
        stem: '“看！孩子们正在操场上跑步。”用英语怎么说？',
        options: [
          { key: 'A', text: 'Look! The children is running on the playground.' },
          { key: 'B', text: 'Look! The children run on the playground.' },
          { key: 'C', text: 'Look! The children are runing on the playground.' },
          { key: 'D', text: 'Look! The children are running on the playground.' }
        ],
        answer: 'D',
        hint: '提示词说明动作正在发生，要用进行时结构，动词加-ing时还要注意拼写变化。',
        analysis: 'children 是复数，be 动词用 are；run 是重读闭音节，加 -ing 要双写 n，写成 running。',
        difficulty: 2
      },
      {
        id: 'g5-english-l4-02',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 4,
        point: '现在进行时用法',
        type: 'judge',
        stem: '“She is reading a book now.”表示“她现在正在读一本书”。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '看清句中的时间词提示动作正在发生，再核对be动词和动词形式。',
        analysis: 'is reading 是 be 加 doing 的现在进行时结构，now 提示动作此刻正在进行。',
        difficulty: 2
      },
      {
        id: 'g5-english-l4-03',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 4,
        point: '现在进行时疑问句',
        type: 'single',
        stem: '“他正在写作业吗？”用英语怎么说？',
        options: [
          { key: 'A', text: 'Does he writing his homework?' },
          { key: 'B', text: 'Is he doing his homework?' },
          { key: 'C', text: 'Is he do his homework?' },
          { key: 'D', text: 'He is doing his homework?' }
        ],
        answer: 'B',
        hint: '现在进行时变一般疑问句，要把be动词提到句首，动词用它的-ing形式。',
        analysis: '现在进行时的一般疑问句把 be 动词提到句首；“写作业”用 do his homework。',
        difficulty: 2
      },
      {
        id: 'g5-english-l4-04',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 4,
        point: '现在进行时构成',
        type: 'single',
        stem: '“我妈妈正在厨房做饭。”用英语怎么说？',
        options: [
          { key: 'A', text: 'My mother cook in the kitchen.' },
          { key: 'B', text: 'My mother is cook in the kitchen.' },
          { key: 'C', text: 'My mother is cooking in the kitchen.' },
          { key: 'D', text: 'My mother cooking in the kitchen.' }
        ],
        answer: 'C',
        hint: '现在进行时由be加动词-ing构成，主语是单数时该选哪个be动词。',
        analysis: '现在进行时由 be 加动词 -ing 构成；主语 My mother 是单数，要用 is cooking。',
        difficulty: 2
      },
      {
        id: 'g5-english-l4-05',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 4,
        point: '现在进行时结构',
        type: 'judge',
        stem: '“They are play football now.”这句话的语法完全正确。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '进行时里be动词后面的动词该用什么形式，对照这条规则检查原句。',
        analysis: '现在进行时必须是 be 加 doing，play 要变成 playing，应改为 They are playing football。',
        difficulty: 2
      },

      /* ---------- 关卡 5 · 对话灯塔 ---------- */
      {
        id: 'g5-english-l5-01',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 5,
        point: '问路与方位介词',
        type: 'single',
        stem: '“请问图书馆在哪里？——它在邮局旁边。”用英语怎么说？',
        options: [
          { key: 'A', text: '—Where is the library? —It\'s next to the post office.' },
          { key: 'B', text: '—Where is the library? —It\'s next the post office.' },
          { key: 'C', text: '—Where are the library? —It\'s near the post office.' },
          { key: 'D', text: '—Where is the library? —It next to the post office.' }
        ],
        answer: 'A',
        hint: '问单个地点用哪个be动词，表示「在……旁边」有固定短语，句中不能少be动词。',
        analysis: '询问单个地点用 Where is；“在……旁边”是 next to，句子中不能缺少 be 动词 is。',
        difficulty: 3
      },
      {
        id: 'g5-english-l5-02',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 5,
        point: '情态动词must用法',
        type: 'judge',
        stem: '“You must wait for the green light.”告诉我们要等绿灯亮了再走。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先弄清这个情态动词表示必须的意思，再想它和交通规则是否一致。',
        analysis: 'must 表示“必须、一定”，wait for the green light 指等绿灯，说法符合交通规则。',
        difficulty: 3
      },
      {
        id: 'g5-english-l5-03',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 5,
        point: '现在进行时综合',
        type: 'single',
        stem: '“看！孩子们正在公园里唱歌。”用英语怎么说？',
        options: [
          { key: 'A', text: 'Look! The children are singing in the park.' },
          { key: 'B', text: 'Look! The children is singing in the park.' },
          { key: 'C', text: 'Look! The children are sing in the park.' },
          { key: 'D', text: 'Look! The children singing in the park.' }
        ],
        answer: 'A',
        hint: '提示词说明动作正在发生，be动词要和复数主语搭配，动词也要加-ing。',
        analysis: 'Look! 提示动作正在发生，要用现在进行时 be + 动词-ing；children 是复数，be 动词用 are，sing 要变成 singing。',
        difficulty: 3
      },
      {
        id: 'g5-english-l5-04',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 5,
        point: '名词性物主代词',
        type: 'single',
        stem: '“这是她的书，那本是我们的。”用英语怎么说？',
        options: [
          { key: 'A', text: 'This is her book. That is our.' },
          { key: 'B', text: 'This is she book. That is ours.' },
          { key: 'C', text: 'This is her book. That is ours.' },
          { key: 'D', text: 'This is hers book. That is our.' }
        ],
        answer: 'C',
        hint: '名词前面用形容词性物主代词，句末单独使用要用名词性物主代词。',
        analysis: '名词前面用形容词性物主代词 her；句末单独使用要用名词性物主代词 ours。',
        difficulty: 3
      },
      {
        id: 'g5-english-l5-05',
        grade: 5,
        subject: 'english',
        packId: 'english-g5',
        level: 5,
        point: '人称代词宾格',
        type: 'single',
        stem: '“你能帮我吗？”用英语怎么说？',
        options: [
          { key: 'A', text: 'Can you help I?' },
          { key: 'B', text: 'Can you help my?' },
          { key: 'C', text: 'Can you help mine?' },
          { key: 'D', text: 'Can you help me?' }
        ],
        answer: 'D',
        hint: '动词后面要接人称代词的宾格，先想清楚「我」的宾格是哪一个。',
        analysis: '动词 help 后面接人称代词的宾格，I 的宾格是 me，所以应说 help me。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);