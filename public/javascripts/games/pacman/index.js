console.log('hafhajkfhaf');
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 420;
const GAME_HEIGHT = 540;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();

let lastTime = 0;

function gameLoop(timestamp) {
  let deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop(0);
