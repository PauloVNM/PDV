import sqlite3

DATABASE = 'mercado.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        # 1. Tabela de Produtos (Já existente)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS produtos (
                ean TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                marca TEXT,
                preco REAL NOT NULL
            )
        ''')

        # 2. Tabela de Clientes (Para o Fiado)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                observacao TEXT
            )
        ''')

        # 3. Tabela de Vendas (O "Cabeçalho" da compra)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS vendas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT NOT NULL, -- 'PAGO' ou 'PENDENTE'
                valor_total REAL,      -- Apenas para vendas pagas
                cliente_id INTEGER,
                FOREIGN KEY (cliente_id) REFERENCES clientes (id)
            )
        ''')

        # 4. Itens da Venda (A lista de produtos de cada ticket)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS itens_venda (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                venda_id INTEGER NOT NULL,
                ean TEXT NOT NULL,
                quantidade INTEGER NOT NULL,
                FOREIGN KEY (venda_id) REFERENCES vendas (id),
                FOREIGN KEY (ean) REFERENCES produtos (ean)
            )
        ''')
        conn.commit()

def buscar_todos_produtos():
    conn = get_db_connection()
    produtos = conn.execute('SELECT * FROM produtos').fetchall()
    conn.close()
    return produtos

def buscar_produto_por_ean(ean):
    conn = get_db_connection()
    produto = conn.execute('SELECT * FROM produtos WHERE ean = ?', (ean,)).fetchone()
    conn.close()
    return produto

def inserir_ou_atualizar_produto(ean, nome, marca, preco):
    conn = get_db_connection()
    conn.execute('INSERT OR REPLACE INTO produtos VALUES (?, ?, ?, ?)', (ean, nome, marca, preco))
    conn.commit()
    conn.close()

def registrar_venda_paga(itens, valor_total):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO vendas (status, valor_total) VALUES (?, ?)',
            ('PAGO', valor_total)
        )
        venda_id = cursor.lastrowid 

        for item in itens:
            cursor.execute(
                'INSERT INTO itens_venda (venda_id, ean, quantidade) VALUES (?, ?, ?)',
                (venda_id, item['ean'], item['qtd'])
            )
        
        conn.commit() 
        return True, venda_id
        
    except Exception as e:
        conn.rollback() 
        return False, str(e)
    finally:
        conn.close()