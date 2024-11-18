window.onload = function () {
  const socket = io('http://localhost:3000');
  const messageContainer = document.getElementById('message-container');
  const messageForm = document.getElementById('send-container');
  const messageInput = document.getElementById('message-input');

  socket.on('connect', () => {
    console.log('Connected to server'); // Debug log
  });

  const name = prompt('What is your name?');
  if (name) {
    appendMessage('You joined', true);
    socket.emit('new-user', name);
  } else {
    console.warn('Name not entered');
  }

  socket.on('chat-message', data => {
    console.log('Message received:', data); // Debug log
    appendMessage(`${data.name}: ${data.message}`, false);
  });

  socket.on('user-connected', name => {
    appendMessage(`${name} connected`, false);
  });

  socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`, false);
  });

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, true);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  });

  function appendMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', isUser ? 'user' : 'sender');
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
};
