// card.value: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
// card.suit: ♠, ♥, ♦, ♣
// TODO: don't show disabled buttons //TODO: maybe do bet in progress
let player = {
  cards: [],
  aces: 0,
  usedAces: 0,
  cardPlaces: document.querySelectorAll('.playerCard'),
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
  cardPlaces: document.querySelectorAll('.dealerCard'),
  pointsPlace: document.querySelector('[data-dealer-points]'),
  points: 0,
  updatePoints: () => {
    dealer.pointsPlace.textContent = dealer.points;
  },
};
let hitInProgress = false;
let standInProgress = false;
let gameSessionID;
let hitButton = document.querySelector('[data-hit-button]');
let standButton = document.querySelector('[data-stand-button]');
let restartButton = document.querySelector('[data-restart-button]');
let balance = 9999; //TODO: Get from top bar, when it will be built
let stake = document.querySelector('[data-stake]');
let potentialWinnings = document.querySelector('[data-potential-winnings]'); //TODO: maybe remove
let balanceRequestContainer = document.querySelector(
  '[data-balance-request-container]'
);
let betField = document.querySelector('[data-stake-input-field]');
let betButton = document.querySelector('[data-stake-input-button]');
let gameTable = document.querySelector('[data-game-table]');
let moneyAmountText = document.querySelector('[data-money-text-container]');
let moneyAmount = document.querySelector('[data-money-container]');
let betContainer = document.querySelector('[data-bet-input-container]');
let ending = document.querySelector('[data-ending-message]');
let currentStake;
let errorOccurred;
let finished = false;
let standButtonPressed = false;

const cardDeck = [
  [
    '/images/games/blackjack/cards/AV.jpeg',
    '/images/games/blackjack/cards/2V.svg',
    '/images/games/blackjack/cards/3V.svg',
    '/images/games/blackjack/cards/4V.svg',
    '/images/games/blackjack/cards/5V.svg',
    '/images/games/blackjack/cards/6V.svg',
    '/images/games/blackjack/cards/7V.svg',
    '/images/games/blackjack/cards/8V.svg',
    '/images/games/blackjack/cards/9V.svg',
    '/images/games/blackjack/cards/10V.svg',
    '/images/games/blackjack/cards/JV.jpeg',
    '/images/games/blackjack/cards/QV.jpeg',
    '/images/games/blackjack/cards/KV.jpeg',
  ],
  [
    '/images/games/blackjack/cards/AS.jpeg',
    '/images/games/blackjack/cards/2S.svg',
    '/images/games/blackjack/cards/3S.svg',
    '/images/games/blackjack/cards/4S.svg',
    '/images/games/blackjack/cards/5S.svg',
    '/images/games/blackjack/cards/6S.svg',
    '/images/games/blackjack/cards/7S.svg',
    '/images/games/blackjack/cards/8S.svg',
    '/images/games/blackjack/cards/9S.svg',
    '/images/games/blackjack/cards/10S.svg',
    '/images/games/blackjack/cards/JS.jpeg',
    '/images/games/blackjack/cards/QS.jpeg',
    '/images/games/blackjack/cards/KS.jpeg',
  ],
  [
    '/images/games/blackjack/cards/AB.jpeg',
    '/images/games/blackjack/cards/2B.svg',
    '/images/games/blackjack/cards/3B.svg',
    '/images/games/blackjack/cards/4B.svg',
    '/images/games/blackjack/cards/5B.svg',
    '/images/games/blackjack/cards/6B.svg',
    '/images/games/blackjack/cards/7B.svg',
    '/images/games/blackjack/cards/8B.svg',
    '/images/games/blackjack/cards/9B.svg',
    '/images/games/blackjack/cards/10B.svg',
    '/images/games/blackjack/cards/JB.jpeg',
    '/images/games/blackjack/cards/QB.jpeg',
    '/images/games/blackjack/cards/KB.jpeg',
  ],
  [
    '/images/games/blackjack/cards/AK.jpeg',
    '/images/games/blackjack/cards/2K.svg',
    '/images/games/blackjack/cards/3K.svg',
    '/images/games/blackjack/cards/4K.svg',
    '/images/games/blackjack/cards/5K.svg',
    '/images/games/blackjack/cards/6K.svg',
    '/images/games/blackjack/cards/7K.svg',
    '/images/games/blackjack/cards/8K.svg',
    '/images/games/blackjack/cards/9K.svg',
    '/images/games/blackjack/cards/10K.svg',
    '/images/games/blackjack/cards/JK.jpeg',
    '/images/games/blackjack/cards/QK.jpeg',
    '/images/games/blackjack/cards/KK.jpeg',
  ],
];

player.pointsPlace.textContent = `0`;
dealer.pointsPlace.textContent = `0`;

//TODO: after game ends stand button should be disabled

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
  target.cardPlaces[target.cards.length - 1].style.backgroundImage =
    'url(' + cardDeck[card.suit][card.value] + ')';
}

function isStakeViable(amount) {
  //     amount <= currentBalance &&
  if (amount <= balance && Number.isInteger(amount) && amount > 0) {
    return true;
  } else {
    return false;
  }
}

function betRequest() {
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
        alert('Neturi tiek licų');
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
    bet = Number(betField.value);
    let res = await betRequest();
    res.playerCards.forEach(card => addPlayerCard(card));
    res.dealerCards.forEach(card => addDealerCard(card));

    stake.textContent = betField.value;
    potentialWinnings.textContent = `${2 * Number(stake.textContent)}`;
    outcomeAmount = Number(betField.value) * -1;
    betContainer.classList.add('hide');
    moneyAmount.classList.remove('hide');
    moneyAmountText.classList.remove('hide');
    gameOutcome = 'lose';
    winningAnimation();

    if (player.points > 21) {
      lost();
    } else if (player.points == 21) {
      if (dealer.points == 21) {
        tie();
      } else {
        blackjack();
      }
    } else {
      hitButton.disabled = false;
      standButton.disabled = false;
      gameSessionID = res.gameSessionID;
    }
  } else {
    alert('Netinkamas statymas');
  }
});

window.addEventListener('load', f => {
  restartButton.disabled = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  moneyAmount.classList.add('hide');
  moneyAmountText.classList.add('hide');
});

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
}

async function addDealerCard(card) {
  if (!finished) {
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
      await timer(500);
      placeCardOnTable(dealer, card);
    } else {
      placeCardOnTable(dealer, card);
    }
    if (
      dealer.points > player.points &&
      dealer.points < 21 &&
      standButtonPressed
    ) {
      lost();
      finished = true;
    }
    dealer.updatePoints();
  }
}

function check() {
  if (dealer.points == 21 || (dealer.aces > 0 && dealer.points == 11)) {
    if (player.points == 21 || (player.aces > 0 && player.points == 11)) {
    }
    if (dealer.cards.length == 2) {
    }
  }
}

function lost() {
  ending.classList.remove('hide');
  ending.textContent = `Pralaimėjai`;
  moneyAmount.classList.add('hide');
  moneyAmountText.classList.add('hide');
  hitButton.disabled = true;
  standButton.disabled = true;
  restartButton.disabled = false;
  currentStake = 0;
  stake.textContent = `0`;
  potentialWinnings.textContent = `0`;
}

function blackjack() {
  outcomeAmount = Math.ceil(1.25 * Number(potentialWinnings.textContent));
  ending.classList.remove('hide');
  ending.textContent = `Juodasis Džekas!`;
  moneyAmount.classList.add('hide');
  moneyAmountText.classList.add('hide');
  hitButton.disabled = true;
  standButton.disabled = true;
  restartButton.disabled = false;
  gameOutcome = 'win';
  winningAnimation();
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
        hitInProgress = false;
        alert('Neturi tiek licų');
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
        bet,
      })
    );
  }).catch(e => console.log(e));
}

hitButton.addEventListener('click', function hit() {
  hitRequest().then(async res => {
    addPlayerCard(res.playerCard);
    if (res.dealerCards.length > 0) {
      //Only happens if player.points = 21
      hitButton.disabled = true;
      standButton.disabled = true;
      for (let i = 0; i < res.dealerCards.length; i++) {
        await addDealerCard(res.dealerCards[i]);
      }
      if (dealer.points == 21) {
        if (dealer.cards.length == 2) {
          lost();
        } else {
          tie();
        }
      } else {
        won();
      }
    } else if (player.points > 21) {
      lost();
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
        standInProgress = false;
        alert('Neturi tiek licų');
        reject("You don't have that much money");
      } else if (this.readyState == 4) {
        standInProgress = false;
        reject('this.readyState == 4');
      }
    };
    xhttp.send(JSON.stringify({ gameSessionID, bet }));
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
  standButtonPressed = true;
});

function tie() {
  outcomeAmount = Number(stake.textContent);
  ending.classList.remove('hide');
  ending.textContent = `Lygiosios`;
  moneyAmount.classList.add('hide');
  moneyAmountText.classList.add('hide');
  restartButton.disabled = false;
  gameOutcome = 'draw';
  winningAnimation();
  // currentStake = 0;
  // stake.textContent = `0`;
  // potentialWinnings.textContent = `0`;
}

function won() {
  outcomeAmount = Number(potentialWinnings.textContent);
  ending.classList.remove('hide');
  ending.textContent = `Laimėjai`;
  moneyAmount.classList.add('hide');
  moneyAmountText.classList.add('hide');
  currentStake = 0;
  stake.textContent = `0`;
  potentialWinnings.textContent = `0`;
  restartButton.disabled = false;
  hitButton.disabled = true;
  standButton.disabled = true;
  gameOutcome = 'win';
  winningAnimation();
}

restartButton.addEventListener('click', function restart() {
  player.cards = [];
  dealer.cards = [];
  player.points = 0;
  dealer.points = 0;
  player.aces = 0;
  dealer.aces = 0;
  player.points = 0;
  dealer.points = 0;
  player.usedAces = 0;
  dealer.usedAces = 0;
  player.updatePoints();
  dealer.updatePoints();
  player.cardPlaces.forEach(cardPlace => {
    cardPlace.style.backgroundImage = '';
  });
  dealer.cardPlaces.forEach(cardPlace => {
    cardPlace.style.backgroundImage = '';
  });

  moneyAmount.classList.add('hide');
  moneyAmountText.classList.add('hide');
  ending.textContent = ``;
  ending.classList.add('hide');
  betContainer.classList.remove('hide');
  finished = false;
  standButtonPressed = false;

  // uncolor();
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
