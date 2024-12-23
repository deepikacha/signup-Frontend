// Initialize the socket
const socket = io('http://localhost:3000');

// Emit join event with username
const username = prompt("Enter your username:");
socket.emit('join', username);

// Listen for incoming messages
socket.on('message', (message) => {
  displayMessage(message);
});

// Send message
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value;

  if (message) {
    socket.emit('message', { username: username, text: message });
    input.value = '';
  }
}

// Display message
function displayMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<span>${message.username}:</span> ${message.text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
