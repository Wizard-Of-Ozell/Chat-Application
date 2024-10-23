const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server listen
server.listen(process.env.PORT || 5000, () => {
  console.log('Server listening on port 5000');
});

io.on('connection', (socket) => {
    console.log('New user connected');
  
    socket.on('joinRoom', ({ username, room }) => {
      socket.join(room);
      socket.emit('message', 'Welcome to the chat!');
      socket.to(room).emit('message', `${username} has joined the room`);
  
      // Handle message sending
      socket.on('chatMessage', (msg) => {
        const message = new Message({ content: msg, sender: socket.id, room });
        message.save().then(() => {
          io.to(room).emit('message', msg);
        });
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.to(room).emit('message', `${username} has left the room`);
      });
    });
  });