var bg = new Image();
var fg = new Image();
bg.src = "assets/bg.png";
fg.src = "assets/fg.png";

export function drawBackground(context){
    context.drawImage(bg,0,0);
}

export function drawForeground(context){
    context.drawImage(fg,0,515 - fg.height);    
}
