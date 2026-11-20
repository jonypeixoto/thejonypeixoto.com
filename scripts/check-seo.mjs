import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'parse5';
import { seo, alternativos, urlIdioma, imagemSocial } from '../src/seo/config.js';

function all(node, predicate) {
  return [ ...(predicate(node) ? [node] : []), ...(node.childNodes || []).flatMap(child => all(child, predicate)) ];
}
const attr = (node, key) => node.attrs?.find(item => item.name === key)?.value;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
const titles = new Set();
for (const [code, data] of Object.entries(seo)) {
  const path = `dist${data.path}index.html`;
  const html = readFileSync(path, 'utf8');
  const doc = parse(html);
  const element = tag => all(doc, node => node.tagName === tag);
  const meta = key => element('meta').filter(node => attr(node, 'name') === key || attr(node, 'property') === key);
  assert.equal(attr(element('html')[0], 'lang'), data.locale, path);
  const headTitles = all(element('head')[0], node => node.tagName === 'title');
  assert.equal(headTitles.length, 1, `${code}: duplicate title`);
  assert.equal(text(headTitles[0]), data.title);
  assert.equal(meta('description').length, 1);
  assert.equal(attr(meta('description')[0], 'content'), data.description);
  assert.equal(attr(meta('og:title')[0], 'content'), data.title);
  assert.equal(attr(meta('og:image')[0], 'content'), imagemSocial);
  assert.equal(attr(meta('og:image:width')[0], 'content'), '1200');
  assert.equal(attr(meta('og:image:height')[0], 'content'), '630');
  assert.equal(attr(meta('og:image:type')[0], 'content'), 'image/jpeg');
  assert.equal(attr(meta('twitter:description')[0], 'content'), data.description);
  assert.equal(attr(element('link').find(node => attr(node, 'rel') === 'canonical'), 'href'), urlIdioma(code));
  assert.ok(!titles.has(data.title), 'Titles must be localized'); titles.add(data.title);
  const alternate = element('link').filter(node => attr(node, 'rel') === 'alternate');
  assert.equal(alternate.length, alternativos.length);
  for (const [lang, target] of alternativos) {
    assert.ok(alternate.some(node => attr(node, 'hreflang') === lang && attr(node, 'href') === urlIdioma(target)));
  }
  const graph = JSON.parse(text(element('script').find(node => attr(node, 'id') === 'seo-structured-data')))['@graph'];
  assert.equal(graph.find(item => item['@type'] === 'WebPage').url, urlIdioma(code));
  assert.equal(graph.find(item => item['@type'] === 'Service').areaServed[0].name, 'Rio de Janeiro');
  assert.equal(graph.find(item => item['@type'] === 'Service').areaServed[1].name, 'United Kingdom');
  assert.ok(!graph.some(item => ['LocalBusiness', 'ProfessionalService'].includes(item['@type'])), 'Do not invent a business address');
  const body = text(element('body')[0]);
  const messages = JSON.parse(readFileSync(`src/locales/${code}.json`, 'utf8'));
  const serviceKey = Object.keys(messages).find(key => key.startsWith('Quer criar um site,'));
  assert.ok(body.includes(messages[serviceKey]), `${code}: translated service copy missing from static HTML`);
  assert.ok(!html.includes('<!-- @secao'), `${code}: section expansion failed`);
  for (const node of element('script').filter(node => attr(node, 'src')?.startsWith('/assets/'))) {
    assert.ok(existsSync(`dist${attr(node, 'src')}`), `${code}: missing build asset`);
  }
  assert.equal(element('a').filter(node => attr(node, 'data-idioma')).length, 5, 'Crawlable language links');
  console.log(`SEO OK: ${data.path} (${data.locale})`);
}
const map = readFileSync('dist/sitemap.xml', 'utf8');
assert.equal((map.match(/<loc>/g) || []).length, Object.keys(seo).length);
for (const code of Object.keys(seo)) assert.ok(map.includes(`<loc>${urlIdioma(code)}</loc>`));
assert.ok(readFileSync('dist/robots.txt', 'utf8').includes('Sitemap: https://www.thejonypeixoto.com/sitemap.xml'));
assert.ok(existsSync(`dist${new URL(imagemSocial).pathname}`));
console.log('SEO OK: sitemap, robots.txt, structured data and social image');
