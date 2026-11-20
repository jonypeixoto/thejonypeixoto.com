export const origem = 'https://www.thejonypeixoto.com';
export const imagemSocial = `${origem}/og.jpg`;

export const seo = {
  pt: {
    path: '/', locale: 'pt-BR', ogLocale: 'pt_BR',
    title: 'Inteligência Artificial e Sites 3D no Rio | Jony Peixoto',
    description: 'Engenharia de inteligência artificial, criação de sites 3D, SaaS, XaaS e plataformas com Jony Peixoto. Atendimento no Rio de Janeiro, Reino Unido e mundo.',
  },
  en: {
    path: '/en/', locale: 'en-GB', ogLocale: 'en_GB',
    title: 'AI Engineering, 3D Websites & SaaS | Jony Peixoto',
    description: 'AI engineering, 3D websites, SaaS, XaaS and custom platforms with Jony Peixoto. Remote projects for Rio de Janeiro, the United Kingdom and clients worldwide.',
  },
  es: {
    path: '/es/', locale: 'es', ogLocale: 'es_ES',
    title: 'Inteligencia Artificial, Sitios 3D y SaaS | Jony Peixoto',
    description: 'Ingeniería de inteligencia artificial, sitios web 3D, SaaS, XaaS y plataformas con Jony Peixoto. Atención remota en Río de Janeiro, Reino Unido y todo el mundo.',
  },
  ru: {
    path: '/ru/', locale: 'ru', ogLocale: 'ru_RU',
    title: 'Инженерия ИИ, 3D-сайты и SaaS | Jony Peixoto',
    description: 'Инженерия искусственного интеллекта, 3D-сайты, SaaS, XaaS и платформы с Jony Peixoto. Удалённая работа: Рио-де-Жанейро, Великобритания и весь мир.',
  },
  ar: {
    path: '/ar/', locale: 'ar', ogLocale: 'ar_AE',
    title: 'هندسة الذكاء الاصطناعي ومواقع ثلاثية الأبعاد | Jony Peixoto',
    description: 'هندسة الذكاء الاصطناعي وتطوير المواقع ثلاثية الأبعاد ومنصات SaaS وXaaS مع Jony Peixoto. خدمات عن بُعد لريو دي جانيرو والمملكة المتحدة والعالم.',
  },
  zh: {
    path: '/zh/', locale: 'zh-CN', ogLocale: 'zh_CN',
    title: '人工智能工程、3D 网站与 SaaS 平台 | Jony Peixoto',
    description: 'Jony Peixoto 提供人工智能工程、3D 网站制作、SaaS、XaaS 和定制平台开发，远程服务覆盖里约热内卢、英国及全球客户。',
  },
};

export const idiomaPorCaminho = pathname => Object.keys(seo).find(idioma => seo[idioma].path === `${pathname.replace(/\/+$/, '')}/`) || 'pt';
export const urlIdioma = idioma => `${origem}${seo[idioma]?.path || '/'}`;
export const alternativos = [
  ['pt-BR', 'pt'], ['pt', 'pt'], ['en-GB', 'en'], ['en', 'en'],
  ['es', 'es'], ['ru', 'ru'], ['ar', 'ar'], ['zh-Hans', 'zh'], ['zh-CN', 'zh'], ['x-default', 'pt'],
];

export function dadosEstruturados(idioma = 'pt') {
  const dados = seo[idioma];
  const person = `${origem}/#jony`;
  const business = `${origem}/#organization`;
  const service = `${origem}/#services`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': person, name: 'Jony Peixoto', url: origem,
        jobTitle: 'AI & Automation Engineer', image: `${origem}/img/jony-perfil.webp`,
        knowsAbout: ['Artificial intelligence', 'AI engineering', 'Automation', '3D websites', 'SaaS', 'XaaS', 'Platform development'],
        sameAs: ['https://github.com/jonypeixoto', 'https://www.linkedin.com/in/jonypeixoto/', 'https://www.youtube.com/@thejonypeixoto', 'https://jonypeixoto.substack.com/', 'https://share.google/qtJsRMuGWMKr3FFDJ'],
      },
      {
        '@type': 'Organization', '@id': business, name: 'THEJONYPEIXOTO.COM',
        alternateName: 'Jony Peixoto', url: origem, founder: { '@id': person },
        email: 'info@jonypeixoto.com', telephone: '+5521978767083',
        contactPoint: {
          '@type': 'ContactPoint', contactType: 'project enquiries',
          url: 'https://tally.so/r/Z9OlBy', availableLanguage: ['pt-BR', 'en-GB', 'es', 'ru', 'zh-CN'],
        },
      },
      {
        '@type': 'Service', '@id': service, name: dados.title, description: dados.description,
        provider: { '@id': person },
        serviceType: ['Artificial intelligence engineering', 'Website development', '3D website development', 'SaaS development', 'XaaS development', 'Digital platform development'],
        areaServed: [
          { '@type': 'City', name: 'Rio de Janeiro', containedInPlace: { '@type': 'Country', name: 'Brazil' } },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Place', name: 'Worldwide — remote services' },
        ],
      },
      {
        '@type': 'WebSite', '@id': `${origem}/#website`, name: 'THEJONYPEIXOTO.COM',
        alternateName: 'Jony Peixoto', url: `${origem}/`, publisher: { '@id': business },
        inLanguage: Object.values(seo).map(item => item.locale),
      },
      {
        '@type': 'WebPage', '@id': `${urlIdioma(idioma)}#webpage`, url: urlIdioma(idioma),
        name: dados.title, description: dados.description, inLanguage: dados.locale,
        isPartOf: { '@id': `${origem}/#website` }, about: { '@id': person },
        mainEntity: { '@id': service }, primaryImageOfPage: { '@type': 'ImageObject', url: imagemSocial },
      },
    ],
  };
}

export function atualizaSeo(idioma) {
  const dados = seo[idioma] || seo.pt;
  document.title = dados.title;
  const set = (selector, value, attribute = 'content') => document.querySelector(selector)?.setAttribute(attribute, value);
  set('meta[name="description"]', dados.description);
  set('link[rel="canonical"]', urlIdioma(idioma), 'href');
  for (const family of ['og', 'twitter']) {
    const attr = family === 'og' ? 'property' : 'name';
    set(`meta[${attr}="${family}:title"]`, dados.title);
    set(`meta[${attr}="${family}:description"]`, dados.description);
  }
  set('meta[property="og:url"]', urlIdioma(idioma));
  set('meta[property="og:locale"]', dados.ogLocale);
  const graph = document.getElementById('seo-structured-data');
  if (graph) graph.textContent = JSON.stringify(dadosEstruturados(idioma));
}
