const {launch,fonts}=require('/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/pw.js');
const OUT='/home/user/husamworld/world/_shots/speech-final-';
const URL='http://localhost:8765/world/speech.html';
(async()=>{
 const b=await launch();
 const runs=[['1440',{viewport:{width:1440,height:900}}],['390',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]];
 for(const [tag,opt] of runs){
  const ctx=await b.newContext(opt);await fonts(ctx);const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
  await p.goto(URL,{waitUntil:'load'});await p.waitForTimeout(500);
  await p.screenshot({path:OUT+tag+'-0intro.png'});
  await p.waitForTimeout(2600);
  await p.screenshot({path:OUT+tag+'-1top.png'});
  const h=await p.evaluate(()=>document.body.scrollHeight);
  const shots={};
  for(let y=0;y<h;y+=300){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(90)}
  for(const id of ['s1','s2','s3','s4','s5','s6','s7','s8']){
    await p.evaluate(id=>document.getElementById(id).scrollIntoView({block:'start'}),id);await p.waitForTimeout(700);
    await p.screenshot({path:OUT+tag+'-'+id+'.png'});
  }
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(400);
  await p.screenshot({path:OUT+tag+'-full.png',fullPage:true});
  const sw=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  // overflowing elements
  const over=await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.ticker')&&!e.closest('.roll')}).slice(0,8).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().right)));
  console.log(tag,'scroll',sw,'h',h,'over',over,errs.length?errs:'no errors');
  await ctx.close();
 }
 // reduced motion + from- hash
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});await fonts(ctx);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(URL,{waitUntil:'load'});await p.waitForTimeout(400);await p.screenshot({path:OUT+'rm-top.png'});
 console.log('rm intro hidden:',await p.evaluate(()=>document.getElementById('intro').hidden),errs);
 const p2=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
 await p2.goto(URL+'#from-world',{waitUntil:'load'});await p2.waitForTimeout(300);
 console.log('from- intro hidden:',await p2.evaluate(()=>document.getElementById('intro').hidden));
 await b.close();
})();
