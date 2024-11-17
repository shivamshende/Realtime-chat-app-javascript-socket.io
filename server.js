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
  // When a new user joins, store their name with their socket ID
  socket.on('new-user', name => {
    users[socket.id] = name; // Correctly map socket.id to name
    socket.broadcast.emit('user-connected', name);
  });

  // Handle sending a chat message
  socket.on('send-chat-message', message => {
    const name = users[socket.id]; // Retrieve the name associated with socket.id
    if (name) {
      socket.broadcast.emit('chat-message', { message: message, name: name });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit('user-disconnected', name);
      delete users[socket.id];
    }
  });
});
