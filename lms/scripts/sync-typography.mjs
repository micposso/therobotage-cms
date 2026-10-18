import { existsSync, readFileSync, writeFileSync } from 'node:fs'

// Railway builds the LMS from its own directory. Keep a generated snapshot so
// isolated builds use the same design system without requiring a monorepo context.
const source = new URL('../../packages/ui/src/styles/typography.css', import.meta.url)
const destination = new URL('../src/app/typography.generated.css', import.meta.url)
if (existsSync(source)) {
  const content = '/* GENERATED from packages/ui/src/styles/typography.css. Do not edit. */\n' + readFileSync(source, 'utf8')
  if (!existsSync(destination) || readFileSync(destination, 'utf8') !== content) {
    writeFileSync(destination, content)
  }
} else if (!existsSync(destination)) {
  throw new Error('Missing typography snapshot. Run this script from the monorepo before deploying the LMS.')
}
