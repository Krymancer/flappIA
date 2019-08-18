import Bird from "./Bird.js"
import Pipe from "./Pipe.js"

import {
    drawBackground,
    drawForeground
} from "./layers.js"


const totalPopulation = 1000;
let allBirds = [];
let activeBirds = [];
let generation = 0;
let bestScore = 0;

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
context.font = '20px Roboto-Bold';

//document.addEventListener("keydown",move);
// const bird = new Bird(20,200);

const horizontalOffset = 170;

const pipes = [
    new Pipe(canvas.width, -(Math.floor(Math.random() * 160))),
    new Pipe(canvas.width + horizontalOffset, -(Math.floor(Math.random() * 160)))
];

function reset() {

    pipes[0].pos.x = canvas.width;
    pipes[0].pos.y = -(Math.floor(Math.random() * 160));
    pipes[1].pos.x = canvas.width + horizontalOffset;
    pipes[1].pos.y = -(Math.floor(Math.random() * 160));
}

function move() {
    bird.jump();
}

function createPopulation() {
    for (let i = 0; i < totalPopulation; i++) {
        let bird = new Bird();
        activeBirds[i] = bird;
        allBirds[i] = bird;
    }
}

function update() {
    //bird.update();
    if (activeBirds.length === 0) {
        nextGeneration();
    }

    pipes.forEach(pipe => {

        if (pipe.die()) {
            pipe.pos.x = canvas.width;
            pipe.pos.y = -(Math.floor(Math.random()*160));
        }

        activeBirds.forEach((bird, index) => {
            bird.update();
            if (bird.die(pipe)) {
                activeBirds.splice(index, 1);
            }
            
            // if(pipes[1].pos.x  > pipes[0].pos.x){
            //     bird.think(pipes[1]);
            // }else{
            //     bird.think(pipes[0]);
            // }
            bird.think(pipes);
        });

        pipe.update();
    });



    drawBackground(context);

    activeBirds.forEach(bird => {
        bird.show(context);
        if(bird.score > bestScore){
            bestScore = bird.score;
        }
    });

    pipes.forEach(pipe => {
        pipe.show(context);
    });

    drawForeground(context);

    context.fillText(`Generation: ${generation}`, 10,475);
    context.fillText(`Best Score: ${bestScore}`, 10,500);
    requestAnimationFrame(update);
}

createPopulation();
update();

function nextGeneration() {
    generation++;
    reset();
    normalizeFitness(allBirds);
    activeBirds = generate(allBirds);
    allBirds = activeBirds.slice();
}

function generate(oldBirds) {
    let newBirds = [];
    oldBirds.forEach((bird,index) => {
        newBirds[index] = new Bird(poolSelection(oldBirds).brain);
    });
    return newBirds;
}

function normalizeFitness(birds) {
    let sum = 0;
    birds.forEach(bird => {
        sum += bird.score;
    });

    birds.forEach(bird => {
        bird.fitness = bird.score / sum;
    });
}

function poolSelection(birds) {
    let index = 0;
    let r = Math.random();

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
        r -= birds[index].fitness;
        // And move on to the next
        index++;
    }

    // Go back one
    index--;

    return birds[index].copy();
}