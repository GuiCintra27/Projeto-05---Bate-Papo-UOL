let Login = '';
const loginScreen = document.getElementById('Login');
const urlLogin = 'https://mock-api.driven.com.br/api/v6/uol/participants';
const urlConnection = 'https://mock-api.driven.com.br/api/v6/uol/status';
const urlMessages = 'https://mock-api.driven.com.br/api/v6/uol/messages';
const main = document.querySelector('main');

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
    const messages = axios.get(urlMessages);
    messages.then(showMessages);
}

function error(){
    alert(`Nome de usuário "${Login.name}" já está em uso!`);
}

function desconnection(){
    alert('Houve um erro no servidor');
    window.location.reload()
}

function showMessages(serverMessage){
    main.innerHTML += `
                    <div class="Message">
                        <p><time>${serverMessage.data[0].time} </time><strong>${serverMessage.data[0].from}</strong> para <strong>${serverMessage.data[0].to}:</strong> ${serverMessage.data[0].text}</p>
                    </div>

                    <div class="Message">
                        <p><time>${serverMessage.data[1].time} </time><strong>${serverMessage.data[1].from}</strong> para <strong>${serverMessage.data[1].to}:</strong> ${serverMessage.data[1].text}</p>
                    </div>`;
}

function toggleMenuParticipants(x){
    x.classList.toggle('Hide');
}