# Registro de implementação

[Voltar ao README](../README.md)

Este registro descreve o estado do código preparado para o repositório e as alterações acompanhadas na conversa de implementação em **20 de novembro de 2026**. O primeiro commit é um snapshot do projeto já existente, não uma reconstrução artificial de seu histórico.

## Base recebida

O projeto começou nesta sessão já com uma estrutura derivada do portfólio demonstrativo Kairo: HTML por seção, Vite, GSAP, agentes de montagem, design tokens, filtros, comparador e Tour. Portanto, esses recursos são documentados como base existente, sem atribuir sua criação a esta sessão.

O código recebido já continha a identidade de Jony, versões em cinco idiomas, vídeos próprios, carrossel gamer em React, vitrines de IA e marcas, YouTube, notícias, formulário e mensagens de WhatsApp localizadas. A publicação registra esses recursos presentes no código, sem inventar datas ou responsáveis por alterações anteriores.

## Trabalho realizado nesta sessão

| Etapa | Resultado |
|---|---|
| Retomada do ambiente | Reinício do servidor Vite em 5300, exposto na rede local; resposta HTTP 200 conferida. |
| Preparação da referência de motion | Instalação/leitura da Reanimate e inspeção das gravações de desktop e mobile fornecidas pelo responsável. |
| Estudo do rosto | Extração de quadros e análise do comportamento público do hero de Lando Norris. |
| Primeira adaptação | Composição WebGL e campo fluido local revelando o vídeo sobre a foto, sem retirar o enxame ou os cursores de profundidade. |
| Escopo dos óculos | Recorte da faixa dos olhos e seleção de luzes, mantendo pele, boca e cabeça na foto estática. |
| Sequência de entrada | Vídeo completo uma vez; transição GSAP de 0,8 s para a foto; quadro do vídeo congelado para os óculos. |
| Refinamento da interação | Retirada do fade global do par inteiro e inclusão de tinta advectada, interpolação do rastro, suavização e dissipação em tempo real. |
| Mouse e toque | Entrada localizada e eventos passivos, preservando a rolagem nativa. |
| Diagnóstico | Botão **Começar uma conversa** passou a usar o mesmo Tally de **Agenda**, em nova aba. |
| Verificações | Build, Chromium desktop/mobile, pausa, movimento reduzido, Tour, replay, toque e overflow, conforme o escopo de cada alteração. |
| Preparação do repositório | README, documentação técnica, GIFs 3D, demonstração, créditos, regras de exclusão e workflow de build. |

## Decisões de implementação

### Preservar a página existente

As mudanças no retrato ficaram em módulos próprios, sem refazer a página como uma aplicação React. O enxame e as setas continuam responsáveis pela montagem e pela profundidade; a composição dos óculos responde pela mídia do retrato.

### Aproveitar as mídias disponíveis

O WebM com alfa continua sendo a primeira escolha de desktop, e o MP4 com máscara empacotada oferece uma alternativa. Depois do vídeo completo, um quadro fixo fornece as luzes dos óculos: isso evita movimentar o rosto enquanto a foto estática permanece na tela.

### Implementar o comportamento, sem incorporar assets da referência

O site de referência usa capacete e modelo 3D próprios. A adaptação usa o conteúdo do projeto, um campo CPU local e o shader de composição WebGL. As gravações de referência e scripts baixados para análise não entram no repositório público.

### Dar visibilidade às limitações

Não foi realizada uma prova de equivalência 1:1 com o original. As checagens locais não substituem Safari ou aparelho físico. Imagens, números e textos herdados da demo continuam exigindo revisão editorial; a documentação não os transforma em casos comerciais verificados.

## O que esta publicação não faz

- Não altera o domínio nem sua hospedagem.
- Não cria ou configura outro formulário no Tally; reutiliza o destino já informado no site.
- Não envia leads de teste aos serviços de contato.
- Não instala serviços de IA no servidor: as IAs citadas são conteúdo/vitrine e links da interface.
- Não concede uma licença nova para marcas, retratos, prints ou conteúdo de terceiros.

Os arquivos exatos e suas responsabilidades estão em [Arquitetura](ARQUITETURA.md). As transições e o campo fluido estão descritos em [Motion](MOTION.md).
