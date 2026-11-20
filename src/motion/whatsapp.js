export function conviteWhatsApp() {
  const botao = document.querySelector('.whatsapp-flutuante');
  if (!botao) return;
  let anterior = scrollY;
  let distancia = 0;
  let ultimaExibicao = -Infinity;
  let fechar;
  const esconde = () => {
    clearTimeout(fechar);
    botao.classList.remove('whatsapp-flutuante--convite');
  };
  window.addEventListener('scroll', () => {
    const atual = scrollY;
    distancia += Math.max(0, atual - anterior);
    anterior = atual;
    const agora = performance.now();
    const intervalo = ultimaExibicao === -Infinity ? 0 : 14000;
    const minimo = ultimaExibicao === -Infinity ? Math.max(120, innerHeight * 0.25) : Math.max(600, innerHeight);
    if (document.hidden || distancia < minimo || agora - ultimaExibicao < intervalo || botao.matches(':focus-visible')) return;
    distancia = 0;
    ultimaExibicao = agora;
    botao.classList.add('whatsapp-flutuante--convite');
    clearTimeout(fechar);
    fechar = setTimeout(esconde, 4500);

  }, { passive: true });
  botao.addEventListener('click', esconde);
  botao.addEventListener('keydown', evento => { if (evento.key === 'Escape') esconde(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) esconde(); });
}
