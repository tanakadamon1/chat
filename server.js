const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on('connection', (socket) => {
  socket.on('sendMessage', (message) => {
    const data = {
        inputText: message.inputText,
        inputName: message.inputName,
        socketId: socket.id
    }
    io.emit('receiveMessage', data);
  });
});
