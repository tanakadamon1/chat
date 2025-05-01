const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const PORT = 3000;

let roomMessages = {}; // 各部屋のメッセージ履歴を保存

app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log(`user connected: ${socket.id}`);

  // 部屋に参加
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);

    // 参加した部屋の履歴を送信
    if (roomMessages[roomName]) {
      socket.emit('previousMessages', roomMessages[roomName]);
    }
  });

  // メッセージ受信
  socket.on('sendMessage', ({ room, inputName, inputText }) => {
    const data = {
      inputName,
      inputText,
      socketId: socket.id
    };

    // 履歴に保存
    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push(data);

    // 部屋内の全員に送信
    io.to(room).emit('receiveMessage', data);
  });
});
