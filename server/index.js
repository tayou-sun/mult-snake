const webpack = require('webpack');
const webpackConfig = require('../webpack.dev.js');
const express = require("express")
const Constants = require('../shared/constraints');
const app = express()
const Game = require('./game');
const webpackDevMiddleware = require('webpack-dev-middleware');

const socketio = require('socket.io');
app.use(express.static('public'));
if (process.env.NODE_ENV === 'development') {

  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  app.use(express.static('dist'));
}


const port = process.env.PORT || 3001;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);


io.on('connection', socket => {
  console.log('Player connected!', socket.id);
  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on('disconnect', onDisconnect);
});

const game = new Game();

function joinGame(username) {
  game.addPlayer(this, username);
}

function onDisconnect() {
  game.removePlayer(this);
}
