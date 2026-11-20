import '@fontsource/anton/400.css';
import '@fontsource/space-mono/400.css';
import '@fontsource-variable/caveat/wght.css';
import '@fontsource-variable/manrope/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/idiomas.css';
import './styles/enxame.css';
import './sections/nav.css';
import './sections/hero.css';
import './styles/secao.css';
import './sections/projetos.css';
import './sections/sobre.css';
import './sections/trajetoria.css';
import './sections/youtube.css';
import './sections/ias.css';
import './sections/marcas.css';
import { marcas } from './motion/marcas.js';
import './sections/gamer.css';
import { gamer } from './motion/gamer.js';
import { carrosselIAs } from './motion/ias.js';
import './sections/contato.css';
import './sections/noticias.css';
import { noticias } from './motion/noticias.js';
import './sections/barra.css';
import './estilo.js';

import { nav } from './motion/nav.js';
import { barra } from './motion/barra.js';
import { enxame } from './motion/enxame.js';
import { interface_ } from './motion/interface.js';
import { idiomas } from './motion/idiomas.js';
import { videoHero } from './motion/video-hero.js';
import { profundidade } from './motion/profundidade.js';
import { conviteWhatsApp } from './motion/whatsapp.js';
import { holograma } from './motion/holograma.js';

try {
  await idiomas();
} catch (erro) {
  console.error('Não foi possível carregar o idioma. Usando o conteúdo original.', erro);
}
import('./components/analytics.jsx')
  .then(({ montaAnalytics }) => montaAnalytics())
  .catch(erro => console.warn('Não foi possível inicializar o Analytics.', erro));
nav();
interface_();
try {
  await gamer();
} catch (erro) {
  console.error('Não foi possível abrir o leque de jogos. Mantendo a galeria original.', erro);
}
enxame(barra());
carrosselIAs();
marcas();
noticias();
videoHero();
profundidade();
conviteWhatsApp();
holograma();
