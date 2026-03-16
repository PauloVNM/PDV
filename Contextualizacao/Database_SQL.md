================================================================================
DIRETRIZES DE ARQUITETURA BACK-END - BANCO DE DADOS (database.py)
================================================================================
STATUS: Centralizado e Protegido.
AMBIENTE: SQLite3 (Python).

1. MOTIVAÇÃO E O PAPEL DO GUARDIÃO
- O `database.py` foi criado para ser o único ponto de contato entre a aplicação e o SQLite. 
- Centralizar o SQL aqui evita que mudanças na estrutura das tabelas quebrem dezenas de rotas espalhadas pelo sistema. Se o banco mudar, apenas este arquivo muda.

2. TRANSAÇÕES ATÔMICAS (A REGRA DO TUDO OU NADA)
- Operações de escrita que envolvem múltiplas inserções (ex: salvar um cabeçalho de venda e depois seus itens) DEVEM OBRIGATORIAMENTE ser envelopadas em um bloco `try/except`.
- Sucesso: `conn.commit()` para gravar tudo de uma vez.
- Falha: `conn.rollback()` para cancelar a operação inteira se qualquer erro ocorrer no meio do caminho. 
- Não toleramos dados corrompidos ou "meias-vendas". O caixa não pode furar.

3. COMO DEVE CONTINUAR SENDO FEITO:
- Cada operação no banco deve ser uma função independente e bem nomeada (ex: `buscar_produto_por_ean(ean)`, `registrar_venda_paga(itens, total)`).
- As funções devem abrir a conexão `get_db_connection()`, executar a tarefa e fechar a conexão `conn.close()` (usando o bloco `finally` quando aplicável para garantir o fechamento mesmo após um erro).
- Nenhuma função do `database.py` deve saber o que é uma requisição web (request/response). Elas recebem parâmetros puros (strings, ints, dicts) e retornam dados puros (tuplas, booleanos, dicionários).
================================================================================