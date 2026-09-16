import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import postcss from 'postcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const styles = ['frontend/src', 'lms/src', 'packages/ui/src']
  .flatMap(directory => walk(path.join(root, directory)))
  .filter(file => file.endsWith('.css'));
const read = file => postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });

test('both applications retain the readable scale with a larger public-site H1', () => {
  const expected = {
    '--text-xs': '0.875rem', '--text-sm': '1rem', '--text-base': '1.125rem',
    '--text-md': '1.5rem', '--text-lg': '2rem', '--text-xl': '3rem', '--text-2xl': '4rem',
  };
  for (const app of ['frontend', 'lms']) {
    const found = {};
    read(path.join(root, app, 'src/app/globals.css')).walkDecls(/^--text-/, declaration => {
      if (declaration.parent.parent.type === 'root') found[declaration.prop] = declaration.value;
    });
    assert.deepEqual(found, { ...expected, '--text-2xl': app === 'frontend' ? '7rem' : '4rem' }, app);
  }
});

test('components consume the scale instead of defining independent font sizes', () => {
  const violations = [];
  for (const file of styles) {
    read(file).walkDecls('font-size', declaration => {
      if (file.endsWith('HeroHomepage.module.css') && declaration.parent.selector === '.headline' && declaration.value === 'calc(var(--text-2xl) * 1.5)') return;
      // em is reserved for an inline element relative to its surrounding text.
      if (!/^(var\(--text-(xs|sm|base|md|lg|xl|2xl)\)|inherit|[\d.]+em)$/.test(declaration.value)) {
        violations.push(`${path.relative(root, file)}:${declaration.source.start.line}: ${declaration.value}`);
      }
    });
  }
  assert.deepEqual(violations, []);
});

test('unclassed headings retain the same hierarchy in both applications', () => {
  const expected = { h1: '--text-2xl', h2: '--text-xl', h3: '--text-lg', h4: '--text-md', h5: '--text-base', h6: '--text-sm' };
  for (const app of ['frontend', 'lms']) {
    const stylesheet = read(path.join(root, app, 'src/app/globals.css'));
    for (const [selector, token] of Object.entries(expected)) {
      let actual;
      stylesheet.walkRules(selector, rule => rule.walkDecls('font-size', declaration => { actual = declaration.value; }));
      assert.equal(actual, `var(${token})`, `${app} ${selector}`);
    }
  }
});

test('normal text uses available regular or medium weights', () => {
  const violations = [];
  for (const file of styles) {
    read(file).walkDecls('font-weight', declaration => {
      if (/^(300|600|700|800|900|bold)$/.test(declaration.value)) {
        violations.push(`${path.relative(root, file)}:${declaration.source.start.line}: ${declaration.value}`);
      }
    });
  }
  assert.deepEqual(violations, []);
});
