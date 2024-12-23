const socket = io('http://localhost:3000');

function promptForUsername() {
  const username = prompt("Enter your username:");
  localStorage.setItem('username', username);
  return username;
}

// Retrieve or prompt for username on page load
let username = localStorage.getItem('username') || promptForUsername();
socket.emit('join', username);

// Listen for incoming messages and display them
socket.on('message', (message) => {
  displayMessage(message);
});

// Fetch old messages when the page loads
window.addEventListener('load', async () => {
  try {
    const response = await fetch("http://localhost:3000/messages", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
    });

    if (response.ok) {
      const messages = await response.json();
      messages.forEach(message => {
        displayMessage({ username: message.username, text: message.message });
      });
    } else {
      console.error('Error fetching messages:', response.statusText);
    }
  } catch (error) {
    console.log("Error fetching details", error);
  }
});

// Send message function
async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value;

  if (message) {
    // Emit the message with username via WebSocket
    socket.emit('message', { username: username, text: message });
    input.value = '';

    try {
      const response = await fetch('http://localhost:3000/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId'), username: username, message }),
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

// Display message function
function displayMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<span>${message.username}:</span> ${message.text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
