(() => {
  const CASES = [
    {
      id: 'single-step', title: '單階機構', label: '基礎', width: 134, half: 76,
      summary: '兩道直切線和三條橫折，讓一段紙片變成小平台。',
      lesson: '移動開合角度，觀察凸出的平台與前方立面。平台和立面各連到一側卡頁，收合時才會一起疊回去。',
      detail: '暖色立面旁的深色縫是切開的邊。切線止於外側折線，兩端保留原紙連接。',
      status: '幾何驗證', lanes: [{x0: 34, x1: 100, terraces: [[27,26]], color: '#df8667'}]
    },
    {
      id: 'times-square', title: '時代廣場紅階梯', label: '建築', width: 182, half: 115,
      summary: '用多階紙帶做出 TKTS 紅階梯，兩側街廓和後方塔樓留在不同深度。',
      lesson: '中央階梯帶先有一段高立面，再向前逐步下降。兩側塔樓有各自的切口，和中央階梯共享卡頁，而在展開時保持前後層次。',
      detail: '切折圖中有三道可動紙帶。這是以現地地標為靈感的簡化模型，沒有做等比例測量。',
      status: '幾何驗證',
      sources: [
        ['Times Square Alliance｜TKTS', 'https://www.timessquarenyc.org/entertainment/tkts-times-square'],
        ['Sherwood Equities｜Two Times Square', 'https://sherwoodequities.com/properties/two-times-square/']
      ],
      lanes: [
        {x0: 12, x1: 44, terraces: [[14,87],[29,61],[39,30]], color: '#768b9b', windows: [[2,19,25,-60,-50],[2,29,35,-60,-50],[4,20,27,-24,-13],[4,31,38,-24,-13]]},
        {x0: 50, x1: 133, terraces: [[16,83],[31,41],[39,34],[47,28],[55,22],[63,16],[71,11],[79,6]], color: '#e35d4e', windows: [[0,67,76,-107,-97],[0,82,91,-107,-97],[0,97,106,-107,-97],[0,112,121,-107,-97],[2,67,76,-60,-49],[2,82,91,-60,-49],[2,97,106,-60,-49],[2,112,121,-60,-49]]},
        {x0: 141, x1: 169, terraces: [[18,65],[34,46],[46,25]], color: '#789b88', windows: [[2,147,154,-40,-34],[2,157,164,-40,-34],[4,147,154,-8,1],[4,157,164,-8,1]]}
      ]
    },
    {
      id: 'three-step-gallery', title: '三階窗廊', label: '進階', width: 166, half: 94,
      summary: '一條紙帶做三階退台，兩層直立面各有三個窗孔。',
      lesson: '先停在 90° 看兩排窗孔，再拉到 45°。窗孔跟著同一片立面運動，三階的深度則由前緣折線控制。',
      detail: '六個窗孔是獨立的切口，窗邊保留紙料，切口不碰折線。整條紙帶仍靠前後未裁開的部位與卡頁連接。',
      status: '幾何驗證', lanes: [{
        x0: 34, x1: 132, terraces: [[19,52],[37,36],[56,18]], color: '#b3c77b',
        windows: [[2,47,61,-29,-22],[2,76,90,-29,-22],[2,105,119,-29,-22],[4,47,61,6,13],[4,76,90,6,13],[4,105,119,6,13]]
      }]
    }
  ];

  if(typeof module!=='undefined') module.exports=CASES;
  else globalThis.paperCases=CASES;
})();
