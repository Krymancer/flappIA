const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function getSprite(path) {
    const image = new Image();
    image.src = path;
    return image
}

const BACKGROUNDS = {
    'day': getSprite('assets/sprites/background-day.png'),
    'night': getSprite('assets/sprites/background-night.png')
}

const BIRDS = {
    'red': [
        getSprite('assets/sprites/redbird-upflap.png'),
        getSprite('assets/sprites/redbird-midflap.png'),
        getSprite('assets/sprites/redbird-downflap.png')
    ],
    'blue': [
        getSprite('assets/sprites/bluebird-upflap.png'),
        getSprite('assets/sprites/bluebird-midflap.png'),
        getSprite('assets/sprites/bluebird-downflap.png')
    ],
    'yellow': [
        getSprite('assets/sprites/yellowbird-upflap.png'),
        getSprite('assets/sprites/yellowbird-midflap.png'),
        getSprite('assets/sprites/yellowbird-downflap.png')
    ]
}

const PIPES = {
    'red': {
        'down': getSprite('assets/sprites/pipe-red.png'),
        'up': getSprite('assets/sprites/pipe-red-up.png')
    },
    'green': {
        'down': getSprite('assets/sprites/pipe-green.png'),
        'up': getSprite('assets/sprites/pipe-green-up.png')
    }
}

const BASE = getSprite('assets/sprites/base.png');
const FLOOR = (canvas.height - BASE.height * 2);

class Base {
    constructor(y) {
        this.VEL = 5;
        this.WIDTH = BASE.width * 2;
        this.IMAGE = BASE;

        this.y = y;
        this.x1 = 0;
        this.x2 = this.WIDTH
    }

    move() {
        this.x1 -= this.VEL;
        this.x2 -= this.VEL;

        if (this.x1 + this.WIDTH < 0) {
            this.x1 = this.x2 + this.WIDTH;
        }

        if (this.x2 + this.WIDTH < 0) {
            this.x2 = this.x1 + this.WIDTH;
        }
    }

    draw(context) {
        context.drawImage(this.IMAGE, this.x1, this.y, BASE.width * 2, BASE.height * 2);
        context.drawImage(this.IMAGE, this.x2, this.y, BASE.width * 2, BASE.height * 2);
    }
}

class Pipe {
    constructor(x) {
        this.GAP = 200;
        this.VEL = 10;

        this.x = x;
        this.height = 0;

        // Where the top and bottom of pipe is
        this.top = 0;
        this.bottom = 0;

        this.PIPE_TOP = PIPES['green']['up'];
        this.PIPE_BOTTOM = PIPES['green']['down'];
        this.setHeight();
    }

    setHeight() {
        this.height = random(50, 450);
        this.top = this.height - this.PIPE_TOP.height * 2;
        this.bottom = this.height + this.GAP;
    }

    move() {
        this.x -= this.VEL;
    }

    draw(context) {
        context.drawImage(this.PIPE_TOP, this.x, this.top, this.PIPE_TOP.width * 2, this.PIPE_TOP.height * 2);
        context.drawImage(this.PIPE_BOTTOM, this.x, this.bottom, this.PIPE_BOTTOM.width * 2, this.PIPE_BOTTOM.height * 2);
    }

    collide(bird) {
        return false
    }
}

class Bird {
    constructor(x, y) {
        this.MAX_ROTATION = 25;
        this.SPRITES = BIRDS['yellow']
        this.ROT_VEL = 20;
        this.ANIMATION_TIME = 5;

        this.x = x;
        this.y = y;
        this.tilt = 0; // Degress to tilt
        this.tickCount = 0;
        this.vel = 0;
        this.height = this.y;
        this.imageCount = 0;
        this.sprite = this.SPRITES[0];
    }

    jump() {
        this.vel = 11.5;
        this.tickCount = 0;
        this.height = this.y;
    }

    move() {
        this.tickCount++;

        // For downward acceleration
        let displacement = this.vel * (this.tickCount) + 0.5 * (3) * (this.tickCount) * (this.tickCount) // Dont even ask

        // Terminal velocity
        if (displacement >= 16) {
            displacement = (displacement / Math.abs(displacement)) * 16
        }

        if (displacement < 0) {
            displacement -= 2;
        }

        this.y = this.y + displacement;

        if ((displacement < 0) || (this.y < this.height + 50)) { // Tilt up
            if (this.tilt < this.MAX_ROTATION) this.tilt = this.MAX_ROTATION;
        } else { // Tilt Down
            if (this.tilt > -90) this.tilt -= this.ROT_VEL;
        }
    }

    draw(context) {
        this.imageCount++;

        // Loop through images to animate bird
        if (this.imageCount <= this.ANIMATION_TIME)
            this.sprite = this.SPRITES[0];
        else if (this.imageCount <= this.ANIMATION_TIME * 2)
            this.sprite = this.SPRITES[1];
        else if (this.imageCount <= this.ANIMATION_TIME * 3)
            this.sprite = this.SPRITES[2];
        else if (this.imageCount <= this.ANIMATION_TIME * 4)
            this.sprite = this.SPRITES[1];
        else if (this.imageCount <= this.ANIMATION_TIME * 4 + 1) {
            this.sprite = this.SPRITES[0];
            this.imageCount = 0;
        }

        // When bird is nose diving it isn't flapping
        if (this.tilt <= -80) {
            this.sprite = this.SPRITES[1]
            this.imageCount = this.ANIMATION_TIME * 2
        }

        // Tilt bird
        blitRotateCenter(context, this.sprite, this.x, this.y, this.tilt)



    }
}

// TODO
function blitRotateCenter(context, image, x, y, angle) {
    context.drawImage(image, x, y, image.height * 2, image.width * 2);
}


function drawScreen(context, birds, pipes, base, score, generation, pipe_index) {
    context.drawImage(BACKGROUNDS['day'], 0, 0, canvas.width, canvas.height);

    pipes.forEach(pipe => pipe.draw(context));
    birds.forEach(bird => bird.draw(context));

    base.draw(context);
}

const base = new Base(FLOOR);
const pipes = [];
const birds = [];
const score = 0;
const generation = 0;
const pipe_index = 0;

pipes.push(new Pipe(canvas.width))
birds.push(new Bird(230, 350))

function draw() {
    base.move();

    pipes.forEach(pipe => pipe.move());
    //birds.forEach(bird => bird.move());

    drawScreen(context, birds, pipes, base, score, generation, pipe_index);
    requestAnimationFrame(draw);
}

function init() {
    draw();
}

init();