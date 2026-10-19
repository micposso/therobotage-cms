const fs=require('fs');
const root='frontend/src/app/(english)/enterprise/';
const file=root+'content.ts';
const c=JSON.parse(fs.readFileSync(file,'utf8').replace('export const enterpriseContent = ','').replace(/ as const\s*$/,''));
const esPath='frontend/src/lib/i18n/enterprise-es.json';
const es=JSON.parse(fs.readFileSync(esPath,'utf8'));
const copy=(en,translation)=>(es[en]=translation,en);
c.support=copy('Scale customer onboarding without scaling your training workload. We build and manage reusable, multilingual training so your engineers spend less time repeating instructions and more time deploying robots.','Amplíe la incorporación de clientes sin multiplicar la carga de formación. Creamos y gestionamos formación reutilizable y multilingüe para que sus ingenieros dediquen menos tiempo a repetir instrucciones y más a desplegar robots.');
c.problem.body=copy('Every new customer brings another team to train. When engineers repeat the same onboarding, customer education consumes time that could support the next deployment.','Cada nuevo cliente trae otro equipo al que formar. Cuando los ingenieros repiten la misma incorporación, la formación consume tiempo que podría dedicarse al siguiente despliegue.');
c.problem.note='';
c.problem.items=[
[copy('Less repeat training','Menos formación repetitiva'),copy('Build one product-specific learning program, then adapt it for each customer site.','Cree un programa de aprendizaje específico para su producto y adáptelo a cada cliente.')],
[copy('More capable customer teams','Equipos de clientes más preparados'),copy('Teach everyday tasks in the workforce’s language, then check practical understanding.','Enseñe las tareas diarias en el idioma del equipo y compruebe su comprensión práctica.')],
[copy('Support beyond handover','Apoyo después de la entrega'),copy('Give new hires and changing shifts a consistent way to learn without starting from scratch.','Ofrezca a los nuevos empleados y turnos una forma coherente de aprender sin empezar de cero.')]
];
c.environments.items[0][1]=copy('Repeatable onboarding for factory, warehouse, and inspection teams—designed to reduce specialist training time at each site.','Incorporación repetible para equipos de fábricas, almacenes e inspección, diseñada para reducir el tiempo de formación de especialistas en cada ubicación.');
c.environments.items[1][1]=copy('Prepare service and venue teams for robot handoffs and exceptions, helping maintain a consistent guest experience across shifts.','Prepare a los equipos de servicio y recintos para entregas y excepciones con robots, ayudando a mantener una experiencia coherente entre turnos.');
c.environments.items[2][1]=copy('Prepare care-support staff for service robots, with clear task boundaries and escalation procedures that respect care workflows.','Prepare al personal de apoyo asistencial para robots de servicio, con límites claros de tareas y procedimientos de escalamiento que respeten los procesos de atención.');
c.solution.title=copy('Your customer training team, on demand.','Su equipo de formación de clientes, cuando lo necesite.');
c.solution.body=copy('Robot Deployment Academy-as-a-Service gives manufacturers, integrators, distributors, and RaaS providers a managed onboarding program built around their robot.','La Academia de Despliegue Robótico como Servicio ofrece a fabricantes, integradores, distribuidores y proveedores RaaS un programa de incorporación gestionado y adaptado a su robot.');
c.solution.note=copy('Research-informed learning adapted to workforce languages, roles, and cultural context. English and Spanish are initially planned; other languages depend on scope.','Aprendizaje basado en investigación y adaptado a los idiomas, funciones y contexto cultural del equipo. Se prevén inicialmente inglés y español; otros idiomas dependen del alcance.');
c.solution.items=[
[copy('Build once','Crear una vez'),copy('We turn your operating procedures into role-based lessons, practical exercises, and assessments.','Convertimos sus procedimientos en lecciones por función, ejercicios prácticos y evaluaciones.')],
[copy('Deliver across customers','Formar a distintos clientes'),copy('We support workshops, digital learning, and train-the-trainer delivery, adapted to each workforce.','Apoyamos talleres, aprendizaje digital y formación de formadores adaptados a cada equipo.')],
[copy('Improve as you scale','Mejorar al crecer'),copy('We review learning outcomes and refresh materials for new hires, workflows, and robot updates.','Revisamos los resultados y actualizamos los materiales para nuevas incorporaciones, procesos y versiones del robot.')]
];
c.pilot.title=copy('Measure the value before you scale.','Mida el valor antes de ampliar.');
c.pilot.body=copy('Start with one robot, one customer, and a paid pilot. Agree a baseline, success criteria, and review period before training begins.','Empiece con un robot, un cliente y un piloto de pago. Acuerde una referencia inicial, criterios de éxito y un período de evaluación antes de comenzar.');
c.pilot.items=[copy('Learning-needs assessment and onboarding plan','Evaluación de necesidades y plan de incorporación'),copy('Robot-specific module and guided training','Módulo específico del robot y formación guiada'),copy('Practical assessment and outcomes report','Evaluación práctica e informe de resultados'),copy('Recommendations for rollout and refreshers','Recomendaciones para ampliar y actualizar la formación')];
c.form.body=copy('Tell us about your robot and where customer onboarding takes the most time. We’ll discuss the scope, measures, and cost of a focused Academy pilot.','Cuéntenos sobre su robot y qué parte de la incorporación de clientes requiere más tiempo. Hablaremos del alcance, las métricas y el coste de un piloto de la Academia.');
c.focus={
areaCta:copy('Discuss your deployment','Hablemos de su despliegue'),
scenarios:copy('Humanoid and inspection scenarios','Escenarios con humanoides y robots de inspección'),
pilotCta:copy('Explore a measurable pilot','Explore un piloto medible'),
deliverables:copy('What the pilot includes','Qué incluye el piloto'),
measurement:copy('Compare results with a comparable cohort or your documented baseline. Set targets together; improvements are measured, not guaranteed.','Compare los resultados con un grupo comparable o con su referencia documentada. Fijamos objetivos juntos; las mejoras se miden, no se garantizan.'),
metrics:[
[copy('Training effort','Esfuerzo de formación'),copy('Staff hours per customer site, multiplied by your hourly staff cost. Compare this with the Academy fee and remaining internal effort.','Horas de personal por cliente multiplicadas por su coste por hora. Compárelo con la tarifa de la Academia y el trabajo interno restante.')],
[copy('Workforce readiness','Preparación del equipo'),copy('Share of employees who can complete agreed robot tasks without prompting, using the same practical assessment.','Proporción de empleados que completan las tareas acordadas sin indicaciones, mediante la misma evaluación práctica.')],
[copy('Customer satisfaction','Satisfacción del cliente'),copy('Customer ratings of onboarding quality and confidence using the robot, collected with the same questions and timing.','Valoraciones de la incorporación y la confianza al usar el robot, recogidas con las mismas preguntas y en momentos equivalentes.')]
]
};
delete c.problem.note;
// intro() requires a note, but an empty string need not be translated.
c.problem.note='';
es['']='';
fs.writeFileSync(file,'export const enterpriseContent = '+JSON.stringify(c,null,2)+' as const\n');
fs.writeFileSync(esPath,JSON.stringify(es,null,2)+'\n');
let page=fs.readFileSync(root+'page.tsx','utf8');
page=page.replace('<p>{t(data.note)}</p>','{data.note && <p>{t(data.note)}</p>}');
page=page.replace('id === \'solution-title\' ? lines(data.title) : t(data.title)','t(data.title)');
page=page.replace('<p className={styles.statement}>{t(c.problem.closing)}</p><p className={styles.scope}>{t(c.scope)}</p>','');
const scenario=page.split('\n').find(line=>line.includes('styles.scenarioPair'));
page=page.replace(scenario+'\n','');
page=page.replace('<p className={styles.disclosure}>{t(c.environments.note)}</p>',`<div className={styles.actions}><a className={\`\${cta.cta} \${styles.button}\`} href="#enterprise-briefing">{t(c.focus.areaCta)} <span aria-hidden="true">↗</span></a></div>
        <details className={styles.details}><summary>{t(c.focus.scenarios)}</summary>${scenario.trim()}</details>
        <p className={styles.disclosure}>{t(c.environments.note)}</p>`);
page=page.replace('<section className={styles.section} aria-labelledby="solution-title">','<section className={styles.section} id="academy-process" aria-labelledby="solution-title">');
page=page.replace("photo('factory', styles.factoryPhoto)","photo('multilingual', styles.factoryPhoto)");
page=page.replace('</ol></div>\n      </div></section>','</ol></div>\n        <div className={styles.actions}><a className={styles.textLink} href="#academy-pilot">{t(c.focus.pilotCta)} <span aria-hidden="true">↓</span></a></div>\n      </div></section>');
const start=page.indexOf('      <section className={`${styles.section} ${styles.specialization}`}');
const end=page.indexOf('      <section className={`${styles.section} ${styles.pilot}`}');
page=page.slice(0,start)+page.slice(end);
const pilotStart=page.indexOf('      <section className={`${styles.section} ${styles.pilot}`}');
const pilotEnd=page.indexOf('      <section className={`${styles.section} ${styles.programs}`}');
page=page.slice(0,pilotStart)+`      <section className={\`\${styles.section} \${styles.pilot}\`} id="academy-pilot" aria-labelledby="pilot-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.pilot.label)}</p><h2 id="pilot-title">{t(c.pilot.title)}</h2><p className={styles.pilotIntro}>{t(c.pilot.body)}</p>
        <div className={styles.metrics}>{c.focus.metrics.map(([title,body])=><article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <p className={styles.measurement}>{t(c.focus.measurement)}</p>
        <details className={styles.details}><summary>{t(c.focus.deliverables)}</summary><ul>{c.pilot.items.map(item=><li key={item}>{t(item)}</li>)}</ul></details>
        <div className={styles.actions}><a className={\`\${cta.cta} \${styles.button}\`} href="#enterprise-briefing">{t(c.pilot.cta)} <span aria-hidden="true">↗</span></a></div>
      </div></section>
`+page.slice(pilotEnd);
const programsStart=page.indexOf('      <section className={`${styles.section} ${styles.programs}`}');
const programsEnd=page.indexOf('      <section className={`${styles.section} ${styles.briefing}`}');
page=page.slice(0,programsStart)+page.slice(programsEnd);
page=page.replace('</main><Footer />','</main><Footer />');
// Keep complementary programs accessible without a separate sales section.
page=page.replace('<EnterpriseForm locale={locale} />','<div><EnterpriseForm locale={locale} /><details className={styles.details}><summary>{t(c.programs.title)}</summary><ul>{c.programs.items.map(([title,,href])=><li key={href}><Link href={contentHref(href,locale)}>{t(title)}</Link></li>)}</ul></details></div>');
page=page.replace(/^  const lines = .*\n/m,'');
fs.writeFileSync(root+'page.tsx',page);
