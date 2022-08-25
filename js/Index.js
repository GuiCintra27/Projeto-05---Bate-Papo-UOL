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
    setInterval(() => {
        main.innerHTML = '';
        for (i=0; i < serverMessage.data.length; i++){
            if (serverMessage.data[i].type !== 'private_message'){
                if (serverMessage.data[i].type === 'message'){
                    
                    if (i === 99){
                        main.innerHTML += `
                                    <div class="Message" id="Last_message">
                                        <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                    </div>`;
                        let lastMessage = document.getElementById('Last_message');
                        lastMessage.scrollIntoView();
                    }else{
                        main.innerHTML += `
                                        <div class="Message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                    }
                    
                }else{
                    if (i === 99){
                        main.innerHTML += `
                                        <div class="Status Message" id="Last_message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                        let lastMessage = document.getElementById('Last_message');
                        lastMessage.scrollIntoView();
                    }else{
                        main.innerHTML += `
                                        <div class="Status Message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                    }
                }
            }else{
                if (serverMessage.data[i].to === Login.name){
                    
                    if (i === 99){
                        main.innerHTML += `
                                        <div class="Reserved Message" id="Last_message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> reservadamente para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                        let lastMessage = document.getElementById('Last_message');
                        lastMessage.scrollIntoView();
                    }else{
                        main.innerHTML += `
                                        <div class="Reserved Message">
                                            <p><time>${serverMessage.data[i].time} </time><strong>${serverMessage.data[i].from}</strong> reservadamente para <strong>${serverMessage.data[i].to}:</strong> ${serverMessage.data[i].text}</p>
                                        </div>`;
                    }
                }
            }
        }
    }, 3000)
}

function toggleMenuParticipants(x){
    x.classList.toggle('Hide');
}