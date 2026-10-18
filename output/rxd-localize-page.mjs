import fs from 'node:fs/promises'
import ts from 'typescript'
const file = 'frontend/src/app/(english)/rxd/page.tsx'
let source = await fs.readFile(file, 'utf8')
const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const edits = []
function walk(n) {
 if (ts.isJsxText(n) && n.text.trim()) {
  const text = n.text.trim().replace(/\s+/g, ' ').replace(/&rarr;/g, '→')
  edits.push({ start:n.pos, end:n.end, text:'{t(' + JSON.stringify(text) + ')}' })
 }
 if (ts.isJsxAttribute(n) && ['title','subtitle','eyebrow'].includes(n.name.text) && n.initializer && ts.isStringLiteral(n.initializer)) edits.push({ start:n.initializer.getStart(ast), end:n.initializer.end, text:'{t(' + JSON.stringify(n.initializer.text) + ')}' })
 ts.forEachChild(n, walk)
}
walk(ast); edits.sort((a,b)=>b.start-a.start).forEach(e=> { source=source.slice(0,e.start)+e.text+source.slice(e.end) })
await fs.writeFile(file, source)
const dictionaryPath = 'frontend/src/lib/i18n/rxd-es.json'
const dictionary = JSON.parse(await fs.readFile(dictionaryPath,'utf8'))
Object.assign(dictionary, {
 'Robots are entering homes, classrooms, and workplaces.':'Los robots llegan a hogares, aulas y lugares de trabajo.',
 'A six-dimension model for evaluating robot interactions the way users actually experience them — built for practitioners, not engineers.':'Un modelo de seis dimensiones para evaluar las interacciones tal como las viven las personas, dirigido a profesionales de la experiencia.',
 'Download the White Paper (v2.0) →':'Descargar el documento técnico (v2.0) →',
 'PDF · Free · CC BY-NC 4.0':'PDF · Gratuito · CC BY-NC 4.0',
 'The six dimensions of':'Las seis dimensiones del',
 'Robot Experience Design':'Diseño de Experiencia Robótica',
 'Who this is for':'A quién se dirige',
 'Built for practitioners, not engineers.':'Diseñado para profesionales de la experiencia.',
 'UX designers':'Diseñadores de UX', 'Product managers':'Responsables de producto', 'Human factors researchers':'Investigadores de factores humanos', 'Educators':'Educadores',
 'Developed by Mike Posso through The Robot Age, a research and education platform preparing non-engineering professionals for consumer robotics. The framework draws on active graduate research at SUNY Polytechnic Institute and professional experience in product engineering leadership.':'Desarrollado por Mike Posso a través de The Robot Age, una plataforma de investigación y educación que prepara a profesionales no ingenieros para la robótica de consumo. El marco se apoya en investigación de posgrado en SUNY Polytechnic Institute y experiencia de liderazgo en ingeniería de producto.',
 'Download':'Descargar', 'Take the framework with you.':'Llévate el marco de trabajo.',
 'The white paper includes:':'El documento técnico incluye:',
 'Evaluation criteria and scoring rubrics for all six dimensions':'Criterios de evaluación y rúbricas para las seis dimensiones',
 'A structured worksheet for assessing any robot product or deployment':'Una hoja estructurada para evaluar productos robóticos o despliegues',
 'Methodology, research background, and application guidance':'Metodología, antecedentes de investigación y orientación de aplicación',
 'Download the RXD White Paper (v2.0) →':'Descargar el documento RXD (v2.0) →',
 'PDF, free to download. Licensed CC BY-NC 4.0.':'PDF de descarga gratuita. Licencia CC BY-NC 4.0.',
 'Dimensions with documented findings':'Dimensiones con hallazgos documentados', 'Scored dimensions':'Dimensiones puntuadas',
})
await fs.writeFile(dictionaryPath, JSON.stringify(dictionary,null,2)+'\n')
