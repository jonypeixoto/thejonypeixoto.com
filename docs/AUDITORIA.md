# Auditoria — 20 de novembro de 2026

As etapas foram tratadas na ordem solicitada, verificando cada alteração antes da seguinte. Este registro distingue implementação, medição e configurações externas. Não certifica conformidade jurídica integral, indexação ou classificação em buscadores.

| Item | Alteração e resultado | Pendência |
|---|---|---|
| 1. Privacidade | /privacidade/ em português, HTML estático, identidade e contato confirmados, inventário real, direitos, fornecedores e links em todos os rodapés. Retenção: até 12 meses após última interação sem contratação, com revisão mensal. | O responsável precisa executar a revisão e exclusão nas ferramentas; o site não automatiza essa rotina. CPF não publicado por decisão expressa do responsável. |
| 2. LCP | Logo entregue no HTML inicial e priorizado; carrossel React só carrega próximo à tela; Analytics após load/ociosidade; vídeo após load com preload none e poster; retrato responsivo. | Meta de 2,5 s não atingida. Lighthouse publicado inicial: 4,1 s; testes locais intermediários: 5,6–5,9 s, não comparáveis diretamente ao ambiente publicado. A foto é registrada como novo candidato a LCP quando aparece na montagem. Não foram encurtados os tempos da montagem. Medição publicada após as primeiras otimizações: LCP 3,5 s, FCP 1,6 s e TBT 460 ms; uma execução não representa garantia de desempenho. |
| 3. Título | Português: Inteligência Artificial e Sites 3D no Rio &#124; Jony Peixoto, 56 caracteres. Open Graph correspondente; títulos próprios por idioma e página legal. | Google pode escolher outro título e recortar conforme o dispositivo. |
| 4. Imagem social | /og.jpg, JPEG 1200 × 630, 63.322 bytes, cópia da foto previamente aprovada com o rosto inteiro. Tags absolutas em todas as páginas. | Prévia depende do cache e do formato escolhido pelo aplicativo. Não houve novo acesso a contas do Meta Sharing Debugger. |
| 5. Imagens | Variantes de 640 px: retrato 23.124 bytes, balcão 15.724, cobrança 20.288, wireframe 8.124. srcset e sizes ajustados às larguras reais, com variantes intermediárias de 720 px para o comparador; imagens abaixo da dobra mantêm lazy e async. Retrato de 912 px recomprimido com qualidade 80, de 188.692 para 39854 bytes, sem mudar dimensões ou enquadramento. | Originais ainda referenciados são necessários para telas maiores; não foram apagados. A estimativa de economia do relatório não é uma garantia. |
| 6. CSS | CSS do build incluído no HTML, sem requisições de stylesheet bloqueantes. Estilos completos preservam as medidas lidas pelo enxame. Fontes locais com swap. | Mais bytes no HTML e menor reutilização do cache de CSS entre documentos: escolha para eliminar a viagem bloqueante sem alterar o layout. Não se trata de extração automática de CSS crítico. |
| 7. Contraste | Token sel-etiqueta escurecido para #1566b2; branco sobre o azul tem 5,87:1. A etiqueta deixa de ser exibida antes do fade da caixa, para evitar contraste reduzido na transição. Lighthouse após o ajuste: color-contrast aprovado. | Auditorias completas de acessibilidade podem apontar outros elementos fora do escopo original. |
| 8. Sitemap | XML existente, agora com cinco idiomas, privacidade e termos; robots aponta para ele. | Envio ao Google Search Console depende de propriedade verificada e acesso à conta. |
| 9. Dados estruturados | Person, Organization, Service, WebSite e WebPage existentes, analisados nos testes; sem endereço, avaliação ou preço inventado. | Teste interativo no Google Rich Results não foi executado nesta revisão. Nem todo tipo Schema.org gera resultado avançado. |
| 10. GA4 | Responsável informou que ainda não tem ID. Orientação de criação fornecida. Vercel Analytics continua instalado. | Receber ID G-, implementar eventos sem conteúdo pessoal e verificar relatório Tempo real. Atualizar política antes de ativar a coleta adicional. |
| 11. Termos | /termos/ em português, proposta/contrato por projeto, condições e prazos combinados antes do início, direitos legais e artigo 49 do CDC. Links em todos os rodapés. | Condições específicas precisam constar em cada proposta ou contrato. |
| 12. Identificação | Nome e contato mantidos. Atendimento pela internet, conforme escolha do responsável; nenhum campo de CPF ou localização geográfica fictícia. | Responsável pediu para não publicar CPF e informou Internet como cidade. Identificação fiscal e endereço geográfico não concluídos; não declarar este item legalmente resolvido. |

## Verificação

Build e check:seo aprovados. Navegador Chromium em 390 × 844 e 1456 × 844: sem erros de JavaScript ou overflow; vídeo chega ao estado efeitos; galeria React carrega ao aproximar; links reais do rodapé abrem páginas legais com títulos próprios. Política legível com JavaScript desligado. Safari e dispositivo físico não foram executados nesta revisão.

## Referências

- LGPD: https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- Direitos e conservação: https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes
- CDC, artigo 49: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- Comércio eletrônico: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm
- GA4: https://support.google.com/analytics/answer/9304153?hl=pt-BR
- Vercel Analytics: https://vercel.com/docs/analytics/privacy-policy
