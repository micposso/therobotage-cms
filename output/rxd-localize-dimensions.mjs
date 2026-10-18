import fs from 'node:fs/promises'
import ts from 'typescript'
const file = 'frontend/src/app/(english)/rxd/RxdDimensionsGrid.tsx'
const source = await fs.readFile(file,'utf8')
const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
let dims
function visit(n) { if(ts.isVariableDeclaration(n) && n.name.getText(ast)==='DIMENSIONS') dims=n.initializer; ts.forEachChild(n,visit) }
visit(ast)
const descriptions = ['¿Puede el usuario entender lo que comunica el robot?', '¿Puede el usuario anticipar hacia dónde se moverá el robot?', '¿La voz, la forma y la estética del robot producen una identidad coherente?', 'Cuando algo falla, ¿el robot hace comprensible el problema?', '¿El modelo de interacción corresponde al contexto y a las expectativas del usuario?', '¿Puede el usuario o el robot retomar la actividad tras una interrupción?']
const bodies = [
 'Los robots comunican intención, estado y acción mediante sonido, luz, movimiento y pantallas. Cuando las señales son ambiguas o inexistentes, las personas deben adivinar, lo que puede generar interacciones inseguras o improductivas. La claridad de señal evalúa lo comprensibles que son estos canales para quienes comparten el espacio con el robot.',
 'Un robot que se mueve sin anticipar su trayectoria genera conductas de evitación, colisiones y pérdida de confianza. La legibilidad espacial mide si las personas pueden prever su siguiente movimiento sin formación especial. Es un indicador temprano de si el despliegue requerirá supervisión humana continua.',
 'La coherencia de la identidad del robot —voz, forma, movimiento y estética— influye en si se percibe como una entidad comprensible o un objeto impredecible. Las discrepancias entre canales pueden provocar extrañeza y dificultar la interacción sostenida. La presencia percibida evalúa si el robot produce una identidad estable y coherente para sus usuarios.',
 'Cuando algo falla, la cuestión no es si el robot puede recuperarse, sino si las personas comprenden lo sucedido y qué hacer después. Los fallos opacos impulsan las solicitudes de asistencia y la pérdida de confianza. La transparencia de fallos evalúa cómo comunica el robot los problemas, sus causas y el camino a seguir.',
 'Un robot diseñado para un entorno o población puede fallar en otro porque el modelo de interacción no corresponde al contexto. El ajuste de interacción evalúa la correspondencia entre cómo espera ser utilizado el robot y cómo sus usuarios reales, en su contexto, esperan usarlo.',
 'La recuperación revela las debilidades de muchos despliegues. Tras una interrupción, confusión o error debe existir un camino claro hacia la operación normal para la persona y el robot. El diseño de recuperación evalúa cuántos pasos requiere, cuánto depende de conocimientos técnicos y si devuelve la interacción a un estado útil para ambas partes.',
]
const dictionaryFile='frontend/src/lib/i18n/rxd-es.json'
const dictionary=JSON.parse(await fs.readFile(dictionaryFile,'utf8'))
dims.elements.forEach((el,i)=>{ for(const prop of el.properties) if(['description','body'].includes(prop.name.getText(ast))) dictionary[prop.initializer.text]=prop.name.getText(ast)==='description'?descriptions[i]:bodies[i] })
await fs.writeFile(dictionaryFile,JSON.stringify(dictionary,null,2)+'\n')
