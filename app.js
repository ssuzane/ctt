'use strict';

async function pegarContatos() {
    const endpoint = 'http://localhost:3000/contatos';
    const api = await fetch(endpoint);
    const listApi = await api.json();
    return listApi;
}

async function editarContato(editaContato, id) {
    const endpoint = `http://localhost:3000/contatos/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editaContato)
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}

async function postarCliente(novoCliente) {
    const endpoint = 'http://localhost:3000/contatos';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoCliente)
    };

    try {
        const response = await fetch(endpoint, options);
        return response.ok;
    } catch (error) {
        console.error('Error posting contact:', error);
    }
}

async function deletarContato(id) {
    const endpoint = `http://localhost:3000/contatos/${id}`;
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Contact with ID ${id} deleted successfully.`);
        } else {
            console.error(`Error deleting contact with ID ${id}.`);
        }
    } catch (error) {
        console.error('Error during delete request:', error);
    }

    window.location.reload();
}

async function carregarContato() {
    let contatos = await pegarContatos();
    contatos.forEach(contato => {
        createRow(contato);
    });
}

carregarContato();



/*********************configs************************************/

const modalClose = document.getElementById('modalClose');
const cancelar = document.getElementById('cancelar');
const campo = document.getElementById('campo');
const modal = document.getElementById('modal');
const btncadastrar = document.getElementById('cadastrar');
const salvar = document.getElementById('salvar');

const createRow = (client) => {
    const newRow = document.createElement('tr');

    const nome = document.createElement('td');
    nome.textContent = client.nome;

    const email = document.createElement('td');
    email.textContent = client.email;

    const celular = document.createElement('td');
    celular.textContent = client.celular;

    const endereco = document.createElement('td');
    endereco.textContent = client.endereco;

    const tdEditarExcluir = document.createElement('td');

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('green', 'button');
    btnEditar.textContent = 'editar';

    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('red', 'button');
    btnExcluir.textContent = 'excluir';

    btnExcluir.addEventListener('click', function() {
        deletarContato(client.id);
    });

    btnEditar.addEventListener('click', function() {
        editar();
        document.getElementById('nome').value = client.nome;
        document.getElementById('email').value = client.email;
        document.getElementById('celular').value = client.celular;
        document.getElementById('endereco').value = client.endereco;
        salvar.dataset.id = client.id;  // Store client ID for saving
    });

    newRow.append(nome, email, celular, endereco, tdEditarExcluir);
    tdEditarExcluir.append(btnEditar, btnExcluir);
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

function editar() {
    modal.classList.remove('baixo');
    modal.classList.add('cima');
    campo.classList.remove('hidden');
    campo.classList.add('visivel');
}

function editado() {
    modal.classList.remove('cima');
    modal.classList.add('baixo');
    campo.classList.remove('visivel');
    campo.classList.add('hidden');
    // Clear fields
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('celular').value = '';
    document.getElementById('endereco').value = '';
    delete salvar.dataset.id;  // Remove client ID
}

btncadastrar.addEventListener('click', function() {
    editar();
});

modalClose.addEventListener('click', editado);
cancelar.addEventListener('click', editado);

salvar.addEventListener('click', async function() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const celular = document.getElementById('celular').value;
    const endereco = document.getElementById('endereco').value;

    const contato = {
        nome: nome,
        email: email,
        celular: celular,
        endereco: endereco
    };

    if (salvar.dataset.id) {
        // Editing existing client
        await editarContato(contato, salvar.dataset.id);
    } else {
        // Creating new client
        await postarCliente(contato);
    }

    editado();
    window.location.reload();
});

