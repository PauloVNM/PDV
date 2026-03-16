================================================================================
DIRETRIZES DE ARQUITETURA BACK-END - ROTAS (app.py)
================================================================================
STATUS: Refatorado e Blindado.
AMBIENTE: Flask (Python).

1. A LEI DO ATENDENTE (RESPONSABILIDADE DO app.py)
- O arquivo `app.py` atua EXCLUSIVAMENTE como um "atendente de balcão". 
- Ele tem apenas três funções: 
  1. Receber a requisição HTTP (GET/POST).
  2. Repassar os dados para as funções especializadas do `database.py`.
  3. Devolver a resposta (HTML ou JSON) para o front-end.

2. O QUE É ESTRITAMENTE PROIBIDO:
- É absolutamente proibido escrever instruções SQL (SELECT, INSERT, UPDATE, DELETE) dentro do `app.py`.
- É proibido colocar regras de negócio complexas ou cálculos financeiros nas rotas.

3. COMO DEVE CONTINUAR SENDO FEITO:
- Toda nova rota deve ser magra. 
- Se a rota precisar de dados do banco, ela deve importar uma função explícita do `database.py`.
- As respostas de API devem seguir um contrato claro de JSON, sempre contendo uma flag de status, ex: `{"sucesso": True, "mensagem": "..."}` ou `{"sucesso": False, "mensagem": "..."}`.
- O tratamento de erros (Try/Except) para falhas de banco de dados não acontece aqui, acontece no módulo de banco de dados. O `app.py` apenas reage ao sucesso ou falha que o `database.py` relatar.
================================================================================