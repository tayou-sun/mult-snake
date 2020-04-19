var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
import {updateDirection} from './connection';

export function processGameUpdate(res) {
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(res)
    res.players.forEach(element => {
    update(element.x, element.y);
   });

   res.items.forEach(item=>{
    drawItems(item.x, item.y)
   })
  
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
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        block.dx = block.speed;
        block.dy = 0;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        block.dx = -block.speed;
        block.dy = 0;
    }

    if (event.key === 'Up' || event.key === 'ArrowUp') {
        block.dy = -block.speed;
        block.dx = 0;

    } else if (event.key === 'Down' || event.key === 'ArrowDown') {
        block.dy = block.speed;
        block.dx = 0;
    }

    var x = block.x + block.dx;
    var y = block.y + block.dy;
    
    updateDirection({x: x, y: y});
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


function moveBlock(x,y) {
    block.x  = x;
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

function drawItems(x,y){
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
