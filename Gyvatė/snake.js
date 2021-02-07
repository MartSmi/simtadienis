// Pabaigos sąlyga - 166 eilutėje, pabaigos veiksmai apie 80 eilute.
// Sorry už plagijavimą
/*
Create by Learn Web Developement
Youtube channel : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/ 

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const licejus = new Image();
licejus.src = "img/licejus.png";

galva = new Image();
galva.src = "img/Saulius.png";

const zalia = new Image();
zalia.src = "img/zalia.png";

const oboulys = new Image();
oboulys.src = "img/obuolys.png";

const raudona = new Image();
raudona.src = "img/raudona.png";


var vaizdas = new Array();
vaizdas =["img/0.png", "img/1.png"]
var maistas = new Array();

var kiek = vaizdas.length;
for(var i=0; i<kiek;i++ ){
    
    maistas[i]= new Image();
    maistas[i].src = vaizdas[i];
}




// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/mokytis.mp4";
eat.src = "audio/tb.mp4";
up.src = "audio/a.mp4";
right.src = "audio/b.mp4";
down.src = "audio/c.mp4";
left.src = "audio/d.mp4";


// create the snake
let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;

//control the snake
let d;

document.addEventListener("keydown",direction);



let veikia =1;

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
    else if(key == 82){
        mirtis();
    }
    else if(key == 32){
        if(veikia==1)veikia=0;
        else veikia=1;
        dead.play();
    }

}
// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function mirtis(ar){
    clearInterval(game);
    ctx.fillStyle = "black";
    ctx.font = "45px Changa one";
    if(ar) ctx.fillText("Deja, atsitrenkėte į save",84,325);
    else  ctx.fillText("Deja, atsitrenkėte į sieną",84,325);

     
    dead.play();


    setTimeout(() => {  location.reload(); }, 2000);

}





var naujas = Math.floor(Math.random() * kiek);
let segmentai =[];
// draw everything to the canvas
function draw(){

    if(veikia ==1){
    ctx.drawImage(ground,0,0);
    ctx.drawImage(licejus,20,17);

    
    for( let i = 1; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
      
        ctx.drawImage(maistas[segmentai[i-1]], snake[i].x, snake[i].y, 32,32);
        ctx.drawImage(zalia, snake[i].x, snake[i].y,32,32);
    }
    ctx.drawImage(oboulys, food.x, food.y,32,32);
    ctx.drawImage(maistas[naujas], food.x+7, food.y+10,18,18);
    ctx.drawImage(raudona, food.x+7, food.y+10,18,18);

    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    ctx.drawImage(galva, snakeX, snakeY,32,32);
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        segmentai.push(naujas);
        naujas = Math.floor(Math.random() * kiek);
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        mirtis(collision(newHead,snake));

    }

    // game over
    

    
    snake.unshift(newHead);
    
    ctx.fillStyle = "black";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);



}
}

// call draw function every 100 ms

let game = setInterval(draw,100);