const botao = document.querySelector('#loginEntrada');
const nomeUser = document.querySelector('#inputUsuario');
const senhaUser = document.querySelector('#inputSenha');

function limpar() {
    nomeUser.value = '';
    senhaUser.value = '';
}

async function dadosLogin() {
    let dadosFetch = await fetch("./script/usuario.json");
    let loginJson = await dadosFetch.json();
    let loginValido = loginJson.users.some(user => nomeUser.value === user.user && senhaUser.value === user.pws);

    if (loginValido) {
        document.querySelector('#formulario').submit();
    } else {
        alert('Favor, preencher com os dados corretos');
        limpar();
    }
}

botao.addEventListener('click', dadosLogin);
