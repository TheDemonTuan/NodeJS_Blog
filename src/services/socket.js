class SocketServices {
  async connection(socket) {
    io.emit('totalOnline', io.of("/").sockets.size);
    socket.on('disconnect', () => {
      io.emit('totalOnline', io.of("/").sockets.size);
    });

    socket.on('userOnline', (userOnline) => {
      io.emit('userOnline', userOnline);
    });
  }
}

module.exports = new SocketServices();