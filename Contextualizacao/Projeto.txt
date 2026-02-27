================================================================================
MERCADO DA FAMÍLIA - ESPECIFICAÇÃO TÉCNICA REVISADA
================================================================================

1. VISÃO GERAL
--------------------------------------------------------------------------------
Sistema de Ponto de Venda (PDV) local, focado em agilidade de fila, robustez 
[cite_start]operacional e gestão de dívidas por mercadoria[cite: 3]. O sistema substitui a 
caderneta física e a calculadora, operando em um único computador, sem 
[cite_start]dependência de internet para funcionamento básico[cite: 4].

[cite_start]Premissa central: A fila não pode parar[cite: 5].

PRINCÍPIOS FUNDAMENTAIS:
- [cite_start]Robustez acima de sofisticação[cite: 7].
- [cite_start]Simplicidade operacional para o operador[cite: 8].
================================================================================
MERCADO DA FAMÍLIA - ESPECIFICAÇÃO TÉCNICA REVISADA
================================================================================

1. VISÃO GERAL
--------------------------------------------------------------------------------
Sistema de Ponto de Venda (PDV) local, focado em agilidade de fila, robustez 
[cite_start]operacional e gestão de dívidas por mercadoria[cite: 3]. O sistema substitui a 
caderneta física e a calculadora, operando em um único computador, sem 
[cite_start]dependência de internet para funcionamento básico[cite: 4].

[cite_start]Premissa central: A fila não pode parar[cite: 5].

PRINCÍPIOS FUNDAMENTAIS:
- [cite_start]Robustez acima de sofisticação[cite: 7].
- [cite_start]Simplicidade operacional para o operador[cite: 8].
- [cite_start]Nenhuma lógica financeira desnecessária[cite: 9].
- [cite_start]Dívida representada como lista de produtos, nunca como valor fixo[cite: 10].

MODELO MENTAL:
- [cite_start]Somador Inteligente de Itens para vendas[cite: 12].
- [cite_start]Gestor de Tickets de Dívida para compras fiadas[cite: 13].

ATITUDE FINANCEIRA:
O sistema protege o capital de giro ignorando o valor monetário no momento da 
[cite_start]venda fiada[cite: 15]. A dívida é sempre recalculada com base no preço atual da 
prateleira no momento do pagamento, funcionando como proteção automática contra 
[cite_start]inflação[cite: 16].


2. ARQUITETURA E TECNOLOGIA
--------------------------------------------------------------------------------
ARQUITETURA GERAL:
- [cite_start]Aplicação local, monolítica e simples[cite: 19].
- [cite_start]Execução síncrona[cite: 20].
- [cite_start]Sem dependência de serviços externos[cite: 21].

TECNOLOGIAS:
- [cite_start]Back-end: Python + Flask[cite: 23].
- [cite_start]Banco de Dados: SQLite[cite: 24].
- [cite_start]Front-end: HTML5 + CSS + JavaScript Vanilla[cite: 25].

MODO DE USO:
- [cite_start]Navegador em modo Kiosk (tela cheia, sem barra de endereços)[cite: 27].

HARDWARE:
- [cite_start]PC comum (Windows como alvo principal)[cite: 29].
- [cite_start]Leitor de código de barras (USB-emula teclado)[cite: 30].
- [cite_start]Impressora térmica não-fiscal (USB ou Serial)[cite: 31].


3. ESCOPO DO SISTEMA
--------------------------------------------------------------------------------
O QUE O SISTEMA FAZ:
- [cite_start]Cadastro e consulta de produtos por código de barras[cite: 34].
- [cite_start]Soma de itens em tempo real no front-end[cite: 35].
- [cite_start]Registro de vendas pagas para fins de relatório[cite: 36].
- [cite_start]Gestão de compras fiadas através de tickets independentes[cite: 37].
- [cite_start]Recalcular automaticamente dívidas pelo preço atual[cite: 38].
- [cite_start]Impressão de comprovantes de dívida[cite: 39].

O QUE O SISTEMA NÃO FAZ:
- [cite_start]Não controla estoque[cite: 41].
- [cite_start]Não congela preços[cite: 42].
- [cite_start]Não diferencia meios de pagamento (Pix, dinheiro, cartão)[cite: 43].
- [cite_start]Não se comunica com máquinas de cartão (TEF)[cite: 44].
- [cite_start]Não salva valores monetários em tickets de dívida[cite: 45].


4. MÓDULOS FUNCIONAIS
--------------------------------------------------------------------------------
4.1 CADASTRO DE PRODUTOS
- [cite_start]Criação e edição de produtos[cite: 48].
- [cite_start]Associação de nome e preço ao código de barras[cite: 49].
- [cite_start]Suporte a códigos EAN-13[cite: 50].
- [cite_start]Criação de códigos internos para produtos caseiros[cite: 51].

4.2 CRIAÇÃO DE NOVA VENDA
- [cite_start]Módulo principal de operação de caixa[cite: 53].
- [cite_start]Entrada por bipagem de código de barras[cite: 54].
- [cite_start]Soma visual em tempo real[cite: 55].

4.3 CONSULTA DE DÍVIDAS
- [cite_start]Busca de clientes[cite: 57].
- [cite_start]Visualização de tickets pendentes[cite: 58].
- [cite_start]Quitação individual ou consolidada[cite: 59].
- [cite_start]Cancelamento de tickets[cite: 60].
- [cite_start]Transferência de tickets entre clientes[cite: 61].


5. FLUXOS DE OPERAÇÃO
--------------------------------------------------------------------------------
CENÁRIO 1: VENDA PAGA
1. [cite_start]Operador bipa os produtos[cite: 64].
2. Front-end agrupa itens, multiplica quantidades e soma o total em tempo real 
   [cite_start][cite: 66, 67, 68].
3. [cite_start]Operador recebe o pagamento externamente[cite: 69].
4. [cite_start]Operador clica em VENDA PAGA[cite: 70].
5. Sistema salva: Data/hora, lista de produtos, quantidades e valor total final 
   (confiando no cálculo do front) [cite_start][cite: 72, 73, 74, 75].
6. [cite_start]Sistema retorna à tela inicial[cite: 76].

CENÁRIO 2: VENDA PENDENTE (FIADO)
1. [cite_start]Operador bipa os produtos e clica em PENDENTE[cite: 81, 82].
2. [cite_start]Seleção de cliente (Existente ou Novo - Nome e Observação)[cite: 83, 84, 88, 89].
3. Sistema grava ticket com: Cliente, lista de códigos de barras e quantidades 
   [cite_start][cite: 92, 93, 94, 95].
4. Sistema tenta imprimir comprovante (obrigatório, mas falha não bloqueia) 
   [cite_start][cite: 97, 102].
5. [cite_start]Sistema retorna à tela inicial[cite: 99].
* [cite_start]Importante: Nenhum valor monetário é salvo no ticket[cite: 101].

CENÁRIO 3: PAGAMENTO DE DÍVIDAS
1. [cite_start]Operador acessa Consulta de Dívidas e seleciona o cliente[cite: 104, 105].
2. [cite_start]Visualiza tickets pendentes[cite: 106].
3. [cite_start]Pagamento Individual ou Quitação Total[cite: 107, 113].
4. O Back-end busca os produtos, consulta o preço ATUAL no catálogo e recalcula 
   [cite_start]o valor em tempo real[cite: 109, 110, 111, 118].
5. [cite_start]Operador confirma recebimento e tickets são baixados[cite: 112, 120, 121].

CENÁRIO 4: TRANSFERÊNCIA DE TICKET
- [cite_start]Permitida apenas para tickets pendentes[cite: 123].
- [cite_start]Operador seleciona o ticket e o cliente destino[cite: 124, 125].
- [cite_start]Confirma e o ticket troca de titularidade[cite: 127, 128].

CENÁRIO 5: CANCELAMENTO DE TICKET
- [cite_start]Operador seleciona o ticket e clica em CANCELAR[cite: 130, 131].
- [cite_start]Após confirmação, o ticket é excluído definitivamente[cite: 132, 133].
- [cite_start]Não aparecem em cobranças nem relatórios[cite: 135, 136].


6. ESTRUTURA DE DADOS (CONCEITUAL)
--------------------------------------------------------------------------------
PRODUTOS:
- [cite_start]codigo_barras (EAN-13, Chave Primária)[cite: 139].
- [cite_start]nome[cite: 140].
- [cite_start]preco_atual[cite: 141].

CLIENTES:
- [cite_start]id[cite: 143].
- [cite_start]nome[cite: 144].
- [cite_start]observacao[cite: 145].

VENDAS:
- [cite_start]id[cite: 147].
- [cite_start]data_hora[cite: 148].
- [cite_start]status (PAGO ou PENDENTE)[cite: 149].
- [cite_start]valor_total (apenas para vendas pagas)[cite: 150].

ITENS DA VENDA:
- [cite_start]venda_id[cite: 152].
- [cite_start]codigo_barras[cite: 153].
- [cite_start]quantidade[cite: 154].

* [cite_start]Observação: Um "ticket" é uma venda com status PENDENTE[cite: 156].


7. REGRAS DE NEGÓCIO ESSENCIAIS
--------------------------------------------------------------------------------
- [cite_start]O sistema não valida nem registra meios de pagamento[cite: 158].
- O cálculo da venda paga é responsabilidade do front-end; back-end confia no 
  [cite_start]valor recebido[cite: 159, 160].
- [cite_start]A dívida é sempre recalculada pelo preço atual[cite: 161].
- [cite_start]Produtos nunca são removidos do catálogo[cite: 162].
- [cite_start]Falhas de impressão não interrompem o fluxo[cite: 163].
- [cite_start]Tickets pagos ou cancelados são imutáveis[cite: 164].
- [cite_start]Clientes podem ter nomes iguais[cite: 165].
- [cite_start]Não há recuperação automática de vendas interrompidas[cite: 166].


8. IMPRESSÃO DE COMPROVANTE (VENDA PENDENTE)
--------------------------------------------------------------------------------
O comprovante deve conter:
- [cite_start]Data e hora[cite: 169].
- [cite_start]Lista de produtos e quantidades[cite: 170].
- [cite_start]Aviso legal sobre atualização de valores por inflação[cite: 171].
- [cite_start]Campo para assinatura[cite: 172].
- [cite_start]Chave Pix para pagamento remoto[cite: 173].
================================================================================- [cite_start]Nenhuma lógica financeira desnecessária[cite: 9].
- [cite_start]Dívida representada como lista de produtos, nunca como valor fixo[cite: 10].

MODELO MENTAL:
- [cite_start]Somador Inteligente de Itens para vendas[cite: 12].
- [cite_start]Gestor de Tickets de Dívida para compras fiadas[cite: 13].

ATITUDE FINANCEIRA:
O sistema protege o capital de giro ignorando o valor monetário no momento da 
[cite_start]venda fiada[cite: 15]. A dívida é sempre recalculada com base no preço atual da 
prateleira no momento do pagamento, funcionando como proteção automática contra 
[cite_start]inflação[cite: 16].


2. ARQUITETURA E TECNOLOGIA
--------------------------------------------------------------------------------
ARQUITETURA GERAL:
- [cite_start]Aplicação local, monolítica e simples[cite: 19].
- [cite_start]Execução síncrona[cite: 20].
- [cite_start]Sem dependência de serviços externos[cite: 21].

TECNOLOGIAS:
- [cite_start]Back-end: Python + Flask[cite: 23].
- [cite_start]Banco de Dados: SQLite[cite: 24].
- [cite_start]Front-end: HTML5 + CSS + JavaScript Vanilla[cite: 25].

MODO DE USO:
- [cite_start]Navegador em modo Kiosk (tela cheia, sem barra de endereços)[cite: 27].

HARDWARE:
- [cite_start]PC comum (Windows como alvo principal)[cite: 29].
- [cite_start]Leitor de código de barras (USB-emula teclado)[cite: 30].
- [cite_start]Impressora térmica não-fiscal (USB ou Serial)[cite: 31].


3. ESCOPO DO SISTEMA
--------------------------------------------------------------------------------
O QUE O SISTEMA FAZ:
- [cite_start]Cadastro e consulta de produtos por código de barras[cite: 34].
- [cite_start]Soma de itens em tempo real no front-end[cite: 35].
- [cite_start]Registro de vendas pagas para fins de relatório[cite: 36].
- [cite_start]Gestão de compras fiadas através de tickets independentes[cite: 37].
- [cite_start]Recalcular automaticamente dívidas pelo preço atual[cite: 38].
- [cite_start]Impressão de comprovantes de dívida[cite: 39].

O QUE O SISTEMA NÃO FAZ:
- [cite_start]Não controla estoque[cite: 41].
- [cite_start]Não congela preços[cite: 42].
- [cite_start]Não diferencia meios de pagamento (Pix, dinheiro, cartão)[cite: 43].
- [cite_start]Não se comunica com máquinas de cartão (TEF)[cite: 44].
- [cite_start]Não salva valores monetários em tickets de dívida[cite: 45].


4. MÓDULOS FUNCIONAIS
--------------------------------------------------------------------------------
4.1 CADASTRO DE PRODUTOS
- [cite_start]Criação e edição de produtos[cite: 48].
- [cite_start]Associação de nome e preço ao código de barras[cite: 49].
- [cite_start]Suporte a códigos EAN-13[cite: 50].
- [cite_start]Criação de códigos internos para produtos caseiros[cite: 51].

4.2 CRIAÇÃO DE NOVA VENDA
- [cite_start]Módulo principal de operação de caixa[cite: 53].
- [cite_start]Entrada por bipagem de código de barras[cite: 54].
- [cite_start]Soma visual em tempo real[cite: 55].

4.3 CONSULTA DE DÍVIDAS
- [cite_start]Busca de clientes[cite: 57].
- [cite_start]Visualização de tickets pendentes[cite: 58].
- [cite_start]Quitação individual ou consolidada[cite: 59].
- [cite_start]Cancelamento de tickets[cite: 60].
- [cite_start]Transferência de tickets entre clientes[cite: 61].


5. FLUXOS DE OPERAÇÃO
--------------------------------------------------------------------------------
CENÁRIO 1: VENDA PAGA
1. [cite_start]Operador bipa os produtos[cite: 64].
2. Front-end agrupa itens, multiplica quantidades e soma o total em tempo real 
   [cite_start][cite: 66, 67, 68].
3. [cite_start]Operador recebe o pagamento externamente[cite: 69].
4. [cite_start]Operador clica em VENDA PAGA[cite: 70].
5. Sistema salva: Data/hora, lista de produtos, quantidades e valor total final 
   (confiando no cálculo do front) [cite_start][cite: 72, 73, 74, 75].
6. [cite_start]Sistema retorna à tela inicial[cite: 76].

CENÁRIO 2: VENDA PENDENTE (FIADO)
1. [cite_start]Operador bipa os produtos e clica em PENDENTE[cite: 81, 82].
2. [cite_start]Seleção de cliente (Existente ou Novo - Nome e Observação)[cite: 83, 84, 88, 89].
3. Sistema grava ticket com: Cliente, lista de códigos de barras e quantidades 
   [cite_start][cite: 92, 93, 94, 95].
4. Sistema tenta imprimir comprovante (obrigatório, mas falha não bloqueia) 
   [cite_start][cite: 97, 102].
5. [cite_start]Sistema retorna à tela inicial[cite: 99].
* [cite_start]Importante: Nenhum valor monetário é salvo no ticket[cite: 101].

CENÁRIO 3: PAGAMENTO DE DÍVIDAS
1. [cite_start]Operador acessa Consulta de Dívidas e seleciona o cliente[cite: 104, 105].
2. [cite_start]Visualiza tickets pendentes[cite: 106].
3. [cite_start]Pagamento Individual ou Quitação Total[cite: 107, 113].
4. O Back-end busca os produtos, consulta o preço ATUAL no catálogo e recalcula 
   [cite_start]o valor em tempo real[cite: 109, 110, 111, 118].
5. [cite_start]Operador confirma recebimento e tickets são baixados[cite: 112, 120, 121].

CENÁRIO 4: TRANSFERÊNCIA DE TICKET
- [cite_start]Permitida apenas para tickets pendentes[cite: 123].
- [cite_start]Operador seleciona o ticket e o cliente destino[cite: 124, 125].
- [cite_start]Confirma e o ticket troca de titularidade[cite: 127, 128].

CENÁRIO 5: CANCELAMENTO DE TICKET
- [cite_start]Operador seleciona o ticket e clica em CANCELAR[cite: 130, 131].
- [cite_start]Após confirmação, o ticket é excluído definitivamente[cite: 132, 133].
- [cite_start]Não aparecem em cobranças nem relatórios[cite: 135, 136].


6. ESTRUTURA DE DADOS (CONCEITUAL)
--------------------------------------------------------------------------------
PRODUTOS:
- [cite_start]codigo_barras (EAN-13, Chave Primária)[cite: 139].
- [cite_start]nome[cite: 140].
- [cite_start]preco_atual[cite: 141].

CLIENTES:
- [cite_start]id[cite: 143].
- [cite_start]nome[cite: 144].
- [cite_start]observacao[cite: 145].

VENDAS:
- [cite_start]id[cite: 147].
- [cite_start]data_hora[cite: 148].
- [cite_start]status (PAGO ou PENDENTE)[cite: 149].
- [cite_start]valor_total (apenas para vendas pagas)[cite: 150].

ITENS DA VENDA:
- [cite_start]venda_id[cite: 152].
- [cite_start]codigo_barras[cite: 153].
- [cite_start]quantidade[cite: 154].

* [cite_start]Observação: Um "ticket" é uma venda com status PENDENTE[cite: 156].


7. REGRAS DE NEGÓCIO ESSENCIAIS
--------------------------------------------------------------------------------
- [cite_start]O sistema não valida nem registra meios de pagamento[cite: 158].
- O cálculo da venda paga é responsabilidade do front-end; back-end confia no 
  [cite_start]valor recebido[cite: 159, 160].
- [cite_start]A dívida é sempre recalculada pelo preço atual[cite: 161].
- [cite_start]Produtos nunca são removidos do catálogo[cite: 162].
- [cite_start]Falhas de impressão não interrompem o fluxo[cite: 163].
- [cite_start]Tickets pagos ou cancelados são imutáveis[cite: 164].
- [cite_start]Clientes podem ter nomes iguais[cite: 165].
- [cite_start]Não há recuperação automática de vendas interrompidas[cite: 166].


8. IMPRESSÃO DE COMPROVANTE (VENDA PENDENTE)
--------------------------------------------------------------------------------
O comprovante deve conter:
- [cite_start]Data e hora[cite: 169].
- [cite_start]Lista de produtos e quantidades[cite: 170].
- [cite_start]Aviso legal sobre atualização de valores por inflação[cite: 171].
- [cite_start]Campo para assinatura[cite: 172].
- [cite_start]Chave Pix para pagamento remoto[cite: 173].
================================================================================