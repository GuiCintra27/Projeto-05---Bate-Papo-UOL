let Login = '';
const url = 'https://mock-api.driven.com.br/api/v6/uol/participants';


function login(userName, loginScreen){
    Login = {name: userName.value};
    const loginServer = axios.post(url, Login);
    loginServer.then(logged(loginScreen));
    loginServer.catch(error(userName));
}

function logged(loginScreen){
    loginScreen.classList.add('Hide');
}

function error(userName){
    alert(`Nome de usuário ${userName} já está em uso!`);
}



function toggleMenuParticipants(x){
    x.classList.toggle('Hide');
}