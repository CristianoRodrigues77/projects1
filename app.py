from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Função para conectar ao banco de dados
def connect_db():
    return sqlite3.connect('todo.db')

# Função para inicializar o banco de dados e criar a tabela
def init_db():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Chama a função para garantir que o banco e a tabela estão criados
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    task = data.get('task')

    if task:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tasks (task) VALUES (?)", (task,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Tarefa adicionada!'})

    return jsonify({'error': 'Tarefa vazia'}), 400

@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, task FROM tasks")
    tasks = [{'id': row[0], 'task': row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify({'tasks': tasks})

@app.route('/delete_task', methods=['POST'])
def delete_task():
    data = request.json
    task_id = data.get('id')

    if task_id:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Tarefa removida!'})

    return jsonify({'error': 'ID inválido'}), 400

@app.route('/update_task', methods=['POST'])
def update_task():
    data = request.json
    task_id = data.get('id')
    new_task = data.get('task')

    if task_id and new_task:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET task = ? WHERE id = ?", (new_task, task_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Tarefa atualizada!'})

    return jsonify({'error': 'ID ou tarefa inválida'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
