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
    }
  ];

  if(typeof module!=='undefined') module.exports=CASES;
  else globalThis.paperCases=CASES;
})();
