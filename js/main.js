import Bird from "./Bird.js"
import Pipe from "./Pipe.js"
import NeuralNetwork from "./NeuralNetwork.js"

import {
    drawBackground,
    drawForeground
} from "./layers.js"


const totalPopulation = 1000;
let allBirds = [];
let activeBirds = [];
let counter = 0;
let best = 0;

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

//document.addEventListener("keydown",move);

//const bird = new Bird(20,200);

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
        let bird = new Bird(20, 200);
        activeBirds[i] = bird;
        allBirds[i] = bird;
    }
}

function update() {
    //bird.update();
    pipes.forEach(pipe => {
        pipe.update();
        if (pipe.die()) {
            pipe.pos.x = canvas.width;
            pipe.pos.y = -(Math.floor(Math.random()*160));
        }

        activeBirds.forEach((bird, index) => {
            bird.think(pipe);
            bird.update();

            if (bird.die(pipe)) {
                activeBirds.splice(index, 1);
            }
        });
    });

    drawBackground(context);

    //bird.show(context);

    activeBirds.forEach(bird => {
        bird.show(context);
        if(bird.score > best){
            best = bird.score;
        }
    });

    pipes.forEach(pipe => {
        pipe.show(context);
    });
    drawForeground(context);

    if (activeBirds.length === 0) {
        nextGeneration();
    }

    requestAnimationFrame(update);
}

createPopulation();
update();

function nextGeneration() {
    counter++;
    console.log('Generation:', counter, "Best:",best);
    reset();
    normalizeFitness(allBirds);
    activeBirds = generate(allBirds);
    allBirds = activeBirds.slice();
}

function generate(oldBirds) {
    let newBirds = [];
    oldBirds.forEach((bird,index) => {
        newBirds[index] = new Bird(20,200,poolSelection(oldBirds));
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
        index += 1;
    }

    // Go back one
    index -= 1;

    return birds[index].copy();
}