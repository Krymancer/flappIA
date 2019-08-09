import NeuralNetwork from "./NeuralNetwork.js"

export default class Bird{
    constructor(x,y,brain){
        this.pos = {x,y};
        this.vel = 30;
        this.gravity = 1.5;
        this.image = new Image();
        this.image.src = "assets/bird.png";
        this.width = 38;
        this.height = 26;

        this.score = 0;
        this.lift = -12;
        this.fitness = 0;

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);
          } else {
            this.brain = new NeuralNetwork(6, 8, 2);
          }
    }

    jump(){
        this.pos.y -= this.vel;
    }

    update(){
        this.pos.y += this.gravity;
        this.score++;
    }

    show(context){
        context.drawImage(this.image,this.pos.x,this.pos.y);
    }

    die(pipe){
       return this.hitGround() || this.collide(pipe);
    }

    hitGround(){
        const hitGroundHeight = 370;
        return this.pos.y >= hitGroundHeight;
    }

    collide(pipe){
        return (this.pos.x > pipe.pos.x && this.pos.x < pipe.pos.x + pipe.height)
                && (this.pos.y < pipe.pos.y + pipe.height || this.pos.y > pipe.pos.y + pipe.offset + pipe.height);
    }

    think(pipe) {
        let inputs = [];
        // x position of closest pipe
        inputs[0] = map(pipe.pos.x, this.pos.x, 288, 0, 1);
        // top of closest pipe opening
        inputs[1] = map(pipe.pos.y + pipe.height, 0, 512, 0, 1);
        // bottom of closest pipe opening
        inputs[2] = map(pipe.pos.y + pipe.height + pipe.offset, 0, 512, 0, 1);
        // bird's y position
        inputs[3] = map(this.pos.y, 0, 512, 0, 1);

        inputs[4] = map(pipe.pos.x + pipe.width/2,this.pos.x,288,0,1);

        inputs[5] = map(this.pos.y, pipe.pos.y + (pipe.height + pipe.offset/2) , 512,0,1);
        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        //console.log(inputs);
        if (action[1] > action[0]) {
            this.jump();
        }
    }

      copy() {
        return new Bird(this.brain);
      }    
}


function mutate(x) {
    if (random(1) < 0.1) {
        let offset = randomZero_One() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

function randomZero_One(){
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}