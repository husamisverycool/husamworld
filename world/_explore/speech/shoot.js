// usage: node shoot.js <url> <prefix> [--full]
const S='/tmp/claude-0/-home-user-husamworld/9fc029a5-1aa4-5271-be6b-e1ec8dd7b649/scratchpad/pw.js';
const {launch,fonts}=require(S);
(async()=>{
 const [url,prefix]=process.argv.slice(2);const out='/home/user/husamworld/world/_shots/';
 const b=await launch();
 for(const [tag,opt] of [['1440',{viewport:{width:1440,height:900}}],['390',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const ctx=await b.newContext(opt);await fonts(ctx);const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
  await p.goto(url,{waitUntil:'load'});await p.waitForTimeout(1500);
  await p.screenshot({path:`${out}${prefix}-${tag}-top.png`});
  // scroll through to trigger reveals
  const h=await p.evaluate(()=>document.body.scrollHeight);
  for(let y=0;y<h;y+=400){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(120)}
  await p.waitForTimeout(800);
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
  await p.screenshot({path:`${out}${prefix}-${tag}-full.png`,fullPage:true});
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth);
  console.log(tag,'scrollWidth',sw,'height',h,errs.length?errs.join('\n'):'no errors');
  await ctx.close();
 }
 await b.close();
})();
