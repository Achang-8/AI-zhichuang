/* 知闯岛 · 内置题库：四年级科学 */
(function (ZCD) {
  'use strict';
  ZCD.registerPack({
    pack: {
      id: 'science-g4',
      name: '科学探秘号',
      grade: 4,
      subject: 'science',
      intro: '从声音和光到简单电路，从身体奥秘到岩石云雨，动手观察、动脑思考，做个小小科学家。',
      difficulty: 2,
      levelNames: ['关卡1 · 声音工坊', '关卡2 · 光影迷宫', '关卡3 · 电路实验室', '关卡4 · 身体探秘', '关卡5 · 自然密码']
    },
    questions: [
      /* ---------- 关卡 1 · 声音工坊 ---------- */
      {
        id: 'g4-science-l1-01',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 1,
        point: '声音的产生',
        type: 'single',
        stem: '物体发出声音的时候，它一定在发生什么变化？',
        options: [
          { key: 'A', text: '发光' },
          { key: 'B', text: '发热' },
          { key: 'C', text: '变冷' },
          { key: 'D', text: '振动' }
        ],
        answer: 'D',
        hint: '用手摸一摸正在发声的鼓面或者音叉，感受它是不是在来回动着。',
        analysis: '声音是由物体振动产生的，振动停止，发声也就停止；发光、发热、变冷与物体是否发声没有必然联系。',
        difficulty: 1
      },
      {
        id: 'g4-science-l1-02',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 1,
        point: '声音的传播',
        type: 'single',
        stem: '声音在下面哪种环境中不能传播？',
        options: [
          { key: 'A', text: '空气中' },
          { key: 'B', text: '真空中' },
          { key: 'C', text: '水中' },
          { key: 'D', text: '木头中' }
        ],
        answer: 'B',
        hint: '传声需要介质，先想一想哪种环境里什么物质都没有。',
        analysis: '声音的传播需要介质，气体、液体和固体都能传声；真空里没有任何介质，所以声音不能在真空中传播。',
        difficulty: 1
      },
      {
        id: 'g4-science-l1-03',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 1,
        point: '声音与振动',
        type: 'judge',
        stem: '"只要物体在振动，我们就一定能听到声音。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '除了物体在动，还要想声音靠什么传到耳朵，人耳能听到的范围有没有限制。',
        analysis: '物体振动可以产生声音，但声音要靠介质传到耳朵，而且人耳能听到的声音有一定频率范围，所以不一定能听到。',
        difficulty: 1
      },
      {
        id: 'g4-science-l1-04',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 1,
        point: '声音的强弱',
        type: 'single',
        stem: '用更大的力气敲鼓，鼓声会发生什么变化？',
        options: [
          { key: 'A', text: '音调变高' },
          { key: 'B', text: '音调变低' },
          { key: 'C', text: '音量变大' },
          { key: 'D', text: '音量变小' }
        ],
        answer: 'C',
        hint: '用力大小改变的是鼓面振动的幅度，想一想幅度对应声音的哪个特点。',
        analysis: '用力越大，鼓面振动的幅度越大，声音的响度也就是音量就越大；音调由振动的快慢决定，与用力大小无关。',
        difficulty: 1
      },
      {
        id: 'g4-science-l1-05',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 1,
        point: '音调与振动',
        type: 'single',
        stem: '把钢尺一端压在桌边，伸出的部分越长，用同样大的力拨动它，声音会怎样变化？',
        options: [
          { key: 'A', text: '音调变低' },
          { key: 'B', text: '音调变高' },
          { key: 'C', text: '音量变大' },
          { key: 'D', text: '没有变化' }
        ],
        answer: 'A',
        hint: '伸出部分越长振动是变快还是变慢，振动快慢又决定声音的哪个特点。',
        analysis: '钢尺伸出桌边越长，振动越慢，频率越低，音调就越低；伸出的部分越短，振动越快，音调越高。',
        difficulty: 1
      },

      /* ---------- 关卡 2 · 光影迷宫 ---------- */
      {
        id: 'g4-science-l2-01',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 2,
        point: '光的传播',
        type: 'single',
        stem: '光在同一种均匀物质中是怎样传播的？',
        options: [
          { key: 'A', text: '沿曲线传播' },
          { key: 'B', text: '方向不断改变' },
          { key: 'C', text: '沿直线传播' },
          { key: 'D', text: '只在水中传播' }
        ],
        answer: 'C',
        hint: '回忆小孔成像和影子的形成，它们都说明光走的是什么样的路线。',
        analysis: '光在同一种均匀物质中是沿直线传播的，小孔成像和影子的形成都说明光沿直线传播。',
        difficulty: 1
      },
      {
        id: 'g4-science-l2-02',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 2,
        point: '影子的形成',
        type: 'judge',
        stem: '"光被不透明的物体挡住，会在物体后面形成影子。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想一想要形成影子，必须有光、有挡光的物体，还要满足什么条件。',
        analysis: '光沿直线传播，遇到不透明物体时被挡住，物体后面光照射不到的区域就形成影子，所以说法正确。',
        difficulty: 1
      },
      {
        id: 'g4-science-l2-03',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 2,
        point: '光的反射',
        type: 'single',
        stem: '我们能从镜子里看到自己的脸，主要是因为光在镜面上发生了什么？',
        options: [
          { key: 'A', text: '被镜子吸收了' },
          { key: 'B', text: '自己拐弯了' },
          { key: 'C', text: '消失了' },
          { key: 'D', text: '发生了反射' }
        ],
        answer: 'D',
        hint: '想一想要看到镜子里的像，光射到镜面后必须改变方向回到眼睛，这属于哪种现象。',
        analysis: '镜子表面很光滑，光射到镜面上会发生反射，反射光进入我们的眼睛，就能看到镜子里的像。',
        difficulty: 1
      },
      {
        id: 'g4-science-l2-04',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 2,
        point: '光的直线传播',
        type: 'single',
        stem: '下面哪个现象说明光是沿直线传播的？',
        options: [
          { key: 'A', text: '水结成冰' },
          { key: 'B', text: '手电筒在空气中射出的光柱是直的' },
          { key: 'C', text: '铁钉被磁铁吸引' },
          { key: 'D', text: '木块浮在水面上' }
        ],
        answer: 'B',
        hint: '从四个现象里找出和光有关的那一个，再看它是不是在说明光的行进路线。',
        analysis: '手电筒射出的光柱又直又亮，说明光沿直线传播；其余三个现象分别与物态变化、磁力和浮力有关。',
        difficulty: 1
      },
      {
        id: 'g4-science-l2-05',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 2,
        point: '反射与吸收',
        type: 'judge',
        stem: '"所有物体的表面反射光的能力都一样强。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '比一比镜面和粗糙深色的纸板，它们对光的反射效果差别大不大。',
        analysis: '不同物体表面对光的反射能力不同：光滑明亮的镜面反射能力强，粗糙深色的表面反射能力弱，所以说法错误。',
        difficulty: 1
      },

      /* ---------- 关卡 3 · 电路实验室 ---------- */
      {
        id: 'g4-science-l3-01',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 3,
        point: '电路组成',
        type: 'single',
        stem: '要把小灯泡点亮，下面哪一组材料能组成一个完整的电路？',
        options: [
          { key: 'A', text: '小灯泡、导线、电池' },
          { key: 'B', text: '电池和开关' },
          { key: 'C', text: '小灯泡、导线' },
          { key: 'D', text: '小灯泡和开关' }
        ],
        answer: 'A',
        hint: '想一想电流要绕成一个圈，路上要有供电的、用电的和连接的，缺一样都走不通。',
        analysis: '一个完整的电路需要电源（电池）、用电器（小灯泡）和导线，把三者连成通路小灯泡才会发光；开关只用来控制通断，不是点亮灯泡必需的。',
        difficulty: 2
      },
      {
        id: 'g4-science-l3-02',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 3,
        point: '导体与绝缘体',
        type: 'single',
        stem: '下面几种材料中，属于绝缘体的是哪一种？',
        options: [
          { key: 'A', text: '铜丝' },
          { key: 'B', text: '铁钉' },
          { key: 'C', text: '铝片' },
          { key: 'D', text: '橡胶' }
        ],
        answer: 'D',
        hint: '先分清容易导电和不容易导电的材料，再判断哪种材料不让电流通过。',
        analysis: '容易导电的材料叫导体，如铜、铁、铝等金属；不容易导电的材料叫绝缘体，如橡胶、塑料和干木头。',
        difficulty: 2
      },
      {
        id: 'g4-science-l3-03',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 3,
        point: '开关的作用',
        type: 'judge',
        stem: '"开关在电路中可以用来控制小灯泡的亮和灭。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '分别想开关闭合和断开时电流能不能通过灯泡，按这两种情况来核对。',
        analysis: '开关闭合时电路形成通路，电流通过小灯泡，灯泡发光；开关断开时电路断开，灯泡熄灭，所以说法正确。',
        difficulty: 2
      },
      {
        id: 'g4-science-l3-04',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 3,
        point: '人体与导电',
        type: 'judge',
        stem: '“人体是绝缘体，电流无法通过人体。”这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '想一想湿手碰插座为什么危险，人体到底能不能让电流通过。',
        analysis: '人体是导体，电流可以通过人体；湿手时导电能力更强，更容易触电，所以不能用湿手触摸开关和插座。',
        difficulty: 2
      },
      {
        id: 'g4-science-l3-05',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 3,
        point: '电路故障',
        type: 'single',
        stem: '把两节电池、一个开关和一个小灯泡用导线连成通路后，小灯泡不亮，最可能的原因是什么？',
        options: [
          { key: 'A', text: '小灯泡太新' },
          { key: 'B', text: '电路某处没有接好，出现了断路' },
          { key: 'C', text: '导线太长' },
          { key: 'D', text: '房间里的灯光太亮' }
        ],
        answer: 'B',
        hint: '灯泡不亮说明没有电流通过，先检查各处的接头和开关是不是都接好了。',
        analysis: '灯泡不亮说明没有电流通过灯泡，常见原因是导线接头松动或者开关没有闭合，使电路出现了断路。',
        difficulty: 2
      },

      /* ---------- 关卡 4 · 身体探秘 ---------- */
      {
        id: 'g4-science-l4-01',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 4,
        point: '人体呼吸',
        type: 'judge',
        stem: '"我们呼出的气体中，二氧化碳比吸入的空气里多。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '想一想呼吸时身体消耗了什么、又产生了什么，再比较吸进和呼出的气体。',
        analysis: '人呼吸时要消耗氧气、产生二氧化碳，所以呼出的气体中二氧化碳含量比吸入的空气多，说法正确。',
        difficulty: 2
      },
      {
        id: 'g4-science-l4-02',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 4,
        point: '食物营养',
        type: 'single',
        stem: '食物中的营养成分里，为人体提供主要能量的是哪一类？',
        options: [
          { key: 'A', text: '糖类（淀粉）' },
          { key: 'B', text: '维生素' },
          { key: 'C', text: '水' },
          { key: 'D', text: '矿物质' }
        ],
        answer: 'A',
        hint: '先分清各种营养成分各起什么作用，找出专门给身体提供能量的那一类。',
        analysis: '糖类（淀粉）是人体主要的能量来源；蛋白质主要用于生长和修复身体，维生素、水和矿物质主要起调节作用。',
        difficulty: 2
      },
      {
        id: 'g4-science-l4-03',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 4,
        point: '消化器官',
        type: 'single',
        stem: '食物在人体内被消化、营养被吸收的主要场所是哪里？',
        options: [
          { key: 'A', text: '口腔' },
          { key: 'B', text: '食道' },
          { key: 'C', text: '小肠' },
          { key: 'D', text: '胃' }
        ],
        answer: 'C',
        hint: '按食物经过的路线想一遍，哪个器官又长又有许多褶皱，专门吸收营养。',
        analysis: '口腔把食物嚼碎并初步消化，胃进行初步消化，小肠才是消化食物和吸收营养的主要器官。',
        difficulty: 2
      },
      {
        id: 'g4-science-l4-04',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 4,
        point: '呼吸器官',
        type: 'single',
        stem: '人体进行气体交换的主要器官是哪一个？',
        options: [
          { key: 'A', text: '心脏' },
          { key: 'B', text: '胃' },
          { key: 'C', text: '肝脏' },
          { key: 'D', text: '肺' }
        ],
        answer: 'D',
        hint: '想一想呼吸时空气进入身体后，在哪个器官里和血液交换气体。',
        analysis: '肺是呼吸的主要器官，氧气在肺泡处进入血液，血液里的二氧化碳则被排出体外。',
        difficulty: 2
      },
      {
        id: 'g4-science-l4-05',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 4,
        point: '骨骼与关节',
        type: 'single',
        stem: '人体能完成弯曲手臂等动作，主要依靠什么配合？',
        options: [
          { key: 'A', text: '只有骨骼' },
          { key: 'B', text: '只有肌肉' },
          { key: 'C', text: '骨骼、关节和肌肉的配合' },
          { key: 'D', text: '只有皮肤' }
        ],
        answer: 'C',
        hint: '做一个弯手臂的动作，感受骨、关节和肌肉各自起什么作用，缺了谁都不行。',
        analysis: '骨起支撑作用，关节使骨能够活动，肌肉收缩牵动骨绕着关节运动，三者配合人体才能做出各种动作。',
        difficulty: 2
      },

      /* ---------- 关卡 5 · 自然密码 ---------- */
      {
        id: 'g4-science-l5-01',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 5,
        point: '岩石与矿物',
        type: 'single',
        stem: '关于岩石和矿物，下面说法正确的是哪一句？',
        options: [
          { key: 'A', text: '岩石都是由一种矿物组成的' },
          { key: 'B', text: '岩石是由一种或多种矿物组成的' },
          { key: 'C', text: '矿物没有任何用途' },
          { key: 'D', text: '岩石和矿物都不能用来盖房子' }
        ],
        answer: 'B',
        hint: '想一块花岗岩里能看出几种不同的颗粒，再判断岩石和矿物之间是什么关系。',
        analysis: '岩石是由一种或多种矿物组成的天然物质，如花岗岩含有石英、长石和云母；矿物在生产生活中用途广泛。',
        difficulty: 3
      },
      {
        id: 'g4-science-l5-02',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 5,
        point: '云和雨的形成',
        type: 'judge',
        stem: '"天空中的云是由水蒸气直接变成的固体冰块形成的。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'B',
        hint: '先想云里的小水滴和小冰晶是怎么来的，水蒸气遇冷后会变成什么状态。',
        analysis: '云是由空气中的水蒸气遇冷凝结成的小水滴或小冰晶组成的，不是水蒸气直接变成的固体冰块，说法错误。',
        difficulty: 3
      },
      {
        id: 'g4-science-l5-03',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 5,
        point: '云和雨的形成',
        type: 'single',
        stem: '雨的形成主要和下面哪种情况有关？',
        options: [
          { key: 'A', text: '空气中的灰尘突然增多' },
          { key: 'B', text: '太阳离地球变近了' },
          { key: 'C', text: '风把云吹散了' },
          { key: 'D', text: '云中的小水滴不断变大，空气托不住时降落下来' }
        ],
        answer: 'D',
        hint: '想云里的小水滴不断碰撞变大以后会怎样，空气托不住时又会出现什么现象。',
        analysis: '云里的小水滴和小冰晶不断碰撞变大，当它们重到空气托不住的时候就会降落下来，形成雨。',
        difficulty: 3
      },
      {
        id: 'g4-science-l5-04',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 5,
        point: '植物繁殖',
        type: 'single',
        stem: '一朵完全花中，将来能发育成果实和种子的结构是什么？',
        options: [
          { key: 'A', text: '雌蕊（子房）' },
          { key: 'B', text: '花瓣' },
          { key: 'C', text: '萼片' },
          { key: 'D', text: '花柄' }
        ],
        answer: 'A',
        hint: '花传粉受精以后，哪个部分留在枝头慢慢长大，里面的胚珠又会变成什么。',
        analysis: '花经过传粉和受精后，雌蕊的子房发育成果实，子房里的胚珠发育成种子，花瓣和萼片会慢慢凋谢。',
        difficulty: 3
      },
      {
        id: 'g4-science-l5-05',
        grade: 4,
        subject: 'science',
        packId: 'science-g4',
        level: 5,
        point: '动物生命周期',
        type: 'judge',
        stem: '"蝴蝶的一生要经过卵、幼虫、蛹、成虫四个阶段，这叫完全变态。"这句话是正确的。',
        options: [
          { key: 'A', text: '正确' },
          { key: 'B', text: '错误' }
        ],
        answer: 'A',
        hint: '回忆蝴蝶一生要经过的几个阶段，看幼虫和成虫的样子差别大不大。',
        analysis: '蝴蝶的发育要经过卵、幼虫、蛹、成虫四个阶段，幼虫和成虫的样子差别很大，属于完全变态发育，说法正确。',
        difficulty: 3
      }
    ]
  });
})(window.ZCD);