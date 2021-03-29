let input_width = document.querySelector('#input_width');
let input_height = document.querySelector('#input_height');
let input_count_cell = document.querySelector('#input_count_cell');
let input_count_food = document.querySelector('#input_count_food');

if (localStorage.getItem('snake_width') != undefined) {
    input_width.value = localStorage.getItem('snake_width');
    input_height.value = localStorage.getItem('snake_height');
    input_count_cell.value = localStorage.getItem('snake_count_cell');
    input_count_food.value = localStorage.getItem('snake_count_food');
}

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = Number(input_width.value)
canvas.height = Number(input_height.value)

const width = canvas.clientWidth;
const height = canvas.clientHeight;

let min_size = (Number(input_width.value) < Number(input_height.value)) ? Number(input_width.value) : Number(input_height.value);
let size = min_size / Number(input_count_cell.value)
let count_food = Number(input_count_food.value)


function reload() {
    localStorage.setItem('snake_width', input_width.value);
    localStorage.setItem('snake_height', input_height.value);
    localStorage.setItem('snake_count_cell', input_count_cell.value);
    localStorage.setItem('snake_count_food', input_count_food.value);
    document.location.reload(true);
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const img_food = new Image();
img_food.src = './images/food.png';

let snake = {
    coordinates: {
        x: [],
        y: [],
    },
    route: 'right',
    canChangeRoute: true,
    isAlive: true,
    checkCageIsOccupied(x, y) {
        for (let i = 1; i < this.coordinates.x.length; i++) {
            if (x === this.coordinates.x[i] && y === this.coordinates.y[i]) {
                return true;
            }
        }
        return false;
    }
}
snake.coordinates.x[0] = 0;
snake.coordinates.y[0] = 0;

class FOOD {
    coordinates = {
        x: '',
        y: '',
    }
    constructor() {
        this.change();
    }
    change() {
        this.coordinates.x = rand(0, (width - size) / size);
        this.coordinates.y = rand(0, (height - size) / size);
        if (snake.checkCageIsOccupied(this.coordinates.x, this.coordinates.y)) {
            this.change()
        }
    }
}

const food = [];
for (let i = 0; i < count_food; i++) {
    food[i] = new FOOD();
}

function step() {
    //draw map
    for (let i = 0; i < Math.floor(height / size); i++) {
        for (let j = 0; j < Math.floor(width / size); j++) {
            if (j % 2 + i % 2 == 1) {
                ctx.fillStyle = 'rgba(3, 68, 17, 0.6)';
            }
            else {
                ctx.fillStyle = 'rgba(30, 88, 17, 0.6)';
            }
            ctx.fillRect(j * size, i * size, size, size);
        }
    }

    //draw snake
    ctx.fillStyle = 'rgb(130, 0, 0)';
    ctx.beginPath();
    ctx.arc(snake.coordinates.x[0] * size + size / 2, snake.coordinates.y[0] * size + size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill();

    //draw tail
    ctx.fillStyle = '#2eb9d4c9';
    for (let i = 1; i < snake.coordinates.x.length; i++) {
        ctx.fillRect(snake.coordinates.x[i] * size, snake.coordinates.y[i] * size, size, size)
    }

    //draw food
    for (let i = 0; i < food.length; i++) {
        ctx.drawImage(img_food, food[i].coordinates.x * size + 3, food[i].coordinates.y * size + 3, size - 3, size - 3)
    }

    //eat
    for (let i = 0; i < food.length; i++) {
        if (snake.coordinates.x[0] == food[i].coordinates.x && snake.coordinates.y[0] == food[i].coordinates.y) {
            food[i].change();
            snake.coordinates.x.push(snake.coordinates.x[0]);
            snake.coordinates.y.push(snake.coordinates.y[0]);
        }
    }

    //tail move
    for (let i = snake.coordinates.x.length - 1; i > 0; i--) {
        snake.coordinates.x[i] = snake.coordinates.x[i - 1];
        snake.coordinates.y[i] = snake.coordinates.y[i - 1];
    }

    //move
    if (snake.route == 'left') snake.coordinates.x[0]--;
    if (snake.route == 'right') snake.coordinates.x[0]++;
    if (snake.route == 'up') snake.coordinates.y[0]--;
    if (snake.route == 'down') snake.coordinates.y[0]++;

    //death
    if (snake.checkCageIsOccupied(snake.coordinates.x[0], snake.coordinates.y[0])) {
            alert('You are dead');
    }

    //wall
    if (snake.coordinates.x[0] >= Math.floor(width / size)) snake.coordinates.x[0] = 0;
    if (snake.coordinates.x[0] < 0) snake.coordinates.x[0] = Math.floor(width / size) - 1;
    if (snake.coordinates.y[0] >= Math.floor(height / size)) snake.coordinates.y[0] = 0;
    if (snake.coordinates.y[0] < 0) snake.coordinates.y[0] = Math.floor(height / size) - 1;

    snake.canChangeRoute = true;

    if (snake.isAlive) {
        setTimeout(() => {
            requestAnimationFrame(step);
        }, 70)
    }
}

step();

document.addEventListener("keydown", e => {
    if (snake.canChangeRoute) {
        if ((e.code === "ArrowLeft" || e.code === "KeyA") && snake.route != 'right') snake.route = "left";
        if ((e.code === "ArrowRight" || e.code === "KeyD") && snake.route != 'left') snake.route = "right";
        if ((e.code === "ArrowDown" || e.code === "KeyS") && snake.route != 'up') snake.route = "down";
        if ((e.code === "ArrowUp" || e.code === "KeyW") && snake.route != 'down') snake.route = "up";
        snake.canChangeRoute = false;
    }
});