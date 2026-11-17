const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const matter = require('gray-matter');
const slug = 'runway-video-models-teach-robots';
const root = path.resolve(__dirname, '../../frontend');
const raw = fs.readFileSync(path.join(root, 'news', `${slug}.md`), 'utf8');
const { data, content } = matter(raw);
for (const key of ['slug', 'title', 'category', 'date', 'excerpt', 'headerImage', 'thumbnailImage', 'author']) assert.equal(typeof data[key], 'string', key);
assert.equal(data.slug, slug);
assert.ok(data.excerpt.length < 160);
assert.ok(!/[\u2018\u2019\u201c\u201d]/.test(raw));
const assets = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/image-assets.json'), 'utf8'));
for (const key of ['headerImage', 'thumbnailImage']) {
  assert.ok(fs.existsSync(path.join(root, 'public', data[key])));
  assert.ok(assets[data[key]]?.startsWith('https://'));
}
const articles = fs.readdirSync(path.join(root, 'news')).filter(file => file.endsWith('.md') && !file.startsWith('_')).map(file => matter(fs.readFileSync(path.join(root, 'news', file), 'utf8')).data).sort((a, b) => new Date(b.date) - new Date(a.date));
assert.equal(articles[0].slug, slug);
const social = fs.readFileSync(path.join(root, 'social', `${slug}-linkedin.txt`), 'utf8').trim();
assert.ok(social.length >= 800 && social.length <= 1500);
console.log(JSON.stringify({ title: data.title, words: content.replace(/\]\([^)]*\)/g, ']').split(/\s+/).length, excerptCharacters: data.excerpt.length, linkedInCharacters: social.length, homepagePosition: 1, images: [assets[data.headerImage], assets[data.thumbnailImage]] }, null, 2));
