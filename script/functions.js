const formPedido = document.querySelector('#formPedidos');
const pedidoTabela = document.querySelector('#itensPedido');
const lista = document.forms.itensPedido.elements;
let itensPedido = [];
let pedido = {};

const keys = {
    0: "codProduto",
    1: "descProduto",
    2: "precoProduto",
    3: "qtdEstoqueProd"
};

function limparPedido() {
    pedido = {};
}

function adicionarItemPedido(event) {
    event.preventDefault();
    for (let index = 0; index <= 3; index++) {
        pedido[keys[index]] = lista[index].value;
    }
    itensPedido.push({ ...pedido });
    limparPedido();
    atualizarTabela();
    somaTotal.style.display = 'block';
}

function atualizarTabela() {
    if (codigoPedido.value && buscarDesc.value && buscarPreco.value && buscarQtde.value) {
        const tbody = document.getElementById('tabelaPed');
        const tr = tbody.insertRow();
        
        const precoUnitario = parseFloat(buscarPreco.value);
        const quantidade = parseFloat(buscarQtde.value);

        if (isNaN(quantidade)) {
            alert('A quantidade deve ser um número válido.');
            return;
        }

        const subtotal = precoUnitario * quantidade;

        tr.insertCell().innerText = codigoPedido.value;
        tr.insertCell().innerText = buscarDesc.value;
        tr.insertCell().innerText = precoUnitario.toFixed(2);
        tr.insertCell().innerText = Math.floor(quantidade);  
        tr.insertCell().innerText = 'R$ ' + subtotal.toFixed(2); 

        let somaAtual = parseFloat(soma.value.replace('R$ ', '')); // Remove o R$ antes de converter para número
        somaAtual = isNaN(somaAtual) ? 0 : somaAtual;
        soma.value = 'R$ ' + (somaAtual + subtotal).toFixed(2); // Adiciona R$ antes de atribuir o novo valor
    } else {
        alert('Favor preencher todos os campos');
    }
}

function exportarTabelaParaJSON() {
    const clienteCodigo = document.getElementById('codClientePed').value;
    const clienteNome = document.getElementById('nomeClientePed').value;
    
    if (!clienteCodigo || !clienteNome) {
        alert('Favor preencher os dados do cliente antes de exportar.');
        return;
    }

    const tbody = document.getElementById('tabelaPed').getElementsByTagName('tr');
    const pedidoExportado = [];
    let totalPedido = 0;

    for (let i = 0; i < tbody.length; i++) {
        const cells = tbody[i].getElementsByTagName('td');
        if (cells.length === 0) continue;

        const itemPedido = {
            codProduto: cells[0].innerText,
            descProduto: cells[1].innerText,
            precoProduto: cells[2].innerText,
            qtdEstoqueProd: cells[3].innerText,
            subtotal: cells[4].innerText.replace('R$ ', '')
        };
        pedidoExportado.push(itemPedido);

        totalPedido += parseFloat(itemPedido.subtotal);
    }

    if (pedidoExportado.length === 0) {
        alert('Nenhum item no pedido para exportar.');
        return;
    }

    const pedidoCompleto = {
        cliente: {
            codigo: clienteCodigo,
            nome: clienteNome
        },
        itens: pedidoExportado,
        total: `R$ ${totalPedido.toFixed(2)}`
    };

    const jsonPedido = JSON.stringify(pedidoCompleto, null, 2);
    const blob = new Blob([jsonPedido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedido_completo.json'; 
    a.click();

    URL.revokeObjectURL(url);
}

document.getElementById('exportarPedido').addEventListener('click', exportarTabelaParaJSON);

formPedido.addEventListener('submit', adicionarItemPedido);
