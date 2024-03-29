document.getElementById('spinButton').addEventListener('click', () => {
  if (!spinning) {
    spin();
  }
});
document.getElementById('colorRed').addEventListener('click', () => {
  chosenColor = 0;
});
document.getElementById('colorBlack').addEventListener('click', () => {
  chosenColor = 1;
});
document.getElementById('colorGreen').addEventListener('click', () => {
  chosenColor = 2;
});

let deg;
let spinning = false;
let chosenColor; //0 - red, 1 - black, 2 - green
let numSpins = 0;
let previousBlockDeg = 0;
function spin() {
  numSpins++;
  let amount = parseInt(document.getElementById('amountInput').value);
  if (amount <= 0) {
    console.log('Statymas turi būti didesnis nei 0');
    alert('Statymas turi būti didesnis nei 0')
    return;
  } else if (chosenColor == undefined) {
    console.log('Spalva turi būti pasirinkta');
    alert('Spalva turi būti pasirinkta')
    return;
  }
  spinning = true;

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/games/roulette/spin', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Response
      let response = this.responseText;

      const block = JSON.parse(response).block;
      let currentBlockDeg = 24 * block;
      // console.log("block: " + block + "  currentBlockDeg: " + currentBlockDeg + "   previousBlockDeg: " + previousBlockDeg);
      deg = numSpins * 3600 - currentBlockDeg + 90;
      previousBlockDeg = currentBlockDeg;
      document.getElementById('box').style.transform = 'rotate(' + deg + 'deg)';
      let winnings = amount;
      outcomeAmount = amount*(-1)
      gameOutcome = 'lose'
      winningAnimation()
      
      if (block == 0) {
        if (chosenColor == 2) {
          // Won on green
          winnings *= 15;
          won(winnings);
        } else {
          // Lost
          winnings *= -1;
          lost(winnings);
        }
      } else if (chosenColor == 1 && block % 2 == 0) {
        // Won on black
        winnings *= 2;
        won(winnings);
      } else if (chosenColor == 0 && block % 2 == 1) {
        // Won on red
        winnings *= 2;
        won(winnings);
      } else {
        // Lost
        winnings *= -1;
        lost(winnings);
      }
    } else if (
      this.readyState == 4 &&
      this.status == 406 &&
      JSON.parse(this.response).error == 'Bet too big'
    ) {
      alert("Neturi tiek licų");
      spinning = false;
    } else if (this.readyState == 4) {
      spinning = false;
    }
  };
  let data = { amount, chosenColor };
  xhttp.send(JSON.stringify(data));
}

function won(winnings) {
  outcomeAmount = winnings
  setTimeout(function () {
    spinning = false;
    gameOutcome = 'win'
    winningAnimation()
    // updateTopbarBalanceNumber(winnings);
  }, 5000);
}

function lost(winnings) {
  outcomeAmount = winnings
  setTimeout(function () {
    spinning = false;
    gameOutcome = ''
    // winningAnimation()
    // updateTopbarBalanceNumber(winnings);
  }, 5000);
}