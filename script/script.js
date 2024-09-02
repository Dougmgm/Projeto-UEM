let clientes = [];
let produtos = [];

fetch('/streamlit/clientes.json')
    .then(response => response.json())
    .then(data => {
        clientes = data;
        TransicaoCliente(1); 
    })
    .catch(error => console.error('Erro ao carregar o arquivo clientes.json:', error));

    fetch('/streamlit/produtos.json')
    .then(response => response.json())
    .then(data => {
        produtos = data;
        TransicaoProdutos(1); 
    })
    .catch(error => console.error('Erro ao carregar o arquivo clientes.json:', error));    

const botaoEsquerda = document.querySelectorAll('.esquerda');
const botaoSair = document.querySelectorAll('.sair');
const botaoMov = document.querySelectorAll('.btnAjuste');
const fecharPedCliente = document.querySelectorAll('.direitaPed');
const codClientePed = document.querySelector("#codClientePed");
const nomeClientePed = document.querySelector("#nomeClientePed");
const codigoPedido = document.querySelector("#codigoPedido");

TransicaoCliente(1);
TransicaoProdutos(1);

function selecionarTela() {
    const esconderTodosFormularios = () => {
        document.forms[0].style.display = 'none';
        document.forms[1].style.display = 'none';
        formPedidos.style.display = 'none'; 
    };

    for (let botao of botaoEsquerda) {
        botao.addEventListener('click', (event) => {
            esconderTodosFormularios();
            switch (event.target.id) {
                case 'primeiro':
                    document.forms[0].style.display = 'block';
                    break;
                case 'segundo':
                    document.forms[1].style.display = 'block';
                    break;
                default:
                    formPedidos.style.display = 'block'; 
                    break;
            }
        });
    }
}

selecionarTela();

function sairTela() {
    for (let fechar of botaoSair) {
        fechar.addEventListener('click', (event) => {
            event.target.form.style.display = 'none';
        });
    }
}

sairTela();

function TransicaoCliente(posicao) {
    const form = document.forms[0];

    const setFormValues = (cliente) => {
        form[2].value = cliente.codCliente;
        form[3].value = cliente.nomeCliente;
        form[4].value = cliente.dataCadCli;
        form[5].value = cliente.sexo;
        form[6].value = cliente.estadoCivil;
    };

    if (posicao === -1) {
        setFormValues({
            codCliente: clientes.length + 1,
            nomeCliente: '',
            dataCadCli: getDate()
        });
    } else if (posicao > clientes.length || posicao < 1) {
        console.log('Fim da lista');
    } else {
        const cliente = clientes[posicao - 1];
        setFormValues(cliente);
    }
}

function getDate() {
    let data = new Date();
    return `${data.getUTCDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
}

function TransicaoProdutos(posicao) {
    const form = document.forms[1];

    const setFormValues = (produto) => {
        form[2].value = produto.codProduto;
        form[3].value = produto.descProduto;
        form[4].value = produto.precoProduto;
        form[5].value = produto.qtdEstoqueProd;
    };

    if (posicao === -1) {
        setFormValues({
            codProduto: produtos.length + 1,
            descProduto: '',
            precoProduto: '',
            qtdEstoqueProd: ''
        });
    } else if (posicao > produtos.length || posicao < 1) {
        console.log('Fim da lista');
    } else {
        const produto = produtos[posicao - 1];
        setFormValues(produto);
    }
}

function movCliente() {
    const acoes = {
        antCliente: pos => TransicaoCliente(Number(pos) - 1),
        proxCliente: pos => TransicaoCliente(Number(pos) + 1),
        novoCliente: () => TransicaoCliente(-1),
        salvarCliente: () => {
            const form = document.forms[0];
            const novoCliente = {
                codCliente: form[2].value,
                nomeCliente: form[3].value,
                dataCadCli: form[4].value,
                sexo: form[5].value,
                estadoCivil: form[6].value
            };
            if (novoCliente.codCliente == clientes.length + 1 && novoCliente.nomeCliente) {
                clientes.push(novoCliente);
                alert('Dados salvos com sucesso');
            } else {
                alert('Por favor preencher todos os dados');
            }
        }
    };

    for (let botao of botaoMov) {
        botao.addEventListener('click', (mover) => {
            const pos = mover.target.form[2].value;
            const acao = acoes[mover.target.id];
            if (acao) acao(pos);
        });
    }
}

movCliente();

function movProduto() {
    const acoes = {
        antProd: pos => TransicaoProdutos(Number(pos) + 1),
        proxProd: pos => TransicaoProdutos(Number(pos) - 1),
        novoProd: () => TransicaoProdutos(-1),
        salvarProd: () => {
            const form = document.forms[1];
            const novoProduto = {
                codProduto: form[2].value,
                descProduto: form[3].value,
                precoProduto: form[4].value,
                qtdEstoqueProd: form[5].value
            };
            if (novoProduto.codProduto == produtos.length + 1 && novoProduto.descProduto && novoProduto.precoProduto && novoProduto.qtdEstoqueProd) {
                produtos.push(novoProduto);
                alert('Dados salvo com sucesso');
            } else {
                alert('Por favor preencher todos os dados');
            }
        }
    };

    for (let botao of botaoMov) {
        botao.addEventListener('click', (mover) => {
            const pos = mover.target.form[2].value;
            const acao = acoes[mover.target.id];
            if (acao) acao(pos);
        });
    }
}

movProduto();

function limpaClientes() {
    const campos = [codClientePed, nomeClientePed, codigoPedido, buscarPreco, buscarDesc, buscarQtde];
    campos.forEach(campo => campo.value = '');
}

function limpaPedidos() {
    [codigoPedido, buscarQtde].forEach(campo => campo.value = '');
}

function validaCliente() {
    let x = Number(codClientePed.value);
    if (x > clientes.length) {
        alert("Favor colocar um código válido");
        limpaClientes();
    } else {
        let cliente = clientes[x - 1];
        nomeClientePed.value = cliente.nomeCliente;
    }
}

function formatarPreco(input) {
    // Obter o valor do input
    let valor = input.value;

    // Converter para número
    let numero = parseFloat(valor);

    // Verificar se é um número válido
    if (!isNaN(numero)) {
        // Formatar para duas casas decimais
        input.value = numero.toFixed(2);
    } else {
        // Caso não seja um número válido, limpar o campo
        input.value = '';
    }
}

function validaProduto() {
    let y = Number(codigoPedido.value);
    if (y > produtos.length) {
        alert("Favor colocar um código válido");
        limpaPedidos();
    } else {
        let produto = produtos[y - 1];
        buscarDesc.value = produto.descProduto;
        buscarPreco.value = produto.precoProduto;
        if (Number(buscarQtde.value) > produto.qtdEstoqueProd) {
            alert('Favor colocar uma quantidade válida');
            limpaPedidos();
        }
    }
}



const quantidadeProduto = document.getElementById('quantidadeProduto');

quantidadeProduto.addEventListener('input', function() {
    if (quantidadeProduto.value < 0) {
        quantidadeProduto.value = 0;
        console.log("teste")
    }
});

document.getElementById('sexoCliente').addEventListener('input', function() {
    const value = this.value.toUpperCase();
    if (value !== 'M' && value !== 'F') {
        this.setCustomValidity('Por favor entre M ou F');
    } else {
        this.setCustomValidity('');
    }
});

function exportarClientesParaJSON() {

    let jsonClientes = JSON.stringify(clientes, null, 2);

    let blob = new Blob([jsonClientes], { type: 'application/json' });

    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json'; 
    a.click();

    URL.revokeObjectURL(url);
}

function exportarProdutosParaJSON() {
    
    let jsonProdutos = JSON.stringify(produtos, null, 2);

    let blob = new Blob([jsonProdutos], { type: 'application/json' });

    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'produtos.json';
    a.click();

    URL.revokeObjectURL(url);
}

window.exportarClientesParaJSON = exportarClientesParaJSON;

window.exportarProdutosParaJSON = exportarProdutosParaJSON;


function getData() {
    for (let botao of fecharPedCliente) {
        botao.addEventListener("focusout", validaCliente);
        botao.addEventListener("focusout", validaProduto);
    }
}

document.getElementById('abrir-bi').addEventListener('click', function() {
    var streamlitSection = document.getElementById('streamlit-section');
    var button = document.getElementById('abrir-bi');

    var formClientes = document.getElementById('formClientes');
    var formPedidos = document.getElementById('formPedidos');
    var formProdutos = document.getElementById('formProdutos');

    if (streamlitSection.style.display === 'none') {
        streamlitSection.style.display = 'block';
        button.textContent = 'Ocultar Análise de Dados';

        formClientes.style.display = 'none';
        formPedidos.style.display = 'none';
        formProdutos.style.display = 'none';
    } else {
        streamlitSection.style.display = 'none';
        button.textContent = 'Abrir Análise de Dados';
    }
}); 

getData();