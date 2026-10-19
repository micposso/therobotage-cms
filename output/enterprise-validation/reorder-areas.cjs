const fs = require('fs');
const base = 'frontend/src/app/(english)/enterprise/';
let page = fs.readFileSync(base+'page.tsx','utf8');
const start = page.indexOf('      <section className={`${styles.section} ${styles.environments}`}');
const end = page.indexOf('      <section className={styles.section} aria-labelledby="partners-title"', start);
let section = page.slice(start,end);
const extra = section.split('\n').find(line=>line.includes('styles.scenarioPair'));
section = section.replace(extra+'\n','');
section = section.replace("['hero', 'factory', 'senior']", "['factory', 'hero', 'senior']");
section = section.replace('<article key={title}>{photo', '<article className={literacy.progressionCard} key={title}>{photo');
page = page.slice(0,start)+page.slice(end);
const before = '      <section className={styles.section} aria-labelledby="solution-title"';
page = page.replace(before,section+before);
const solutionEnd = page.indexOf('</div></section>',page.indexOf(before));
page = page.slice(0,solutionEnd)+extra.trim()+'\n      '+page.slice(solutionEnd);
fs.writeFileSync(base+'page.tsx',page);
let content = fs.readFileSync(base+'content.ts','utf8');
const pairs = [
['Restaurants & Hospitality','Industrial'],
['Train front-of-house, service, facilities, and operations teams to work alongside delivery and service robots.','Standardize onboarding across factories, warehouses, and inspection teams so each new site requires less repeat instruction from your technical specialists.'],
['Manufacturing & Logistics','Hospitality & Entertainment'],
['Support workforce orientation, robot interaction procedures, and changing operational workflows.','Prepare service and venue teams to guide robot interactions, manage handoffs, and handle exceptions—helping protect the guest experience as staff and shifts change.'],
['Senior Living & Facilities','Healthcare'],
['Help staff understand service robots, their limitations, and appropriate operation in human-centered environments.','Prepare care-support and facilities staff for delivery and service robots, with clear boundaries and escalation procedures that respect residents, patients, and care workflows.']
];
for(const [old,value] of pairs)content=content.replace(JSON.stringify(old),JSON.stringify(value));
fs.writeFileSync(base+'content.ts',content);
const esPath='frontend/src/lib/i18n/enterprise-es.json';
const es=JSON.parse(fs.readFileSync(esPath,'utf8'));
const values=['Industria','Estandarice la incorporación en fábricas, almacenes y equipos de inspección para reducir la formación que sus especialistas técnicos deben repetir en cada nueva ubicación.','Hostelería y entretenimiento','Prepare a los equipos de servicio y de recintos para guiar las interacciones con robots, gestionar entregas y resolver excepciones, ayudando a cuidar la experiencia del visitante ante los cambios de personal y de turno.','Salud','Prepare al personal de apoyo asistencial y de instalaciones para robots de entrega y servicio, con límites claros y procedimientos de escalamiento que respeten a residentes, pacientes y procesos de atención.'];
pairs.forEach((pair,i)=>es[pair[1]]=values[i]);
fs.writeFileSync(esPath,JSON.stringify(es,null,2)+'\n');
