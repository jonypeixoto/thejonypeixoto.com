# SEO, idiomas e descoberta local

[Voltar ao README](../README.md)

## Título e descrição

**Português — página principal**

- Título: **Inteligência Artificial e Sites 3D no Rio | Jony Peixoto**
- Descrição: **Engenharia de inteligência artificial, criação de sites 3D, SaaS, XaaS e plataformas com Jony Peixoto. Atendimento no Rio de Janeiro, Reino Unido e mundo.**

**Inglês — Reino Unido e público internacional**

- Título: **AI Engineering, 3D Websites & SaaS | Jony Peixoto**
- Descrição: **AI engineering, 3D websites, SaaS, XaaS and custom platforms with Jony Peixoto. Remote projects for Rio de Janeiro, the United Kingdom and clients worldwide.**

As versões em espanhol, russo e chinês também têm títulos e descrições próprios. A fonte é `src/seo/config.js`; o plugin aplica os metadados ao HTML e o navegador os mantém sincronizados. O texto visível de serviços cobre as intenções de busca: inteligência artificial, engenharia de inteligência artificial, criar um site, criar um site 3D, SaaS, XaaS e criar uma plataforma.

Não foi adicionada uma lista de `meta keywords`: ela não substitui conteúdo relevante nem determina a classificação no Google. Títulos e descrições são sugestões ao buscador, que pode apresentar outro texto conforme a consulta.

## URLs estáveis por idioma

| URL | Idioma e público |
|---|---|
| `https://www.thejonypeixoto.com/` | Português brasileiro; destaque para Rio de Janeiro. |
| `https://www.thejonypeixoto.com/en/` | Inglês britânico; Reino Unido e público internacional em inglês. |
| `https://www.thejonypeixoto.com/es/` | Espanhol. |
| `https://www.thejonypeixoto.com/ru/` | Russo. |
| `https://www.thejonypeixoto.com/zh/` | Chinês simplificado. |

Cada versão tem conteúdo traduzido no HTML gerado, sem precisar executar JavaScript para ler os textos. `parse5` faz a transformação no desenvolvimento e no build; não é enviado ao navegador. O seletor usa links HTML rastreáveis.

A raiz passa a abrir em português de forma estável. O idioma não é mais alterado automaticamente por cookies ou pela configuração do navegador. Links antigos `?lang=en`, por exemplo, são encaminhados pelo cliente para `/en/`, conservando parâmetros de apresentação e fragmentos. O sitemap usa somente as URLs canônicas, sem os parâmetros de motion.

## Sinais implementados

- `title`, description e robots coerentes por idioma.
- Canonical próprio para cada versão, usando o domínio oficial com `www` e HTTPS.
- Alternativas `hreflang` recíprocas: `pt-BR`, `pt`, `en-GB`, `en`, `es`, `ru`, `zh-Hans`, `zh-CN` e `x-default`.
- Sitemap XML com as cinco URLs e suas alternativas; gerado pelo plugin.
- `public/robots.txt` permite rastreamento e informa o sitemap.
- Open Graph e Twitter Card com a foto escolhida pelo responsável em `public/img/og-jony-peixoto-whatsapp.jpg` (1200 × 630, JPEG de aproximadamente 63 KB), com o rosto inteiro dentro da área central.
- JSON-LD com Person, Organization, Service, WebSite e WebPage.
- Serviços e áreas atendidas: Rio de Janeiro, Reino Unido e atendimento remoto mundial.
- Link do perfil Google informado pelo responsável incluído em `sameAs` da pessoa.
- `vercel.json` mantém as barras finais consistentes nas URLs de idioma.
- `npm run check:seo` valida metadados, traduções estáticas, links de idioma, dados estruturados e arquivos de descoberta após o build. O workflow também executa essa checagem.

## Perfil da Empresa no Google

Link informado pelo responsável: [Jony Peixoto no Google](https://share.google/qtJsRMuGWMKr3FFDJ).

O link redirecionou para uma busca de entidade com o nome Jony Peixoto, mas a leitura automatizada de detalhes foi bloqueada pelo Google. Endereço, categoria, horários, situação de verificação e configurações da conta não foram confirmados nem alterados.

O site identifica o atendimento remoto nos mercados solicitados. Não foi inventado endereço físico, filial britânica, coordenada de escritório, horário ou avaliação. Não foi aplicado `LocalBusiness`/`ProfessionalService` sem os dados locais necessários; o grafo descreve a pessoa, a marca e os serviços.

### Descrição sugerida para o perfil

> Jony Peixoto trabalha com engenharia de inteligência artificial, automação e desenvolvimento de soluções digitais. Criação de sites, sites 3D, plataformas, SaaS e XaaS, com integrações e agentes de IA para atendimento, vendas e operações. Atendimento a projetos no Rio de Janeiro e serviços remotos para o Reino Unido e outros países, do diagnóstico à implementação.

Este é um texto pronto para revisão; **não foi publicado no Perfil da Empresa**. Ele não inclui links, promoções, métricas ou qualificações não confirmadas.

No painel do Google, conferir o nome real da empresa, categoria correspondente à atividade, website `https://www.thejonypeixoto.com/`, telefone, endereço/área de atendimento real e situação de verificação. Não substituir o nome da empresa por uma lista de palavras-chave. A área de atuação remota mundial do site não equivale a uma área local ilimitada no Maps.

## Publicação e indexação

1. Publicar o novo build de `dist/`, incluindo `/en/`, `/es/`, `/ru/`, `/zh/`, `sitemap.xml`, `robots.txt` e a imagem social. Preservar os diretórios de idioma.
2. Conferir no domínio público o status HTTP, canonical e ausência de `noindex` ou bloqueios de hospedagem.
3. Na propriedade verificada do Google Search Console, enviar `https://www.thejonypeixoto.com/sitemap.xml`.
4. Inspecionar a raiz e `/en/` e solicitar indexação quando o painel permitir; acompanhar os relatórios de páginas e desempenho.
5. No Bing Webmaster Tools, verificar a propriedade e enviar o mesmo sitemap.
6. Conferir que o Perfil da Empresa aponta para o domínio oficial e que os dados locais são reais e consistentes.

As contas de hospedagem/Search Console não estão automaticamente conectadas por este repositório. Nenhum token de verificação foi inventado ou inserido. Publicar código no GitHub não comprova uma implantação no domínio. O link público do Perfil da Empresa também não concede acesso administrativo.

Não há garantia de indexação imediata, posição no Google ou ordem geográfica fixa. Rio de Janeiro e Reino Unido são prioridades de conteúdo e idioma. A busca local depende também de relevância, distância e destaque; o Google decide quando rastrear e indexar.

## Referências oficiais

- [Google: títulos dos resultados](https://developers.google.com/search/docs/appearance/title-link).
- [Google: descrições e snippets](https://developers.google.com/search/docs/appearance/snippet).
- [Google: sites multilíngues e regionais](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).
- [Google: alternativas de idioma e região](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
- [Google: classificação local](https://support.google.com/business/answer/7091).
- [Google: diretrizes do Perfil da Empresa](https://support.google.com/business/answer/3038177).

## Analytics e IndexNow

O componente global de métricas está em `src/components/analytics.jsx`, com `Analytics` de `@vercel/analytics/react`, carregado por `main.js`. A entrada `/next` não é usada porque o projeto é Vite, não Next.js. O componente monta uma vez por página fora das seções/replay e roda no build de produção. A coleta depende de habilitar Web Analytics no projeto e publicar na Vercel. Nenhum evento personalizado ou upgrade de plano foi adicionado.

O arquivo público `c2cd18b9d1a94d95be0a70421940acb3.txt` verifica a propriedade para IndexNow. Após publicar, as URLs alteradas podem ser notificadas a Bing e outros participantes. Google não usa IndexNow. A verificação e o envio no Search Console são separados.
