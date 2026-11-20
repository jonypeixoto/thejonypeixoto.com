# Mídias do README

As animações são arquivos locais, sem serviço externo de geração de banners. As cenas são desenhadas em Canvas 2D a partir de vértices 3D, rotação e projeção perspectiva. Os frames são capturados por Chromium e codificados por FFmpeg.

| Arquivo | Origem |
|---|---|
| `../media/hero-3d.gif` | Cena `hero` de `scene-3d.html`; 90 frames, 15 fps, loop de 6 s. |
| `../media/orbit-3d.gif` | Cena `orbit`; 90 frames, 15 fps, loop de 6 s. |
| `../media/site-demo.gif` | Captura da montagem real do site, em resolução reduzida para documentação. |
| `../media/site-desktop.png` | Screenshot desktop do estado montado. |
| `../media/site-mobile.png` | Screenshot mobile do estado montado. |

## Gerar as cenas 3D

Pré-requisitos: Node.js 22.12+, FFmpeg disponível no PATH e Chromium do Playwright.

```bash
cd docs/tools
npm install
npx playwright install chromium
npm run render
```

O gerador salva PNGs temporários em `frames/`, ignorada pelo Git. Não são necessárias chaves de API. A captura funciona sem acessar o site remoto.

Para reutilizar ferramentas já instaladas, defina `README_PLAYWRIGHT_MODULE` como uma URL `file:///.../playwright/index.mjs` e `README_FFMPEG` como o caminho completo do executável FFmpeg. Essas variáveis são opcionais e não são credenciais.

## Demonstração do site

A demonstração publicada foi gravada no Vite local, em português, com viewport desktop. Para atualizá-la, rode o site, capture a entrada com um gravador de tela ou Playwright e converta um trecho curto:

```bash
ffmpeg -i gravacao.webm -vf "fps=12,scale=960:-2:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" -loop 0 ../media/site-demo.gif
```

Prefira trechos curtos e arquivos leves. A captura do site é separada das cenas ilustrativas 3D. Confira os GIFs no README do GitHub depois de publicar; o leitor pode ter a reprodução automática de imagens desativada nas preferências de acessibilidade.
