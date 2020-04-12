class Player {
    constructor(id, username, x, y,socketId) {
        this.id = id;
        this.username = username;
        this.x = x;
        this.y = y;
        this.socketId = socketId;
    }
}

module.exports = Player;