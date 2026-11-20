import { gsap } from 'gsap';

export function holograma() {
  const nome = document.querySelector('.hero__jonis');
  if (!nome) return;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  let visivel = false;
  let tempo = 0;
  new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; }).observe(nome);
  gsap.ticker.add((_, dt) => {
    if (!visivel || document.hidden || reduzido.matches) return;
    if (document.documentElement.classList.contains('monta') && !nome.classList.contains('c-pronta')) return;
    tempo += Math.min(dt, 64) / 1000;
    const video = document.querySelector('video.hero__video');
    const fase = video && !video.paused && video.duration ? video.currentTime / video.duration : tempo / 30;
    const luz = (1 - Math.cos(fase * Math.PI * 2)) * 50;
    nome.style.backgroundPosition = `${luz.toFixed(2)}% 50%`;
    nome.style.setProperty('--holo-y', `${(Math.sin(tempo / 24 * Math.PI * 2) * 1.5).toFixed(2)}px`);
  });
}
