const socketIO = require('socket.io');
let io = null;

exports.init = server => io = socketIO(server);
exports.io = () => io;
