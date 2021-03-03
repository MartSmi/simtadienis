const costImage = document.querySelector('[data-cost-image]');
const loseImage = document.querySelector('[data-lose-image]');
const winImage = document.querySelector('[data-win-image]');
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];

document.getElementById('Gira').addEventListener('click', doSlot);

let spinInProgress = false;
const spin = [
  new Audio('res/sounds/spin.mp3'),
  new Audio('res/sounds/spin.mp3'),
  new Audio('res/sounds/spin.mp3'),
  new Audio('res/sounds/spin.mp3'),
  new Audio('res/sounds/spin.mp3'),
  new Audio('res/sounds/spin.mp3'),
  new Audio('res/sounds/spin.mp3'),
];
const coin = [
  new Audio('res/sounds/coin.mp3'),
  new Audio('res/sounds/coin.mp3'),
  new Audio('res/sounds/coin.mp3'),
];
const win = new Audio('res/sounds/win.mp3');
const lose = new Audio('res/sounds/lose.mp3');
var audio = false;
var info = true;

async function doSlot() {
  if (spinInProgress) {
    return;
  }
  spinInProgress = true; //TODO: set to false somewhere
  const symbols = await spinRequest();
  costImage.src = '/images/games/slots/transparent.svg';

  symbols.forEach((symbol, i) => {
    reels[i].className = 'symbol' + (symbol + 1);
  });
  const winnings = calWinnings(symbols);
  if (winnings > 0) {
    console.log('won');
    costImage.src = '/images/games/slots/laimejai.png';
  } else {
    console.log('lost');
    costImage.src = '/images/games/slots/pralaimejai.png';
  }
  spinInProgress = false;
  return;

  slot1 = setInterval(spin1, 50);
  slot2 = setInterval(spin2, 50);
  slot3 = setInterval(spin3, 50);
  function spin1() {
    i1++;
    if (i1 >= slots[0]) {
      //coin[0].play()
      clearInterval(slot1);
      return null;
    }
    slotTile = document.getElementById('slot1');
    slotTile.className = 'a' + (parseInt(slotTile.className.substring(1)) + 1);
  }
  function spin2() {
    i2++;
    if (i2 >= slots[1]) {
      //coin[1].play()
      clearInterval(slot2);
      return null;
    }
    slotTile = document.getElementById('slot2');
    if (slotTile.className == 'a7') {
      slotTile.className = 'a0';
    }
    slotTile.className = 'a' + (parseInt(slotTile.className.substring(1)) + 1);
  }
  function spin3() {
    i3++;
    if (i3 >= slots[2]) {
      //coin[2].play()
      clearInterval(slot3);
      testWin();
      return null;
    }
    slotTile = document.getElementById('slot3');
    if (slotTile.className == 'a7') {
      slotTile.className = 'a0';
    }
    sound++;
    if (sound == spin.length) {
      sound = 0;
    }
    //spin[sound].play();
    slotTile.className = 'a' + (parseInt(slotTile.className.substring(1)) + 1);
  }
}

function calWinnings(symbols) {
  if (symbols[0] == symbols[1] && symbols[1] == symbols[2]) {
    if (symbols[0] == 6) {
      return 250;
    } else {
      return 100;
    }
  } else if (
    (symbols[0] == symbols[1] && symbols[2] == 6) ||
    (symbols[0] == symbols[2] && symbols[1] == 6) ||
    (symbols[1] == symbols[2] && symbols[0] == 6)
  ) {
    return 25;
  } else if (
    (symbols[0] == symbols[1] && symbols[0] == 6) ||
    (symbols[0] == symbols[2] && symbols[0] == 6) ||
    (symbols[1] == symbols[2] && symbols[1] == 6)
  ) {
    return 25;
  }
  return -5;
}

function testWin(slots) {
  var slot1 = document.getElementById('slot1').className;
  var slot2 = document.getElementById('slot2').className;
  var slot3 = document.getElementById('slot3').className;

  if (
    ((slot1 == slot2 && slot2 == slot3) ||
      (slot1 == slot2 && slot3 == 'a7') ||
      (slot1 == slot3 && slot2 == 'a7') ||
      (slot2 == slot3 && slot1 == 'a7') ||
      (slot1 == slot2 && slot1 == 'a7') ||
      (slot1 == slot3 && slot1 == 'a7') ||
      (slot2 == slot3 && slot2 == 'a7')) &&
    !(slot1 == slot2 && slot2 == slot3 && slot1 == 'a7')
  ) {
    costImage.src = '/images/games/slots/laimejai.png';
    //win.play();
  } else {
    costImage.src = '/images/games/slots/pralaimejai.png';
    //lose.play();
  }
}

function spinRequest() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/games/slots/spin', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText).slots);
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      reject(xhr.statusText);
    };
    xhr.send(null);
  }).catch(e => console.error(e));
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
