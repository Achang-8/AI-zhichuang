/* 知闯岛 · 内置题库：五年级数学 */
(function (ZCD) {
  'use strict';

  ZCD.registerPack({
    pack: {
      id: 'math-g5',
      name: '方程密码岛',
      grade: 5,
      subject: 'math',
      intro: '小数乘除、简易方程、多边形面积和因数倍数，学会用数学语言描述关系。',
      difficulty: 2,
      levelNames: ['关卡1 · 小数集市', '关卡2 · 方程密室', '关卡3 · 面积梯田', '关卡4 · 因数迷宫', '关卡5 · 体积洞穴']
    },
    questions: [
      {
        id: 'g5-math-l1-01',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 1,
        point: '小数乘法',
        type: 'single',
        stem: '0.6 × 0.5 = ？',
        options: [
          { key: 'A', text: '0.3' },
          { key: 'B', text: '3' },
          { key: 'C', text: '0.03' },
          { key: 'D', text: '0.11' }
        ],
        answer: 'A',
        hint: '先按整数相乘，再数一数两个因数一共有几位小数。',
        analysis: '6 × 5 = 30，两个因数一共有两位小数，所以积是 0.30，即 0.3。',
        difficulty: 1
      },
      {
        id: 'g5-math-l1-02',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 1,
        point: '小数除法',
        type: 'single',
        stem: '3.6 ÷ 0.9 = ？',
        options: [
          { key: 'A', text: '0.4' },
          { key: 'B', text: '40' },
          { key: 'C', text: '4' },
          { key: 'D', text: '4.5' }
        ],
        answer: 'C',
        hint: '除数是小数时，把被除数和除数同时扩大相同的倍数，变成整数除法再算。',
        analysis: '被除数和除数同时扩大10倍，变成 36 ÷ 9 = 4，所以 3.6 ÷ 0.9 = 4。',
        difficulty: 1
      },
      {
        id: 'g5-math-l1-03',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 1,
        point: '小数乘法',
        type: 'judge',
        stem: '0.8 × 0.5 的积小于 1。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先按整数相乘，再根据小数位数点上小数点，然后看看积够不够1。',
        analysis: '0.8 × 0.5 = 0.4，0.4 比 1 小，所以这句话是正确的。',
        difficulty: 1
      },
      {
        id: 'g5-math-l1-04',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 1,
        point: '商的近似数',
        type: 'single',
        stem: '5 ÷ 3 的商保留两位小数约是（　）。',
        options: [
          { key: 'A', text: '1.6' },
          { key: 'B', text: '1.66' },
          { key: 'C', text: '1.67' },
          { key: 'D', text: '1.7' }
        ],
        answer: 'C',
        hint: '先除到小数点后第三位，保留两位小数时看千分位上的数决定是否进一。',
        analysis: '5 ÷ 3 = 1.666…，保留两位小数要看千分位上的6，向前一位进1，约等于1.67。',
        difficulty: 1
      },
      {
        id: 'g5-math-l1-05',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 1,
        point: '小数除法',
        type: 'judge',
        stem: '一个数（0除外）除以 0.5，商比这个数大。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想一想除数比1小的时候，商和被除数相比谁大，可以举个例子试试。',
        analysis: '0.5 比 1 小，一个数（0除外）除以小于1的数，商比原数大，如 2 ÷ 0.5 = 4。',
        difficulty: 1
      },
      {
        id: 'g5-math-l2-01',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 2,
        point: '等式性质',
        type: 'single',
        stem: '方程 x + 3.5 = 7.2 的解是（　）。',
        options: [
          { key: 'A', text: '10.7' },
          { key: 'B', text: '4.7' },
          { key: 'C', text: '3.5' },
          { key: 'D', text: '3.7' }
        ],
        answer: 'D',
        hint: '利用等式的性质，两边同时减去同一个数，就能把未知数单独留下。',
        analysis: '根据等式的性质，两边同时减去3.5，x = 7.2 - 3.5 = 3.7。',
        difficulty: 1
      },
      {
        id: 'g5-math-l2-02',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 2,
        point: '解简单方程',
        type: 'single',
        stem: '方程 3x = 4.5 的解是（　）。',
        options: [
          { key: 'A', text: '13.5' },
          { key: 'B', text: '1.5' },
          { key: 'C', text: '0.15' },
          { key: 'D', text: '7.5' }
        ],
        answer: 'B',
        hint: '方程两边同时除以未知数前面的那个数，就能求出未知数的值。',
        analysis: '两边同时除以3，x = 4.5 ÷ 3 = 1.5。检验：3 × 1.5 = 4.5，左右两边相等。',
        difficulty: 1
      },
      {
        id: 'g5-math-l2-03',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 2,
        point: '带括号的方程',
        type: 'single',
        stem: '方程 2(x + 1.5) = 9 的解是（　）。',
        options: [
          { key: 'A', text: '6' },
          { key: 'B', text: '4.5' },
          { key: 'C', text: '3' },
          { key: 'D', text: '2.5' }
        ],
        answer: 'C',
        hint: '先把括号里的式子看成一个整体，两边同时除以括号外的数，再去掉括号里的数。',
        analysis: '两边同时除以2，得 x + 1.5 = 4.5；再同时减去1.5，x = 3。',
        difficulty: 1
      },
      {
        id: 'g5-math-l2-04',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 2,
        point: '方程的解',
        type: 'judge',
        stem: '方程 3x - 6 = 9 的解是 x = 5。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '检验一个数是不是方程的解，就把它代入方程两边，看结果是否相等。',
        analysis: '把 x = 5 代入左边：3 × 5 - 6 = 15 - 6 = 9，与右边相等，所以 x = 5 是方程的解。',
        difficulty: 1
      },
      {
        id: 'g5-math-l2-05',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 2,
        point: '方程的意义',
        type: 'judge',
        stem: '含有未知数的式子都是方程。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想想方程要同时满足哪两个条件，只含有未知数还不够。',
        analysis: '方程必须既含有未知数，又是等式；如 2x 只含有未知数却不是等式，所以不是方程。',
        difficulty: 1
      },
      {
        id: 'g5-math-l3-01',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 3,
        point: '平行四边形面积',
        type: 'single',
        stem: '一个平行四边形的底是6厘米，高是4厘米，它的面积是（　）平方厘米。',
        options: [
          { key: 'A', text: '24' },
          { key: 'B', text: '12' },
          { key: 'C', text: '10' },
          { key: 'D', text: '48' }
        ],
        answer: 'A',
        hint: '回忆平行四边形面积公式，底和高相乘之后不需要再除以2。',
        analysis: '平行四边形面积 = 底 × 高 = 6 × 4 = 24（平方厘米），求平行四边形面积不用除以2。',
        difficulty: 2
      },
      {
        id: 'g5-math-l3-02',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 3,
        point: '三角形面积',
        type: 'single',
        stem: '一个三角形的底是8分米，高是5分米，它的面积是（　）平方分米。',
        options: [
          { key: 'A', text: '40' },
          { key: 'B', text: '13' },
          { key: 'C', text: '20' },
          { key: 'D', text: '80' }
        ],
        answer: 'C',
        hint: '三角形面积＝底×高÷2，算完乘积别忘了最后除以2这一步。',
        analysis: '三角形面积 = 底 × 高 ÷ 2 = 8 × 5 ÷ 2 = 20（平方分米），计算时别忘了除以2。',
        difficulty: 2
      },
      {
        id: 'g5-math-l3-03',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 3,
        point: '梯形面积',
        type: 'single',
        stem: '一个梯形的上底是3米，下底是5米，高是4米，它的面积是（　）平方米。',
        options: [
          { key: 'A', text: '32' },
          { key: 'B', text: '12' },
          { key: 'C', text: '15' },
          { key: 'D', text: '16' }
        ],
        answer: 'D',
        hint: '梯形面积＝（上底＋下底）×高÷2，先把两个底加起来再乘高。',
        analysis: '梯形面积 = （上底 + 下底）× 高 ÷ 2 = （3 + 5）× 4 ÷ 2 = 16（平方米）。',
        difficulty: 2
      },
      {
        id: 'g5-math-l3-04',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 3,
        point: '组合图形面积',
        type: 'single',
        stem: '一个长8厘米、宽5厘米的长方形，剪去一个底4厘米、高5厘米的三角形，剩下部分的面积是（　）平方厘米。',
        options: [
          { key: 'A', text: '20' },
          { key: 'B', text: '36' },
          { key: 'C', text: '30' },
          { key: 'D', text: '10' }
        ],
        answer: 'C',
        hint: '先算整个长方形的面积，再减去剪掉的三角形面积，三角形那份要除以2。',
        analysis: '长方形面积 8 × 5 = 40，剪去的三角形面积 4 × 5 ÷ 2 = 10，剩下 40 - 10 = 30（平方厘米）。',
        difficulty: 2
      },
      {
        id: 'g5-math-l3-05',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 3,
        point: '面积公式比较',
        type: 'judge',
        stem: '等底等高的平行四边形面积是三角形面积的2倍。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '把两个面积公式摆在一起比一比，看看三角形公式比平行四边形公式多做了哪一步运算。',
        analysis: '平行四边形面积 = 底 × 高，三角形面积 = 底 × 高 ÷ 2，等底等高时前者正好是后者的2倍。',
        difficulty: 2
      },
      {
        id: 'g5-math-l4-01',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 4,
        point: '最大公因数',
        type: 'single',
        stem: '12 和 18 的最大公因数是（　）。',
        options: [
          { key: 'A', text: '3' },
          { key: 'B', text: '6' },
          { key: 'C', text: '36' },
          { key: 'D', text: '72' }
        ],
        answer: 'B',
        hint: '把两个数的因数分别按顺序写出来，再找它们公有的因数里最大的那个。',
        analysis: '12的因数有1、2、3、4、6、12，18的因数有1、2、3、6、9、18，公有的最大因数是6。',
        difficulty: 2
      },
      {
        id: 'g5-math-l4-02',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 4,
        point: '最小公倍数',
        type: 'single',
        stem: '4 和 6 的最小公倍数是（　）。',
        options: [
          { key: 'A', text: '2' },
          { key: 'B', text: '6' },
          { key: 'C', text: '24' },
          { key: 'D', text: '12' }
        ],
        answer: 'D',
        hint: '按顺序写出两个数的倍数，第一次同时出现的那一个就是最小的公倍数。',
        analysis: '4的倍数有4、8、12、16…，6的倍数有6、12、18…，公有的最小倍数是12。',
        difficulty: 2
      },
      {
        id: 'g5-math-l4-03',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 4,
        point: '分数的意义',
        type: 'single',
        stem: '把一根3米长的绳子平均分成4段，每段是全长的（　）。',
        options: [
          { key: 'A', text: '四分之三' },
          { key: 'B', text: '三分之一' },
          { key: 'C', text: '四分之一' },
          { key: 'D', text: '三分之四' }
        ],
        answer: 'C',
        hint: '把全长看作单位1，平均分成几段，每段占其中的一份，和绳子的长度没有关系。',
        analysis: '把全长看作单位1，平均分成4段，每段是全长的四分之一；每段的长度才是 3 ÷ 4 = 四分之三（米）。',
        difficulty: 2
      },
      {
        id: 'g5-math-l4-04',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 4,
        point: '质数与合数',
        type: 'judge',
        stem: '所有的质数都是奇数。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '下结论之前先想想有没有哪个质数比较特殊，它可能正好打破这个说法。',
        analysis: '2 只有1和2两个因数，是质数；而 2 ÷ 2 = 1，它又是偶数，所以这句话是错误的。',
        difficulty: 2
      },
      {
        id: 'g5-math-l4-05',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 4,
        point: '倍数特征',
        type: 'judge',
        stem: '同时是 2、3、5 的倍数的最小三位数是 120。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '先想同时满足这三个条件的数其实是哪个数的倍数，再找最小的三位数。',
        analysis: '同时是2、3、5的倍数就是30的倍数，30的倍数中最小的三位数是 30 × 4 = 120。',
        difficulty: 2
      },
      {
        id: 'g5-math-l5-01',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 5,
        point: '正方体表面积',
        type: 'single',
        stem: '一个正方体的棱长是3厘米，它的表面积是（　）平方厘米。',
        options: [
          { key: 'A', text: '27' },
          { key: 'B', text: '54' },
          { key: 'C', text: '36' },
          { key: 'D', text: '9' }
        ],
        answer: 'B',
        hint: '正方体六个面一样大，先算出一个面的面积，再乘6。',
        analysis: '正方体表面积 = 棱长 × 棱长 × 6 = 3 × 3 × 6 = 54（平方厘米）。',
        difficulty: 3
      },
      {
        id: 'g5-math-l5-02',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 5,
        point: '长方体体积',
        type: 'single',
        stem: '一个长方体长5分米、宽4分米、高3分米，它的体积是（　）立方分米。',
        options: [
          { key: 'A', text: '12' },
          { key: 'B', text: '47' },
          { key: 'C', text: '94' },
          { key: 'D', text: '60' }
        ],
        answer: 'D',
        hint: '长方体体积＝长×宽×高，把三个数直接连乘起来。',
        analysis: '长方体体积 = 长 × 宽 × 高 = 5 × 4 × 3 = 60（立方分米）。',
        difficulty: 3
      },
      {
        id: 'g5-math-l5-03',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 5,
        point: '长方体表面积',
        type: 'single',
        stem: '一个长方体长6厘米、宽4厘米、高2厘米，它的表面积是（　）平方厘米。',
        options: [
          { key: 'A', text: '44' },
          { key: 'B', text: '48' },
          { key: 'C', text: '96' },
          { key: 'D', text: '88' }
        ],
        answer: 'D',
        hint: '表面积＝（长×宽＋长×高＋宽×高）×2，三组面各算一次别忘了乘2。',
        analysis: '表面积 = （6 × 4 + 6 × 2 + 4 × 2）× 2 = （24 + 12 + 8）× 2 = 88（平方厘米）。',
        difficulty: 3
      },
      {
        id: 'g5-math-l5-04',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 5,
        point: '体积单位进率',
        type: 'judge',
        stem: '1 立方米 = 100 立方分米。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '回忆相邻两个体积单位之间的进率是多少，再回来核对这句话。',
        analysis: '相邻两个体积单位之间的进率是1000，1立方米 = 1000立方分米，所以题中说法错误。',
        difficulty: 3
      },
      {
        id: 'g5-math-l5-05',
        grade: 5,
        subject: 'math',
        packId: 'math-g5',
        level: 5,
        point: '容积与体积',
        type: 'judge',
        stem: '一个容器的容积是4升，它的体积也一定是4立方分米。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想容积是从容器里面量还是外面量，容器壁有没有厚度。',
        analysis: '容积是从容器里面量的，容器壁有厚度，体积从外面量会更大，所以容积4升时体积大于4立方分米。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);