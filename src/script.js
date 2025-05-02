const socket = io();
let mySocketId = '';
let currentRoom = '';
let myName = localStorage.getItem('myName') || '';

// ページロード時に名前欄に自動入力
document.getElementById('inputName').value = myName;

socket.on('connect', () => {
  mySocketId = socket.id;
});

// チャットメッセージをリストに追加する関数
const addChatList = (message) => {
  const ul = document.getElementById('chatList');
  const li = document.createElement('li');

  const nameNode = document.createTextNode(message.inputName);
  li.appendChild(nameNode);

  const p = document.createElement('p');
  const textNode = document.createTextNode(message.inputText);
  p.appendChild(textNode);
  li.appendChild(p);

  if (message.inputName === myName) {
    li.classList.add('me');
  } else {
    li.classList.add('other');
  }

  ul.appendChild(li);
};

// 部屋に参加する関数
function joinRoom(roomName) {
  currentRoom = roomName;
  socket.emit('joinRoom', roomName);

  document.getElementById('chatList').innerHTML = '';
  document.getElementById('roomName').innerText = currentRoom;
}

// メッセージ送信ボタン
document.getElementById('sendBtn').addEventListener('click', () => {
  const inputText = document.getElementById('inputText').value;
  const inputName = document.getElementById('inputName').value;

  if (inputText === '' || inputName === '') {
    console.log('入力してください');
    return;
  }

  myName = inputName;
  localStorage.setItem('myName', myName); // 名前を保存

  const messageData = {
    inputText,
    inputName,
    room: currentRoom
  };

  socket.emit('sendMessage', messageData);
  clearChat();
});

// 入力欄を空にする関数
const clearChat = () => {
  document.getElementById('inputText').value = '';
};

// サーバーから過去のメッセージを受け取る
socket.on('previousMessages', (messages) => {
  messages.forEach((message) => {
    addChatList(message);
  });
});

// サーバーから新しいメッセージを受け取る
socket.on('receiveMessage', (message) => {
  addChatList(message);
});

// URLからroom名を取得し自動参加
const params = new URLSearchParams(window.location.search);
const roomNameFromURL = params.get('room') || 'default';
joinRoom(roomNameFromURL);
