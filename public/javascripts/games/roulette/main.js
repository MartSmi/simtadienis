document.getElementById('spinButton').addEventListener('click', spin);
document.getElementById('colorRed').addEventListener('click', () => {
  chosenColor = 0;
});
document.getElementById('colorBlack').addEventListener('click', () => {
  chosenColor = 1;
});
document.getElementById('colorGreen').addEventListener('click', () => {
  chosenColor = 2;
});

var rnumber = Math.floor(Math.random() * 16);
var deg = 30 * 360 + rnumber * 22.5;
var deg2 = deg - 30 * 360;
var gameSessionID = 123; //TODO: when starting a new game generate ID on server, add to DB and send back to client
let chosenColor; //0 - red, 1 - black, 2 - green
function spin() {
  let amount = parseInt(document.getElementById('amountInput').value);
  if (amount == 0) {
    console.log('Amount must be greater than 0');
    return;
  } else if (chosenColor == undefined) {
    console.log('A color must be chosen');
    return;
  }
  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/games/roulette/spin', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Response
      let response = this.responseText;
      console.log(response);
    }
  };
  let data = { amount, chosenColor };
  xhttp.send(JSON.stringify(data));
}

function myfunction() {
  var number = document.getElementById('numberInput').value;
  // var color = document.getElementById('myText2').value;
  var number1 = Number(number);
  document.getElementById('box').style.transform = 'rotate(' + deg + 'deg)';
  var element = document.getElementById('mainbox');
  element.classList.remove('animate');
  setTimeout(function () {
    element.classList.add('animate');
  }, 5000); //5000 = 5 second
  if (color == 'red' || color == 'RED' || color == 'Red') {
    if (
      deg2 == 22.5 ||
      deg2 == 67.5 ||
      deg2 == 112.5 ||
      deg2 == 157.5 ||
      deg2 == 202.5 ||
      deg2 == 247.5 ||
      deg2 == 292.5 ||
      deg2 == 337.5
    ) {
      winr = number1 * 1.5;
      setTimeout(function () {
        alert('You win ' + winr);
      }, 5500);
    } else {
      setTimeout(function () {
        alert('You lose');
      }, 5500);
    }
  } else if (color == 'black' || color == 'BLACK' || color == 'Black') {
    if (
      deg2 == 0 ||
      deg2 == 45 ||
      deg2 == 270 ||
      deg2 == 135 ||
      deg2 == 180 ||
      deg2 == 225 ||
      deg2 == 315 ||
      deg2 == 360
    ) {
      winb = number1 * 2;
      setTimeout(function () {
        alert('You win ' + winb);
      }, 5500);
    } else {
      setTimeout(function () {
        alert('You lose');
      }, 5500);
    }
  } else if (color == 'green' || color == 'GREEN' || color == 'Green') {
    if (deg2 == 90) {
      wing = number1 * 5;
      setTimeout(function () {
        alert('You win ' + wing);
      }, 5500);
    } else {
      setTimeout(function () {
        alert('You lose');
      }, 5500);
    }
  } else {
    setTimeout(function () {
      alert('You lose');
    }, 5500);
  }
  setTimeout(function () {
    location.reload();
  }, 7000);
}
