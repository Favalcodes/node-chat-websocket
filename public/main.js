// const socket = io("http://localhost:4000", {})
const socket = io();

const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");

const nameInput = document.getElementById("name-input");
const chatForm = document.getElementById("message-form");
const chatInput = document.getElementById("message-input");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

const sendMessage = () => {
  if (chatInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: chatInput.value,
    dateTime: new Date(),
  };

  // emitting the event to the server
  socket.emit("message", data);

  addMessage(true, data);
  chatInput.value = "";
};

// handle the event emitted for the connected users size
socket.on("client-total", (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`;
});

socket.on("chat", (data) => {
  addMessage(false, data);
});

const addMessage = (isOwnMessage, data) => {
  clearFeedback();
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
    <p class="message">
      ${data.message}
      <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>`;

  messageContainer.innerHTML += element;
  scrollDown();
};

const scrollDown = () => {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
};

// if a user focus on the input field
chatInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message...`,
  });
});

// if user presses a key
chatInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message...`,
  });
});

// when the input field blurs out and not in focus
chatInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: ``,
  });
});

socket.on("user-typing", (data) => {
  clearFeedback();
  const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>`;

  messageContainer.innerHTML += element;
});

const clearFeedback = () => {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
};
