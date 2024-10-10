const {Server} = require('socket.io');

const connectSocket = () => {
    io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
};

module.exports = connectSocket;