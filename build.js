#!/usr/bin/env node
/*
  Avilo site build. No dependencies.

  Reads  src/pages/**\/*.html   page bodies with a <!--meta ... --> block and an optional <!--head ... --> block
         src/partials/*.html     head, nav, footer
  Writes <root>/<path>.html      finished pages (committed; Hostinger deploys the root as-is)
         sitemap.xml, llms.txt   generated from the page list

  Page meta keys: title, description, path, robots (optional), og_image (optional), og_type (optional), nav (optional: "none")
*/
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGES = path.join(SRC, 'pages');
const PARTIALS = path.join(SRC, 'partials');
const SITE = 'https://avilo.com.au';

const RETIRED = [
  'AI front desk', 'Your AI front desk', 'front desk handled', 'Officially integrated',
  'Real clinics, real numbers', 'Coming soon', 'Notifications plan', 'Abby', 'Lyngo', 'Aeva', 'BookedSolid', 'Cliniq',
];

function read(p) { return fs.readFileSync(p, 'utf8'); }
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html') && !e.name.startsWith('_')) out.push(p);
  }
  return out;
}
function block(src, name) {
  const re = new RegExp(`<!--${name}\\n([\\s\\S]*?)\\n-->`);
  const m = src.match(re);
  return m ? { text: m[1], src: src.replace(m[0], '') } : { text: null, src };
}
function parseMeta(text) {
  const meta = {};
  for (const line of text.split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return meta;
}
function outPathFor(p) {
  if (p === '/') return 'index.html';
  if (p.endsWith('/')) return p.slice(1) + 'index.html';
  return p.slice(1) + '.html';
}
function gitDate(file) {
  try {
    const d = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (d) return d;
  } catch (_) { /* untracked */ }
  return new Date().toISOString().slice(0, 10);
}
function render(tpl, vars) {
  return tpl
    .replace(/\{\{active:([^}]+)\}\}/g, (_, p) => {
      const cur = vars.path;
      const hit = p === '/' ? cur === '/' : (cur === p || cur.startsWith(p + '/'));
      return hit ? ' class="active"' : '';
    })
    .replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ''));
}

const partials = {
  head: read(path.join(PARTIALS, 'head.html')),
  nav: read(path.join(PARTIALS, 'nav.html')),
  footer: read(path.join(PARTIALS, 'footer.html')),
};

const pages = [];
const errors = [];

for (const file of walk(PAGES)) {
  const rel = path.relative(PAGES, file);
  let src = read(file);
  const m = block(src, 'meta'); src = m.src;
  const h = block(src, 'head'); src = h.src;
  if (!m.text) { errors.push(`${rel}: missing <!--meta--> block`); continue; }
  const meta = parseMeta(m.text);
  for (const k of ['title', 'description', 'path']) if (!meta[k]) errors.push(`${rel}: meta.${k} missing`);
  if (meta.title && meta.title.length > 60) errors.push(`${rel}: title is ${meta.title.length} chars (max 60)`);
  if (meta.description && meta.description.length > 160) errors.push(`${rel}: description is ${meta.description.length} chars (max 160)`);
  if (!meta.path) continue;

  const vars = {
    title: meta.title,
    description: meta.description,
    path: meta.path,
    canonical: SITE + meta.path,
    robots: meta.robots ? `<meta name="robots" content="${meta.robots}" />` : '',
    og_image: meta.og_image || `${SITE}/brand/avilo_og.png`,
    og_type: meta.og_type || 'website',
    head_extra: h.text || '',
    year: String(new Date().getFullYear()),
  };
  const nav = meta.nav === 'none' ? '' : render(partials.nav, vars);
  const html = render(partials.head, vars) + nav + '<main id="main">\n' + src.trim() + '\n</main>\n' + render(partials.footer, vars);

  // guards on output
  if (/[—–]/.test(html)) errors.push(`${rel}: contains an em or en dash`);
  const badHref = html.match(/href="(?!https?:)[^"]*\.html"/g);
  if (badHref) errors.push(`${rel}: internal .html link(s): ${badHref.slice(0, 3).join(', ')}`);
  for (const phrase of RETIRED) if (html.includes(phrase)) errors.push(`${rel}: retired phrase "${phrase}"`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${rel}: must have exactly one <h1>`);

  pages.push({ rel, file, meta, html, out: outPathFor(meta.path) });
}

if (errors.length) {
  console.error('Build failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}

for (const p of pages) {
  const dest = path.join(ROOT, p.out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, p.html);
}

// sitemap: indexable pages only
const indexable = pages.filter(p => !(p.meta.robots || '').includes('noindex'));
const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  .concat(indexable.map(p => `  <url><loc>${SITE}${p.meta.path}</loc><lastmod>${gitDate(p.file)}</lastmod></url>`))
  .concat(['</urlset>', ''])
  .join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

// llms.txt: static template plus the generated page list
const llmsTpl = read(path.join(SRC, 'llms.txt'));
const pageList = indexable
  .filter(p => !p.meta.path.startsWith('/blog/') || p.meta.path === '/blog/')
  .map(p => `- [${p.meta.title.replace(/ \| Avilo$/, '')}](${SITE}${p.meta.path}): ${p.meta.description}`)
  .join('\n');
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llmsTpl.replace('{{pages}}', pageList));

console.log(`Built ${pages.length} pages, sitemap (${indexable.length} urls), llms.txt`);
