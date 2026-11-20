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
| `/sitemap.xml` | HTTP 200, XML válido com seis versões de idioma e duas páginas legais (oito URLs). |
| `/og.jpg` | HTTP 200, JPEG 1200 × 630, aproximadamente 63 KB, rosto inteiro centralizado. |
| `/_vercel/insights/script.js` | HTTP 200 e carregamento pelo componente React global. |
| Navegador mobile em produção | Sem erros JavaScript e sem overflow horizontal na checagem. |
| GitHub Actions | Build e validação estática de SEO aprovados. |
| IndexNow | As páginas alteradas são notificadas com a chave de verificação publicada; a versão árabe também foi enviada. |

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


## Verificação de HTTPS e DNS — 20 de novembro de 2026

O domínio sem www está configurado na Vercel para redirecionar por HTTP 308 a https://www.thejonypeixoto.com/. Ambos os domínios estão verificados no projeto existente.

Uma ocorrência de ERR_CERT_COMMON_NAME_INVALID com certificado de *.github.io foi associada à resolução DNS local que ainda devolvia endereços antigos, misturados aos da Vercel. Os resolvedores públicos consultados já retornavam a infraestrutura correta. Limpar somente o cache não foi suficiente naquele computador.

Com autorização do responsável, o DNS da conexão ativa foi ajustado para Cloudflare e o cache limpo. Os testes posteriores de HTTPS normal, sem ignorar a validação do certificado, retornaram 308 no domínio sem www e 200 no domínio com www. Esse ajuste é local ao computador e não é aplicado por um deploy do site.

Se outro visitante receber o certificado antigo, conferir a resolução no dispositivo e na rede utilizados, reiniciar o navegador após atualizar o cache e comparar com resolvedores públicos. Não desativar a validação TLS nem contornar o aviso de certificado. Não fixar IPs de CDN no arquivo hosts, pois podem mudar.

Backups e scripts administrativos usados no diagnóstico ficam fora do repositório público. Nenhuma configuração de rede pessoal é distribuída com o site.
