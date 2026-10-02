const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','styles.css','config.js','products.js','script.js','checkout.js','robots.txt','sitemap.xml'])fs.copyFileSync(path.join(root,name),path.join(out,name));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
console.log('Static storefront built in dist. No server or credentials required.');
