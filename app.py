from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Lista de tarefas em memória
tarefas = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/adicionar', methods=['POST'])
def adicionar_tarefa():
    global tarefas
    nova_tarefa = request.json.get('tarefa', '').strip()
    if nova_tarefa:
        tarefas.append(nova_tarefa)
        return jsonify({'status': 'success', 'tarefas': tarefas})
    return jsonify({'status': 'error', 'message': 'Tarefa inválida!'})

@app.route('/remover', methods=['POST'])
def remover_tarefa():
    global tarefas
    tarefa_index = request.json.get('index', -1)
    if 0 <= tarefa_index < len(tarefas):
        tarefas.pop(tarefa_index)
        return jsonify({'status': 'success', 'tarefas': tarefas})
    return jsonify({'status': 'error', 'message': 'Índice inválido!'})

@app.route('/listar', methods=['GET'])
def listar_tarefas():
    return jsonify({'status': 'success', 'tarefas': tarefas})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
