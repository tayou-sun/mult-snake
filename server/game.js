const Constants = require('../shared/constraints');
const Player = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = [];
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.players.push(new Player(socket.id, username, 0, 0, socket.id));
    this.sockets[socket.id] = socket;
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

 /*  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  } */

  input(obj) {
    Object.keys(this.sockets).forEach(playerID => {
      console.log(obj)
      var player = this.players.find(x=>x.socketId = playerID)
      player.x = obj.x;
      player.y = obj.y;

      console.log(this.players)
     // const socket = this.sockets[playerID];
      //socket.emit(Constants.MSG_TYPES.UPDATE, this.players);
    });
  }

  update() {
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      //console.log(this.players.length)
      socket.emit(Constants.MSG_TYPES.UPDATE, this.players);
    });

  }
}

module.exports = Game;
