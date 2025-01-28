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
