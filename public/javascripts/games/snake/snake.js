// Pabaiga suveikia ir taškų pervedimas tūrėtų būti: line 160

// Sorry už plagijavimą
/*
Create by Learn Web Developement
Youtube channel : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/

const cvs = document.getElementById('snake');
const ctx = cvs.getContext('2d');

// Images
const ground = document.getElementById('ground');
const fonas = document.getElementById('fonas');
const licejus = document.getElementById('licejus');
const icon = document.getElementById('icon');
const galva = document.getElementById('galva');
const zalia = document.getElementById('zalia');
const obuolys = document.getElementById('obuolys');
const raudona = document.getElementById('raudona');
const maistas = document.getElementsByClassName('maistas');
// const siena = document.getElementById('siena');
// const save = document.getElementById('save');
let started = false;
let died = false;
window.onload = window.onresize = function () {
  var canvas = document.getElementById('snake');
  scaleConstant = 532 / 610;
  canvasSize = window.innerHeight * scaleConstant;
  box = canvasSize / 19;
  // console.log(box);
  // console.log(window.innerHeight);
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  fontSize = Math.round((45 * box) / 32);
  textFont = fontSize + 'px Acherus Grotesque';
  // Draws instantly ~60 ms faster to draw the first frame
  draw();
  // Žaidimo greitis
  if (!('game' in window)) game = setInterval(draw, 180 - score / 2);
};

// create the snake
let snake = [
  {
    x: 9,
    y: 10,
  },
];

// create the food

let food = {
  x: Math.floor(Math.random() * 17 + 1),
  y: Math.floor(Math.random() * 15 + 3),
};

let score = 0;

//Direction of snake
let d;

document.addEventListener('keydown', direction);

let veikia = 1;

function start() {
  if (started === false) {
    started = true;
    startRequest();
  }
}

function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != 'RIGHT') {
    d = 'LEFT';
    start();
  } else if (key == 38 && d != 'DOWN') {
    d = 'UP';
    start();
  } else if (key == 39 && d != 'LEFT') {
    d = 'RIGHT';
    start();
  } else if (key == 40 && d != 'UP') {
    d = 'DOWN';
    start();
    // } else if (key == 82) {
    //   mirtis();
  } else if (key == 32) {
    if (veikia == 1) veikia = 0;
    else veikia = 1;
  }
}
// check collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function startRequest() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/games/snake/start', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Response
        gameSessionID = JSON.parse(this.responseText).gameSessionID;
        resolve();
      } else if (this.readyState == 4) {
        reject();
      }
    };
    xhr.send(null);
  });
}

function deathRequest() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/games/snake/end', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ gameSessionID, score }));
  outcomeAmount = score
  gameOutcome = 'win'
  winningAnimation()
}

function mirtis(ar) {
  if (died == true) {
    return;
  } else {
    died = true;
  }
  deathRequest();
  clearInterval(game);
  ctx.fillStyle = 'black';
  ctx.font = textFont;

  //kokia pabaiga
  ctx.drawImage(
    fonas,
    (60 * box) / 32,
    (270 * box) / 32,
    (490 * box) / 32,
    (80 * box) / 32
  );
  if (ar)
    ctx.fillText(
      'Deja, atsitrenkėte į save',
      (84 * box) / 32,
      (325 * box) / 32
    );
  else
    ctx.fillText(
      'Deja, atsitrenkėte į sieną',
      (84 * box) / 32,
      (325 * box) / 32
    );

  //Šitoje vietoje tūrėtų būti kažkas su taškų pervedimu kintamsis: score
  // score prasideda nuo 0. Lenta yra 15*17, todėl teoriškai 254 yra įmanoma surinkti idealiai žaidžiat, bet praktiškai tai nėra realu, nes žaidimas greitėja.

  // setTimeout(() => {
  //   location.reload();
  // }, 2000);
}

var naujas = Math.floor(Math.random() * maistas.length);
let segmentai = [];
// draw everything to the canvas
function draw() {
  if (veikia == 1) {
    //ctx.drawImage(ground,0,0);
    ctx.drawImage(ground, 0, 0, (608 * box) / 32, (608 * box) / 32);
    ctx.drawImage(
      icon,
      (20 * box) / 32,
      (17 * box) / 32,
      (40 * box) / 32,
      (40 * box) / 32
    );

    for (let i = 1; i < snake.length; i++) {
      ctx.fillStyle = i == 0 ? 'green' : 'white';

      ctx.drawImage(
        maistas[segmentai[i - 1]],
        snake[i].x * box,
        snake[i].y * box,
        box,
        box
      );
      ctx.drawImage(zalia, snake[i].x * box, snake[i].y * box, box, box);
    }
    ctx.drawImage(obuolys, food.x * box, food.y * box, box, box);
    ctx.drawImage(
      maistas[naujas],
      box * food.x + (7 * box) / 32,
      box * food.y + (10 * box) / 32,
      (18 * box) / 32,
      (18 * box) / 32
    );
    ctx.drawImage(
      raudona,
      box * food.x + (7 * box) / 32,
      box * food.y + (10 * box) / 32,
      (18 * box) / 32,
      (18 * box) / 32
    );

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    ctx.drawImage(galva, snakeX * box, snakeY * box, box, box);
    // which direction
    if (d == 'LEFT') snakeX -= 1;
    if (d == 'UP') snakeY -= 1;
    if (d == 'RIGHT') snakeX += 1;
    if (d == 'DOWN') snakeY += 1;

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
      score++;
      segmentai.push(naujas);
      naujas = Math.floor(Math.random() * maistas.length);
      food = {
        x: Math.floor(Math.random() * 17 + 1),
        y: Math.floor(Math.random() * 15 + 3),
      };
      let uzimta = 1;
      while (uzimta) {
        uzimta = 0;
        for (let i = 0; i < snake.length; i++) {
          if (food.x == snake[i].x && food.y == snake[i].y) {
            uzimta = 1;
          }
        }
        if (food.x == snakeX.x && food.y == snakeY) uzimta = 1;

        if (uzimta == 1) {
          food = {
            x: Math.floor(Math.random() * 17 + 1),
            y: Math.floor(Math.random() * 15 + 3),
          };
        }
      }

      // we don't remove the tail
    } else {
      // remove the tail
      snake.pop();
    }

    // add new Head
    let newHead = {
      x: snakeX,
      y: snakeY,
    };

    if (
      snakeX < 1 ||
      snakeX > 17 ||
      snakeY < 3 ||
      snakeY > 17 ||
      collision(newHead, snake)
    ) {
      mirtis(collision(newHead, snake));
    }

    // game over

    snake.unshift(newHead);

    ctx.fillStyle = 'black';
    ctx.font = textFont;
    ctx.fillText(score, 2 * box, 1.6 * box);
  }
}
