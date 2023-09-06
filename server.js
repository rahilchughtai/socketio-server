const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"]
    }
});

const generateRoomCode = () => {
    return Math.floor(4000 + Math.random() * 2000)

}
io.on('connection', (socket) => {
    socket.emit("hello", "connection established");

    // Handle create-room event
    socket.on('create-room', (callback) => {
        const roomCode = generateRoomCode();
        console.log("creating room...", roomCode)
        socket.join(roomCode);
        callback({ success: true, roomCode });
    });

    socket.on('player-join', (callback) => {
        console.log("player joined the room")
    });

    socket.on("fragment-send", (roomCode, fragment, playerType) => {
        console.log(fragment, playerType)
        io.to(roomCode).emit("fragment-added", { fragment, playerType });
    })


    // Handle join-room event
    socket.on('join-room', (roomCodeStr, callback) => {
        const roomCode = Number(roomCodeStr)
        console.log(roomCode);
        console.log(io.sockets.adapter.rooms);
        socket.join(roomCode);
        io.to(roomCode).emit("player-join");
        callback({ success: true, roomCode });
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

})


console.log('SocketIO Server listening on port 3000')
const port = process.env['PORT'] || 3000
server.listen(3000)

