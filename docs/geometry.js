(() => {
  const EPS = 1e-8;
  const same = (a,b) => Math.abs(a.u-b.u) < EPS && Math.abs(a.v-b.v) < EPS;
  const point = (u,v) => ({u,v,s:u-v});
  const byS = (a,b) => a-b;

  function profile(half, terraces) {
    const points = [point(0,half)];
    for (const [depth,height] of terraces) {
      points.push(point(points.at(-1).u,height),point(depth,height));
    }
    points.push(point(points.at(-1).u,0),point(half,0));
    return points;
  }

  function sectionAt(points, s) {
    const i = points.findIndex((p,j) => j>0 && p.s+EPS>=s);
    if (i<1) return points.at(-1);
    const a=points[i-1], b=points[i], t=(s-a.s)/(b.s-a.s);
    return point(a.u+(b.u-a.u)*t,a.v+(b.v-a.v)*t);
  }

  function build(model) {
    const H=model.half, W=model.width;
    const lanes=model.lanes.map(lane=>({...lane})).sort((a,b)=>a.x0-b.x0);
    const spans=[];
    let x=0;
    for (const lane of lanes) {
      if (lane.x0>x) spans.push({x0:x,x1:lane.x0,terraces:[]});
      spans.push(lane);
      x=lane.x1;
    }
    if (x<W) spans.push({x0:x,x1:W,terraces:[]});
    const panels=[], creases=[], seams=[], windows=[];
    for (const lane of spans) {
      const P=profile(H,lane.terraces);
      lane.points=P;
      for(let j=0;j<P.length-1;j++) {
        const a=P[j], b=P[j+1];
        const face={lane,j,a,b,x0:lane.x0,x1:lane.x1,holes:[],kind:a.u===b.u?'vertical':'horizontal'};
        panels.push(face);
        for(const [faceIndex,x0,x1,s0,s1] of lane.windows||[]) {
          if(faceIndex!==j) continue;
          face.holes.push({x0,x1,s0,s1});
          windows.push({x0,x1,s0,s1});
        }
      }
      for(let j=1;j<P.length-1;j++) {
        creases.push({x0:lane.x0,x1:lane.x1,p:P[j],kind:j%2===1?'valley':'mountain'});
      }
    }
    for(let i=1;i<spans.length;i++) {
      const left=spans[i-1], right=spans[i];
      const marks=[...new Set([...left.points,...right.points].map(p=>p.s))].sort(byS);
      for(let j=0;j<marks.length-1;j++) {
        const a=marks[j], b=marks[j+1];
        if(![a,b].every(s=>same(sectionAt(left.points,s),sectionAt(right.points,s)))) {
          const tail=seams.at(-1);
          if(tail&&tail.x===right.x0&&tail.end===a) tail.end=b;
          else seams.push({x:right.x0,start:a,end:b});
        }
      }
    }
    return {W,H,spans,panels,creases,seams,windows};
  }

  function world(x,p,angle) {
    const rad=angle*Math.PI/180;
    return [x,p.u+p.v*Math.cos(rad),p.v*Math.sin(rad)];
  }

  function planSvg(g, title, withLegend=true) {
    const {W,H,seams,creases,windows}=g;
    const border='<rect x="0" y="0" width="'+W+'" height="'+2*H+'" fill="#faf8ee" stroke="#85919a" stroke-width=".45"/>';
    const cuts=seams.map(({x,start,end})=>'<line x1="'+x+'" x2="'+x+'" y1="'+(start+H)+'" y2="'+(end+H)+'"/>').join('');
    const holes=windows.map(w=>'<rect x="'+w.x0+'" y="'+(w.s0+H)+'" width="'+(w.x1-w.x0)+'" height="'+(w.s1-w.s0)+'"/>').join('');
    const foldGroup=(kind,color,dash)=>'<g id="'+kind+'" fill="none" stroke="'+color+'" stroke-width=".6" stroke-dasharray="'+dash+'">'+creases.filter(c=>c.kind===kind).map(c=>'<line x1="'+c.x0+'" x2="'+c.x1+'" y1="'+(c.p.s+H)+'" y2="'+(c.p.s+H)+'"/>').join('')+'</g>';
    const escape=(value)=>String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));
    const extra=withLegend?22:0;
    const tag=withLegend?'<text x="0" y="'+(2*H+8)+'" font-family="sans-serif" font-size="4" fill="#23334a">'+W+' × '+2*H+' mm</text><text x="0" y="'+(2*H+16)+'" font-family="sans-serif" font-size="3.5" fill="#23334a">Cut / Mountain fold / Valley fold</text>':'';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 '+(W+4)+' '+(2*H+4+extra)+'" width="'+(W+4)+'mm" height="'+(2*H+4+extra)+'mm" role="img"><title>'+escape(title)+'</title>'+border+'<g id="cut" fill="none" stroke="#c24128" stroke-width=".66">'+cuts+holes+'</g>'+foldGroup('mountain','#6850ab','3 1.6')+foldGroup('valley','#0b7080','1.35 1.35')+tag+'</svg>';
  }

  const api={build,world,planSvg,sectionAt,profile};
  if(typeof module!=='undefined') module.exports=api;
  else globalThis.paperGeometry=api;
})();
