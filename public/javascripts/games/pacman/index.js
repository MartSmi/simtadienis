let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const PLAY_TEXT = 'ŽAISTI';
const PAUSE_TEXT = 'SUSTABDYTI';

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();
//game.pause();

var playing = false;

var startStopButton = document.getElementById('start_stop_btn');
startStopButton.addEventListener('click', event => {
  if (!playing && typeof gameSessionID == 'undefined') {
    console.log('startReq');
    gameStartRequest();
  }
  if (game.lost || game.won) {
    game.start();
  }

  playing = !playing;
  /* if (playing)
    game.play();
  else
    game.pause(); */

  if (playing) startStopButton.innerHTML = PAUSE_TEXT;
  else startStopButton.innerHTML = PLAY_TEXT;
  if (playing) gameLog.innerHTML = 'ŽAIDŽIAMA';
  else gameLog.innerHTML = 'SUSTABDYTA';
});

document.getElementById('quit_btn').addEventListener('click', event => {
  playing = false;
  /* game.pause(); 
  game.quit(); */
  if (typeof gameSessionID !== 'undefined' && game.score !== 0) {
    gameOverRequest();
  }

  game.start();
  if (playing) startStopButton.innerHTML = PAUSE_TEXT;
  else startStopButton.innerHTML = PLAY_TEXT;
});

let lastTime = 0;

let gameLog = document.getElementById('log_text');

function gameLoop(timestamp) {
  let deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  game.update(deltaTime, playing);
  game.draw(ctx);

  if (game.lost || game.won) {
    if (typeof gameSessionID !== 'undefined') {
      gameOverRequest();
    }
    playing = false;
    if (game.lost) gameLog.innerHTML = 'PRALAIMĖTA...';
    else gameLog.innerHTML = 'LAIMĖJOT!';
    startStopButton.innerHTML = 'IŠ NAUJO';
  }

  requestAnimationFrame(gameLoop);
}

gameLoop(0);

function gameStartRequest() {
  fetch('/games/pacman/start', { method: 'GET' })
    .then(res => res.json())
    .then(data => (gameSessionID = data.gameSessionID));
}

function gameOverRequest() {
  gameSessionID = undefined;
  fetch('/games/pacman/end', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameSessionID, score: game.score, level: game.curLevel }),
  });
  gameOutcome = 'win'
  outcomeAmount = Math.round(game.score/100)
  outcomeAmount += (game.curLevel-1) * 50
  game.curLevel = 1;
  winningAnimation()
}
