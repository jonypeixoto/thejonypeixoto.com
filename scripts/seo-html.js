import { parse, parseFragment, serialize } from 'parse5';
import { readFileSync } from 'node:fs';
import { seo, imagemSocial, alternativos, urlIdioma } from '../src/seo/config.js';
import { dadosEstruturados } from '../src/seo/config.js';

const normaliza = texto => texto.replace(/\s+/g, ' ').trim();
const escapa = texto => String(texto).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const atributo = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const define = (node, name, value) => {
  const item = node.attrs.find(item => item.name === name);
  if (item) item.value = value;
  else node.attrs.push({ name, value });
};

export function preparaPagina(html, idioma = 'pt') {
  const doc = parse(html);
  const root = doc.childNodes.find(node => node.tagName === 'html');
  const head = root.childNodes.find(node => node.tagName === 'head');
  const body = root.childNodes.find(node => node.tagName === 'body');
  const dados = seo[idioma];
  const mensagens = JSON.parse(readFileSync(new URL(`../src/locales/${idioma}.json`, import.meta.url), 'utf8'));
  const traduz = texto => mensagens[normaliza(texto)] || texto;
  function visita(node) {
    if (node.nodeName === '#text') {
      const value = traduz(node.value);
      if (value !== node.value) node.value = node.value.replace(node.value.trim(), value);
      return;
    }
    const classes = (atributo(node, 'class') || '').split(/\s+/);
    if (['script', 'style', 'svg', 'x-l'].includes(node.tagName) || classes.some(item => ['idiomas__menu', 'nav__marca', 'ch'].includes(item))) return;
    for (const attr of node.attrs || []) if (['aria-label', 'placeholder', 'alt', 'title'].includes(attr.name)) attr.value = traduz(attr.value);
    for (const child of node.childNodes || []) visita(child);
  }
  if (idioma !== 'pt') visita(body);
  const nomes = { pt: 'Português', en: 'English', es: 'Español', ru: 'Русский', zh: '中文' };
  const flags = { pt: 'br', en: 'us', es: 'es', ru: 'ru', zh: 'cn' };
  function marcaIdioma(node) {
    const classes = (atributo(node, 'class') || '').split(/\s+/);
    if (classes.includes('idiomas__codigo')) node.childNodes[0].value = idioma.toUpperCase();
    if (classes.includes('idiomas__botao')) {
      const img = node.childNodes.find(child => child.tagName === 'img');
      define(img, 'src', `/img/flags/${flags[idioma]}.svg`);
      define(img, 'alt', nomes[idioma]);
    }
    if (atributo(node, 'data-idioma')) {
      node.attrs = node.attrs.filter(item => item.name !== 'aria-current');
      if (atributo(node, 'data-idioma') === idioma) define(node, 'aria-current', 'page');
    }
    for (const child of node.childNodes || []) marcaIdioma(child);
  }
  marcaIdioma(body);
  define(root, 'lang', dados.locale);
  define(root, 'data-idioma', idioma);
  define(root, 'data-idioma-inicial', idioma);
  // Reaplicável: as páginas traduzidas são geradas do HTML final do Vite.
  head.childNodes = head.childNodes.filter(node => {
    if (node.tagName === 'title' || atributo(node, 'id') === 'seo-structured-data') return false;
    if (node.tagName === 'meta') {
      const name = atributo(node, 'name') || atributo(node, 'property') || '';
      if (['description', 'robots', 'author'].includes(name) || /^(og:|twitter:)/.test(name)) return false;
    }
    return !(node.tagName === 'link' && ['canonical', 'alternate'].includes(atributo(node, 'rel')));
  });
  const meta = (name, content, property = false) => `<meta ${property ? 'property' : 'name'}="${name}" content="${escapa(content)}">`;
  const json = JSON.stringify(dadosEstruturados(idioma)).replaceAll('<', '\\u003c');
  const fragment = parseFragment(`
    <title>${escapa(dados.title)}</title>
    ${meta('description', dados.description)}
    ${meta('author', 'Jony Peixoto')}
    ${meta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')}
    <link rel="canonical" href="${urlIdioma(idioma)}">
    ${alternativos.map(([lang, code]) => `<link rel="alternate" hreflang="${lang}" href="${urlIdioma(code)}">`).join('\n')}
    ${meta('og:type', 'website', true)}
    ${meta('og:site_name', 'THEJONYPEIXOTO.COM', true)}
    ${meta('og:title', dados.title, true)}
    ${meta('og:description', dados.description, true)}
    ${meta('og:url', urlIdioma(idioma), true)}
    ${meta('og:locale', dados.ogLocale, true)}
    ${Object.entries(seo).filter(([code]) => code !== idioma).map(([, item]) => meta('og:locale:alternate', item.ogLocale, true)).join('\n')}
    ${meta('og:image', imagemSocial, true)}
    ${meta('og:image:secure_url', imagemSocial, true)}
    ${meta('og:image:type', 'image/jpeg', true)}
    ${meta('og:image:width', '1200', true)}
    ${meta('og:image:height', '630', true)}
    ${meta('og:image:alt', 'Jony Peixoto — portrait with luminous glasses', true)}
    ${meta('twitter:card', 'summary_large_image')}
    ${meta('twitter:title', dados.title)}
    ${meta('twitter:description', dados.description)}
    ${meta('twitter:image', imagemSocial)}
    ${meta('twitter:image:alt', 'Jony Peixoto — portrait with luminous glasses')}
    <script type="application/ld+json" id="seo-structured-data">${json}</script>
  `);
  for (const node of fragment.childNodes) { node.parentNode = head; head.childNodes.push(node); }
  return serialize(doc);
}

export function sitemap() {
  const links = alternativos.map(([lang, code]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${urlIdioma(code)}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Object.keys(seo).map(code => `<url><loc>${urlIdioma(code)}</loc>${links}</url>`).join('')}</urlset>\n`;
}
