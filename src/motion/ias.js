import { gsap } from 'gsap';

export function carrosselIAs() {
  const secao = document.querySelector('.ias');
  if (!secao) return;
  const trilho = secao.querySelector('.ias__trilho');
  const janela = secao.querySelector('.ias__janela');
  const originais = [...trilho.children];
  for (const item of originais) {
    const copia = item.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    copia.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));
    copia.removeAttribute('data-camada');
    copia.querySelectorAll('[data-camada]').forEach(el => el.removeAttribute('data-camada'));
    trilho.append(copia);
  }
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let pausaAte = 0;

  let visivel = false;
  let x = 0;
  const posiciona = () => {
    const largura = trilho.scrollWidth / 2;
    if (!largura) return;
    x = ((x % largura) + largura) % largura;
    gsap.set(trilho, { x: -x });
  };
  const avanca = direcao => {
    pausaAte = performance.now() + 6000;
    x += direcao * originais[0].getBoundingClientRect().width;
    posiciona();
  };
  secao.querySelector('[data-ias-anterior]').addEventListener('click', () => avanca(-1));
  secao.querySelector('[data-ias-proxima]').addEventListener('click', () => avanca(1));
  janela.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    avanca(event.key === 'ArrowRight' ? 1 : -1);
  });
  new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; }).observe(secao);
  gsap.ticker.add((_, dt) => {
    const pronta = !document.documentElement.classList.contains('monta') || originais.every(item => item.classList.contains('c-pronta'));
    secao.classList.toggle('ias--pronta', pronta);
    const interagindo = hover.matches && janela.matches(':hover, :focus-within');
    if (!visivel || reduzido.matches || performance.now() < pausaAte || document.hidden || interagindo) return;
    if (!pronta) return;
    x += Math.min(dt, 64) / 1000 * 28;
    posiciona();
  });
  if ('ResizeObserver' in window) new ResizeObserver(posiciona).observe(janela);
  else window.addEventListener('resize', posiciona, { passive: true });
}
