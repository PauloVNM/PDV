================================================================================
DIRETRIZES DE ARQUITETURA FRONT-END - PDV MERCADO
================================================================================
STATUS: Sistema em produção tática. 
AMBIENTE: Ubuntu.
STACK: Flask (Python), SQLite, HTML, CSS Vanilla e JS puro.
OBJETIVO: Interface pragmática, à prova de falhas, operada 100% via teclado.

1. REGRA DE OURO (SEM GORDURA)
- O CSS inline (style="...") é proibido. Toda a estilização deve estar nos arquivos CSS.
- Se um componente visual (como botões de menu) se repete, ele DEVE ser abstraído no `base.css`.

2. BLINDAGEM DE LAYOUT (O CONCEITO DE TELA TRAVADA)
- O PDV roda no navegador, mas deve se comportar fisicamente como um terminal desktop.
- O `body` possui `height: 100vh`, `display: flex; flex-direction: column` e `overflow: hidden`. O scroll global da página está MORTO.
- `header` e `footer` são intocáveis (`flex-shrink: 0`).
- A tag `<main>` ocupa o espaço restante (`flex: 1`). ELA DEVE OBRIGATORIAMENTE possuir `min-height: 0` para impedir que seu conteúdo interno force o redimensionamento da tela.

3. ESTRUTURAÇÃO DE TABELAS (ANTIDEDO DE OPERADOR)
- Tabelas que recebem dados dinâmicos (como o carrinho de compras ou lista de produtos) devem ser isoladas.
- O invólucro da tabela (`.tabela-container`) é quem recebe a rolagem (`overflow-y: auto`).
- A tag `table` deve ter OBRIGATORIAMENTE `table-layout: fixed` para impedir que os dados recalculem a largura das colunas e façam a tela "dançar".
- O cabeçalho (`th`) usa `position: sticky; top: 0` para ficar pregado no teto da rolagem.
- Células (`td`) usam `white-space: nowrap`, `overflow: hidden` e `text-overflow: ellipsis` para fatiar textos gigantes que tentem quebrar a interface.

4. FORMULÁRIOS E PREVENÇÃO DE "HIPERCALÇOS"
- Agrupamentos de inputs na mesma linha são feitos com CSS Grid (`display: grid`).
- ALERTA CRÍTICO: Textos de feedback (como mensagens de erro, status de busca de API) que aparecem debaixo do input NUNCA devem interferir no cálculo do Grid.
- Solução Tática: A `div` que envolve o input (ex: `.campo-grupo`) recebe `position: relative`. O texto de feedback recebe `position: absolute; top: 100%; left: 0`. Isso arranca o texto da física do bloco, impedindo que ele empurre os botões e inputs para cima e deforme a linha.

5. NAVEGAÇÃO JS E COMPORTAMENTO
- O operador não usa mouse. O arquivo `navegacao.js` gerencia as setas, o TAB e o ENTER.
- A tecla ESC atua como botão de pânico global (cancelar/voltar página).
- Toda tela nova deve ter um elemento com o atributo `autofocus` para o JS engatar a primeira marcha automaticamente sem o operador precisar clicar em nada.
================================================================================