/* The Plaza: the record, reduced to districts. Shared by the prototypes.
   Names live only in comments. k: m month-dated, s season (placed), y year-only, r weekly (dots), u undated. */
var DISTRICTS={
  bill:{name:'the Capitol',href:'bill.html'},
  speech:{name:'the Chamber',href:'speech.html'},
  translation:{name:'the Bridge',href:'translation.html'},
  n1:{name:'the Polling Station',href:'n1.html'},
  triptik:{name:'the Map Room',href:'triptik.html'},
  os:{name:'the Garage',href:'os.html'},
  depths:{name:'the Pier',href:'depths.html'},
  everywhere:{name:'the Airport',href:'everywhere.html'}
};
var ORDER=['bill','speech','translation','n1','triptik','os','depths','everywhere'];
var ROLES=[
 {k:'r',d:'triptik',y:[2015,2021],day:0},            // Sundays
 {k:'r',d:'triptik',y:[2018,2021],day:6},            // Saturdays
 {k:'m',d:'os',s:[2020,3],e:[2020,10]},              // first business at 14
 {k:'m',d:'bill',s:[2021,5],e:[2023,5]},             // advocacy
 {k:'m',d:'triptik',s:[2021,9],e:[2025,12]},         // community association
 {k:'y',d:'bill',y:[2022,2022]},                     // fellowship
 {k:'y',d:'triptik',y:[2022,2022]},                  // student association
 {k:'m',d:'bill',s:[2022,4],e:[2022,12]},            // nonprofit ED
 {k:'m',d:'bill',s:[2022,6],e:[2022,12]},            // House internship
 {k:'m',d:'translation',s:[2022,7],e:[2024,4]},      // translation desk
 {k:'m',d:'n1',s:[2022,7],e:[2022,10]},              // research A
 {k:'m',d:'n1',s:[2022,10],e:[2023,4]},              // research B
 {k:'m',d:'n1',s:[2023,1],e:[2023,3]},               // research C
 {k:'y',d:'bill',y:[2023,2025]},                     // caucus
 {k:'y',d:'n1',y:[2023,2024]},                       // researcher
 {k:'y',d:'translation',y:[2023,2024]},              // press officer
 {k:'y',d:'bill',y:[2023,2023]},                     // civics fellow
 {k:'y',d:'speech',y:[2023,2023]},                   // talks mentee
 {k:'y',d:'os',y:[2023,2023]},                       // grant
 {k:'y',d:'n1',y:[2023,2023]},                       // policy analyst
 {k:'y',d:'triptik',y:[2023,2023]},                  // tutor
 {k:'s',d:'os',d0:'2023-06-01',d1:'2023-08-31'},     // summer internship
 {k:'m',d:'os',s:[2023,10],e:[2024,12]},             // think tank
 {k:'m',d:'n1',s:[2024,1],e:[2024,3]},               // research fellow
 {k:'m',d:'speech',s:[2024,5],e:[2025,5]},           // council
 {k:'m',d:'bill',s:[2024,6],e:[2025,1]},             // national ops
 {k:'m',d:'bill',s:[2024,7],e:[2025,2]},             // state director
 {k:'s',d:'depths',d0:'2024-07-01',d1:'2024-08-18'}, // summer seminar
 {k:'m',d:'bill',s:[2024,9],e:[2024,10]},            // election fellow
 {k:'s',d:'n1',d0:'2025-06-01',d1:'2025-08-31'},     // summer fellowship
 {k:'s',d:'everywhere',d0:'2025-07-01',d1:'2025-08-18'}, // 7-week fellowship
 {k:'m',d:'everywhere',s:[2025,8],e:null},           // fellowships
 {k:'m',d:'n1',s:[2025,9],e:[2026,5]},               // institute
 {k:'m',d:'n1',s:[2025,9],e:[2026,2]},               // consulting
 {k:'m',d:'everywhere',s:[2025,9],e:null},           // congress sim
 {k:'m',d:'everywhere',s:[2025,10],e:null},          // newspaper business
 {k:'m',d:'everywhere',s:[2025,10],e:[2026,4]},      // mentor
 {k:'s',d:'everywhere',d0:'2026-01-01',d1:'2026-01-31'}, // winter fellowship
 {k:'m',d:'os',s:[2026,6],e:null}                    // company
];
var DAY=864e5;
function dn(y,m,d){return Math.floor(Date.UTC(y,m-1,d)/DAY);}
function iso(s){var p=s.split('-');return dn(+p[0],+p[1],+p[2]);}
function lastDay(y,m){return dn(y,m+1,1)-1;}
var NOW=new Date(), TODAY=dn(NOW.getFullYear(),NOW.getMonth()+1,NOW.getDate());
var Y0=2015,Y1=2026,NW=52*(Y1-Y0+1),W=[];
for(var y=Y0;y<=Y1;y++){var j=dn(y,1,1),ye=dn(y,12,31);for(var w=0;w<52;w++){var s=j+7*w,e=(w===51)?ye:s+6;W.push({y:y,w:w,s:s,e:e,mid:s+3});}}
var CUR=NW-1;for(var i=0;i<NW;i++){if(W[i].s<=TODAY&&TODAY<=W[i].e){CUR=i;break;}}
function span(r){if(r.k==='m')return [dn(r.s[0],r.s[1],1),r.e?lastDay(r.e[0],r.e[1]):Infinity];if(r.k==='s')return [iso(r.d0),iso(r.d1)];return [dn(r.y[0],1,1),dn(r.y[1],12,31)];}
ROLES.forEach(function(r){r.sp=span(r);});
function active(r,i){if(i>CUR)return false;var a=r.sp[0],b=r.sp[1];if(b===Infinity)return W[i].mid>=a||(i===CUR&&a<=TODAY);return W[i].mid>=a&&W[i].mid<=b;}
/* per week: counts by district (m + s only), plus year-only, plus weekend dots */
var WK=W.map(function(x,i){var by={},n=0,nm=0,ny=0,sun=false,sat=false;ROLES.forEach(function(r){if(!active(r,i))return;if(r.k==='m'||r.k==='s'){by[r.d]=(by[r.d]||0)+1;n++;if(r.k==='m')nm++;}else if(r.k==='y'){ny++;}else if(r.k==='r'){if(r.day===0)sun=true;else sat=true;}});return {i:i,y:x.y,w:x.w,s:x.s,e:x.e,n:n,nm:nm,ny:ny,by:by,sun:sun,sat:sat,future:i>CUR};});
function peakRuns(arr){var max=0;arr.forEach(function(v){if(v>max)max=v;});var runs=[],st=-1;for(var i=0;i<arr.length;i++){if(arr[i]===max&&st<0)st=i;if(st>=0&&(arr[i]!==max||i===arr.length-1)){runs.push([st,arr[i]===max?i:i-1]);st=-1;}}var best=runs[0];runs.forEach(function(r){if(r[1]-r[0]>best[1]-best[0])best=r;});return {max:max,runs:runs,best:best};}
var PK=peakRuns(WK.map(function(w){return w.n;}));
var PKM=peakRuns(WK.map(function(w){return w.nm;}));
var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
var MS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function ymd(d){var t=new Date(d*DAY);return [t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()];}
function longDay(d,y){var a=ymd(d);return MON[a[1]]+' '+a[2]+(y?', '+a[0]:'');}
function shortDay(d,y){var a=ymd(d);return MS[a[1]]+' '+a[2]+(y?', '+a[0]:'');}
function parts(w){return Object.keys(w.by).sort(function(a,b){return w.by[b]-w.by[a]||ORDER.indexOf(a)-ORDER.indexOf(b);}).map(function(k){return {d:k,n:w.by[k],name:DISTRICTS[k].name,href:DISTRICTS[k].href};});}
function cardText(w){var p=parts(w);if(!p.length)return 'Nothing on the chart';return p.map(function(x,j){return (j===0?(x.n+(x.n===1?' thing':' things')):x.n)+' in '+x.name;}).join(' · ');}
if(typeof module!=='undefined')module.exports={WK:WK,PK:PK,W:W,CUR:CUR,ROLES:ROLES};
