import {random_int, Queue} from "/js/algorithms.js";


const box = 32;
const num = 20;


function canvas_context() {
    let canvas = document.getElementsByTagName("canvas")[0];

    let size = box * num;
    canvas.width = size;    // set width and height of canvas not in css
    canvas.height = size;

    return canvas.getContext("2d");
}

let context = canvas_context();


class Point {
    constructor(i, j) {
        this.i = i;
        this.j = j;

        this.x = i * box;
        this.y = j * box;
    }

    draw_box(color) {
        context.fillStyle = color;
        context.fillRect(this.x, this.y, box, box);
    }

    draw_circle(color) {
        let x = this.x + box / 2;
        let y = this.y + box / 2;
        
        context.beginPath();
        context.fillStyle = color;

        context.arc(x, y, box / 2, 0, 2 * Math.PI);
        context.fill();
    }

    draw_img(path) {
        let x = this.x;
        let y = this.y;

        let img = new Image();

        img.onload = function () {
            context.drawImage(img, x, y, box, box);
        };

        img.src = path;
    }

    move(direction) {
        switch (direction) {
            case "right":
                return new Point(this.i + 1, this.j);
            case "left":
                return new Point(this.i - 1, this.j);
            case "down":
                return new Point(this.i, this.j + 1);
            case "up":
                return new Point(this.i, this.j - 1);
        }
    }

    check_border() {
        return this.i < 0 || this.i >= num || this.j < 0 || this.j >= num;
    }

    check_lap(p) {
        return this.i == p.i && this.j == p.j;
    }
}


function random_point() {
    let i = random_int(num);
    let j = random_int(num);

    return new Point(i, j);
}


class Food {
    constructor() {
        this.locate = random_point();
        this.draw("red");
    }

    draw(color) {
        this.locate.draw_box(color);
    }

    check_lap(p) {
        return this.locate.check_lap(p);
    }
}

let food;


function draw_line(color, p1, p2) {
    context.beginPath();
    context.strokeStyle = color;

    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();
}


function draw_board(color) {
    let start;
    let end;

    for (let i = 1; i < num; i++) {
        start = new Point(i, 0);
        end = new Point(i, num);
        draw_line(color, start, end);

        start = new Point(0, i);
        end = new Point(num, i);
        draw_line(color, start, end);
    }
}

draw_board("blue");


class Snake {
    constructor(p, direction) {
        this.queue = new Queue();
        this.queue.push(p);

        this.direction = direction;

        this.draw("pink", "/source/saber.png");
    }

    len() {
        return this.queue.length;
    }

    head() {
        return this.queue.tail();
    }

    body() {
        return this.queue.body();
    }

    draw(color, path) {
        for (let p of this.body()) 
            p.draw_circle(color);
            
        this.head().draw_img(path);
    }

    next() {
        let head = this.head();

        return head.move(this.direction);
    }

    check_eatself() {
        for (let p of this.body()) {
            if (this.next().check_lap(p))
                return true;
        }
        return false;
    }

    move() {
        let head = this.head();
        let next = this.next();

        if (this.check_eatself() || next.check_border())
            return false;

        this.queue.push(next);

        if (food.check_lap(head)) {
            food = new Food("red");
        } 
        else {
            this.queue.pop();
        }
        return true;
    }
}

let start = new Point(3, 4);
let snake = new Snake(start, "right");

function set_direction(event) {
    switch (event.key) {
        case "ArrowRight":
            if (snake.direction != "left")
                snake.direction = "right";
            break;
        case "ArrowLeft":
            if (snake.direction != "right")
                snake.direction = "left";
            break;
        case "ArrowDown":
            if (snake.direction != "up")
                snake.direction = "down";
            break;
        case "ArrowUp":
            if (snake.direction != "down")
                snake.direction = "up";
            break;
    }
}

document.addEventListener("keydown", set_direction);


let audio = document.getElementsByTagName("audio")[0];
audio.volume = 0.06;


localStorage.setItem("highest score", 0);

function update_score() {
    let score = snake.len() - 1;

    if (score > localStorage.getItem("highest score")) {
        localStorage.setItem("highest score", score);
    }

    alert("Your score: " + score + "\nHighest score: " + localStorage.getItem("highest score"));
}


let interval;
function play() {
    audio.play();

    snake = new Snake(start, "right");
    food = new Food("red");

    clearInterval(interval);

    interval = setInterval(function () {
        context = canvas_context();
        draw_board("blue");
    
        food.draw("red");

        snake.draw("pink", "/source/saber.png");

        if (!snake.move()) {
            clearInterval(interval);

            audio.pause();
            
            update_score();
        }
    }, 1000 / 7);  // 7 fps
}


let button = document.getElementsByTagName("button")[0];
button.addEventListener("click", play);