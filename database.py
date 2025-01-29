import sqlite3

def init_db():
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    
    # Criar a tabela se não existir
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

# Chama a função ao iniciar o sistema
init_db()
