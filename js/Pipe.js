var pipeNorth = new Image();
var pipeSouth = new Image();

pipeNorth.src = "assets/pipe-1.png";
pipeSouth.src = "assets/pipe-2.png";

export default class Pipe{
    constructor(x,y){
        this.pos = { x, y};
        this.vel = 2;
        this.offset = 120;
        this.width = 52;
        this.height = 242;
    }

    update(){
        this.pos.x -= this.vel;
    }

    show(context){
        context.drawImage(pipeNorth,this.pos.x,this.pos.y);
        context.drawImage(pipeSouth,this.pos.x,this.pos.y + this.offset + pipeNorth.height);
    }

    die(){
        return this.pos.x < -pipeNorth.width;
    }
}

// -160 - 0