const express = require('express')
const path = require('path')
const app = express()

const port = process.env.PORT || 4000

const server = app.listen(port, () => console.log(`Server started on ${port}`))

const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
    console.log(socket.id)
    socketConnected.add(socket.id)

    // pass an event name to get the total connected users
    io.emit('client-total', socketConnected.size)

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id)
        socketConnected.delete(socket.id)
        // pass an event name to get the total connected users
        io.emit('client-total', socketConnected.size)
    })

    // recieves the emitted message
    socket.on('message', (data) => {
        socket.broadcast.emit('chat', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('user-typing', data)
    })
}