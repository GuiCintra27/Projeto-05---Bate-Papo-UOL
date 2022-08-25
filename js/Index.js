let Login = '';
const loginScreen = document.getElementById('Login');
const urlLogin = 'https://mock-api.driven.com.br/api/v6/uol/participants';
const urlConnection = 'https://mock-api.driven.com.br/api/v6/uol/status';
const urlMessages = 'https://mock-api.driven.com.br/api/v6/uol/messages';
const main = document.querySelector('main');

function login(userName) {
    Login = { name: userName.value };
    let loginServer = axios.post(urlLogin, Login);
    loginServer.then(logged);
    loginServer.catch(error);
    setInterval(() => {
        loginServer = axios.post(urlConnection, Login);
        loginServer.catch(desconnection);
    }, 5000);
}

function logged() {
    loginScreen.classList.add('Hide');
    setInterval(() => {
        const messages = axios.get(urlMessages);
        messages.then(showMessages);
    },3000);
}

function error() {
    alert(`Nome de usuário "${Login.name}" já está em uso!`);
}

function desconnection() {
    alert('O usuário foi desconectado');
    window.location.reload()
}

function showMessages(serverMessage) {
    main.innerHTML = '';
    for (i = 0; i < serverMessage.data.length; i++) {
        if (serverMessage.data[i].type !== 'private_message') {
            if (serverMessage.data[i].type === 'message') {

                if (i === 99) {
                    main.innerHTML += `
                                    <div class="Message" id="Last_message">
                                        <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                    </div>`;
                    let lastMessage = document.getElementById('Last_message');
                    lastMessage.scrollIntoView();
                } else {
                    main.innerHTML += `
                                        <div class="Message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                }

            } else {
                if (i === 99) {
                    main.innerHTML += `
                                        <div class="Status Message" id="Last_message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                    let lastMessage = document.getElementById('Last_message');
                    lastMessage.scrollIntoView();
                } else {
                    main.innerHTML += `
                                        <div class="Status Message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                }
            }
        } else {
            if (serverMessage.data[i].to === Login.name) {

                if (i === 99) {
                    main.innerHTML += `
                                        <div class="Reserved Message" id="Last_message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> reservadamente para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                    let lastMessage = document.getElementById('Last_message');
                    lastMessage.scrollIntoView();
                } else {
                    main.innerHTML += `
                                        <div class="Reserved Message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> reservadamente para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                }
            }
        }
    }
}

function sendMessage(userMessage) {
    let Type = document.querySelector('.Type').innerHTML;

    if (Type === 'Público'){
        Type = 'message';
    }else{
        Type = 'private_message';
    }

    let uMessage = userMessage.value,  
        Message = {
            from: Login.name,
            to: document.querySelector('.To').innerHTML,
            text: uMessage,
            type: Type
        };
        
    if (uMessage.length > 0) {
        const send = axios.post(urlMessages, Message);
        send.then(messageSent);
        send.catch(messageError);
    }
}

function messageSent(){
    const messages = axios.get(urlMessages);
    messages.then(showMessages);
}

function messageError(error){
    alert(`A mensagem não pode ser enviada! erro ${error.response.status} `);
    console.log(error.response.data);
}

function toggleMenuParticipants(x) {
    x.classList.toggle('Hide');
}