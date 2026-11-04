/**
 * Build script — concatenates src/*.js into ONE self-contained IIFE and writes:
 *   dist/chat.js      (readable)
 *   dist/chat.min.js  (minified, JS + CSS)
 *
 * Usage:  npm install && npm run build
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, 'src', f), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

// Order matters: icons → helpers → platforms → config → animations → chat
const FILES = ['icons.js', 'helpers.js', 'platforms.js', 'config.js', 'animations.js', 'chat.js'];

const banner = `/*! Fixs.Arts Chat Widget v${pkg.version} — portable floating contact widget (Vanilla JS, Shadow DOM) */`;

function bundle(cssLiteral) {
  const body = FILES.map((f) => `/* ---- src/${f} ---- */\n` + read(f)).join('\n');
  return `${banner}
(function (window, document) {
  'use strict';
  if (!window || !document) return;
  if (window.FixsArtsChat && window.FixsArtsChat.__fx) return;   // already loaded — prevents duplicate widgets

  var CSS_TEXT = ${cssLiteral};

${body}
})(typeof window !== 'undefined' ? window : undefined, typeof document !== 'undefined' ? document : undefined);
`;
}

(async () => {
  const css = read('styles.css');
  const cssMin = (await esbuild.transform(css, { loader: 'css', minify: true })).code.trim();
  // readable build: keep the original CSS (template literal, escaped)
  const tpl = '`' + css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';

  const readable = bundle(tpl);
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist', 'chat.js'), readable);

  const min = await esbuild.transform(bundle(JSON.stringify(cssMin)), {
    minify: true, target: 'es2018', legalComments: 'none'
  });
  fs.writeFileSync(path.join(root, 'dist', 'chat.min.js'), banner + '\n' + min.code);

  const kb = (f) => (fs.statSync(path.join(root, 'dist', f)).size / 1024).toFixed(1) + ' KB';
  console.log('dist/chat.js     ' + kb('chat.js'));
  console.log('dist/chat.min.js ' + kb('chat.min.js'));
})().catch((e) => { console.error(e); process.exit(1); });
