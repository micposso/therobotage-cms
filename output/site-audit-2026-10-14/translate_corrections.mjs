import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { translationInput, translatedMarkdown } from '../../frontend/scripts/translation-core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend')
const updates = [
  {id:'research/rlp-module-1-1-live.md', title:'Anuncio de programa archivado: itinerarios de aprendizaje actuales', category:'ARCHIVE', body:[
    'Actualización del programa — octubre de 2026. La disponibilidad del módulo y la credencial descritas anteriormente aquí ya no forman parte del catálogo público actual.',
    'Empieza con Robot Literacy para adquirir conocimientos básicos, experimenta con robots reales en Live Robot Lab o explora los itinerarios profesionales de la Academia: Diseño de productos para robots (RPDP) y Profesional de despliegue de robots (RDP).',
    'Consulta los currículos, las fechas previstas y las listas de interés en la Academia. Inscribirse en una lista no reserva una plaza. Los estudiantes actuales pueden iniciar sesión para acceder a su historial de aprendizaje.',
  ]},
  {id:'research/first-rep-workplace.md',title:'Anuncio de credencial archivado: información del programa en revisión',category:'ARCHIVE',body:[
    'Actualización editorial — octubre de 2026. Las afirmaciones sobre la obtención de credenciales y los resultados en el lugar de trabajo publicadas anteriormente en esta URL se han retirado de la promoción pública hasta su verificación.',
    'Esta página no constituye evidencia de resultados de RPDP o RDP. Las ofertas públicas actuales son Robot Literacy, Live Robot Lab, Diseño de productos para robots (RPDP) y Profesional de despliegue de robots (RDP).',
    'Consulta la información actual de los programas profesionales en la Academia. Esta actualización del catálogo no cambia el nombre de los historiales de aprendizaje ni de las credenciales emitidas anteriormente.',
  ]},
  ...['research','news'].map(collection=>({id:`${collection}/summit-nyc-call-for-speakers.md`,title:'Anuncio del encuentro: consulta la información actual del evento',category:'SUMMIT',body:[
    'Actualización del evento — octubre de 2026. El plazo de solicitud y los beneficios para ponentes anunciados anteriormente en esta página ya no se promocionan como ofertas actuales.',
    'Para conocer los planes actuales del encuentro o consultar una participación como ponente, contacta con The Robot Age mediante la página de contacto. Una consulta no confirma una participación como ponente ni una inscripción al evento.',
    'Para conocer los programas de aprendizaje actuales, explora Robot Literacy, Live Robot Lab, RPDP y RDP.',
    ...(collection==='news'?['[Contacta con The Robot Age](/connect) o [explora los programas profesionales actuales](/learn#programs).']:[]),
  ]})),
]
for (const update of updates) {
  const source = path.join(root, update.id.startsWith('news/') ? update.id : `translations/sources/${update.id}`)
  const raw=fs.readFileSync(source,'utf8')
  const input=translationInput(raw)
  const fields=Object.fromEntries(Object.keys(input.fields).map(key=>[key,key==='category'?update.category:key==='excerpt'?(update.id.startsWith('news/')?'Contacta con The Robot Age para conocer los planes actuales del encuentro y consultar una participación como ponente. Los plazos y beneficios anteriores ya no se anuncian como ofertas actuales.':update.body[0]):update.title]))
  fs.writeFileSync(path.join(root,'translations/es',update.id),translatedMarkdown(raw,{fields,body:update.body.join('\n\n')},'editorial-catalog-update'))
}
const id='research/human-readiness-framework.md'
const raw=fs.readFileSync(path.join(root,'translations/sources',id),'utf8')
const old=translationInput(fs.readFileSync(path.join(root,'translations/es',id),'utf8'))
old.body=old.body.trim().split(/\n\s*\n/).slice(0,-1).concat('Actualización del programa — octubre de 2026: este artículo anterior sobre el marco no anuncia la disponibilidad de un curso actual. Explora RPDP y RDP en la página de la Academia para conocer los itinerarios profesionales actuales.').join('\n\n')
fs.writeFileSync(path.join(root,'translations/es',id),translatedMarkdown(raw,old,'editorial-catalog-update'))
console.log('Updated five Spanish articles to match the corrected English sources')
