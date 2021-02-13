let player = {
  cards: [],
  aces: 0,
  usedAces: 0,
  cardPlaces: document.querySelectorAll('[data-player-card]'),
  pointsPlace: document.querySelector('[data-player-points]'),
  points: 0,
  updatePoints: () => {
    player.pointsPlace.textContent = player.points;
  },
};
let dealer = {
  cards: [],
  aces: 0,
  usedAces: 0,
  cardPlaces: document.querySelectorAll('[data-dealer-card]'),
  pointsPlace: document.querySelector('[data-dealer-points]'),
  points: 0,
  updatePoints: () => {
    dealer.pointsPlace.textContent = dealer.points;
  },
};
let hitInProgress = false; //TODO: maybe do bet in progress
let standInProgress = false;
let gameSessionID;
let hitButton = document.querySelector('[data-hit-button]');
let standButton = document.querySelector('[data-stand-button]');
let loseScreen = document.querySelector('[data-lose-screen]');
let winScreen = document.querySelector('[data-win-screen]');
let tieScreen = document.querySelector('[data-tie-screen]');
let restartButton = document.querySelector('[data-restart-button]');
let balance = 9999; //TODO: Get from top bar, when it will be built
let stake = document.querySelector('[data-stake]');
let potentialWinnings = document.querySelector('[data-potential-winnings]'); //TODO: maybe remove
let balanceValue = document.querySelector('[data-balance-value]');
let balanceRequestContainer = document.querySelector(
  '[data-balance-request-container]'
);
let betWindow = document.querySelector('[data-stake-input-container]');
let betField = document.querySelector('[data-stake-input-field]');
let betButton = document.querySelector('[data-stake-input-button]');
let gameTable = document.querySelector('[data-game-table]');
let currentStake;
let errorOccurred;

player.pointsPlace.textContent = `0`;
dealer.pointsPlace.textContent = `0`;

//TODO: after game ends stand button should be disabled

const timer = ms => new Promise(res => setTimeout(res, ms));
let suits = ['♠', '♥', '♦', '♣'];
let cardValues = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
];

function placeCardOnTable(target, card) {
  let n = target.cards.length - 1;
  target.cardPlaces[n].firstElementChild.textContent = `${
    cardValues[card.value]
  }`;

  target.cardPlaces[n].firstElementChild.nextElementSibling.textContent = `${
    suits[card.suit]
  }`;

  colorSuit(target.cardPlaces[n].firstElementChild.nextElementSibling);
}

function isStakeViable(amount) {
  //     amount <= currentBalance &&
  if (amount <= balance && Number.isInteger(amount) && amount > 0) {
    return true;
  } else {
    return false;
  }
}

function betRequest(bet) {
  return new Promise((resolve, reject) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/games/blackjack/bet', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Response
        resolve(JSON.parse(this.responseText));
      } else if (
        this.readyState == 4 &&
        this.status == 406 &&
        JSON.parse(this.response).error == 'Bet too big'
      ) {
        alert("You don't have that much money");
        reject();
      } else if (this.readyState == 4) {
        reject();
      }
    };
    xhttp.send(JSON.stringify({ bet }));
  });
}

betButton.addEventListener('click', async function placeBet() {
  if (isStakeViable(Number(betField.value))) {
    let bet = Number(betField.value);
    let res = await betRequest(bet);
    // const block = JSON.parse(response).block;
    res.playerCards.forEach(card => addPlayerCard(card));
    res.dealerCards.forEach(card => addDealerCard(card));
    gameSessionID = res.gameSessionID;
    betWindow.classList.add('hide');
    betWindow.classList.remove('stakeInputContainer');
    stake.textContent = betField.value;
    standButton.disabled = false;
    gameTable.classList.remove('blur');
  } else {
    alert('Bad bet');
  }
});

window.addEventListener('load', f => {
  restartButton.disabled = true;
  hitButton.disabled = true;
  standButton.disabled = true;
});

function colorSuit(suit) {
  if (suit.textContent === '♦' || suit.textContent === '♥') {
    suit.classList.add('redColor');
  }
}

function getPoints(value) {
  if (value > 9) return 10;
  else return value + 1;
}

function addPlayerCard(card) {
  player.cards.push(card);
  if (card.value == 0) player.aces++;
  let cardPoint = getPoints(card.value);
  if (player.points + cardPoint <= 11 && player.aces > 0) {
    player.points += 10;
    player.usedAces++;
  } else if (player.points + cardPoint > 21 && player.usedAces > 0) {
    player.points -= 10;
    player.usedAces--;
  }
  player.points += cardPoint;

  placeCardOnTable(player, card);
  player.updatePoints();
  if (player.points > 21) {
    lost();
  } else if (
    (player.points == 21 || (player.aces > 0 && player.points == 11)) &&
    player.cards.length == 2
  ) {
    blackjack();
  } else {
    hitButton.disabled = false;
  }
}

async function addDealerCard(card) {
  dealer.cards.push(card);
  if (card.value == 0) dealer.aces++;
  let cardPoint = getPoints(card.value);
  if (dealer.points + cardPoint <= 11 && dealer.aces > 0) {
    dealer.points += 10;
    dealer.usedAces++;
  } else if (dealer.points + cardPoint > 21 && dealer.usedAces > 0) {
    dealer.points -= 10;
    dealer.usedAces--;
  }
  dealer.points += cardPoint;

  if (dealer.cards.length > 1) {
    await timer(1000);
    placeCardOnTable(dealer, card);
  } else {
    placeCardOnTable(dealer, card);
  }
  dealer.updatePoints();
  if (dealer.points > 21) {
    lost();
  } else if (dealer.points == 21 || (dealer.aces > 0 && dealer.points == 11)) {
    if (player.points == 21) {
      tie();
    }
  }
}

function lost() {
  loseScreen.classList.remove('hide');
  alert('lost');
  hitButton.disabled = true;
  restartButton.disabled = false;
  loseScreen.classList.remove('hide');
  currentStake = 0;
  stake.textContent = `0`;
  potentialWinnings.textContent = `0`;
}

function blackjack() {
  winScreen.classList.remove('hide');
  alert('blackjack');
  hitButton.disabled = true;
  restartButton.disabled = false;
}

window.addEventListener('load', f => {
  restartButton.disabled = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  standButton.disabled = true;
});

// function disableHitButton() {
//   hitButton.disabled = true;
// }
// function disableStandButton() {
//   standButton.disabled = true;
// }

function hitRequest() {
  return new Promise((resolve, reject) => {
    if (hitInProgress) reject('already called');
    hitInProgress = true;
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/games/blackjack/hit', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Response
        hitInProgress = false;
        resolve(JSON.parse(this.responseText));
      } else if (
        this.readyState == 4 &&
        this.status == 406 &&
        JSON.parse(this.response).error == 'Bet too big'
      ) {
        //TODO
        hitInProgress = false;
        alert("You don't have that much money");
        reject("You don't have that much money");
      } else if (this.readyState == 4) {
        hitInProgress = false;
        reject('this.readyState == 4');
      }
    };
    xhttp.send(
      JSON.stringify({
        gameSessionID,
        playerCards: player.cards,
        dealerCard: dealer.cards[0],
      })
    );
  }).catch(e => console.log(e));
}

hitButton.addEventListener('click', function hit() {
  hitRequest().then(res => {
    addPlayerCard(res.playerCard);
    if (res.dealerCards.length > 0) {
      //Only happens if player.points = 21
      res.dealerCards.forEach(card => {
        addDealerCard(card);
      });
      if (dealer.points == 21) {
        tie();
      } else {
        won();
      }
    }
  });
});

function standRequest() {
  return new Promise((resolve, reject) => {
    if (standInProgress) reject('already called');
    standInProgress = true;
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/games/blackjack/stand', true); //TODO: maybe change to sync?
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Response
        standInProgress = false;
        resolve(JSON.parse(this.responseText).cards);
      } else if (
        this.readyState == 4 &&
        this.status == 406 &&
        JSON.parse(this.response).error == 'Bet too big'
      ) {
        //TODO
        standInProgress = false;
        alert("You don't have that much money");
        reject("You don't have that much money");
      } else if (this.readyState == 4) {
        standInProgress = false;
        reject('this.readyState == 4');
      }
    };
    xhttp.send(JSON.stringify({ gameSessionID }));
  }).catch(e => console.log(e));
}

standButton.addEventListener('click', function stand() {
  standRequest().then(async cards => {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      await addDealerCard(card);
    }
    if (dealer.points == player.points) {
      tie();
    } else if (dealer.points > 21 || player.points > dealer.points) {
      won();
    } else {
      lost();
    }
  });
  hitButton.disabled = true;
  standButton.disabled = true;
});

function playerBust() {
  if (Number(player.points.textContent) > 21) {
    loseScreen.classList.remove('hide');
    if (check()) {
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
    } else {
      alert('Error');
    }

    disableHitButton();
    disableStandButton();
    restartButton.disabled = false;
  }

  disableHitButton();
  disableStandButton();
  restartButton.disabled = false;
  standButton.disabled = false;
}

function tie() {
  if (Number(player.points.textContent) === Number(dealer.points.textContent)) {
    tieScreen.classList.remove('hide');
    if (check()) {
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
      restartButton.disabled = false;
    } else {
      alert('Error');
    }
  }
}

function won() {
  alert('won');
  winScreen.classList.remove('hide');
  currentStake = 0;
  stake.textContent = `0`;
  potentialWinnings.textContent = `0`;
  restartButton.disabled = false;
  hitButton.disabled = true;
  standButton.disabled = true;
}

restartButton.addEventListener('click', () => {
  player.cards = [];
  dealer.cards = [];
  player.points = 0;
  dealer.points = 0;
  player.aces = 0;
  dealer.aces = 0;
  player.points = 0;
  dealer.points = 0;
  player.updatePoints();
  dealer.updatePoints();
  for (i = 0; i < player.cardPlaces.length; i++) {
    player.cardPlaces[i].firstElementChild.textContent = ``;
    player.cardPlaces[i].firstElementChild.nextElementSibling.textContent = ``;
    dealer.cardPlaces[i].firstElementChild.textContent = ``;
    dealer.cardPlaces[i].firstElementChild.nextElementSibling.textContent = ``;
  }

  winScreen.classList.add('hide');
  loseScreen.classList.add('hide');
  tieScreen.classList.add('hide');
  hitButton.disabled = false;
  standButton.disabled = false;

  // uncolor();
  betWindow.classList.remove('hide');
  betWindow.classList.add('stakeInputContainer');
  gameTable.classList.add('blur');
  restartButton.disabled = true;
});

function uncolor() {
  for (i = 0; i < player.cardPlaces.length; i++) {
    player.cardPlaces[i].firstElementChild.nextElementSibling.classList.remove(
      'redColor'
    );
    dealer.cardPlaces[i].firstElementChild.nextElementSibling.classList.remove(
      'redColor'
    );
  }
}
