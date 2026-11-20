import { gsap } from 'gsap';

export function noticias() {
  const lista = document.querySelector('.noticias__lista');
  if (!lista) return;
  const itens = [...lista.children];
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let visivel = false;
  let pausaAte = 0;
  let posicao = 0;
  const pausa = () => { pausaAte = performance.now() + 6000; };
  lista.addEventListener('pointerdown', pausa);
  lista.addEventListener('touchmove', pausa, { passive: true });
  lista.addEventListener('wheel', pausa, { passive: true });
  new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; }).observe(lista);
  gsap.ticker.add((_, dt) => {
    const pronta = !document.documentElement.classList.contains('monta') || itens.every(item => item.classList.contains('c-pronta'));
    const interagindo = hover.matches && lista.matches(':hover, :focus-within');
    const anda = visivel && pronta && !reduzido.matches && !document.hidden && performance.now() >= pausaAte && !interagindo;
    lista.classList.toggle('noticias__lista--automatica', anda);
    if (!anda) { posicao = lista.scrollLeft; return; }
    posicao += Math.min(dt, 64) / 1000 * 16;
    if (posicao >= lista.scrollWidth - lista.clientWidth) posicao = 0;
    lista.scrollLeft = posicao;
  });
}
