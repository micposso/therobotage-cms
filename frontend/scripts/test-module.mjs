import { readFile } from 'node:fs/promises'
import ts from 'typescript'

// Compile small, pure TS dependency graphs for Node tests without a running Next server.
export async function testModule(url) {
  let source = ts.transpileModule(await readFile(url, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  for (const match of [...source.matchAll(/from ['"](\.\.?\/[^'"]+)['"]/g)]) {
    const dependency = new URL(match[1].endsWith('.ts') ? match[1] : `${match[1]}.ts`, url)
    source = source.replace(match[0], `from ${JSON.stringify(await testModule(dependency))}`)
  }
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
}
