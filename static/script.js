const listaTarefas = document.getElementById('lista-tarefas');
const novaTarefaInput = document.getElementById('nova-tarefa');
const botaoAdicionar = document.getElementById('adicionar-tarefa');

// Atualiza a lista de tarefas na interface
function atualizarLista(tarefas) {
    listaTarefas.innerHTML = '';
    tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${index + 1}. ${tarefa} <span class="remove" onclick="removerTarefa(${index})">x</span>`;
        listaTarefas.appendChild(li);
    });
}

// Adiciona uma tarefa
botaoAdicionar.addEventListener('click', async () => {
    const tarefa = novaTarefaInput.value.trim();
    if (tarefa) {
        const response = await fetch('/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tarefa }),
        });
        const data = await response.json();
        if (data.status === 'success') {
            atualizarLista(data.tarefas);
            novaTarefaInput.value = '';
        }
    }
});

// Remove uma tarefa
async function removerTarefa(index) {
    const response = await fetch('/remover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index }),
    });
    const data = await response.json();
    if (data.status === 'success') {
        atualizarLista(data.tarefas);
    }
}

// Carrega a lista inicial de tarefas
async function carregarTarefas() {
    const response = await fetch('/listar');
    const data = await response.json();
    if (data.status === 'success') {
        atualizarLista(data.tarefas);
    }
}

document.addEventListener('DOMContentLoaded', carregarTarefas);

// Função para adicionar tarefa
document.getElementById('addTaskBtn').addEventListener('click', function () {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value;

    if (task) {
        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Tarefa adicionada!') {
                taskInput.value = '';
                loadTasks(); // Atualiza a lista de tarefas
            } else {
                alert('Erro ao adicionar tarefa');
            }
        });
    }
});

// Função para carregar tarefas do banco de dados
function loadTasks() {
    fetch('/get_tasks')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Limpa a lista antes de adicionar as novas tarefas

            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.task;
                
                // Adiciona um botão de editar
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.onclick = function() {
                    editTask(task.id, task.task);
                };

                // Adiciona um botão de deletar
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Deletar';
                deleteBtn.onclick = function() {
                    deleteTask(task.id);
                };

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        });
}

// Função para editar uma tarefa
function editTask(taskId, oldTask) {
    const newTask = prompt('Edite a tarefa', oldTask);
    if (newTask !== null && newTask !== oldTask) {
        fetch('/update_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: taskId, task: newTask }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Tarefa atualizada!') {
                loadTasks(); // Atualiza a lista de tarefas
            }
        });
    }
}

// Função para deletar uma tarefa
function deleteTask(taskId) {
    fetch('/delete_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Tarefa removida!') {
            loadTasks(); // Atualiza a lista de tarefas
        }
    });
}

// Carrega as tarefas ao iniciar a página
loadTasks();
