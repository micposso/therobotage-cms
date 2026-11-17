const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const file = 'frontend/src/lib/image-assets.json';
const verified = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const original = JSON.parse(execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: 'utf8' }));
for (const suffix of ['header', 'thumb']) {
  const key = `/images/news/runway-video-models-teach-robots-${suffix}.png`;
  if (!verified[key]) throw new Error(`Missing verified image: ${key}`);
  original[key] = verified[key];
}
const ordered = Object.fromEntries(Object.entries(original).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
fs.writeFileSync(path.join(root, file), JSON.stringify(ordered, null, 2) + '\n');
const inventory = 'output/r2-image-inventory.json';
fs.copyFileSync(path.join(root, inventory), path.join(__dirname, 'r2-image-inventory.json'));
fs.writeFileSync(path.join(root, inventory), execFileSync('git', ['show', `HEAD:${inventory}`], { cwd: root }));
console.log('Kept only the two article additions in the public image manifest; retained the full publishing report with the article evidence.');
const catalogFile = 'frontend/translations/catalog.json';
const generatedCatalog = JSON.parse(fs.readFileSync(path.join(root, catalogFile), 'utf8'));
const baselineCatalog = JSON.parse(execFileSync('git', ['show', `HEAD:${catalogFile}`], { cwd: root, encoding: 'utf8' }));
const entry = generatedCatalog.find(item => item.id === 'news/runway-video-models-teach-robots.md');
if (!entry) throw new Error('New article is absent from the generated translation catalog');
const index = baselineCatalog.findIndex(item => item.id === 'news/shenzhen-robot-fight-league-benchmark.md');
baselineCatalog.splice(index, 0, entry);
fs.writeFileSync(path.join(root, catalogFile), JSON.stringify(baselineCatalog, null, 2) + '\n');
console.log('Kept the new article catalog entry without unrelated expired-job removals.');
