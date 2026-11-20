# Estado da publicação

[Voltar ao README](../README.md)

## Configuração confirmada em 20 de novembro de 2026

- Repositório público: [jonypeixoto/thejonypeixoto.com](https://github.com/jonypeixoto/thejonypeixoto.com).
- Projeto Vercel existente: `thejonypeixoto`.
- Integração Git: GitHub, proprietário `jonypeixoto`, repositório `thejonypeixoto.com`.
- Branch de publicação: `main`.
- Domínio principal: [www.thejonypeixoto.com](https://www.thejonypeixoto.com/).
- O domínio sem `www` redireciona para o principal.
- A conexão foi conferida pela integração Vercel; não foi criado um projeto duplicado.

## Recursos publicados e verificados

| Recurso | Verificação |
|---|---|
| `/`, `/en/`, `/es/`, `/ru/`, `/zh/` | HTTP 200, idiomas, títulos e canonical próprios; conteúdo disponível sem JavaScript. |
| `/robots.txt` | HTTP 200, rastreamento permitido e referência ao sitemap oficial. |
| `/sitemap.xml` | HTTP 200, XML válido com cinco URLs e alternativas de idioma. |
| `/img/og-jony-peixoto-whatsapp.jpg` | HTTP 200, JPEG 1200 × 630, aproximadamente 63 KB, rosto inteiro centralizado. |
| `/_vercel/insights/script.js` | HTTP 200 e carregamento pelo componente React global. |
| Navegador mobile em produção | Sem erros JavaScript e sem overflow horizontal na checagem. |
| GitHub Actions | Build e validação estática de SEO aprovados. |
| IndexNow | As cinco URLs alteradas foram enviadas com a chave de verificação publicada. |

O primeiro deploy de produção dessa atualização foi validado como READY a partir do commit `3ce74f12bffb477dfd57fc1de8b6bab4722674b8`. O histórico de deploys da Vercel registra as atualizações posteriores, inclusive alterações de documentação.

## Como acompanhar as próximas atualizações

1. Envie um commit para `main` no GitHub.
2. Confira o workflow de build e `check:seo` na aba Actions.
3. Confira o novo deployment do projeto existente na Vercel.
4. Aguarde READY e a atribuição dos domínios de produção.
5. Valide a página e os endpoints públicos. Um push por si só não comprova deploy concluído.

## Indexação e métricas

O envio ao IndexNow não comprova que os buscadores já indexaram as páginas. Google não utiliza IndexNow: a propriedade e a inspeção de URLs precisam ser tratadas no Search Console. Não foi confirmada uma conexão Google Search Console na conta OpenSEO durante esta publicação.

O carregamento do script do Analytics foi verificado, mas não representa uma contagem de visitas ou um relatório do painel. Os dados dependem do tráfego e do processamento da plataforma.

O WhatsApp pode manter a prévia de links em cache. A imagem nova está publicada; mensagens enviadas anteriormente podem continuar mostrando a versão antiga.
