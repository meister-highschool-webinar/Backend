const { io } = require('../modules/websocket');

let connected = 0;
io.on('connection', (socket) => {
  connected++;
  io.to(socket.id).emit('create name', connected);
  io.emit('connected_change', connected);

  socket.on('disconnect', function(){
    io.emit('connected_change', connected);
  });

  socket.on('send message', function(text){
    const time = Date.now()
    io.emit('receive message', {
      user_id: id,
      name: socket.name,
      text: text,
      time: time
    });
  });

});