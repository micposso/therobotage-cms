const fs=require('fs');
const dir='frontend/src/app/(english)/enterprise/';
const file=dir+'content.ts';
const c=JSON.parse(fs.readFileSync(file,'utf8').replace('export const enterpriseContent = ','').replace(/ as const\s*$/,''));
const ep='frontend/src/lib/i18n/enterprise-es.json';const es=JSON.parse(fs.readFileSync(ep,'utf8'));
const t=(en,sp)=>(es[en]=sp,en);
c.support=t('Make customer onboarding a path to growth, not a deployment bottleneck. Our managed, multilingual Academy helps your team train more customer sites without repeating the same work.','Convierta la incorporación de clientes en una vía de crecimiento, no en un obstáculo para los despliegues. Nuestra Academia gestionada y multilingüe ayuda a su equipo a formar a más clientes sin repetir el mismo trabajo.');
c.cta=t('Plan your Academy pilot','Planifique su piloto de la Academia');
c.focus.areaCta=c.cta;c.pilot.cta=c.cta;
c.focus.firstStep=t('Start with a conversation about your onboarding bottleneck, pilot scope, and cost.','Empiece con una conversación sobre sus obstáculos de incorporación, el alcance del piloto y su coste.');
c.problem.title=t('Is customer training holding back your next deployment?','¿La formación de clientes está frenando su próximo despliegue?');
c.problem.body=t('When every site depends on your engineers to train its workforce, growth adds work to the same team. A reusable Academy gives customer education its own delivery model.','Cuando cada ubicación depende de sus ingenieros para formar al personal, crecer añade trabajo al mismo equipo. Una Academia reutilizable ofrece a la formación de clientes su propio modelo de entrega.');
c.problem.items=[
[t('Free deployment capacity','Libere capacidad de despliegue'),t('Move repeatable workforce instruction into a managed Academy so specialists can focus on commissioning and the next customer.','Traslade la formación repetitiva del personal a una Academia gestionada para que sus especialistas se concentren en la puesta en marcha y el próximo cliente.')],
[t('Protect rollout margins','Proteja los márgenes del despliegue'),t('Reuse lessons across sites instead of rebuilding training each time. Compare total onboarding cost per site in the pilot.','Reutilice lecciones entre ubicaciones en lugar de rehacer la formación cada vez. Compare el coste total de incorporación por ubicación durante el piloto.')],
[t('Support customer expansion','Apoye la expansión de sus clientes'),t('Give customers a repeatable way to prepare new teams and locations when they expand their robot fleet.','Ofrezca a sus clientes una forma repetible de preparar nuevos equipos y ubicaciones cuando amplíen su flota de robots.')]
];
c.form.title=t('Where is onboarding slowing you down?','¿Dónde se está frenando la incorporación?');
c.form.body=t('Tell us who you are. In the first conversation, we’ll identify the training bottleneck, discuss one suitable pilot, and agree what would make it worth scaling.','Cuéntenos quién es. En la primera conversación identificaremos el obstáculo de formación, hablaremos de un piloto adecuado y acordaremos qué justificaría ampliarlo.');
c.focus.fit=t('For robot manufacturers, integrators, distributors, and RaaS teams preparing customer deployments.','Para fabricantes, integradores, distribuidores y equipos RaaS que preparan despliegues para clientes.');
t('Add deployment details (optional)','Añadir detalles del despliegue (opcional)');
fs.writeFileSync(file,'export const enterpriseContent = '+JSON.stringify(c,null,2)+' as const\n');fs.writeFileSync(ep,JSON.stringify(es,null,2)+'\n');
