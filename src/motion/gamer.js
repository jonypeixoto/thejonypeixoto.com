export async function gamer() {
  const secao = document.querySelector('.gamer');
  if (!secao) return;
  const lista = secao.querySelector('.gamer__trilho');
  const controles = secao.querySelector('.gamer__controles');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...lista.children].map(item => ({
    imgUrl: item.querySelector('img').getAttribute('src'),
    alt: item.querySelector('img').alt,
    title: item.querySelector('h4').textContent,
    video: item.querySelector('.gamer__play').href,
    videoLabel: item.querySelector('.gamer__play').getAttribute('aria-label'),
    links: [...item.querySelectorAll('.gamer__links a')].map(link => ({
      label: link.textContent,
      href: link.href,
    })),
  }));
  controles.querySelectorAll('[data-gamer-passo]').forEach(botao => {
    botao.addEventListener('click', () => {
      const passo = lista.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(lista).gap);
      lista.scrollBy({ left: Number(botao.dataset.gamerPasso) * passo, behavior: reduzido.matches ? 'auto' : 'smooth' });
    });
  });
  if (reduzido.matches) return;
  const { montaGamer } = await import('../components/gamer-fan.jsx');
  montaGamer(secao, cards);
  lista.hidden = true;
  controles.hidden = true;
  lista.removeAttribute('data-duplica');
  for (const el of [controles, ...controles.querySelectorAll('[data-camada]'), ...lista.querySelectorAll('[data-camada]')]) {
    el.removeAttribute('data-camada');
  }
  // A galeria HTML continua utilizável até a ilha React se aproximar da tela.
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    try {
      const { montaGamer } = await import('../components/gamer-fan.jsx');
      montaGamer(secao, cards);
      lista.hidden = true;
      controles.hidden = true;
    } catch (erro) { console.warn('Galeria original mantida.', erro); }
  }, { rootMargin: '900px' });
  observer.observe(secao);
}
