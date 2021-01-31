console.log('hafhajkfhaf');
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 420;
const GAME_HEIGHT = 540;
const PLAY_TEXT = "Žaisti";
const PAUSE_TEXT = "Sustabdyti";

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();
//game.pause();

var playing = false;

var startStopButton = document.getElementById('start_stop_btn');
startStopButton.addEventListener('click', event => {
  playing = !playing;
 /* if (playing)
    game.play();
  else
    game.pause(); */

  if (playing) startStopButton.innerHTML = PAUSE_TEXT;
  else startStopButton.innerHTML = PLAY_TEXT;
});

document.getElementById('quit_btn').addEventListener('click', event => {
  playing = false;
 /* game.pause(); 
  game.quit(); */

  // !!! pervesti į banką kiekį: game.score

  game.start();

  if (playing) startStopButton.innerHTML = PAUSE_TEXT;
  else startStopButton.innerHTML = PLAY_TEXT;
});

let lastTime = 0;

function gameLoop(timestamp) {
  let deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  game.update(deltaTime, playing);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop(0);
