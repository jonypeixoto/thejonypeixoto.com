import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { preparaPagina, sitemap } from './scripts/seo-html.js';
import { seo, idiomaPorCaminho } from './src/seo/config.js';

// Uma seção por arquivo: <!-- @secao hero --> no index.html vira o conteúdo de src/sections/hero.html
// (vale dentro das próprias seções: o hero inclui o painel).
const MARCA = /<!--\s*@secao\s+([\w-]+)\s*-->/g;
const inclui = (html) =>
  html.replace(MARCA, (_, nome) => inclui(readFileSync(resolve(import.meta.dirname, `src/sections/${nome}.html`), 'utf8')));
const secoes = () => ({
  name: 'secoes',
  transformIndexHtml: { order: 'pre', handler(html, context) {
    const path = new URL(context.originalUrl || context.path || '/', 'http://localhost').pathname;
    if (/^\/privacidade(?:\/|$)/.test(path)) return inclui(html);
    return preparaPagina(inclui(html), idiomaPorCaminho(path));
  } },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] !== '/sitemap.xml') return next();
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.end(sitemap());
    });
  },
  generateBundle: { order: 'post', handler(_, bundle) {
    const index = bundle['index.html'];
    if (!index || index.type !== 'asset') throw new Error('HTML principal não foi gerado.');
    for (const [idioma, dados] of Object.entries(seo)) {
      if (idioma === 'pt') continue;
      this.emitFile({ type: 'asset', fileName: `${dados.path.slice(1)}index.html`, source: preparaPagina(String(index.source), idioma) });
    }
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() });
  } },
  handleHotUpdate({ file, server }) {
    if (file.includes('/src/sections/') && file.endsWith('.html')) server.ws.send({ type: 'full-reload' });
  },
});

export default defineConfig({
  plugins: [secoes()],
  build: { target: 'es2022', assetsInlineLimit: 0, rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), privacidade: resolve(import.meta.dirname, 'privacidade/index.html') } } },
});
