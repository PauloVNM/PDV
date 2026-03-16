================================================================================
DIRETRIZES DE ARQUITETURA - JAVASCRIPT
================================================================================
STATUS: Modularizado por Domínio.
AMBIENTE: JS Vanilla (Vanilla puro, sem frameworks, sem compiladores).

1. MOTIVAÇÃO E A MORTE DO MONOLITO
- Arquivos JS que misturam manipulação de tela (DOM), chamadas de rede (Fetch API) e cálculos matemáticos tornam-se insustentáveis. 
- A regra agora é a Separação por Domínio de Responsabilidade. "Uma ferramenta faz apenas uma coisa".

2. A ESTRUTURA DOS ARQUIVOS JS (COMO CONTINUAR):
Todo novo módulo do sistema (ex: Vendas, Produtos, Fiado) deve ser quebrado nesta trinca:

- A REDE (Prefixo `api_*.js`): 
  O mensageiro. Único arquivo autorizado a usar o `fetch()` para conversar com o Python. Não sabe o que é um botão ou um HTML. Recebe parâmetros, faz a requisição, devolve JSON.
  Ex: `api_venda.js`, `api_produtos.js`.

- A MEMÓRIA/MATEMÁTICA (Motor de Estado):
  O cérebro isolado. Lida apenas com arrays, variáveis e cálculos (ex: conversão de centavos, aplicação de margem, soma de carrinho). Não toca no HTML, não chama APIs.
  Ex: `carrinho.js`, `precificacao.js`.

- O MAESTRO (O sufixo `_ui.js` ou nome direto do módulo):
  O controlador da interface. Único autorizado a usar `document.getElementById`, ouvir cliques e injetar HTML na tela. Ele orquestra os outros dois: lê a tela, pede para a Matemática calcular, manda a Rede salvar, e atualiza o visual com o resultado.
  Ex: `venda.js`, `produtos_ui.js`.

3. O MOTOR INTOCÁVEL:
- O arquivo `navegacao.js` é o cérebro da operação sem mouse. Ele é global, carrega por último no HTML e intercepta as teclas (Setas, Enter, ESC). Nenhuma lógica de negócio deve ser colocada dentro dele.

4. HIERARQUIA NO HTML:
- A ordem de inclusão das tags `<script>` no final do `<body>` importa. 
- Regra de carregamento: 1º Memória/Matemática -> 2º Rede -> 3º Maestro do DOM -> 4º Navegador de Teclado.
================================================================================