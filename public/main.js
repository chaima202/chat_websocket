const socket = io() //Elle crée une connexion WebSocket entre ton frontend (navigateur) et ton serveur Socket.IO ✅

const clientsTotal = document.getElementById('client-total')
//récupérer un élément du DOM (Document Object Model) HTML en fonction de son identifiant (ID) et de le stocker dans une variable en JavaScript


socket.on('clients-total', (data) => {
    console.log(data)
    //hethi tel9aha f inspecter mta3 reponse de serveur c est adire dans le navigateur 
    clientsTotal.innerText = `Total Clients: ${data}` //modifier clientsTotal en ce test 
  })

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

  messageForm.addEventListener('submit', (e) => { 
    //Cela veut dire que dès que l’utilisateur appuie sur Entrée ou clique sur Envoyer, cette fonction s’exécute.
    e.preventDefault()
    sendMessage()
  })


  function sendMessage() {
    if (messageInput.value === '') return
    //Si l’utilisateur n’a rien écrit dans le champ de message (messageInput), on arrête la fonction (pas d’envoi vide).
    // console.log(messageInput.value)
    const data = {
      name: nameInput.value,
      message: messageInput.value,
      dateTime: new Date(),
    }
    socket.emit('message', data)
    //Tu envoies un événement appelé 'message' du client vers le serveur avec des données (data)
    addMessageToUI(true, data)
    messageInput.value = ''
  }
  socket.on('chat-message', (data) => {
    // console.log(data)
    
    addMessageToUI(false, data)
  })
  
  function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>
          `
  
    messageContainer.innerHTML += element
    scrollToBottom()
  }
  
  function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }
  messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })
  
  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
  })
  
  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }
  



  // Au début du fichier, après les autres sélections d'éléments
const nameIcon = document.getElementById('name-icon');

// Mettez à jour cette fonction existante ou créez-en une nouvelle
function updateNameIcon() {
  const name = nameInput.value.trim();
  const initials = name === '' ? 'A' : 
                  name.split(' ').length > 1 ? 
                  name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0) : 
                  name.charAt(0);
  nameIcon.textContent = initials.toUpperCase();
  
  // Changer la couleur en fonction des initiales pour plus de personnalisation
  const colors = [
    'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  ];
  const colorIndex = initials.charCodeAt(0) % colors.length;
  nameIcon.style.background = colors[colorIndex];
}

// Appeler cette fonction au chargement et à chaque changement de nom
nameInput.addEventListener('input', updateNameIcon);
updateNameIcon(); // Initial call