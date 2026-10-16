import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve('frontend/src')
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]) }
for(const file of walk(root).filter(f=>/\.(tsx|ts|jsx|js)$/.test(f) && !f.endsWith('MediaImage.tsx'))) {
  let source = fs.readFileSync(file,'utf8')
  const original = source
  source = source.replace(/import Image from 'next\/image'/g, "import Image from '@/components/MediaImage'")
  let hasStatic = false
  source = source.replace(/import (\w+) from '([^']*public(\/[^']+\.(?:png|webp|jpg|jpeg)))'/g, (_,name,location,publicPath)=>{
    hasStatic = true
    return `import ${name}Local from '${location}'\nconst ${name} = imageAsset('${publicPath}', ${name}Local)`
  })
  if(hasStatic) source = "import { imageAsset } from '@/lib/image-assets'\n"+source
  if(source!==original) { fs.writeFileSync(file,source);console.log(path.relative(root,file)) }
}
