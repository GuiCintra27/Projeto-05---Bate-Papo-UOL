let Login = '', Check = 'Todos';
const loginScreen = document.getElementById('Login');
const urlParticipants = 'https://mock-api.driven.com.br/api/v6/uol/participants';
const urlConnection = 'https://mock-api.driven.com.br/api/v6/uol/status';
const urlMessages = 'https://mock-api.driven.com.br/api/v6/uol/messages';
const main = document.querySelector('main');

function login(userName) {
    Login = { name: userName.value };
    let loginServer = axios.post(urlParticipants, Login);
    loginServer.then(logged);
    loginServer.catch(error);
    setInterval(() => {
        loginServer = axios.post(urlConnection, Login);
        loginServer.catch(desconnection);
    }, 5000);
}

function logged() {
    loginScreen.classList.add('Hide');
    activeParticipants();
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
        userMessage = '';
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
    window.location.reload();
}

function toggleMenuParticipants(x) {
    x.classList.toggle('Hide');
}

function activeParticipants(){
    const participants = axios.get(urlParticipants);
    participants.then(showPeople);
    participants.catch(participantError);
    setInterval(() =>{
        const participants = axios.get(urlParticipants);
        participants.then(showPeople);
        participants.catch(participantError);
    },10000)
}

function showPeople(serverData){
    const response = serverData.data;
    let participants = document.getElementById('Participants');
    participants.innerHTML = ''; 
    let nameChecked = 0, allChecked = 0;
    console.log(response);

    for (i=0; i<response.length; i++){
        if (response[i].name === Check){
                participants.innerHTML += `
            <li>
                <div>
                    <img src="images/Person-circle.svg" alt="">
                    <p onclick="selectParticipant(this)" class="To">${response[i].name}</p>
                </div>
                <img src="images/Correct-icon.svg" alt="" id="Img">
            </li>
            `
            nameChecked = 1;
        }else {     
            participants.innerHTML += `
            <li>
                <div>
                    <img src="images/Person-circle.svg" alt="">
                    <p onclick="selectParticipant(this)">${response[i].name}</p>
                </div>
            </li>
            `
        }

        if(i === response.length -1 && nameChecked === 0){
            participants.innerHTML = `
            <li>
                <div>
                    <img src="images/People 2.svg" alt="">
                    <p onclick="selectParticipant(this)" class="To">Todos</p>
                </div>
                <img src="images/Correct-icon.svg" alt="" id="Img">
            </li> ` + participants.innerHTML;
            allChecked = 1;
        }else if(i === response.length -1 && allChecked === 0){
            participants.innerHTML = `
            <li>
                <div>
                    <img src="images/People 2.svg" alt="">
                    <p onclick="selectParticipant(this)">Todos</p>
                </div>
            </li> ` + participants.innerHTML;
        }
    }
}

function participantError(error){
    alert(`Algo deu errado! erro ${error.response.status}`);
}

function selectParticipant(Selected){
    let disable = document.querySelector('.To'), img = document.getElementById('Img');
    let div = Selected.parentNode, li = div.parentNode;

    disable.classList.remove('To');
    Selected.classList.add('To');

    if (img) {
        img.parentNode.removeChild(img);
    }
    li.innerHTML += '<img src="images/Correct-icon.svg" alt="" id="Img">'
    Check = Selected.innerHTML;
}

function selectMessageMode(Selected){
    let disable = document.querySelector('.Type'), img = document.getElementById('Img_type');
    let div = Selected.parentNode, li = div.parentNode;

    disable.classList.remove('Type');
    Selected.classList.add('Type');

    if (img) {
        img.parentNode.removeChild(img);
    }
    li.innerHTML += '<img src="images/Correct-icon.svg" alt="" id="Img_type">'
}