const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, 'out');
// replace /_next/ in all files
let r=0;(function w(d){fs.readdirSync(d,{withFileTypes:1}).forEach(e=>{let f=path.join(d,e.name);if(e.isDirectory()){if(e.name!='node_modules')w(f)}else if(e.isFile()){try{let c=fs.readFileSync(f,'utf8');if(c.includes('/_next/')){c=c.replace(/\/_next\//g,'/next-assets/');fs.writeFileSync(f,c,'utf8');r++}}catch(e){}}})})(outDir);console.log('Replaced in '+r+' files')
// index.html in route dirs
let idx=0;(function wi(dp){let p=path.dirname(dp),dn=path.basename(dp),hf=path.join(p,dn+'.html');if(fs.existsSync(hf)){let ixf=path.join(dp,'index.html');if(!fs.existsSync(ixf)){fs.copyFileSync(hf,ixf);idx++}}fs.readdirSync(dp,{withFileTypes:1}).forEach(e=>{if(e.isDirectory()&&e.name!='node_modules'&&!e.name.startsWith('__next'))wi(path.join(dp,e.name))})})(outDir);console.log('Created '+idx+' index.html');

// Rename _next directory to next-assets
const nextDir = path.join(outDir, '_next');
const assetsDir = path.join(outDir, 'next-assets');
if (fs.existsSync(nextDir)) {
  fs.renameSync(nextDir, assetsDir);
  console.log('Renamed _next folder to next-assets');
}
