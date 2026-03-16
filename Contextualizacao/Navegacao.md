================================================================================
MÓDULO DE NAVEGAÇÃO MATRICIAL (KEYBOARD-ONLY)
================================================================================
Projeto: PDV Mercado
Status: Validado (Linux/Firefox)
Data: 18/02/2026

1. OBJETIVO OPERACIONAL
--------------------------------------------------------------------------------
Eliminar a dependência do mouse (dispositivo apontador) nas operações de frente 
[cite_start]de caixa e retaguarda[cite: 179]. O sistema deve permitir navegação completa, 
rápida e intuitiva utilizando apenas o teclado, priorizando a velocidade do 
[cite_start]operador[cite: 180].


2. LÓGICA DO SISTEMA (NAVEGAÇÃO MATRICIAL)
--------------------------------------------------------------------------------
O script organiza a tela em uma matriz lógica baseada na estrutura HTML 
[cite_start]semântica, sem utilizar tabindex[cite: 182]:

- EIXO VERTICAL (SEÇÕES): A tela é dividida em blocos maiores usando a tag 
  [cite_start]<section> (ex: Formulário é um bloco, Tabela de Itens é outro)[cite: 183, 184].
- EIXO HORIZONTAL (ITENS): Dentro de cada seção, os elementos interativos 
  (input, button, a) [cite_start]são tratados como itens lineares[cite: 185].


3. MAPEAMENTO DE TECLAS
--------------------------------------------------------------------------------
TECLA             | CONTEXTO          | AÇÃO
------------------|-------------------|-----------------------------------------
Seta CIMA/BAIXO   | Geral             | [cite_start]Alterna o foco entre Seções (<section>)[cite: 190, 192].
Seta ESQ/DIR      | Navegação         | [cite_start]Alterna entre botões/links na mesma seção[cite: 193, 195].
Seta ESQ/DIR      | Edição de Texto   | [cite_start]Move o cursor dentro do input (nativo)[cite: 196, 198].
ENTER             | Formulário        | [cite_start]Pula para o próximo campo (estilo Tab)[cite: 199, 201].
ENTER             | Botão/Link        | [cite_start]Executa a ação (Click)[cite: 202, 204].
ESC               | Geral             | [cite_start]Botão de Pânico: Volta à tela anterior[cite: 205, 207].


4. INSTALAÇÃO
--------------------------------------------------------------------------------
Para ativar a navegação, inclua o script navegacao.js antes do fechamento da 
[cite_start]tag </body>[cite: 209]. A estrutura deve obrigatoriamente usar tags <section> 
[cite_start]para delimitar os blocos[cite: 210].

Exemplo:
  <script src="/static/js/navegacao.js"></script>
</body>


5. CÓDIGO FONTE (VERSÃO ESTÁVEL)
--------------------------------------------------------------------------------
Localização: static/js/navegacao.js

[O código fonte implementa a captura de eventos 'keydown', mapeia seções com 
elementos interagíveis e gerencia os índices 'secIndex' e 'itemIndex' para 
controle preciso do foco. Ele inclui tratamento especial para inputs de texto 
para não quebrar a edição nativa e ignora o comportamento de 'Enter' em campos 
[cite_start]específicos como leitor de código de barras][cite: 218, 244, 256, 288].


6. OBSERVAÇÕES DE MANUTENÇÃO
--------------------------------------------------------------------------------
- CAMPOS DE TEXTO: A navegação horizontal é desabilitada dentro de inputs para 
  [cite_start]permitir a edição do conteúdo[cite: 296]. Para sair, use Enter ou as setas 
  [cite_start]Cima/Baixo[cite: 297].
- ADIÇÃO DINÂMICA: O array de itens (currentItems) é recalculado a cada tecla 
  pressionada. Isso garante que novos itens adicionados via JS (como produtos 
  [cite_start]em uma venda) sejam percebidos imediatamente pelo motor de foco[cite: 298].
================================================================================