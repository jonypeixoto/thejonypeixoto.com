# Validação

[Voltar ao README](../README.md)

## Verificações acompanhadas durante a implementação

| Checagem | Resultado registrado | Limite |
|---|---|---|
| `npm run build` | Passou nas iterações do retrato e no ajuste do CTA. | Há aviso preexistente de `"use client"` no carrossel. |
| Desktop Chromium 1456 × 840 | Reprodução, etapa estática e máscaras sem erro JS. | Chromium automatizado, sem comprovação em Safari. |
| Mobile Chromium 390 × 844 | MP4 com máscara, toque emulado e overflow horizontal 0 px. | Não substitui celular físico. |
| Etapa final do retrato | Vídeo pausado no quadro inicial; foto opaca; estado `efeitos`. | Inspeção de estado e capturas, não comparação 1:1 com a referência. |
| Cursores de profundidade | Presentes na revisão do efeito: cinco desktop, dois mobile. | São os cursores decorativos de profundidade; não a contagem total do enxame. |
| `prefers-reduced-motion` | Vídeo pausado e foto visível nos dois tamanhos. | Preferência emulada no navegador. |
| Visibilidade | Reprodução pausada fora da tela. | Confirmação local. |
| Tour a 4× | Completou; replay remontou o hero. | Testado antes dos últimos refinamentos visuais do campo. |
| Toque/rolagem | Gesto de teste rolou 345 px; Tour desativado; overflow 0 px. | Emulação de entrada pelo Chromium. |
| Campo fluido | Injeção localizada e decaimento observados em checagem específica. | Não há teste de equivalência física com a simulação original. |
| CTA do diagnóstico | Mesmo URL Tally em **Começar uma conversa** e **Agenda**. | Não foi enviada resposta ao formulário externo. |

Scripts de diagnóstico, capturas completas e dependências temporárias permanecem em `.reanimate/`, ignorada pelo Git. Os GIFs e capturas selecionados para documentação ficam em `docs/media/`.

## Antes de publicar uma alteração visual

1. Rode o site com e sem `?pronto`, em português e em outro idioma.
2. Confira 1456 × 840 e 390 × 844; role rápido durante a montagem.
3. Espere o vídeo completo, observe a transição e mova mouse/dedo sobre os óculos.
4. Confira Tour, 1×/2×/4×, replay e interrupção por toque.
5. Teste filtro, busca, comparador, carrosséis e navegação por teclado.
6. Confira foco visível, movimento reduzido e ausência de rolagem lateral.
7. Confira os links Tally/WhatsApp e o formulário sem criar envios desnecessários.
8. Execute `npm run build` e confira `npm run preview`.
9. Faça uma revisão em Safari e em aparelho físico antes de anunciar suporte validado nesses ambientes.

## Integração contínua

O workflow `Build` instala as dependências com `npm ci` e executa `npm run build` em Linux. Ele valida a compilação, não faz testes visuais, não envia formulários e não publica o site. O resultado de cada execução fica na aba Actions.

Não há suíte de testes automatizados configurada no pacote principal, relatório Lighthouse ou métrica de cobertura publicada. Esses resultados não devem ser presumidos a partir do badge de build.
