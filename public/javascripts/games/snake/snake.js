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
const restartButton = document.getElementById('restartButton');
restartButton.disabled = true;

const scaleConstant = 532 / 610;

window.onload = window.onresize = function () {
  var canvas = document.getElementById('snake');
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
  if (game.loop == undefined) game.loop = setInterval(draw, 240);
};

document.addEventListener('keydown', changeDirection);

restartButton.addEventListener('click', () => {
  restartButton.disabled = true;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  food.x = Math.floor(Math.random() * 17 + 1);
  food.y = Math.floor(Math.random() * 15 + 3);
  snake.body[0].x = 9;
  snake.body[0].y = 10;
  game.started = false;
  snake.alive = true;
  gamePause = false;
  key = '';
  snake.direction = '';

  snake.body.length = 1;
  game.loop = setInterval(draw, 240);
  draw();
  game.score = 0;
});

const game = {
  loop: undefined,
  score: 0,
  started: false,
};

const log = {
  movement: [],
  eatenFood: [],
};

// create the snake
const snake = {
  alive: true,
  direction: undefined,
  body: [
    {
      x: 9,
      y: 10,
    },
  ],
};
// create the food

let food = {
  x: Math.floor(Math.random() * 17 + 1),
  y: Math.floor(Math.random() * 15 + 3),
  num: Math.floor(Math.random() * maistas.length),
};

let gamePause = false;

function start() {
  if (!game.started) {
    game.started = true;
    log = {
      movement: [],
      eatenFood: [],
    };
    startRequest();
  }
}

function changeDirection(event) {
  var key = event.keyCode;
  if (key == 37 && snake.direction != 'RIGHT') {
    snake.direction = 'LEFT';
    start();
  } else if (key == 38 && snake.direction != 'DOWN') {
    snake.direction = 'UP';
    start();
  } else if (key == 39 && snake.direction != 'LEFT') {
    snake.direction = 'RIGHT';
    start();
  } else if (key == 40 && snake.direction != 'UP') {
    snake.direction = 'DOWN';
    start();
    // } else if (key == 82) {
    //   death();
  } else if (key == 32) {
    gamePause = !gamePause;
  }
}
// check bodyCollision
function bodyCollision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x == body[i].x && head.y == body[i].y) {
      return true;
    }
  }
  return false;
}

function death(collidedWithBody) {
  if (!snake.alive) {
    return;
  }
  snake.alive = false;
  deathRequest();
  clearInterval(game.loop);
  ctx.fillStyle = 'black';
  ctx.font = textFont;

  ctx.drawImage(
    fonas,
    (60 * box) / 32,
    (270 * box) / 32,
    (490 * box) / 32,
    (80 * box) / 32
  );

  if (collidedWithBody)
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

  restartButton.disabled = false;

  // score prasideda nuo 0. Lenta yra 15*17, todėl teoriškai 254 yra įmanoma surinkti idealiai žaidžiat, bet praktiškai tai nėra realu, nes žaidimas greitėja.
}

let segmentai = [];
// draw everything to the canvas
function draw() {
  if (gamePause) return;
  ctx.drawImage(ground, 0, 0, (608 * box) / 32, (608 * box) / 32);
  ctx.drawImage(
    icon,
    (20 * box) / 32,
    (17 * box) / 32,
    (40 * box) / 32,
    (40 * box) / 32
  );

  for (let i = 1; i < snake.body.length; i++) {
    // ctx.fillStyle = i == 0 ? 'green' : 'white';

    ctx.drawImage(
      maistas[segmentai[i - 1]],
      snake.body[i].x * box,
      snake.body[i].y * box,
      box,
      box
    );
    ctx.drawImage(
      zalia,
      snake.body[i].x * box,
      snake.body[i].y * box,
      box,
      box
    );
  }
  ctx.drawImage(obuolys, food.x * box, food.y * box, box, box);
  ctx.drawImage(
    maistas[food.num],
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
  let snakeX = snake.body[0].x;
  let snakeY = snake.body[0].y;
  ctx.drawImage(galva, snakeX * box, snakeY * box, box, box);
  // which direction
  if (snake.direction == 'LEFT') snakeX -= 1;
  if (snake.direction == 'UP') snakeY -= 1;
  if (snake.direction == 'RIGHT') snakeX += 1;
  if (snake.direction == 'DOWN') snakeY += 1;
  // console.log(snake.direction);

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    log.eatenFood.push({ x: food.x, y: food.y });
    game.score++;
    segmentai.push(food.num);
    food = {
      x: Math.floor(Math.random() * 17 + 1),
      y: Math.floor(Math.random() * 15 + 3),
      num: Math.floor(Math.random() * maistas.length),
    };

    // Place new food i a non occupied location
    let occupied = true;
    while (occupied) {
      occupied = false;
      for (let i = 0; i < snake.body.length; i++) {
        if (food.x == snake.body[i].x && food.y == snake.body[i].y) {
          occupied = true;
        }
      }
      if (food.x == snakeX && food.y == snakeY) occupied = true;

      if (occupied) {
        food.x = Math.floor(Math.random() * 17 + 1);
        food.y = Math.floor(Math.random() * 15 + 3);
      }
    }

    // we don't remove the tail
  } else {
    // remove the tail
    snake.body.pop();
  }

  // add new Head
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  log.movement.push(newHead);

  if (
    snakeX < 1 ||
    snakeX > 17 ||
    snakeY < 3 ||
    snakeY > 17 ||
    bodyCollision(newHead, snake.body)
  ) {
    // game over
    death(bodyCollision(newHead, snake.body));
    snakeX = 9;
    snakeY = 10;
    newHead.x = 9;
    newHead.y = 10;
  }

  snake.body.unshift(newHead);

  ctx.fillStyle = 'black';
  ctx.font = textFont;
  ctx.fillText(game.score, 2 * box, 1.6 * box);
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
  xhr.send(
    JSON.stringify({
      gameSessionID,
      score: game.score,
      log: game.score > 30 ? log : {},
    })
  );
  outcomeAmount = Math.round((game.score / 2) * Math.pow(1.03, game.score));
  gameOutcome = 'win';
  winningAnimation();
}
