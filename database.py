import sqlite3

DATABASE = 'mercado.db'

def get_db_connection():
    # Conecta e garante que os dados venham como dicionários (Row)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    # Esta função só roda uma vez para garantir que a estrutura existe
    with get_db_connection() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS produtos (
                ean TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                marca TEXT,
                preco REAL NOT NULL
            )
        ''')
        conn.commit()