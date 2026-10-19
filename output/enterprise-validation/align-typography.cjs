const fs = require('fs');
const path = 'frontend/src/app/(english)/enterprise/enterprise.module.css';
let css = fs.readFileSync(path, 'utf8');
// Remove obsolete custom hero rules; the shared PageHero owns its typography.
css = css.split('\n').filter(line => !/\.(heroText|heroSupport|heroFigure|heroPhoto)\b|^\s*\.hero\s*\{|\.page\[lang="es"\] \.hero|@media \(min-width:1500px\)/.test(line)).join('\n');
css = css.replace('.page p { margin:0; }', '.section p { margin:0; }');
css = css.replace('.page p,.page li { font-size:1rem; line-height:1.65; }', '.section li { font-size:var(--text-body); line-height:var(--leading-body); }');
css = css.replace(/font-size:(?:\.\d+rem|1rem|clamp\(1\.3rem,2\.2vw,2rem\))\s*(?:!important)?;/g, 'font-size:var(--text-body);');
css = css.replace(/--text-body:1\.3rem;/g, '');
css = css.replace(/--text-heading:clamp\(2\.2rem,3\.6vw,3\.7rem\);/g, '');
css = css.replace(/line-height:1\.4\s*!important;/g, 'line-height:var(--leading-body);');
css = css.replace(/(\.brandHero \.offer \{[^}]*?)font-size:var\(--text-sm\) !important;/, '$1');
// Use the shared small scale only for metadata, labels and supporting UI.
css = css.replace(/(\.(?:number|processTrack|label|optional|formNote|error|consent|disclosure)\b[^\n{]*\{[^}\n]*?)font-size:var\(--text-body\);/g, '$1font-size:var(--text-xs);');
css = css.replace(/(\.adoptionFigure figcaption \{[^}]*?)font-size:var\(--text-body\);/, '$1font-size:var(--text-xs);');
fs.writeFileSync(path, css);
