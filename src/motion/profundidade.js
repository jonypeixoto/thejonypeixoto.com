import { gsap } from 'gsap';
import { novoAgente } from './agentes.js';
import { observaMidia } from './compatibilidade.js';

export function profundidade() {
  const preferencias = gsap.matchMedia();
  preferencias.add('(prefers-reduced-motion: no-preference)', () => {
    const palco = document.createElement('div');
    palco.className = 'profundidade';
    palco.setAttribute('aria-hidden', 'true');
    document.body.append(palco);
    const celular = matchMedia('(max-width: 760px)');
    const foto = document.querySelector('.hero__retrato');
    let linhas = [];
    let montadoAntes = false;
    const sincroniza = () => {
      const montado = !document.documentElement.classList.contains('monta') || foto?.classList.contains('c-pronta');
      if (montado && !montadoAntes) {
        montadoAntes = true;
        cria();
        return;
      }
      montadoAntes = montado;
      const ativo = montado && !document.hidden;
      palco.style.visibility = montado ? 'visible' : 'hidden';
      for (const linha of linhas) linha.paused(!ativo);
    };
    const cria = () => {
      linhas.forEach(linha => linha.kill());
      palco.replaceChildren();
      linhas = [];
      const total = celular.matches ? 2 : 5;
      for (let i = 0; i < total; i++) {
        const agente = novoAgente(i + 2, palco);
        gsap.set(agente.el, { opacity: 0 });
        const linha = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.5,
          repeatRefresh: true,
          delay: i * 1.8,
          paused: true,
        });
        linha.set(agente.el, {
          x: () => innerWidth * gsap.utils.random(0.25, 0.75),
          y: () => innerHeight * gsap.utils.random(0.2, 0.8),
          z: -2600,
          opacity: 0,
          filter: 'blur(2px)',
          scale: 1,
        });
        linha.to(agente.el, { opacity: 0.85, duration: 2, ease: 'sine.out' }, 0);
        linha.to(agente.el, {
          x: () => innerWidth * gsap.utils.random(0.08, 0.92),
          y: () => innerHeight * gsap.utils.random(0.12, 0.82),
          z: 0,
          filter: 'blur(0px)',
          duration: 7,
          ease: 'power1.out',
        }, 0);
        linha.to(agente.el, { x: '+=50', y: '-=24', duration: 2.5, ease: 'sine.inOut' });
        linha.to(agente.el, { opacity: 0, duration: 1.2 }, '-=1.2');
        linhas.push(linha);
      }
      sincroniza();
    };
    const observador = new MutationObserver(sincroniza);
    if (foto) observador.observe(foto, { attributes: true, attributeFilter: ['class'] });
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', sincroniza);
    const desligaMidia = observaMidia(celular, cria);
    cria();
    return () => {
      linhas.forEach(linha => linha.kill());
      observador.disconnect();
      document.removeEventListener('visibilitychange', sincroniza);
      desligaMidia();
      palco.remove();
    };
  });
}
