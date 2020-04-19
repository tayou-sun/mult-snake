const Constants = require('../shared/constraints');
const Player = require('./player');
const Item = require('./item');

class Game {
  constructor() {
    this.sockets = {};
    this.players = [];
    this.items = [];

    setInterval(this.update.bind(this), 1000 / 60);
    setInterval(this.generateItems.bind(this), 2000);
  }

  addPlayer(socket, username) {

    this.players.push(new Player(socket.id, username, 0, 0, socket.id));
    this.sockets[socket.id] = socket;
  }

  generateItems() {
    if (this.items.length < 10) {
      for (var i = this.items.length; i < 10; i++) {
        this.items.push(new Item());
      }
    }
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  input(obj) {
    console.log(obj)
    var player = this.players.find(x => x.socketId == obj.socketId)
    player.x = obj.x;
    player.y = obj.y;
    this.checkCollision(obj.x, obj.y);
    console.log(this.players)
  }

  checkCollision(x, y) {
    var deletedItems;
    for (var i = 0 ; i < this.items.length; i++){
      if (y + 10 > this.items[i].y &&
        x + 10 > this.items[i].x &&
        x - 10 < this.items[i].x + 5 &&
        y - 10 < this.items[i].y + 5) {
        deletedItems = i;
      }

    };

    if (deletedItems !== undefined){
      this.items.splice(deletedItems, 1);
    }
  }

  update() {

    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      //console.log(this.players.length)
      socket.emit(Constants.MSG_TYPES.UPDATE, { players: this.players, items: this.items });
    });

  }
}

module.exports = Game;
