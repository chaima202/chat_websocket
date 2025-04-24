const express =require('express')
const path =require('path')
const { Socket } = require('socket.io')
const app = express()
const PORT = process.env.PORT || 5000
const server=app.listen(PORT, ()=>console.log(`server on port ${PORT}`))
app.use(express.static(path.join(__dirname,'public')))

//Cette ligne permet à ton serveur de donner des fichiers (comme des pages web, des images, etc.) depuis le dossier public quand on leur demande.

const io=require('socket.io')(server)

let socketsConected = new Set() //definir un ensemble 

io.on('connection', onConnected)
//cette ligne écoute l'événement connection émis par Socket.IO chaque fois qu'un nouveau client (socket) se connecte au serveur.
//Lorsque cet événement se produit, la fonction onConnected est appelée et reçoit un paramètre socket, qui représente la connexion du client.
function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)
  //io.emit('clients-total', socketsConected.size) va envoyer l'événement clients-total avec la taille actuelle de l'ensemble des clients connectés à tous les clients.

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  //en ecoute de l'evenement message 
  socket.on('message', (data) => { // il ecoute l evenement message recu depuis le front car ce code est ecrit dans le backend et .on cad ecoute
    // console.log(data)
    socket.broadcast.emit('chat-message', data) //puis il le renvoie aux clients connectes depuis le serveur car emit cad diffiser
  })

  ////en ecoute de l evenement feedback 
  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}