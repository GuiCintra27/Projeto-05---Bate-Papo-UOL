let Login = '';
const loginScreen = document.getElementById('Login');
const url = 'https://mock-api.driven.com.br/api/v6/uol/participants';

function login(userName){
    Login = {name: userName.value};
    const loginServer = axios.post(url, Login);
    loginServer.then(logged);
    loginServer.catch(error);
}

function logged(){
    loginScreen.classList.add('Hide');
}

function error(){
    alert(`Nome de usuário "${Login.name}" já está em uso!`);
}

function toggleMenuParticipants(x){
    x.classList.toggle('Hide');
}