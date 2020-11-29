const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(4003);
// WARNING: app.listen(80) will NOT work here!

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.of('/network-srv').on('connection', (socket) => {
 
  socket.on ('message', function (data) {
    io.of('/network-srv').emit ('messageSuccess', data);
  });

 
});