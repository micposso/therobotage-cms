const fs=require('fs');
const base='frontend/src/app/(english)/enterprise/';
const file=base+'content.ts';
let raw=fs.readFileSync(file,'utf8').replace('export const enterpriseContent = ','').replace(/ as const\s*$/,'').replace(/,\s*}/g,'}');
const c=JSON.parse(raw);
const esPath='frontend/src/lib/i18n/enterprise-es.json';
const es=JSON.parse(fs.readFileSync(esPath,'utf8'));
const t=(en,translation)=>(es[en]=translation,en);
c.environments.titleLines=[t('Different workplaces. Different people.','Distintos lugares de trabajo. Distintas personas.'),t('One approach to readiness.','Un mismo enfoque de preparación.')];
c.environments.items[1]=[t('Hospitality','Hostelería'),t('Train hotel teams to manage robot supply handoffs and exceptions, helping maintain consistent service across shifts.','Forme a los equipos de hoteles para gestionar entregas de suministros y excepciones con robots, ayudando a mantener un servicio coherente entre turnos.')];
c.environments.items.push(
[t('Entertainment','Entretenimiento'),t('Prepare museum and attraction staff to guide robot-led visitor interactions and step in when needed, supporting an engaging, well-managed guest experience.','Prepare al personal de museos y atracciones para guiar las interacciones de visitantes con robots e intervenir cuando sea necesario, favoreciendo una experiencia atractiva y bien gestionada.')],
[t('Security','Seguridad'),t('Train campus security teams to review patrol-robot alerts and escalate incidents, with clear human oversight and consistent shift handovers.','Forme a los equipos de seguridad de campus para revisar alertas de robots de patrulla y escalar incidentes, con supervisión humana clara y relevos de turno coherentes.')],
[t('Local Government','Gobierno local'),t('Prepare municipal facilities teams for robot-assisted building inspections: follow routes, review findings, and flag maintenance needs through a repeatable workflow.','Prepare a los equipos municipales para inspecciones de edificios asistidas por robots: seguir rutas, revisar hallazgos y señalar necesidades de mantenimiento mediante un proceso repetible.')]
);
c.alt.entertainment=t('Museum staff practice visitor interactions beside a wheeled interactive robot.','Personal de un museo practica interacciones con visitantes junto a un robot interactivo con ruedas.');
c.alt.security=t('A supervisor trains security officers to oversee a wheeled patrol robot at a commercial campus.','Un supervisor forma a agentes de seguridad para supervisar un robot de patrulla en un campus comercial.');
c.alt.government=t('Municipal facilities staff learn an inspection route with a quadruped robot in a building mechanical room.','Personal municipal aprende una ruta de inspección con un robot cuadrúpedo en una sala de máquinas.');
delete c.additionalScenarios;
delete c.focus.scenarios;
fs.writeFileSync(file,'export const enterpriseContent = '+JSON.stringify(c,null,2)+' as const\n');
fs.writeFileSync(esPath,JSON.stringify(es,null,2)+'\n');
let page=fs.readFileSync(base+'page.tsx','utf8');
page=page.split('\n').filter(line=>!line.includes('c.focus.scenarios')).join('\n');
page=page.replace("  quadruped: '/images/enterprise/enterprise-quadruped-inspection.webp',", "  quadruped: '/images/enterprise/enterprise-quadruped-inspection.webp',\n  entertainment: '/images/enterprise/enterprise-entertainment.webp',\n  security: '/images/enterprise/enterprise-security.webp',\n  government: '/images/enterprise/enterprise-local-government.webp',");
page=page.replace('className={styles.mediumHeading} id="environments-title">{t(c.environments.title)}','className={styles.environmentsHeading} id="environments-title">{c.environments.titleLines.map(line=><span key={line}>{t(line)}</span>)}');
page=page.replace("['factory', 'hero', 'senior']", "['factory', 'humanoid', 'senior', 'entertainment', 'security', 'government']");
page=page.replace("'(max-width: 600px) 100vw, 33vw'", "'(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw'");
fs.writeFileSync(base+'page.tsx',page);
