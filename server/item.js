class Item {
    constructor() {
        this.x = Math.floor(Math.random() * 801);     // returns a random integer from 0 to 99
        this.y = Math.floor(Math.random() * 601);
    }

}

module.exports = Item;