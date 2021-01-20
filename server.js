'use strict';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cowsay = require('cowsay');

const { exec } = require("child_process");

const PORT = process.env.SERVER_PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let interval;

  socket.on('top', (msg) => {
    console.log('emit top')

    interval = setInterval(() => {
      exec("top -b -n 1", (error, stdout, stderr) => {
        if (error) {
          return;
        }
        if (stderr) {
          return;
        }

        io.emit('top', stdout);

      });
    }, 1000)
  });


  socket.on('disconnect', () => {
    clearInterval(interval)
    console.log('user disconnected');
  });
});

http.listen(PORT, () => {
  console.log(
    cowsay.say({
      text: `\x1b[33mServer has been started \x1b[34mhttp://localhost:${PORT}\x1b[37m`,
      e: 'oO',
      T: 'U ',
    })
  )
});
