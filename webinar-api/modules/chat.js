const {verifyJWT} = require("../middlewares/auth.middle");
const { io } = require('../modules/websocket');

let connected = 0;
io.on('connection', async (socket) => {
  const token = socket.request._query['token'];
  const payload = await verifyJWT(token)
  socket.user_id = payload.id;
  connected++;
  io.emit('connected_change', ++connected);

  socket.on('disconnect', _ => {
    io.emit('connected_change', --connected);
  });

  socket.on('send message', (text) => {
    const time = Date.now()
    io.emit('receive message', {
      user_id: socket.user_id,
      name: socket.name,
      text: text,
      time: time
    });
  });
});