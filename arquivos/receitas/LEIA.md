# Receitas das imagens da Kairo

Todas as imagens da demo foram geradas por IA a partir destes prompts. Servem para refazer uma imagem no mesmo
estilo ou adaptar para a sua marca. Qualquer gerador de imagem que aceite uma imagem de referência serve (ChatGPT,
Gemini, Midjourney, Ideogram...). Custo: o de uma imagem por receita, geralmente dentro do plano do gerador.

## Ordem
1. **Retrato** (`retrato.prompt.txt`): o retrato de perfil do hero, com luz vermelha e azul sobre fundo preto liso.
   O prompt fala de "the same man as in the reference photo": anexe uma foto sua de frente como referência, ou use
   uma foto real sua feita com a mesma luz. Depois, recorte o fundo (`fonte/recorta.swift` no Mac, ou qualquer
   removedor de fundo) e salve como WebP com transparência, 900 px de largura, em `public/img/kairo-perfil.webp`.
2. **Telas dos projetos** (`tela-projeto-*.prompt.txt`): três prints de produto em modo escuro, 16:10. Modo escuro
   de propósito: tela branca estoura quando alguém grava o site com o celular. O melhor, quando existe, é o print
   de verdade do seu projeto (também 16:10, modo escuro). Salve em `public/img/proj-*.webp`, 1280 × 800.
3. **Wireframe** (`wireframe.prompt.txt`): o rascunho do primeiro projeto, para o comparador "Do rascunho. Ao ar.".
   Anexe a tela final como referência: o wireframe tem de ter exatamente o mesmo enquadramento, senão a alça do
   comparador mostra as duas metades desalinhadas. Se você tiver o wireframe de verdade (Figma, papel), use ele.

## Sem gerar nada
- Sem retrato novo: mantenha o da demo enquanto não tiver o seu (é uma pessoa que não existe; troque antes de
  publicar).
- Sem telas novas: tire print das páginas dos seus projetos em 1600 × 1000 no modo escuro.
- Sem wireframe: o guia explica como tirar o comparador e deixar só a tela final.
