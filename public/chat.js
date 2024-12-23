const socket = io('http://localhost:3000');

const username = prompt("Enter your username:");
socket.emit('join', username);

socket.on('message', (message) => {
  displayMessage(message);
});

async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value;

  if (message) {
    socket.emit('message', { username, text: message });
    input.value = '';

    try {
      const response = await fetch('http://localhost:3000/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId'), message }),
      });

      const responseBody = await response.json();
      if (response.ok) {
        console.log('Message stored successfully:', responseBody);
      } else {
        console.error('Error storing message:', responseBody.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

function displayMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<span>${message.username}:</span> ${message.text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
