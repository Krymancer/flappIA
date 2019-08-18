var pipeNorth = new Image();
var pipeSouth = new Image();

pipeNorth.src = "assets/pipe-1.png";
pipeSouth.src = "assets/pipe-2.png";

export default class Pipe{
    constructor(x,y){
        this.pos = { x, y};
        this.vel = 2;
        this.offset = 130;
        this.width = 52;
        this.height = 242;
    }

    update(){
        this.pos.x -= this.vel;
    }

    show(context){
        context.strokeStyle = 'red';
        context.beginPath();
        context.rect(this.pos.x,this.pos.y,this.width,this.height);
        context.rect(this.pos.x,this.pos.y + this.height + this.offset ,this.width,this.height);
        context.drawImage(pipeNorth,this.pos.x,this.pos.y);
        context.drawImage(pipeSouth,this.pos.x,this.pos.y + this.offset + this.height);
        context.stroke();
    }

    die(){
        return this.pos.x < -pipeNorth.width;
    }
}

// -160 - 0