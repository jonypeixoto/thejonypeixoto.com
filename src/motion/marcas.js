import { gsap } from 'gsap';

export function marcas() {
  const secao = document.querySelector('.marcas');
  if (!secao) return;
  const janela = secao.querySelector('.marcas__janela');
  const trilho = secao.querySelector('.marcas__trilho');
  const originais = [...trilho.children];
  for (const item of originais) {
    const copia = item.cloneNode(true);
    copia.removeAttribute('data-camada');
    copia.setAttribute('aria-hidden', 'true');
    trilho.append(copia);
  }
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let visivel = false;
  let pausaAte = 0;
  let posicao = janela.scrollLeft;
  const pausa = () => { pausaAte = performance.now() + 6000; };
  janela.addEventListener('pointerdown', pausa);
  janela.addEventListener('wheel', pausa, { passive: true });
  janela.addEventListener('touchmove', pausa, { passive: true });
  janela.addEventListener('keydown', evento => {
    if (!['ArrowLeft', 'ArrowRight'].includes(evento.key)) return;
    evento.preventDefault();
    pausa();
    const passo = originais[0].getBoundingClientRect().width + parseFloat(getComputedStyle(trilho).gap);
    janela.scrollBy({ left: (evento.key === 'ArrowRight' ? 1 : -1) * passo, behavior: reduzido.matches ? 'auto' : 'smooth' });
  });
  new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; }).observe(janela);
  gsap.ticker.add((_, dt) => {
    const pronta = !document.documentElement.classList.contains('monta') || originais.every(item => item.classList.contains('c-pronta'));
    secao.classList.toggle('marcas--prontas', pronta);
    const interagindo = hover.matches && janela.matches(':hover, :focus-within');
    if (!pronta || !visivel || reduzido.matches || interagindo || document.hidden || performance.now() < pausaAte) {
      posicao = janela.scrollLeft;
      return;
    }
    const largura = trilho.children[originais.length].offsetLeft - originais[0].offsetLeft;
    if (!largura) return;
    posicao = (posicao + Math.min(dt, 64) / 1000 * 24) % largura;
    janela.scrollLeft = posicao;
  });
}
