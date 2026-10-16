import fs from 'node:fs/promises'
import ts from 'typescript'
import { z } from 'zod'

const source = await fs.readFile(new URL('../src/lib/rxd/schema.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
export const schema = await import('data:text/javascript;base64,' + Buffer.from(compiled.replace("from 'zod'", `from ${JSON.stringify(import.meta.resolve('zod'))}`)).toString('base64'))
export const protocols = JSON.parse(await fs.readFile(new URL('../src/content/rxd/protocols.json', import.meta.url), 'utf8')).map(p => schema.ProtocolSchema.parse(p))
export { z }
