var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
import { updateDirection } from './connection';

export function processGameUpdate(res) {
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(res)
    debugger
    res.players.forEach(element => {
        element.snake.points.forEach(point => {
            var currentX = point.x;
            var currentY = point.y;
            for (var i = 0; i < point.size; i++) {
                update(currentX, currentY);
                currentX = getNextXPoint(currentX, point.direction);
                currentY = getNextYPoint(currentY, point.direction);
            }
        });

    });

    res.items.forEach(item => {
        drawItems(item.x, item.y)
    })

}

function getNextXPoint(x,direction) {
    if (direction == "Right") {
        return x + 10;
    }
    if (direction == "Left") {
        return x - 10;
    }
    return x;
}

function getNextYPoint(y, direction) {
    if (direction == "Up") {
        return y - 10;
    }
    if (direction == "Down") {
        return y + 10;
    }

    return y;
}

export function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlock()
}


const block = {
    x: canvas.width / 2 - 40,
    y: canvas.height / 2 - 20,
    width: 10,
    height: 10,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};


function drawBlock() {
    ctx.beginPath();
    ctx.rect(block.x, block.y, block.width, block.height);
    ctx.fillStyle = '#e0f7ff';
    ctx.fill();
    ctx.closePath();
}


document.addEventListener('keydown', event => {

    var direction = "";

    if (event.key === 'Right' || event.key === 'ArrowRight') {
        block.dx = block.speed;
        block.dy = 0;
        direction = "Right";
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        block.dx = -block.speed;
        block.dy = 0;
        direction = "Left";
    }

    if (event.key === 'Up' || event.key === 'ArrowUp') {
        block.dy = -block.speed;
        block.dx = 0;
        direction = "Up";

    } else if (event.key === 'Down' || event.key === 'ArrowDown') {
        block.dy = block.speed;
        block.dx = 0;
        direction = "Down";
    }

    var x = block.x + block.dx;
    var y = block.y + block.dy;

    updateDirection({ x: x, y: y, direction: direction });
    //update();


});

document.addEventListener('keyup', event => {
    if (event.key === 'Right' ||
        event.key === 'ArrowRight' ||
        event.key === 'Left' ||
        event.key === 'ArrowLeft' ||
        event.key === 'Up' ||
        event.key === 'ArrowUp' ||
        event.key === 'Down' ||
        event.key === 'ArrowDown'
    ) {
        block.dx = 0;
        block.dy = 0;
    }
});


function moveBlock(x, y) {
    block.x = x;
    block.y = y;

    if (block.x < 0) {
        block.x = 0
    }

    if (block.x + block.width > canvas.width) {
        block.x = canvas.width - block.width
    }

    if (block.y < 0) {
        block.y = 0
    }

    if (block.y + block.height > canvas.height) {
        block.y = canvas.height - block.height
    }

}

function drawItems(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, 5, 5);
    ctx.fillStyle = '#E91E63';
    ctx.fill();
    ctx.closePath();
}

function update(x, y) {
    moveBlock(x, y);
    drawBlock();
    //updateDirection({x: block.x, y: block.y});
}
