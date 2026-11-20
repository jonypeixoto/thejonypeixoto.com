import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal, flushSync } from 'react-dom';
import CardFanCarousel from './ui/card-fan-carousel.jsx';

function ProjectLinks({ card }) {
  return <div className="gamer__fan-links">{card.links.map(link => (
    <a key={link.label} className="sel" href={link.href} target="_blank" rel="noopener">{link.label}</a>
  ))}</div>;
}

function FanContents({ cards }) {
  const root = React.useRef(null);
  const [media, setMedia] = React.useState([]);
  const [center, setCenter] = React.useState(cards.length > 7 ? 3 : cards.length >> 1);
  const images = React.useMemo(() => cards.map(card => ({ imgUrl: card.imgUrl, alt: card.alt })), [cards]);
  React.useLayoutEffect(() => {
    const host = root.current;
    const elementos = [...host.querySelectorAll('.cf-card')];
    setMedia(elementos.map(el => el.querySelector('.cf-media')));
    host.querySelector('.cf-arrow:first-child')?.setAttribute('aria-label', document.querySelector('[data-gamer-passo="-1"]').getAttribute('aria-label'));
    host.querySelector('.cf-arrow:last-child')?.setAttribute('aria-label', document.querySelector('[data-gamer-passo="1"]').getAttribute('aria-label'));
    const dots = host.querySelector('.cf-dots');
    let toque;
    const iniciaToque = evento => {
      const ponto = evento.touches[0];
      toque = { x: ponto.clientX, y: ponto.clientY };
    };
    const terminaToque = evento => {
      if (!toque) return;
      const ponto = evento.changedTouches[0];
      const dx = ponto.clientX - toque.x;
      const dy = ponto.clientY - toque.y;
      toque = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      host.querySelector(dx < 0 ? '.cf-arrow:last-child' : '.cf-arrow:first-child')?.click();
    };
    host.addEventListener('touchstart', iniciaToque, { passive: true });
    host.addEventListener('touchend', terminaToque, { passive: true });
    const observer = new MutationObserver(() => {
      const index = [...dots.children].findIndex(el => el.classList.contains('cf-dot--active'));
      if (index >= 0) setCenter(index);
    });
    if (dots) observer.observe(dots, { subtree: true, attributes: true, attributeFilter: ['class'] });
    const acessibilidade = new MutationObserver(() => {
      for (const el of elementos) {
        const oculta = Number(el.style.opacity || 0) < 0.05;
        el.setAttribute('aria-hidden', String(oculta));
        el.querySelectorAll('a').forEach(link => { link.tabIndex = oculta ? -1 : 0; });
      }
    });
    elementos.forEach(el => acessibilidade.observe(el, { attributes: true, attributeFilter: ['style'] }));
    return () => {
      observer.disconnect();
      acessibilidade.disconnect();
      host.removeEventListener('touchstart', iniciaToque);
      host.removeEventListener('touchend', terminaToque);
    };
  }, []);
  return <div ref={root}>
    <CardFanCarousel cards={images} className="gamer__leque" />
    {media.map((host, index) => createPortal(<>
      <a className="gamer__play gamer__fan-play" href={cards[index].video} target="_blank" rel="noopener" aria-label={cards[index].videoLabel}>▶</a>
      <div className="gamer__fan-plataformas"><ProjectLinks card={cards[index]} /></div>
    </>, host, String(index)))}
    <div className="gamer__fan-detalhe">
      <h4>{cards[center].title}</h4>
      <ProjectLinks card={cards[center]} />
    </div>
  </div>;
}

function GamerFan({ host, cards }) {
  const [ready, setReady] = React.useState(!document.documentElement.classList.contains('monta'));
  React.useEffect(() => {
    const sincroniza = () => setReady(!document.documentElement.classList.contains('monta') || host.classList.contains('c-pronta'));
    const observer = new MutationObserver(sincroniza);
    observer.observe(host, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    sincroniza();
    return () => observer.disconnect();
  }, [host]);
  return ready ? <FanContents cards={cards} /> : null;
}

export function montaGamer(secao, cards) {
  const host = document.createElement('div');
  host.className = 'gamer__fan';
  host.dataset.camada = 'bloco';
  host.setAttribute('role', 'region');
  host.setAttribute('aria-label', secao.querySelector('.gamer__trilho').getAttribute('aria-label'));
  secao.querySelector('.gamer__trilho').before(host);
  const root = createRoot(host);
  flushSync(() => root.render(<GamerFan host={host} cards={cards} />));
}
