(() => {
  const cases=globalThis.paperCases;
  const geometry=globalThis.paperGeometry;
  const $=id=>document.getElementById(id);
  const art=$('artboard'), angle=$('angle'), tabs=$('case-tabs');
  if(!Array.isArray(cases)||!cases.length||!geometry){
    art.textContent='無法載入圖鑑資料，請重新整理。';
    return;
  }

  const getModel=()=>cases.find(c=>c.id===location.hash.slice(6));
  let model=getModel()||cases.find(c=>c.id==='times-square')||cases[0];
  let folds=geometry.build(model);
  let mode='model';

  for(const entry of cases){
    const tab=document.createElement('a');
    tab.href='#case/'+entry.id;
    tab.textContent=entry.title;
    tab.dataset.case=entry.id;
    tabs.append(tab);
  }

  const yaw=.44, pitch=.51;
  function project(x,p,degrees){
    const [a,b,z]=geometry.world(x,p,degrees);
    const across=a*Math.cos(yaw)-b*Math.sin(yaw);
    const away=a*Math.sin(yaw)+b*Math.cos(yaw);
    return [across, away*Math.sin(pitch)-z*Math.cos(pitch), away*Math.cos(pitch)+z*Math.sin(pitch)];
  }

  function frames(g){
    const samples=[];
    for(let d=0;d<=180;d+=15){
      for(const face of g.panels){
        for(const x of [face.x0,face.x1]) for(const p of [face.a,face.b]) samples.push(project(x,p,d));
      }
    }
    const xs=samples.map(p=>p[0]), ys=samples.map(p=>p[1]);
    return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
  }
  let fitted=frames(folds);

  function planePath(points,xy){
    return 'M'+points.map(p=>xy(p).map(n=>n.toFixed(2)).join(',')).join('L')+'Z';
  }

  function modelSvg(g,degrees){
    const [x0,y0,x1,y1]=fitted;
    const scale=Math.min(728/(x1-x0),379/(y1-y0));
    const xy=p=>[405+(p[0]-(x0+x1)/2)*scale,223+(p[1]-(y0+y1)/2)*scale];
    const pr=(x,p)=>project(x,p,degrees);
    const sorted=g.panels.map(f=>{
      const points=[pr(f.x0,f.a),pr(f.x1,f.a),pr(f.x1,f.b),pr(f.x0,f.b)];
      const depth=points.reduce((sum,p)=>sum+p[2],0)/4;
      return {f,points,depth};
    }).sort((a,b)=>a.depth-b.depth);
    const shapes=sorted.map(({f,points})=>{
      const tinted=f.lane.color&&f.j>0&&f.j<f.lane.points.length-2;
      const fill=tinted?f.lane.color:f.kind==='vertical'?'#e3e3d2':'#f5f2de';
      const holes=f.holes.map(w=>{
        const a=geometry.sectionAt(f.lane.points,w.s0), b=geometry.sectionAt(f.lane.points,w.s1);
        return planePath([pr(w.x0,a),pr(w.x1,a),pr(w.x1,b),pr(w.x0,b)],xy);
      });
      const stroke=tinted?'#373532':'#768078';
      return '<path d="'+planePath(points,xy)+holes.join('')+'" fill="'+fill+'" fill-opacity="'+(tinted&&f.kind==='horizontal'?'.89':'1')+'" fill-rule="evenodd" stroke="'+stroke+'" stroke-width="1.45" stroke-linejoin="round"/>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 810 448" role="img" aria-label="'+degrees+' 度的紙雕模型"><defs><filter id="shadow" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#081010" flood-opacity=".58"/></filter></defs><g filter="url(#shadow)">'+shapes+'</g></svg>';
  }

  function display(){
    const degrees=Number(angle.value);
    $('angle-output').textContent=degrees+'°';
    angle.setAttribute('aria-valuetext',degrees+' 度');
    for(const button of document.querySelectorAll('[data-angle]')){
      button.setAttribute('aria-pressed',String(Number(button.dataset.angle)===degrees));
    }
    const isPlan=mode==='plan';
    art.dataset.mode=mode;
    art.innerHTML=isPlan?geometry.planSvg(folds,model.title+'切折圖',false):modelSvg(folds,degrees);
    $('view-plan').setAttribute('aria-pressed',String(isPlan));
    $('view-3d').setAttribute('aria-pressed',String(!isPlan));
    $('angle-controls').hidden=isPlan;
    $('legend').hidden=!isPlan;
  }

  function updateCase(next){
    model=next;
    folds=geometry.build(model);
    fitted=frames(folds);
    for(const tab of tabs.children) tab.setAttribute('aria-current',String(tab.dataset.case===model.id));
    for(const [id,value] of Object.entries({
      status:model.status, 'case-title':model.title, summary:model.summary,
      sheet:model.width+' × '+model.half*2+' mm', lanes:model.lanes.length+' 條',
      lesson:model.lesson, detail:model.detail
    })) $(id).textContent=value;
    $('sources').replaceChildren();
    $('sources').hidden=!model.sources?.length;
    for(const [name,url] of model.sources||[]){
      const link=document.createElement('a');
      link.textContent=name+' ↗'; link.href=url; link.target='_blank'; link.rel='noreferrer';
      $('sources').append(link);
    }
    display();
  }

  window.addEventListener('hashchange',()=>{const next=getModel(); if(next&&next!==model) updateCase(next);});
  angle.addEventListener('input',display);
  $('view-3d').addEventListener('click',()=>{mode='model';display();});
  $('view-plan').addEventListener('click',()=>{mode='plan';display();});
  for(const button of document.querySelectorAll('[data-angle]')){
    button.addEventListener('click',()=>{angle.value=button.dataset.angle;display();});
  }
  $('download').addEventListener('click',()=>{
    const svg=new Blob([geometry.planSvg(folds,model.title+'切折圖')],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(svg);
    const link=document.createElement('a');
    link.href=url; link.download=model.id+'-cut-fold.svg';
    link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  updateCase(model);
})();
