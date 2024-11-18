const io = require('socket.io')(3000, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const users = {};

io.on('connection', socket => {
  console.log('New user connected'); // Debug log

  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    console.log(`${name} connected`); // Debug log
  });

  socket.on('send-chat-message', message => {
    const name = users[socket.id];
    if (name) {
      console.log(`Message received from ${name}: ${message}`); // Debug log
      socket.broadcast.emit('chat-message', { message: message, name: name });
    }
  });

  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit('user-disconnected', name);
      delete users[socket.id];
      console.log(`${name} disconnected`); // Debug log
    }
  });
});
