window.addEventListener('load', event => {
  loadTetris();
  paintHat();
});

// Loads tetris
function loadTetris() {
  const canvas = document.getElementById('tetris-canvas');
  const tetris = new ClassicTetris(canvas);
  document.getElementById('start-stop-btn').addEventListener('click', event => {
    //const startLevel = document.getElementById('level-input').value;
    const startLevel = 5;
    tetris.setStartLevel(startLevel);
    tetris.togglePlayPause();
  });
  document.getElementById('quit-btn').addEventListener('click', event => {
    tetris.quit();
  });
}

// Paints the hat
function paintHat() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    canvas.width = document.getElementById('p').scrollWidth;
    canvas.height = document.getElementById('p').clientHeight;
    var x = canvas.width / 100;
    var y = canvas.height / 100;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.beginPath();
    //ctx.moveTo(0, 0);
    ctx.moveTo(0, 65 * y);
    ctx.lineTo(30 * x, 65 * y);
    ctx.lineTo(70 * x, 5 * y);
    ctx.lineTo(100 * x, 5 * y);
    //ctx.lineTo(100*x, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 65 * y);
    ctx.lineTo(30 * x, 65 * y);
    ctx.lineTo(70 * x, 5 * y);
    ctx.lineTo(100 * x, 5 * y);
    ctx.lineTo(100 * x, 0);

    ctx.fill();
  }
}

function gameStartRequest() {
  fetch('/games/tetris/start', { method: 'GET' })
    .then(res => res.json())
    .then(data => (gameSessionID = data.gameSessionID));
}

function gameOverRequest(score) {
  fetch('/games/tetris/end', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameSessionID, score }),
  });
  gameOutcome = 'win'
  outcomeAmount = Math.round(score/100)
  winningAnimation()
}
