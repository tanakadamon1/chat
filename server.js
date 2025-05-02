const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const PORT = 3000;

// 各部屋ごとのメッセージ履歴を保持するオブジェクト
let roomMessages = {};

app.use(express.static(path.join(__dirname, 'src')));

// トップページにアクセスしたときの処理（URLクエリ対応）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// サーバー起動
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// ソケット接続時の処理
io.on('connection', (socket) => {
  console.log(`入室: ${socket.id}`);

  // クライアントが部屋に参加するとき
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room ${roomName}`);

    // 過去のメッセージをクライアントに送信
    const history = roomMessages[roomName] || [];
    socket.emit('previousMessages', history);
  });

  // メッセージ送信処理
  socket.on('sendMessage', ({ room, inputName, inputText }) => {
    const messageData = {
      inputName,
      inputText,
      socketId: socket.id
    };

    // 履歴に保存
    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push(messageData);

    // 同じ部屋のクライアント全員にブロードキャスト
    io.to(room).emit('receiveMessage', messageData);
  });

  // 切断処理（必要なら拡張）
  socket.on('disconnect', () => {
    console.log(`切断: ${socket.id}`);
  });
});
