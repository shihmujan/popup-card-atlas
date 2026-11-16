const assert = require('node:assert/strict');
const cases = require('../docs/cases.js');
const {build,world,sectionAt,planSvg}=require('../docs/geometry.js');
const close=(a,b)=>Math.abs(a-b)<1e-6;
const norm=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const ids=new Set();

for(const model of cases){
  assert(/^[a-z]+(?:-[a-z]+)*$/.test(model.id)&&!ids.has(model.id),model.id);
  ids.add(model.id);
  for(const field of ['title','summary','lesson','detail']) assert(model[field]?.trim(),field);
  assert(model.width>0&&model.half>0&&model.status==='幾何驗證');
  for(const [,url] of model.sources||[]) assert.equal(new URL(url).protocol,'https:');
  let edge=0;
  for(const lane of model.lanes){
    assert(lane.x0-edge>=3&&lane.x1>lane.x0&&lane.terraces.length>0);
    assert(/^#[a-f0-9]{6}$/i.test(lane.color));
    let depth=0,height=model.half;
    for(const [d,h] of lane.terraces){
      assert(d>depth&&h<height&&h>0&&d+h<model.half,model.id+' terrace out of bounds');
      depth=d;height=h;
    }
    edge=lane.x1;
  }
  assert(model.width-edge>=3);
  const g=build(model);
  let windowCount=0;
  for(const f of g.panels){
    const length=f.b.s-f.a.s;
    assert(length>0);
    for(const degrees of [0,10,45,90,135,180]){
      const a=world(f.x0,f.a,degrees), b=world(f.x0,f.b,degrees);
      assert(close(norm(a,b),length),model.id+' panel changes length');
      const across=world(f.x1,f.b,degrees);
      assert(close(norm(b,across),f.x1-f.x0),model.id+' panel changes width');
      if(degrees===0) assert(a[1]>=0&&b[1]<=model.half+1e-7);
      if(degrees===180) assert(close(a[1],f.a.s)&&close(b[1],f.b.s));
    }
    for(let j=0;j<f.holes.length;j++){
      const w=f.holes[j];windowCount++;
      assert(f.kind==='vertical'&&w.x1>w.x0&&w.s1>w.s0&&w.x0>=f.x0+2&&w.x1<=f.x1-2,model.id+' window x');
      assert(w.s0>=f.a.s+2&&w.s1<=f.b.s-2,model.id+' window s');
      for(const other of f.holes.slice(0,j)){
        assert(w.x0>=other.x1+2||other.x0>=w.x1+2||w.s0>=other.s1+2||other.s0>=w.s1+2,model.id+' overlapping apertures');
      }
    }
  }
  assert.equal(windowCount,model.lanes.reduce((n,l)=>n+(l.windows?.length||0),0));
  for(let i=1;i<g.spans.length;i++){
    const left=g.spans[i-1], right=g.spans[i];
    const cuts=g.seams.filter(s=>s.x===right.x0);
    for(const cut of cuts) assert(cut.start>-g.H&&cut.end<g.H&&cut.start<cut.end,model.id+' cut disconnects sheets');
    const breaks=[...new Set([...left.points,...right.points].map(p=>p.s))].sort((a,b)=>a-b);
    for(let j=1;j<breaks.length;j++){
      const start=breaks[j-1], end=breaks[j];
      const cut=cuts.some(c=>c.start<=start&&c.end>=end);
      const same=[start,end].every(s=>{const a=sectionAt(left.points,s), b=sectionAt(right.points,s);return close(a.u,b.u)&&close(a.v,b.v);});
      assert.equal(cut,!same,model.id+' uncut seam mismatch');
    }
  }
  const svg=planSvg(g,model.title);
  for(const group of ['cut','mountain','valley']) assert(svg.includes('id="'+group+'"'));
  assert(svg.includes('width="'+(g.W+4)+'mm"'));
  console.log(model.id+': '+g.panels.length+' 個面片，'+windowCount+' 個窗孔，通過展開圖、接縫及角度檢查。');
}
console.log('三階窗廊延伸案例：'+(ids.has('three-step-gallery')?'已出現在資料及共用檢查':'初版尚未加入'));

