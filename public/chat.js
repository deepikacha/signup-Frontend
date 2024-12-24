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
  loadMessagesFromLocalStorage();
  fetchNewMessages();
  startPolling();
});

function loadMessagesFromLocalStorage() {
  const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  messages.forEach(message => displayMessage(message));
}

async function fetchNewMessages() {
  const lastMessageTimestamp = getLastMessageTimestamp();
  
  try {
    const response = await fetch(`http://localhost:3000/messages?since=${lastMessageTimestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
    });

    if (response.ok) {
      const messages = await response.json();
      messages.forEach(message => {
        displayMessage(message);
        storeMessageInLocalStorage(message);
      });
    } else {
      console.error('Error fetching messages:', response.statusText);
    }
  } catch (error) {
    console.log("Error fetching details", error);
  }
}

function getLastMessageTimestamp() {
  const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  if (messages.length > 0) {
    return messages[messages.length - 1].timestamp;
  }
  return 0; // Fetch all messages if no timestamp found
}

function startPolling() {
  setInterval(fetchNewMessages, 1000);
}

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

function displayMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<span>${message.username}:</span> ${message.text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Store messages in local storage
  storeMessageInLocalStorage(message);
}

function storeMessageInLocalStorage(message) {
  let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  messages.push(message);

  // Limit to the most recent 10 messages
  if (messages.length > 10) {
    messages.shift();
  }

  localStorage.setItem('chatMessages', JSON.stringify(messages));
}
