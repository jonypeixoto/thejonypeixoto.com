import { seo, atualizaSeo, idiomaPorCaminho } from '../seo/config.js';

const arquivos = import.meta.glob('../locales/*.json', { import: 'default' });
const configuracao = {
  pt: { locale: 'pt-BR', pais: 'br', nome: 'Português' },
  en: { locale: 'en-GB', pais: 'us', nome: 'English' },
  es: { locale: 'es', pais: 'es', nome: 'Español' },
  ru: { locale: 'ru', pais: 'ru', nome: 'Русский' },
  zh: { locale: 'zh-CN', pais: 'cn', nome: '中文' },
};
const normaliza = texto => texto.replace(/\s+/g, ' ').trim();
const ignorado = el => el.closest('script, style, .idiomas__menu, .nav__marca, svg, x-l, .ch');

export async function idiomas() {
  const url = new URL(location.href);
  const legado = url.searchParams.get('lang');
  if (configuracao[legado]) {
    url.pathname = seo[legado].path;
    url.searchParams.delete('lang');
    location.replace(url.href);
    // Aguarda a navegação para não montar conteúdo de outro idioma.
    await new Promise(() => {});
  }
  // Cada URL tem um idioma estável, independente de cookies e navegador.
  const idioma = configuracao[legado] ? legado : idiomaPorCaminho(url.pathname);
  const dados = configuracao[idioma];
  document.documentElement.lang = dados.locale;
  document.documentElement.dataset.idioma = idioma;
  atualizaSeo(idioma);
  const mensagensWhatsApp = {
    pt: 'Opa ! Tudo bem ? Cheguei através do site: THEJONYPEIXOTO.COM e gostaria de implementar inteligência artificial nos meus projetos. Pode me ajudar ?',
    en: 'Hi! How are you? I found you through THEJONYPEIXOTO.COM and would like to implement artificial intelligence in my projects. Can you help me?',
    es: '¡Hola! ¿Cómo estás? Llegué a través del sitio THEJONYPEIXOTO.COM y me gustaría implementar inteligencia artificial en mis proyectos. ¿Puedes ayudarme?',
    ru: 'Привет! Как дела? Я нашёл вас через сайт THEJONYPEIXOTO.COM и хотел бы внедрить искусственный интеллект в свои проекты. Можете мне помочь?',
    zh: '你好！最近怎么样？我通过 THEJONYPEIXOTO.COM 网站找到了你，希望在我的项目中应用人工智能。你能帮助我吗？',
  };
  const conversa = document.querySelector('.nav__cta');
  if (conversa) {
    const contato = new URL(conversa.href);
    contato.searchParams.set('text', mensagensWhatsApp[idioma]);
    conversa.href = contato.href;
  }
  const mensagensProblema = {
    pt: 'Oi, vim pelo site THEJONYPEIXOTO.COM e estou com o seguinte problema: [DESCREVA O SEU PROBLEMA AQUI]. Como posso utilizar inteligência artificial nesse problema ?',
    en: 'Hi, I came from THEJONYPEIXOTO.COM and I have the following problem: [DESCRIBE YOUR PROBLEM HERE]. How can I use artificial intelligence to solve this problem?',
    es: 'Hola, llegué desde THEJONYPEIXOTO.COM y tengo el siguiente problema: [DESCRIBE TU PROBLEMA AQUÍ]. ¿Cómo puedo utilizar inteligencia artificial para resolver este problema?',
    ru: 'Здравствуйте! Я пришёл с сайта THEJONYPEIXOTO.COM, и у меня следующая проблема: [ОПИШИТЕ ВАШУ ПРОБЛЕМУ ЗДЕСЬ]. Как я могу использовать искусственный интеллект для её решения?',
    zh: '你好，我通过 THEJONYPEIXOTO.COM 网站找到你，我遇到了以下问题：[请在此描述您的问题]。我可以如何利用人工智能解决这个问题？',
  };
  const mensagensPortfolio = {
    pt: 'Oi, tudo bem? Chequei o seu portfólio e gostaria de mostrar o que preciso para fazermos negócio...',
    en: "Hi, how are you? I checked your portfolio and I'd like to show you what I need for us to do business...",
    es: 'Hola, ¿cómo estás? Revisé tu portafolio y me gustaría mostrarte lo que necesito para que hagamos negocios...',
    ru: 'Здравствуйте! Я посмотрел ваше портфолио и хотел бы рассказать, что мне нужно для совместной работы...',
    zh: '你好！我看了你的作品集，想向你介绍我的需求，以便探讨合作……',
  };
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    const endereco = new URL(link.href);
    const mensagens = link.dataset.whatsapp === 'problema' ? mensagensProblema
      : link.matches('.nav__cta, .ias__contato') ? mensagensWhatsApp : mensagensPortfolio;
    endereco.searchParams.set('text', mensagens[idioma]);
    link.href = endereco.href;
  });
  const seletor = document.querySelector('.idiomas');
  const bandeira = seletor.querySelector('summary img');
  bandeira.src = `/img/flags/${dados.pais}.svg`;
  bandeira.alt = dados.nome;
  seletor.querySelector('.idiomas__codigo').textContent = idioma.toUpperCase();
  seletor.querySelectorAll('[data-idioma]').forEach(botao => {
    if (botao.dataset.idioma === idioma) botao.setAttribute('aria-current', 'page');
    botao.addEventListener('click', () => {
      try { localStorage.setItem('jony-idioma', botao.dataset.idioma); } catch {}
      // O href continua funcionando sem JS e pode ser rastreado pelos buscadores.
    });
  });
  document.addEventListener('click', evento => { if (!seletor.contains(evento.target)) seletor.open = false; });
  seletor.addEventListener('keydown', evento => { if (evento.key === 'Escape') { seletor.open = false; seletor.querySelector('summary').focus(); } });
  const dicionario = await arquivos[`../locales/${idioma}.json`]();
  const traduz = texto => dicionario[normaliza(texto)] || texto;
  seletor.querySelector('summary').setAttribute('aria-label', traduz('Escolha o idioma'));
  seletor.querySelector('.idiomas__menu').setAttribute('aria-label', traduz('Escolha o idioma'));
  const aplica = raiz => {
    if (raiz.nodeType === Node.TEXT_NODE) {
      if (!raiz.parentElement || ignorado(raiz.parentElement)) return;
      const original = raiz.textContent;
      const valor = traduz(original);
      if (valor !== original && valor !== normaliza(original)) raiz.textContent = original.replace(original.trim(), valor);
      return;
    }
    if (raiz.nodeType !== Node.ELEMENT_NODE || ignorado(raiz)) return;
    for (const atributo of ['aria-label', 'placeholder', 'alt', 'title']) {
      const texto = raiz.getAttribute(atributo);
      if (texto) {
        const valor = traduz(texto);
        if (valor !== texto) raiz.setAttribute(atributo, valor);
      }
    }
    [...raiz.childNodes].forEach(aplica);
  };
  if (idioma !== 'pt') {
    aplica(document.body);
    new MutationObserver(mudancas => {
      for (const mudanca of mudancas) {
        if (mudanca.type === 'characterData') aplica(mudanca.target);
        else mudanca.addedNodes.forEach(aplica);
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true });
  }
}
