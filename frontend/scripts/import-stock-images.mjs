import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat()}
const urls=new Set()
for(const dir of ['src','news','translations'])for(const file of await walk(path.join(root,dir))){
  if(!/\.(?:tsx?|jsx?|md)$/.test(file))continue
  const text=await fs.readFile(file,'utf8')
  for(const match of text.matchAll(/https:\/\/images\.unsplash\.com\/[^\s'"<>`\\)]+/g))urls.add(match[0])
}
const aliases={}
const failures=[]
await fs.mkdir(path.join(root,'public/images/imported'),{recursive:true})
for(const url of urls){
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)})
  if(!response.ok){failures.push({url,status:response.status});continue}
  const name=createHash('sha256').update(url).digest('hex').slice(0,16)+'.webp'
  await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:85}).toFile(path.join(root,'public/images/imported',name))
  aliases[url]='/images/imported/'+name
}
await fs.writeFile(path.join(root,'src/lib/image-source-aliases.json'),JSON.stringify(aliases,null,2)+'\n')
await fs.writeFile(path.resolve(root,'../output/stock-image-import.json'),JSON.stringify({imported:Object.keys(aliases).length,failures},null,2)+'\n')
console.log(JSON.stringify({imported:Object.keys(aliases).length,failures},null,2))
