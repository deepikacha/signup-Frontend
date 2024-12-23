require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = require('./app'); // Import the app from app.js
const Message = require('./models/messages');
const User = require('./models/user'); // Ensure User model is imported

const server = http.createServer(app);
const io = socketIo(server);

const users = [];

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (name) => {
    const user = { id: socket.id, name };
    users.push(user);
    io.emit('userList', users);
    socket.broadcast.emit('message', { name: 'System', text: `${name} has joined the chat` });
  });

  socket.on('message', async (message) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.emit('message', { name: user.name, text: message.text });

      // Store the message in the database with correct userId
      try {
        const userInDb = await User.findOne({ where: { name: user.name } });
        if (userInDb) {
          await Message.create({ userId: userInDb.id, username: user.name, message: message.text });
        } else {
          console.error('User not found in the database');
        }
      } catch (error) {
        console.error('Error storing message:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    const index = users.findIndex(u => u.id === socket.id);
    if (index !== -1) {
      const user = users.splice(index, 1)[0];
      io.emit('message', { name: 'System', text: `${user.name} has left the chat` });
      io.emit('userList', users);
    }
  });
});

// Serving static files and routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
