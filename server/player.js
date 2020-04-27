class Player {
    constructor(id, username,socketId, snake) {
        this.id = id;
        this.username = username;
        this.socketId = socketId;
        this.snake = snake;
    }
}

module.exports = Player;