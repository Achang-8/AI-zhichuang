/* 知闯岛 · 内置题库：六年级科学 */
(function (ZCD) {
  'use strict';

  ZCD.registerPack({
    pack: {
      id: 'science-g6',
      name: '科学探索号',
      grade: 6,
      subject: 'science',
      intro: '能量、简单机械、电磁铁、物质变化、遗传变异、生态系统、人体系统与宇宙微观世界。',
      difficulty: 3,
      levelNames: ['关卡1 · 能量工坊', '关卡2 · 机械营地', '关卡3 · 电磁与变化', '关卡4 · 生命空间', '关卡5 · 宇宙微观']
    },
    questions: [
      {
        id: 'g6-science-l1-01',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 1,
        point: '能量的转化',
        type: 'single',
        stem: '太阳灶用凹面镜把阳光会聚起来加热食物，这个过程中能量是怎样转化的？',
        options: [
          { key: 'A', text: '光能转化为热能' },
          { key: 'B', text: '热能转化为光能' },
          { key: 'C', text: '电能转化为光能' },
          { key: 'D', text: '化学能转化为电能' }
        ],
        answer: 'A',
        hint: '想想会聚起来的是什么，食物变热又靠什么能量。',
        analysis: '太阳灶会聚太阳光，把光能转化为热能，用来加热食物，这是能量形式发生转化的例子。',
        difficulty: 1
      },
      {
        id: 'g6-science-l1-02',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 1,
        point: '动能与势能',
        type: 'single',
        stem: '把小球竖直向上抛出，小球在上升过程中，能量的转化是？',
        options: [
          { key: 'A', text: '重力势能转化为动能' },
          { key: 'B', text: '动能转化为重力势能' },
          { key: 'C', text: '电能转化为动能' },
          { key: 'D', text: '化学能转化为重力势能' }
        ],
        answer: 'B',
        hint: '上升时高度和速度各怎么变，再看哪种能量在减少、哪种在增加。',
        analysis: '小球上升时高度增大、速度减小，动能减小，重力势能增大，动能转化成了重力势能。',
        difficulty: 1
      },
      {
        id: 'g6-science-l1-03',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 1,
        point: '能量守恒',
        type: 'judge',
        stem: '能量既不会凭空产生，也不会凭空消失，只会从一种形式转化为另一种形式，或从一个物体转移到另一个物体。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '从能量在转化和转移中总量是否改变这个角度去检查。',
        analysis: '这是能量守恒定律的内容，能量在转化或转移的过程中总量保持不变，这是自然界的基本规律。',
        difficulty: 1
      },
      {
        id: 'g6-science-l1-04',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 1,
        point: '动能大小',
        type: 'judge',
        stem: '物体的质量不变时，运动的速度越快，它具有的动能越小。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想动能的大小和哪些因素有关，再逐项检查句中的说法。',
        analysis: '动能的大小与质量和速度有关，质量相同时速度越大动能越大，所以这句话的说法是错误的。',
        difficulty: 1
      },
      {
        id: 'g6-science-l1-05',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 1,
        point: '电能转化',
        type: 'single',
        stem: '下列用电器工作时，主要把电能转化为机械能的是？',
        options: [
          { key: 'A', text: '电饭锅' },
          { key: 'B', text: '电灯' },
          { key: 'C', text: '电风扇' },
          { key: 'D', text: '电视机' }
        ],
        answer: 'C',
        hint: '想哪种用电器工作时会转起来、动起来，那就是机械能。',
        analysis: '电风扇里的电动机转动，主要把电能转化为机械能；电饭锅主要转化为热能，电灯主要转化为光能。',
        difficulty: 1
      },
      {
        id: 'g6-science-l2-01',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 2,
        point: '杠杆的分类',
        type: 'single',
        stem: '使用杠杆时，如果动力臂大于阻力臂，这个杠杆属于？',
        options: [
          { key: 'A', text: '省力杠杆' },
          { key: 'B', text: '费力杠杆' },
          { key: 'C', text: '等臂杠杆' },
          { key: 'D', text: '不能确定' }
        ],
        answer: 'A',
        hint: '比较动力臂和阻力臂的长短，再看用力是省还是费。',
        analysis: '动力臂大于阻力臂时，动力小于阻力，属于省力杠杆，使用时会多移动一段距离。',
        difficulty: 1
      },
      {
        id: 'g6-science-l2-02',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 2,
        point: '费力杠杆',
        type: 'single',
        stem: '下列工具中，正常使用时属于费力杠杆的是？',
        options: [
          { key: 'A', text: '用羊角锤拔钉子' },
          { key: 'B', text: '用开瓶器开瓶盖' },
          { key: 'C', text: '用镊子夹取物品' },
          { key: 'D', text: '用钢丝钳剪铁丝' }
        ],
        answer: 'C',
        hint: '逐个比较工具使用时动力臂和阻力臂的长短，判断哪种更费力。',
        analysis: '镊子的动力臂小于阻力臂，使用时费力但能省距离；羊角锤、开瓶器和钢丝钳都是省力杠杆。',
        difficulty: 1
      },
      {
        id: 'g6-science-l2-03',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 2,
        point: '定滑轮特点',
        type: 'judge',
        stem: '定滑轮不能省力，但可以改变用力的方向。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '从滑轮的轴固定不固定、它相当于哪种杠杆来想它的作用。',
        analysis: '定滑轮的实质是等臂杠杆，不省力也不费力，但能改变用力的方向，让工作更方便。',
        difficulty: 1
      },
      {
        id: 'g6-science-l2-04',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 2,
        point: '斜面省力',
        type: 'judge',
        stem: '使用斜面把物体推到高处，一定比直接提起物体更费力。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想沿斜面推物体时坡度和用力大小的关系，再看句中的说法。',
        analysis: '斜面是省力机械，把同一物体送到同样高度时，斜面越平缓越省力，但要移动更长的距离。',
        difficulty: 1
      },
      {
        id: 'g6-science-l2-05',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 2,
        point: '斜面越平缓越省力',
        type: 'single',
        stem: '把同一重物沿不同长度的斜面拉到同一高度，下列说法正确的是？',
        options: [
          { key: 'A', text: '斜面越短越省力' },
          { key: 'B', text: '斜面越长越费力' },
          { key: 'C', text: '用力大小与斜面长短无关' },
          { key: 'D', text: '斜面越长、坡度越平缓越省力' }
        ],
        answer: 'D',
        hint: '同样高度下，比一比坡的陡缓与用力大小的关系。',
        analysis: '沿斜面拉物体时，斜面越长、坡度越平缓，需要的力越小，但物体移动的距离会更长。',
        difficulty: 1
      },
      {
        id: 'g6-science-l3-01',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 3,
        point: '电磁铁特点',
        type: 'single',
        stem: '关于电磁铁，下列说法正确的是？',
        options: [
          { key: 'A', text: '电磁铁断电以后仍能保持很强的磁性' },
          { key: 'B', text: '电磁铁通电时有磁性，断电磁性消失' },
          { key: 'C', text: '电磁铁的磁力大小与电流大小无关' },
          { key: 'D', text: '电磁铁的铁芯可以用塑料棒代替' }
        ],
        answer: 'B',
        hint: '想它的本领靠什么维持，电流停掉以后又会怎样。',
        analysis: '电磁铁通电时产生磁性，断电时磁性消失，所以人们能方便地控制它磁性的有无。',
        difficulty: 2
      },
      {
        id: 'g6-science-l3-02',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 3,
        point: '影响磁力因素',
        type: 'single',
        stem: '要增大电磁铁的磁力，下列做法可行的是？',
        options: [
          { key: 'A', text: '减少线圈的匝数' },
          { key: 'B', text: '减小通过线圈的电流' },
          { key: 'C', text: '增加线圈匝数并增大电流' },
          { key: 'D', text: '把铁芯换成塑料棒' }
        ],
        answer: 'C',
        hint: '回忆影响它强弱的因素有哪些，再想让哪些量变大。',
        analysis: '电磁铁的磁力大小与线圈匝数和电流大小有关，匝数越多、电流越大，磁力就越强。',
        difficulty: 2
      },
      {
        id: 'g6-science-l3-03',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 3,
        point: '化学变化',
        type: 'judge',
        stem: '铁生锈的过程中产生了新物质，属于化学变化。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '判断是不是化学变化，关键看有没有新物质生成。',
        analysis: '铁生锈时生成了铁锈，铁锈和铁的性质不同，有新物质产生，所以属于化学变化。',
        difficulty: 2
      },
      {
        id: 'g6-science-l3-04',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 3,
        point: '物理变化',
        type: 'judge',
        stem: '水结成冰和纸被撕碎都产生了新物质，属于化学变化。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '逐个看变化前后物质本身有没有改变，再下结论。',
        analysis: '水结冰只是状态改变，纸被撕碎只是形状改变，都没有产生新物质，属于物理变化。',
        difficulty: 2
      },
      {
        id: 'g6-science-l3-05',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 3,
        point: '燃烧的条件',
        type: 'single',
        stem: '关于燃烧需要满足的条件，下列说法正确的是？',
        options: [
          { key: 'A', text: '只要有可燃物和氧气就能燃烧' },
          { key: 'B', text: '只要温度达到着火点就能燃烧' },
          { key: 'C', text: '可燃物、氧气、温度三个条件中具备一个即可' },
          { key: 'D', text: '有可燃物、有氧气，并且温度达到着火点' }
        ],
        answer: 'D',
        hint: '燃烧要同时满足哪几个条件，缺一个还能不能烧起来。',
        analysis: '燃烧必须同时满足三个条件：有可燃物、有氧气或空气、温度达到着火点，缺少一个都不能燃烧。',
        difficulty: 2
      },
      {
        id: 'g6-science-l4-01',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 4,
        point: '遗传现象',
        type: 'single',
        stem: '“种瓜得瓜，种豆得豆”这句话说明生物具有什么现象？',
        options: [
          { key: 'A', text: '遗传现象' },
          { key: 'B', text: '变异现象' },
          { key: 'C', text: '进化现象' },
          { key: 'D', text: '适应现象' }
        ],
        answer: 'A',
        hint: '从亲代和子代长得像这一点出发，想想这属于什么现象。',
        analysis: '亲代与子代之间性状相似叫作遗传，种下的瓜长出瓜，正说明生物具有遗传现象。',
        difficulty: 2
      },
      {
        id: 'g6-science-l4-02',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 4,
        point: '变异现象',
        type: 'single',
        stem: '“一母生九子，连母十个样”主要说明生物具有什么现象？',
        options: [
          { key: 'A', text: '遗传现象' },
          { key: 'B', text: '变异现象' },
          { key: 'C', text: '生殖现象' },
          { key: 'D', text: '生长现象' }
        ],
        answer: 'B',
        hint: '抓住句子里各不相同的地方，想想子代之间为什么会有差别。',
        analysis: '子代之间以及子代与亲代之间存在的差异叫作变异，这句话说的正是生物的变异现象。',
        difficulty: 2
      },
      {
        id: 'g6-science-l4-03',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 4,
        point: '食物链组成',
        type: 'judge',
        stem: '一条完整的食物链通常从绿色植物开始，能量沿着食物链逐级传递并逐级减少。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想一想这条链的起点是哪类生物，能量传递时会不会变少。',
        analysis: '绿色植物能进行光合作用制造养料，是食物链的起点，能量在传递过程中会逐级减少。',
        difficulty: 2
      },
      {
        id: 'g6-science-l4-04',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 4,
        point: '保护生物多样性',
        type: 'judge',
        stem: '保护生物多样性只需要保护珍稀动物，不必保护它们生活的环境。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想生物离不开什么，只保护动物本身够不够。',
        analysis: '保护生物多样性最重要的是保护生物的栖息地，只有环境得到保护，各种生物才能长久生存。',
        difficulty: 2
      },
      {
        id: 'g6-science-l4-05',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 4,
        point: '消化与吸收',
        type: 'single',
        stem: '人体消化食物和吸收营养物质的主要器官是？',
        options: [
          { key: 'A', text: '口腔' },
          { key: 'B', text: '胃' },
          { key: 'C', text: '食道' },
          { key: 'D', text: '小肠' }
        ],
        answer: 'D',
        hint: '想想哪个器官又长又有许多绒毛，最利于吸收养分。',
        analysis: '小肠很长，内表面有许多皱襞和小肠绒毛，是人体消化食物和吸收营养物质的主要器官。',
        difficulty: 2
      },
      {
        id: 'g6-science-l5-01',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 5,
        point: '太阳系行星',
        type: 'single',
        stem: '在太阳系中，按离太阳由近到远的顺序排列，地球是第几颗行星？',
        options: [
          { key: 'A', text: '第三颗' },
          { key: 'B', text: '第二颗' },
          { key: 'C', text: '第四颗' },
          { key: 'D', text: '第五颗' }
        ],
        answer: 'A',
        hint: '按离太阳由近到远把八大行星排一排，再数地球的位置。',
        analysis: '太阳系八大行星由近到远依次是水星、金星、地球、火星、木星、土星、天王星和海王星。',
        difficulty: 3
      },
      {
        id: 'g6-science-l5-02',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 5,
        point: '月相变化',
        type: 'single',
        stem: '我们看到的月相总是不断变化，关于月相变化，下列说法正确的是？',
        options: [
          { key: 'A', text: '月相变化的周期约为一年' },
          { key: 'B', text: '月相变化是月球绕地球公转形成的，周期约为一个月' },
          { key: 'C', text: '月相变化是地球绕太阳公转形成的' },
          { key: 'D', text: '每天看到的月相都完全相同' }
        ],
        answer: 'B',
        hint: '想一想我们看到的那部分亮面是怎么来的，多久会重复一次。',
        analysis: '月球本身不发光，我们看到的是它被太阳照亮的部分；月球绕地球公转，月相变化周期约为一个月。',
        difficulty: 3
      },
      {
        id: 'g6-science-l5-03',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 5,
        point: '显微镜使用',
        type: 'single',
        stem: '用显微镜观察标本时，下列做法正确的是？',
        options: [
          { key: 'A', text: '用一只眼睛观察，另一只眼睛随便看别处' },
          { key: 'B', text: '转动粗准焦螺旋使镜筒下降时，眼睛一直看着目镜' },
          { key: 'C', text: '先用低倍镜找到物像，再换用高倍镜观察' },
          { key: 'D', text: '把镜筒降到最低处，再把玻片放到载物台上' }
        ],
        answer: 'C',
        hint: '想一想该先用哪种放大倍数的物镜，镜筒下降时视线该放在哪里。',
        analysis: '观察时先用低倍镜找到物像，再换高倍镜；镜筒下降时眼睛要从侧面看着物镜，防止压碎玻片。',
        difficulty: 3
      },
      {
        id: 'g6-science-l5-04',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 5,
        point: '银河系组成',
        type: 'judge',
        stem: '银河系是由大量恒星、行星、气体和尘埃组成的天体系统，太阳只是银河系中一颗普通的恒星。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '从它的组成和恒星在其中的地位去检查这段话。',
        analysis: '银河系包含上千亿颗恒星，太阳是其中普通的一员，地球等行星围绕太阳公转。',
        difficulty: 3
      },
      {
        id: 'g6-science-l5-05',
        grade: 6,
        subject: 'science',
        packId: 'science-g6',
        level: 5,
        point: '人体系统协调',
        type: 'single',
        stem: '关于人体各个系统，下列说法正确的是？',
        options: [
          { key: 'A', text: '人体吸入的氧气主要由消化系统运输到全身' },
          { key: 'B', text: '食物中的营养物质主要在大肠被吸收' },
          { key: 'C', text: '呼吸和心跳与神经系统没有任何关系' },
          { key: 'D', text: '心脏像水泵一样推动血液在血管中循环流动' }
        ],
        answer: 'D',
        hint: '想身体里哪个器官不停地搏动，把养分和氧气送到全身各处。',
        analysis: '心脏是血液循环的动力器官，推动血液在血管中流动，把氧气和营养物质运送到全身各处。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);