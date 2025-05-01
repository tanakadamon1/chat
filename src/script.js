const socket = io();
let mySocketId = '';

socket.on('connect', () => {
  mySocketId = socket.id;
});

document.getElementById('sendBtn').addEventListener('click', () =>{
    let input = {
        inputText: document.getElementById('inputText').value,
        inputName: document.getElementById('inputName').value
    }
    if (input.inputText === '' || input.inputName === '') {
        console.log('入力してください')
        return;
    }

    socket.emit('sendMessage', input);
    clearChat();
})

// 入力欄空白
const clearChat = () => {
    document.getElementById('inputText').value = '';
}


const addChatList = (message) => {
    const ul = document.getElementById('chatList');
    const li = document.createElement('li');
    const chatNode = document.createTextNode(message.inputName);
    li.appendChild(chatNode);
    ul.appendChild(li);

    const name = document.createElement('p');
    const nameNode = document.createTextNode(message.inputText);
    name.appendChild(nameNode);
    li.appendChild(name)

    if (message.socketId === mySocketId) {
        li.classList.add('me');
    } else {
        li.classList.add('other');
    }

}
socket.on('receiveMessage', (message) => {
    console.log(message)
    addChatList(message);
});