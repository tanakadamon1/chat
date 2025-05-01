const socket = io();
let mySocketId = '';
let currentRoom = '';

socket.on('connect', () => {
  mySocketId = socket.id;
});

// 部屋に参加する関数
function joinRoom(roomName) {
  currentRoom = roomName;
  socket.emit('joinRoom', roomName);
  document.getElementById('chatList').innerHTML = '';  // チャットリストをクリア

  document.getElementById('roomName').innerHTML = currentRoom;

}

// メッセージ送信ボタンのイベントリスナー
document.getElementById('sendBtn').addEventListener('click', () => {
  const inputText = document.getElementById('inputText').value;
  const inputName = document.getElementById('inputName').value;

  if (inputText === '' || inputName === '') {
    console.log('入力してください');
    return;
  }

  // サーバーへ送信するデータ
  const messageData = {
    inputText: inputText,
    inputName: inputName,
    room: currentRoom  // 現在の部屋を指定
  };

  socket.emit('sendMessage', messageData);
  clearChat();
});

// 入力欄を空にする関数
const clearChat = () => {
  document.getElementById('inputText').value = '';
};

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

  if (message.socketId === mySocketId) {
    li.classList.add('me');
  } else {
    li.classList.add('other');
  }

  ul.appendChild(li);
};

// サーバーからメッセージを受け取ったとき
socket.on('previousMessages', (messages) => {
    messages.forEach((message) => {
      addChatList(message);
    });
  });