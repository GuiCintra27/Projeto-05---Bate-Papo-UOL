let Login = '';
const loginScreen = document.getElementById('Login');
const urlLogin = 'https://mock-api.driven.com.br/api/v6/uol/participants';
const urlConnection = 'https://mock-api.driven.com.br/api/v6/uol/status';
const urlMessages = 'https://mock-api.driven.com.br/api/v6/uol/messages';

function login(userName){
    Login = {name: userName.value};
    let loginServer = axios.post(urlLogin, Login);
    loginServer.then(logged);
    loginServer.catch(error);
    setInterval(() => {
        loginServer = axios.post(urlConnection, Login);
        loginServer.catch(desconnection);
    }, 5000);
}

function logged(){
    loginScreen.classList.add('Hide');
}

function error(){
    alert(`Nome de usuário "${Login.name}" já está em uso!`);
}

function desconnection(){
    alert('Houve um erro no servidor');
    window.location.reload()
}

function toggleMenuParticipants(x){
    x.classList.toggle('Hide');
}