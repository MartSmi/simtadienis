// Pabaiga suveikia ir taškų pervedimas tūrėtų būti: line 160

// Sorry už plagijavimą
/*
Create by Learn Web Developement
Youtube channel : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/ 

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const pathToImg = "../../../images/games/snake/img/";
const pathToAudio = "../../../images/audio/snake/audio/";

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = pathToImg + "ground.png";

const fonas = new Image();
fonas.src = pathToImg + "fonas.png";

const licejus = new Image();
licejus.src = pathToImg + "licejus.png";

const icon = new Image();
icon.src = pathToImg + "icon.png";

galva = new Image();
galva.src = pathToImg + "Saulius.png";

const zalia = new Image();
zalia.src = pathToImg + "zalia.png";

const oboulys = new Image();
oboulys.src = pathToImg + "obuolys.png";

const raudona = new Image();
raudona.src = pathToImg + "raudona.png";


var vaizdas = new Array();
//vaizdas =["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png", "img/7.png", "img/8.png", "img/9.png", "img/10.png", "img/11.png", "img/12.png", "img/13.png", "img/14.png", "img/15.png", "img/16.png", "img/17.png", "img/18.png", "img/19.png", "img/20.png", "img/21.png", "img/22.png", "img/23.png", "img/24.png", "img/25.png", "img/26.png", "img/27.png", "img/28.png", "img/29.png", "img/30.png", "img/31.png", "img/32.png"]
vaizdas = [];
for (var i = 1; i <= 32; i++) {
    vaizdas.push(pathToImg + i + ".png");
}

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
let garsas =0; 
dead.src = pathToAudio + "mokytis.mp4";
dead.volume = garsas;
eat.src = pathToAudio + "tb.mp4";
eat.volume = garsas;
up.src = pathToAudio + "a.mp4";
up.volume = garsas;
right.src = pathToAudio + "b.mp4";
right.volume = garsas;
down.src = pathToAudio + "c.mp4";
down.volume = garsas;
left.src = pathToAudio + "d.mp4";
left.volume = garsas;



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
    ctx.font = "45px Acherus Grotesque";

    const siena = new Image();
    siena.src = pathToImg + "siena.png";
    const save = new Image();
    save.src = pathToImg + "save.png";

    //kokia pabaiga
    ctx.drawImage(fonas,60,270, 490 ,80);
    if(ar) ctx.fillText("Deja, atsitrenkėte į save",84,325);
    else  ctx.fillText("Deja, atsitrenkėte į sieną",84,325);
    dead.play();


    //Šitoje vietoje tūrėtų būti kažkas su taškų pervedimu kintamsis: score
    // score prasideda nuo 0. Lenta yra 15*17, todėl teoriškai 254 yra įmanoma surinkti idealiai žaidžiat, bet praktiškai tai nėra realu, nes žaidimas greitėja.

    setTimeout(() => {  location.reload(); }, 2000);

}




var naujas = Math.floor(Math.random() * kiek);
let segmentai =[];
// draw everything to the canvas
function draw(){

    if(veikia ==1){
    ctx.drawImage(ground,0,0);
    ctx.drawImage(icon,20,17, 40 ,40);

    
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
        let uzimta =1;
        while(uzimta){
            uzimta=0;
            for( let i = 0; i < snake.length ; i++){
                if(food.x==snake[i].x && food.y==snake[i].y){
                    uzimta=1;
                }
            }
            if(food.x==snakeX.x && food.y==snakeY)uzimta=1;

             if(uzimta==1) {
                   food = {
                       
                        x : Math.floor(Math.random()*17+1) * box,
                        y : Math.floor(Math.random()*15+3) * box
                    }
                }
            
        
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
    ctx.font = "45px Acherus Grotesque";
    ctx.fillText(score,2*box,1.6*box);



}
}

// žaidimo greitis

let game = setInterval(draw,120-(score/3));