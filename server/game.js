const Constants = require('../shared/constraints');
const Player = require('./player');
const Item = require('./item');
const Point = require('./point');
const Snake = require('./snake');

class Game {
  constructor() {
    this.sockets = {};
    this.players = [];
    this.items = [];

    setInterval(this.update.bind(this), 1000 / 60);
    setInterval(this.generateItems.bind(this), 2000);
  }

  addPlayer(socket, username) {
    var points = [];
    points.push(new Point(0, 0, ""))
    var snake = new Snake(points, 1);
    this.players.push(new Player(socket.id, username, socket.id, snake));
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


  getPos(x, y, snakeDirection, pointDirection) {
    var step = 10;
    if (snakeDirection == "Left") {
      if (pointDirection == "Up" || pointDirection == "Down") {
        return { x: x + step, y: y };
      }
    }

    if (snakeDirection == "Right") {
      if (pointDirection == "Up" || pointDirection == "Down") {
        return { x: x - step, y: y };

      }
    }

    if (snakeDirection == "Up") {
      if (pointDirection == "Right" || pointDirection == "Left") {
        return { x: x, y: y + step };
      }
    }
    if (snakeDirection == "Down") {
      if (pointDirection == "Right" || pointDirection == "Left") {

        return { x: x, y: y - step };
      }

    }
    return { x: x, y: y };
  }

  input(obj) {
    var player = this.players.find(x => x.socketId == obj.socketId);
    var pointCount = player.snake.size;
    var currentDirection = player.snake.points[player.snake.points.length - 1].direction;

    //если общее направление не совпадает с текущим и размер 
    //змейки больше 2, то создаем точку перегиба
    if (currentDirection !== obj.direction && pointCount > 2) {
      var o = this.getPos(obj.x, obj.y, currentDirection, obj.direction);
      var point = new Point(
        o.x,
        o.y,
        obj.direction);

      player.snake.points.forEach(p => {
        p.size--;
      });

      player.snake.points.filter(p => p.size > 0);

      player.snake.points.push(point);
    }

    else {
      if (player.snake.points.length > 1) {
        for (var i = 0; i < player.snake.points.length; i++) {
          var p = player.snake.points[i];
          if (player.snake.size > 2) {
            if (i != player.snake.points.length - 1) {
              p.size--;
              if (p.size != 0) {
                p.x = this.getNextXPoint(p.x, p.direction, 1);
                p.y = this.getNextYPoint(p.y, p.direction, 1);
              }
            }
            else {
              p.size++;
            }
          }
        }

        var a = player.snake.points.filter(p => p.size > 0);
        player.snake.points = player.snake.points.filter(p => p.size > 0);

      }
      else {
        player.snake.points[player.snake.points.length - 1].x = obj.x;
        player.snake.points[player.snake.points.length - 1].y = obj.y;
        player.snake.points[player.snake.points.length - 1].direction = obj.direction;
      }
    }
    player.snake.points = player.snake.points.filter(p => p.size > 0);
    var hasCollision = this.checkCollision(player.snake);

    if (hasCollision) {
      player.snake.itemsCount++;
      if (player.snake.itemsCount % 3 === 0) {
        player.snake.points[player.snake.points.length - 1].size++;
        player.snake.size++;


        console.log(this.players)
      }
    }
  }

  getNextXPoint(x, direction, size) {
    if (direction == "Right") {
      return x + size * 10;
    }
    if (direction == "Left") {
      return x - size * 10;
    }
    return x;
  }

  getNextYPoint(y, direction, size) {
    if (direction == "Up") {
      return y - size * 10;
    }
    if (direction == "Down") {
      return y + size * 10;
    }
    return y;
  }

  checkCollision(snake) {
    var deletedItems;
    var lastPoint = snake.points[snake.points.length - 1];
    var x = this.getNextXPoint(lastPoint.x, lastPoint.direction, lastPoint.size);
    var y = this.getNextYPoint(lastPoint.y, lastPoint.direction, lastPoint.size);

    for (var i = 0; i < this.items.length; i++) {

      if (y + 10 > this.items[i].y &&
        x + 10 > this.items[i].x &&
        x - 10 < this.items[i].x + 5 &&
        y - 10 < this.items[i].y + 5) {
        deletedItems = i;
      }

    };

    if (deletedItems !== undefined) {
      this.items.splice(deletedItems, 1);
      return true;
    }

    return false;
  }


  /*   checkCollision(x, y) {
      var deletedItems;
      for (var i = 0; i < this.items.length; i++) {
        if (y + 10 > this.items[i].y &&
          x + 10 > this.items[i].x &&
          x - 10 < this.items[i].x + 5 &&
          y - 10 < this.items[i].y + 5) {
          deletedItems = i;
        }
  
      };
  
      if (deletedItems !== undefined) {
        this.items.splice(deletedItems, 1);
        return true;
      }
  
      return false;
    }
   */
  update() {

    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      //console.log(this.players.length)
      socket.emit(Constants.MSG_TYPES.UPDATE, { players: this.players, items: this.items });
    });

  }
}

module.exports = Game;
