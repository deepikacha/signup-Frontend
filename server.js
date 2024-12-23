require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = require('./app'); // Import the app from app.js

const server = http.createServer(app);
const io = socketIo(server);

const users = [];

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (username) => {
    const user = { id: socket.id, username };
    users.push(user);
    io.emit('userList', users);
    socket.broadcast.emit('message', { username: 'System', text: `${username} has joined the chat` });
  });

  socket.on('message', (message) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.emit('message', { username: user.username, text: message.text });
    }
  });

  socket.on('disconnect', () => {
    const index = users.findIndex(u => u.id === socket.id);
    if (index !== -1) {
      const user = users.splice(index, 1)[0];
      io.emit('message', { username: 'System', text: `${user.username} has left the chat` });
      io.emit('userList', users);
    }
  });
});

// Serving static files and routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
