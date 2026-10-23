/* 知闯岛 · 内置题库：五年级科学 */
(function (ZCD) {
  'use strict';

  ZCD.registerPack({
    pack: {
      id: 'science-g5',
      name: '科学探秘号',
      grade: 5,
      subject: 'science',
      intro: '从光和热到地球运动，再看食物链、健康与沉浮，用观察和推理揭开身边的科学。',
      difficulty: 2,
      levelNames: ['关卡1 · 光影实验室', '关卡2 · 冷热观察站', '关卡3 · 地球运动台', '关卡4 · 生态健康营', '关卡5 · 沉浮机械厂']
    },
    questions: [
      /* ---------- 关卡 1 · 光影实验室 ---------- */
      {
        id: 'g5-science-l1-01',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 1,
        point: '光源的判断',
        type: 'single',
        stem: '下面哪种物体属于光源？',
        options: [
          { key: 'A', text: '点燃的蜡烛' },
          { key: 'B', text: '月亮' },
          { key: 'C', text: '镜子' },
          { key: 'D', text: '白纸' }
        ],
        answer: 'A',
        hint: '判断光源要看它能不能自己发光，只反光的物体不算。',
        analysis: '自身能发光的物体叫光源。蜡烛燃烧时自己发光；月亮、镜子和白纸只是反射其他物体的光。',
        difficulty: 1
      },
      {
        id: 'g5-science-l1-02',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 1,
        point: '光沿直线传播',
        type: 'judge',
        stem: '光在同一种均匀物质中是沿直线传播的，所以我们能看到物体挡住光后形成的影子。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想一想影子是怎么形成的，光被挡住说明它是怎么走过来的。',
        analysis: '光沿直线传播，遇到不透明的物体被挡住，物体后面就出现影子，这是光直线传播的证据。',
        difficulty: 1
      },
      {
        id: 'g5-science-l1-03',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 1,
        point: '小孔成像特点',
        type: 'single',
        stem: '用带小孔的纸板对着点燃的蜡烛，在纸板后面的光屏上会看到什么？',
        options: [
          { key: 'A', text: '一个放大的正立蜡烛像' },
          { key: 'B', text: '一个倒立的蜡烛像' },
          { key: 'C', text: '一个和蜡烛一样大的正立像' },
          { key: 'D', text: '光屏上什么也看不到' }
        ],
        answer: 'B',
        hint: '光沿直线传播，蜡烛上下各部分的光穿过小孔后落到哪个位置，像的样子就清楚了。',
        analysis: '小孔成像的原理是光沿直线传播，光屏上得到的是倒立的像，像的大小与纸板和光屏的距离有关。',
        difficulty: 1
      },
      {
        id: 'g5-science-l1-04',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 1,
        point: '光的反射应用',
        type: 'single',
        stem: '潜望镜能让人躲在海面下看到海面上的情况，它主要利用了光的什么性质？',
        options: [
          { key: 'A', text: '光的直线传播' },
          { key: 'B', text: '光的折射' },
          { key: 'C', text: '光的反射' },
          { key: 'D', text: '光的吸收' }
        ],
        answer: 'C',
        hint: '想想潜望镜里装的是什么镜子，光碰到它以后方向会怎样改变。',
        analysis: '潜望镜里装有两面互相平行的平面镜，光线经过两次反射后进入眼睛，利用的是光的反射。',
        difficulty: 1
      },
      {
        id: 'g5-science-l1-05',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 1,
        point: '光的传播',
        type: 'judge',
        stem: '光在水中不能传播，所以水里的鱼看不到岸上的物体。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想想光能不能在水和玻璃这样的透明物质里传播，速度有什么不同。',
        analysis: '光能在水、玻璃等透明物质中传播，只是速度比在空气中慢，所以水中的鱼能看到岸上的物体。',
        difficulty: 1
      },

      /* ---------- 关卡 2 · 冷热观察站 ---------- */
      {
        id: 'g5-science-l2-01',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 2,
        point: '热的良导体',
        type: 'single',
        stem: '下面哪种材料是热的良导体？',
        options: [
          { key: 'A', text: '木头' },
          { key: 'B', text: '塑料' },
          { key: 'C', text: '空气' },
          { key: 'D', text: '铜' }
        ],
        answer: 'D',
        hint: '比较几种材料传热的快慢，金属一类的材料传热是快还是慢。',
        analysis: '铜、铁、铝等金属传热快，是热的良导体；木头、塑料和空气传热慢，是热的不良导体。',
        difficulty: 1
      },
      {
        id: 'g5-science-l2-02',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 2,
        point: '热传导方向',
        type: 'judge',
        stem: '热总是从温度高的物体传向温度低的物体，直到两部分温度相同为止。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '只要两部分温度不一样，热会往哪边跑，跑到什么时候才停。',
        analysis: '只要存在温度差，热就会从高温部分传到低温部分，直到温度相同，这是热传导的基本规律。',
        difficulty: 1
      },
      {
        id: 'g5-science-l2-03',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 2,
        point: '热胀冷缩',
        type: 'single',
        stem: '把插有细玻璃管的烧瓶放进热水中，管里的水位会上升，这是因为？',
        options: [
          { key: 'A', text: '水变多了' },
          { key: 'B', text: '玻璃管变粗了' },
          { key: 'C', text: '水受热后体积膨胀' },
          { key: 'D', text: '水受热后变重了' }
        ],
        answer: 'C',
        hint: '想一想瓶子里的液体遇热以后会不会胀大，细管中的水位为什么会上移。',
        analysis: '水受热后体积膨胀，也就是热胀冷缩，所以细玻璃管中的水位会明显上升。',
        difficulty: 1
      },
      {
        id: 'g5-science-l2-04',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 2,
        point: '温度计的使用',
        type: 'judge',
        stem: '实验用的液体温度计读数时不能把它从被测液体中拿出来。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想一想液体温度计靠什么工作，离开被测液体后示数会不会变。',
        analysis: '实验用的液体温度计利用液体热胀冷缩工作，读数时离开被测液体，示数就会随环境温度变化，所以要留在液体中读；体温计可以离开人体读数，是特殊设计。',
        difficulty: 1
      },
      {
        id: 'g5-science-l2-05',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 2,
        point: '保温与散热',
        type: 'single',
        stem: '冬天穿羽绒服觉得暖和，主要原因是？',
        options: [
          { key: 'A', text: '羽绒服里的空气是热的不良导体，能减少热量散失' },
          { key: 'B', text: '羽绒服会自己产生热量' },
          { key: 'C', text: '羽绒服能把冷空气吸走' },
          { key: 'D', text: '羽绒服是热的良导体' }
        ],
        answer: 'A',
        hint: '想想羽绒蓬松的结构里藏着什么，它传热的本领是强还是弱。',
        analysis: '羽绒蓬松，里面藏着大量空气，空气是热的不良导体，能减慢身体热量散失，起到保温作用。',
        difficulty: 1
      },

      /* ---------- 关卡 3 · 地球运动台 ---------- */
      {
        id: 'g5-science-l3-01',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 3,
        point: '昼夜交替',
        type: 'single',
        stem: '地球上昼夜交替的现象是由什么造成的？',
        options: [
          { key: 'A', text: '太阳绕着地球转' },
          { key: 'B', text: '地球围绕太阳公转' },
          { key: 'C', text: '月亮的遮挡' },
          { key: 'D', text: '地球自转' }
        ],
        answer: 'D',
        hint: '分清地球的两种运动，一天转一圈的是哪一种。',
        analysis: '地球自西向东自转，一天转一圈，向着太阳的一面是白天，背着太阳的一面是黑夜，形成昼夜交替。',
        difficulty: 2
      },
      {
        id: 'g5-science-l3-02',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 3,
        point: '地球公转',
        type: 'judge',
        stem: '地球围绕太阳公转一周大约需要一年，加上地轴倾斜且倾斜方向不变，就产生了四季变化。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想想一年里各地得到太阳光热的多少为什么会变，和地球的运动有什么关系。',
        analysis: '地球公转一周约一年，地轴倾斜且方向不变，各地获得太阳光热的多少随之变化，形成四季。',
        difficulty: 2
      },
      {
        id: 'g5-science-l3-03',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 3,
        point: '地轴倾斜',
        type: 'single',
        stem: '地球在公转过程中，地轴始终是？',
        options: [
          { key: 'A', text: '倾斜的，倾斜方向保持不变' },
          { key: 'B', text: '垂直的' },
          { key: 'C', text: '倾斜的，方向不断改变' },
          { key: 'D', text: '水平躺着的' }
        ],
        answer: 'A',
        hint: '回忆地球公转时的姿态，地轴的角度和朝向会不会随着转动改变。',
        analysis: '地轴与公转轨道面约成 66.5 度夹角，而且倾斜方向保持不变，这是四季形成的重要原因。',
        difficulty: 2
      },
      {
        id: 'g5-science-l3-04',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 3,
        point: '时区与时间差',
        type: 'single',
        stem: '北京是中午 12 点的时候，纽约大约是半夜，这是因为？',
        options: [
          { key: 'A', text: '北京离太阳更近' },
          { key: 'B', text: '纽约的白天比北京短' },
          { key: 'C', text: '地球自转使不同经度的地方时间不同' },
          { key: 'D', text: '纽约的钟表走得慢' }
        ],
        answer: 'C',
        hint: '想想同一时刻太阳先照到东边还是西边，两地时间为什么会不一样。',
        analysis: '地球自转使东边的地方比西边先看到日出，不同经度的时刻不同，所以两地时间相差很大。',
        difficulty: 2
      },
      {
        id: 'g5-science-l3-05',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 3,
        point: '昼夜长短变化',
        type: 'judge',
        stem: '在地球上任何地方，一年中白天和黑夜都正好各是十二小时。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想想地轴是倾斜的，两极会不会出现太阳整天不落或整天不升的日子。',
        analysis: '只有赤道附近昼夜长短变化很小。地轴倾斜使两极出现极昼极夜，其他地方昼夜长短也会变化。',
        difficulty: 2
      },

      /* ---------- 关卡 4 · 生态健康营 ---------- */
      {
        id: 'g5-science-l4-01',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 4,
        point: '食物链的组成',
        type: 'single',
        stem: '下面哪条食物链的写法是正确的？',
        options: [
          { key: 'A', text: '阳光→草→兔子→鹰' },
          { key: 'B', text: '鹰→兔子→草' },
          { key: 'C', text: '草→兔子→鹰→细菌' },
          { key: 'D', text: '草→兔子→鹰' }
        ],
        answer: 'D',
        hint: '食物链要从绿色植物开始，箭头指向吃它的动物，想想阳光和细菌该不该写进去。',
        analysis: '食物链从绿色植物这类生产者开始，箭头指向吃它的动物，一般到最高级消费者结束，不含阳光和细菌。',
        difficulty: 2
      },
      {
        id: 'g5-science-l4-02',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 4,
        point: '食物网与生态平衡',
        type: 'judge',
        stem: '同一片草原上的多条食物链相互交错形成食物网，其中一种生物大量减少会影响其他生物。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想想草原上各种生物之间的食物关系，是连成一条线还是交织成网。',
        analysis: '食物网中各种生物通过食物关系相互联系，某种生物数量剧烈变化会影响整个生态系统的平衡。',
        difficulty: 2
      },
      {
        id: 'g5-science-l4-03',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 4,
        point: '生态瓶与保护生态',
        type: 'single',
        stem: '在生态瓶里放入适量水草、小鱼和泥沙，放在有光的地方，瓶中的生物能生活较长时间。这说明？',
        options: [
          { key: 'A', text: '生态瓶里不需要水草' },
          { key: 'B', text: '生物可以脱离环境生存' },
          { key: 'C', text: '生物与环境相互依存，保持生态平衡很重要' },
          { key: 'D', text: '只要密封好，瓶里的生物永远不会死' }
        ],
        answer: 'C',
        hint: '看看瓶里水草、小鱼和泥沙各起什么作用，它们能不能离开彼此单独活着。',
        analysis: '水草制造氧气和养料，小鱼消耗氧气，微生物分解废物，说明生物与环境相互依存，要注意保护生态平衡。',
        difficulty: 2
      },
      {
        id: 'g5-science-l4-04',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 4,
        point: '脑与神经',
        type: 'judge',
        stem: '人体的所有活动都由大脑直接控制，不需要神经来传递信息。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想想脑发出的指令要经过什么才能传到身体各处。',
        analysis: '脑和脊髓是神经系统的中枢部分，它们通过遍布全身的神经传递信息，才能指挥身体的各种活动。',
        difficulty: 2
      },
      {
        id: 'g5-science-l4-05',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 4,
        point: '青春期与运动',
        type: 'single',
        stem: '关于青春期的健康和体育锻炼，下面说法正确的是？',
        options: [
          { key: 'A', text: '青春期身高不再变化，可以不参加锻炼' },
          { key: 'B', text: '经常锻炼会使心脏功能变弱' },
          { key: 'C', text: '运动后心跳加快，说明身体出了问题' },
          { key: 'D', text: '坚持锻炼能让心脏更强健，运动后心跳恢复得更快' }
        ],
        answer: 'D',
        hint: '想想经常锻炼会让心肌和心脏功能变强还是变弱，锻炼多的人停下来以后心率回落得快还是慢。',
        analysis: '经常锻炼可使心肌发达、心脏功能增强，运动后心率恢复更快。青春期生长快，更需要运动、营养和休息。',
        difficulty: 2
      },

      /* ---------- 关卡 5 · 沉浮机械厂 ---------- */
      {
        id: 'g5-science-l5-01',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 5,
        point: '物体沉浮条件',
        type: 'single',
        stem: '同样大小的土豆放入水中会沉到水底，泡沫块却浮在水面，这是因为？',
        options: [
          { key: 'A', text: '泡沫块比土豆轻，所以不受重力' },
          { key: 'B', text: '泡沫块受到的浮力等于它的重力，土豆受到的浮力小于它的重力' },
          { key: 'C', text: '水对泡沫块没有浮力' },
          { key: 'D', text: '土豆在水中不受浮力' }
        ],
        answer: 'B',
        hint: '想想浸在水里的物体受到哪两个力，把这两个力的大小比一比就能判断沉浮。',
        analysis: '浸在水中的物体都受到浮力。上浮时浮力大于重力，下沉时浮力小于重力；泡沫块漂浮在水面上，浮力正好等于它的重力。',
        difficulty: 3
      },
      {
        id: 'g5-science-l5-02',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 5,
        point: '浮力与排开的水',
        type: 'judge',
        stem: '物体在水中排开的水越多，受到的浮力越大；物体完全浸没后，浮力不再随浸入深度的增加而变大。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '浮力大小跟排开液体的多少有关，物体完全浸没以后排开的水还会不会增加。',
        analysis: '浮力大小与液体密度和排开液体的体积有关。物体完全浸没后排开水的体积不再增大，浮力也就保持不变。',
        difficulty: 3
      },
      {
        id: 'g5-science-l5-03',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 5,
        point: '改变沉浮的方法',
        type: 'single',
        stem: '把橡皮泥捏成实心球会沉入水底，把它捏成小船就能浮在水面，主要原因是？',
        options: [
          { key: 'A', text: '橡皮泥变轻了' },
          { key: 'B', text: '水的浮力消失了' },
          { key: 'C', text: '船形橡皮泥不受重力' },
          { key: 'D', text: '船形排开的水更多，受到的浮力更大' }
        ],
        answer: 'D',
        hint: '同样的橡皮泥捏成不同形状，它挤占的水会不会变多，浮力又跟着怎么变。',
        analysis: '橡皮泥捏成船形后排开水的体积明显变大，受到的浮力增大，当浮力等于重力时就能漂浮在水面上。',
        difficulty: 3
      },
      {
        id: 'g5-science-l5-04',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 5,
        point: '斜面的作用',
        type: 'single',
        stem: '用长木板搭成斜面把箱子推上车，比直接搬上去省力，这是因为斜面？',
        options: [
          { key: 'A', text: '能减小箱子的重力' },
          { key: 'B', text: '能消除摩擦力' },
          { key: 'C', text: '是简单机械，坡度越小越省力' },
          { key: 'D', text: '能增加箱子的重量' }
        ],
        answer: 'C',
        hint: '想想斜面这种装置能帮我们做什么，坡度变了用的力气会怎么变。',
        analysis: '斜面是一种简单机械，沿斜面推物体比竖直提起省力，坡度越小越省力，但移动的距离会更长。',
        difficulty: 3
      },
      {
        id: 'g5-science-l5-05',
        grade: 5,
        subject: 'science',
        packId: 'science-g5',
        level: 5,
        point: '杠杆与支点',
        type: 'single',
        stem: '用撬棒撬石头时，在撬棒下面垫一块小石头，这样做的道理是？',
        options: [
          { key: 'A', text: '增大了石头的重力' },
          { key: 'B', text: '减小了石头的重量' },
          { key: 'C', text: '使撬棒变得更短' },
          { key: 'D', text: '形成杠杆，支点越靠近石头越省力' }
        ],
        answer: 'D',
        hint: '垫在下面的石头起了什么作用，它离重物远近对用力有什么影响。',
        analysis: '垫在下面的小石头相当于杠杆的支点。支点离重物越近、手离支点越远，撬动石头时就越省力。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);