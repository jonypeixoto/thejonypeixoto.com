# Manutenção e publicação

[Voltar ao README](../README.md)

## Ambiente

Use Node.js 22.12+ e npm; `npm ci` instala as versões do lockfile. O desenvolvimento usa a porta 5300 com `strictPort`: se ela estiver ocupada, encerre o processo anterior ou escolha outra porta explicitamente. `npm run preview` também usa 5300.

```bash
npm ci
npm run dev
npm run build
# Depois de encerrar o dev:
npm run preview
```

## Onde editar

| Mudança | Arquivos |
|---|---|
| Título, descrição, idioma base e favicon | `index.html`, `public/favicon.svg` |
| Marca, âncoras e WhatsApp principal | `src/sections/nav.html`, `src/motion/idiomas.js` |
| Nome, saudação, cargo, números e retrato | `src/sections/hero.html` |
| Alinhamento de foto/vídeo e holograma | `src/sections/hero.css`, `src/motion/holograma.js` |
| Sequência vídeo/foto | `src/motion/video-hero.js` |
| Óculos, recorte e transparência | `src/motion/video-alpha.js`, `src/motion/rosto-fluido.js` |
| Cards, filtros e comparador | `src/sections/projetos.html`, `src/sections/projetos.css` |
| Biografia e PDF | `src/sections/sobre.html`, `public/arquivos/` |
| Trajetória profissional | `src/sections/trajetoria.html` |
| Canal no YouTube | `src/sections/youtube.html` |
| Jogos e links de cada projeto | `src/sections/gamer.html`; layout em `src/components/ui/card-fan-carousel.jsx` |
| Personagens de IA, marcas e newsletter | HTML/CSS das seções `ias`, `marcas` e `noticias` |
| Contatos, diagnóstico e formulário | `src/sections/contato.html`, `src/motion/interface.js` |
| Idiomas e mensagens | `src/locales/*.json`, `src/motion/idiomas.js` |
| Paleta, tipografia e escala | `src/styles/tokens.css`, imports em `src/main.js` |

As instruções históricas de personalização estão em `AGENTS.md` e `CLAUDE.md`. Elas descrevem a base Kairo; para o estado atual do site, use também os documentos desta pasta. Não invente clientes, métricas, avaliações ou resultados ao atualizar o conteúdo.

## Adicionar uma seção

1. Crie `src/sections/nome.html` e `nome.css`.
2. Insira a marca `<!-- @secao nome -->` em `index.html`.
3. Importe o CSS em `src/main.js`.
4. Inclua uma âncora na navegação quando fizer sentido.
5. Marque o contêiner com `data-montagem` e cada peça com `data-camada`.
6. Atualize os cinco dicionários, se houver conteúdo traduzível.
7. Revise `?pronto`, montagem, Tour, teclado e celular; execute o build.

## Mídias

Prefira WebP para imagens e mantenha dimensões declaradas para reduzir deslocamentos. Prints de projetos escuros preservam a leitura nas gravações. Use `loading="lazy"` abaixo do hero e não adicione vídeos grandes ao carregamento inicial sem necessidade.

Ao trocar o vídeo do retrato, produza a alternativa MP4 com cor e máscara lado a lado e revise o enquadramento. O shader dos óculos faz uma seleção por cor: um novo acessório com cores diferentes requer recalibrar o recorte. Nunca substitua o MP4 por um vídeo comum esperando que a metade direita vire transparência.

## Integrações

| Serviço | Uso e configuração |
|---|---|
| Tally | `https://tally.so/r/Z9OlBy`, usado por **Começar uma conversa** e **Agenda**. |
| WhatsApp | Links `wa.me` na navegação, contatos e botão flutuante; mensagens localizadas por `idiomas.js`. |
| Web3Forms | POST do formulário para `https://api.web3forms.com/submit`; configuração no HTML. |
| country.is | Estimativa de país no envio; timeout de 3 s e fallback que permite continuar. |
| YouTube / Rumble / GitHub | Destinos externos dos projetos e da seção gamer. |
| Substack | Newsletter e destinos editoriais dos cards de notícias. |

O formulário usa validação nativa, honeypot, botão desativado durante envio e timeout de 20 s. Não conserve uma tentativa duplicada enquanto a anterior está em andamento. Nenhum envio real foi feito como parte das checagens de documentação.

A `access_key` do Web3Forms é uma chave de formulário destinada ao frontend, não uma credencial de acesso à conta. A própria documentação do provedor permite seu uso público: [FAQ](https://docs.web3forms.com/getting-started/faq). Ao reutilizar este código em outro site, configure sua própria chave e restrições no painel do serviço. Não publique tokens de administração, senhas ou arquivos `.env`.

O código desta página não guarda respostas no backend, mas os serviços externos processam os dados enviados a eles. Revise a política de privacidade e as configurações de cada serviço conforme o uso real do site. A consulta de país utiliza uma requisição externa baseada em IP; a função só retém o país para preencher o envio.

## Publicar o build

1. Execute `npm ci` e `npm run build`.
2. Confira `npm run preview`, a partir do build gerado.
3. Envie o conteúdo de `dist/` para a raiz da hospedagem estática.
4. Configure o domínio e HTTPS no provedor escolhido.
5. Confira caminhos de mídias, links externos e formulário no endereço final.

Não há configuração de deploy automático no domínio neste repositório. `.github/workflows/build.yml` apenas executa instalação e build em push/pull request. Alterar o repositório não significa que o domínio foi atualizado.

### Caminho base

Os assets usam URLs como `/img/...` e `/video/...`. Isso funciona na raiz de `thejonypeixoto.com`. Publicar sob uma subpasta, como uma página de projeto em `usuario.github.io/repositorio/`, exige adaptar o `base` do Vite **e** os caminhos absolutos existentes em HTML, CSS e JS. Não basta trocar apenas um parâmetro.

## Arquivos locais que ficam fora do Git

`dist/`, `node_modules/`, `.npm-cache/`, `.reanimate/`, logs, `.env*`, materiais-fonte em `fonte/`, a cópia original em `kairo/` e prints de conceito não são enviados. As receitas textuais de imagens e os guias da base continuam disponíveis, com contexto nos créditos.

## Documentação visual

Os GIFs em `docs/media/` não fazem parte do carregamento do site. O código das cenas fica em `docs/tools/`; veja o [guia de geração](tools/README.md). Atualize a demonstração quando uma mudança visual tornar o GIF desatualizado.
