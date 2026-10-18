import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const assets=JSON.parse(fs.readFileSync('frontend/src/lib/image-assets.json','utf8'))
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
for(const file of walk('frontend/src/app').filter(f=>f.endsWith('page.tsx'))){
  let source=fs.readFileSync(file,'utf8')
  const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)
  const edits=[]
  function visit(node){
    if(ts.isStringLiteral(node)&&assets[node.text]){
      const parent=node.parent
      if(ts.isJsxAttribute(parent)||ts.isImportDeclaration(parent))return
      if(ts.isCallExpression(parent)&&['imageUrl','imageAsset'].includes(parent.expression.getText(tree)))return
      if(ts.isPropertyAssignment(parent)&&parent.name===node)return
      edits.push({start:node.getStart(tree),end:node.end,text:`imageUrl(${node.getText(tree)})`})
    }
    ts.forEachChild(node,visit)
  }
  visit(tree)
  if(!edits.length)continue
  for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.text+source.slice(e.end)
  if(!/import\s*\{[^}]*\bimageUrl\b/.test(source))source="import { imageUrl } from '@/lib/image-assets'\n"+source
  fs.writeFileSync(file,source)
  console.log(file)
}
