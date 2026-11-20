import { gsap } from 'gsap';
import { videoAlpha } from './video-alpha.js';
import { rostoFluido } from './rosto-fluido.js';
import { observaMidia } from './compatibilidade.js';

export function videoHero() {
  const camada = document.querySelector('.hero__retrato');
  if (!camada) return;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  const celular = matchMedia('(max-width: 760px)');
  const video = document.createElement('video');
  video.className = 'hero__video hero__video--fonte';
  video.muted = true;
  video.loop = false;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('disablepictureinpicture', '');
  camada.append(video);
  const fluido = rostoFluido(camada);
  const renderer = videoAlpha(video, { fluido, packed: celular.matches });
  if (!renderer) return;
  camada.append(renderer.canvas);
  camada.classList.add('rosto-fluido', 'rosto-intro');
  renderer.setReveal(0);
  camada.dataset.rosto = 'intro';
  let entradaConcluida = false;
  const transicao = { reveal: 0 };
  let visivel = false, falhou = false, tentando = false;
  let packed = celular.matches, alphaVerificado = false, estavaMontada = false;
  const montada = () => !document.documentElement.classList.contains('monta') || camada.classList.contains('c-pronta');
  const esconde = () => {
    video.pause();
    fluido.pause();
    if (camada.classList.contains('video-ativo')) camada.classList.remove('video-ativo');
  };
  const usaAlternativa = () => {
    if (packed && video.src) { falhou = true; esconde(); return; }
    packed = true;
    renderer.setPacked(true);
    video.src = '/video/jony-alpha-mobile.mp4';
    video.load();
  };
  const sincroniza = async () => {
    const pronta = montada();
    if (!pronta && estavaMontada) {
      fluido.reset();
      gsap.killTweensOf(transicao);
      transicao.reveal = 0;
      renderer.setReveal(0);
      entradaConcluida = false;
      video.currentTime = 0;
      camada.dataset.rosto = 'intro';
      if (!camada.classList.contains('rosto-intro')) camada.classList.add('rosto-intro');
    }
    estavaMontada = pronta;
    if (reduzido.matches || !pronta || falhou) { esconde(); return; }
    if (!visivel || document.hidden) { video.pause(); fluido.pause(); return; }
    if (entradaConcluida) return;
    if (tentando || !video.paused) return;
    tentando = true;
    try {
      if (!video.src) video.src = packed ? '/video/jony-alpha-mobile.mp4' : '/video/jony-sem-fundo.webm';
      await video.play();
    } catch { esconde(); }
    finally { tentando = false; }
  };
  const verificaAlpha = () => {
    if (packed || alphaVerificado) return true;
    const teste = document.createElement('canvas');
    teste.width = teste.height = 1;
    const ctx = teste.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1);
    if (ctx.getImageData(0, 0, 1, 1).data[3] > 128) { usaAlternativa(); return false; }
    alphaVerificado = true;
    return true;
  };
  video.addEventListener('error', usaAlternativa);
  video.addEventListener('loadeddata', sincroniza);
  video.addEventListener('ended', () => {
    entradaConcluida = true;
    camada.dataset.rosto = 'efeitos';
    camada.classList.remove('rosto-intro');
    fluido.reset();
    // A foto reaparece enquanto o vídeo completo se dissolve. Depois, os
    // óculos usam um único quadro, sem movimentar o rosto sob a máscara.
    gsap.to(transicao, {
      reveal: 1, duration: 0.8, ease: 'power2.inOut',
      onUpdate: () => renderer.setReveal(transicao.reveal),
      onComplete: () => { video.currentTime = 0; },
    });
  });
  gsap.ticker.add((_, dt) => {
    if (falhou || reduzido.matches || !visivel || document.hidden || (!entradaConcluida && video.paused) || video.readyState < 2 || !montada()) return;
    try {
      if (!verificaAlpha()) return;
      // O tempo da máscara acompanha a velocidade global da montagem.
      if (entradaConcluida) fluido.update(Math.min(dt, 64) / 1000 * gsap.globalTimeline.timeScale());
      if (renderer.desenha()) {
        if (!camada.classList.contains('video-ativo')) camada.classList.add('video-ativo');
      }
      else { falhou = true; esconde(); }
    } catch { falhou = true; esconde(); }
  });
  new MutationObserver(sincroniza).observe(camada, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sincroniza).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; sincroniza(); }).observe(camada);
  document.addEventListener('visibilitychange', sincroniza);
  observaMidia(reduzido, sincroniza);
}
