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

const cardDeck = [
  ['/images/games/blackjack/cards/A S.jpeg', '/images/games/blackjack/cards/2S.svg', '/images/games/blackjack/cards/3S.svg', 
  '/images/games/blackjack/cards/4S.svg', '/images/games/blackjack/cards/5S.svg', '/images/games/blackjack/cards/6S.svg', 
  '/images/games/blackjack/cards/7S.svg', '/images/games/blackjack/cards/8S.svg', '/images/games/blackjack/cards/9S.svg', 
  '/images/games/blackjack/cards/10S.svg', '/images/games/blackjack/cards/J S.jpeg', '/images/games/blackjack/cards/Q S.jpeg', 
  '/images/games/blackjack/cards/K S.jpeg'],

  ['/images/games/blackjack/cards/A V.jpeg', '/images/games/blackjack/cards/2V.svg', '/images/games/blackjack/cards/3V.svg', 
  '/images/games/blackjack/cards/4V.svg', '/images/games/blackjack/cards/5V.svg', '/images/games/blackjack/cards/6V.svg', 
  '/images/games/blackjack/cards/7V.svg', '/images/games/blackjack/cards/8V.svg', '/images/games/blackjack/cards/9V.svg', 
  '/images/games/blackjack/cards/10V.svg', '/images/games/blackjack/cards/J V.jpeg', '/images/games/blackjack/cards/Q V.jpeg', 
  '/images/games/blackjack/cards/K V.jpeg'],

  ['/images/games/blackjack/cards/AB.jpeg', '/images/games/blackjack/cards/2B.svg', '/images/games/blackjack/cards/3B.svg', 
  '/images/games/blackjack/cards/4B.svg', '/images/games/blackjack/cards/5B.svg', '/images/games/blackjack/cards/6B.svg', 
  '/images/games/blackjack/cards/7B.svg', '/images/games/blackjack/cards/8B.svg', '/images/games/blackjack/cards/9B.svg', 
  '/images/games/blackjack/cards/10B.svg', '/images/games/blackjack/cards/J B.jpeg', '/images/games/blackjack/cards/Q B.jpeg', 
  '/images/games/blackjack/cards/K B.jpeg'],

  ['/images/games/blackjack/cards/A K.jpeg', '/images/games/blackjack/cards/2K.svg', '/images/games/blackjack/cards/3K.svg', 
  '/images/games/blackjack/cards/4K.svg', '/images/games/blackjack/cards/5K.svg', '/images/games/blackjack/cards/6K.svg', 
  '/images/games/blackjack/cards/7K.svg', '/images/games/blackjack/cards/8K.svg', '/images/games/blackjack/cards/9K.svg', 
  '/images/games/blackjack/cards/10K.svg', '/images/games/blackjack/cards/J K.jpeg', '/images/games/blackjack/cards/Q K.jpeg', 
  '/images/games/blackjack/cards/K K.jpeg']
]

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
  placeCardImage(target.cardPlaces[n].firstElementChild.nextElementSibling.nextElementSibling.src, card.value, card.suit)
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
    player.cardPlaces[i].firstElementChild.nextElementSibling.nextElementSibling.src = '/images/games/blackjack/transparent.svg'
    dealer.cardPlaces[i].firstElementChild.textContent = ``;
    dealer.cardPlaces[i].firstElementChild.nextElementSibling.textContent = ``;
    dealer.cardPlaces[i].firstElementChild.nextElementSibling.nextElementSibling.src = '/images/games/blackjack/transparent.svg'
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

function placeCardImage(card, value, suit) {
  switch (suit) {
    case '♥':
      switch (value) {
        case 'A':
          card.src = cardDeck[0][0]
          break
        case '2':
          card.src = cardDeck[0][1]
          break
        case '3':
          card.src = cardDeck[0][2]
          break
        case '4':
          card.src = cardDeck[0][3]
          break
        case '5':
          card.src = cardDeck[0][4]
          break
        case '6':
          card.src = cardDeck[0][5]
          break
        case '7':
          card.src = cardDeck[0][6]
          break
        case '8':
          card.src = cardDeck[0][7]
          break
        case '9':
          card.src = cardDeck[0][8]
          break
        case '10':
          card.src = cardDeck[0][9]
          break
        case 'J':
          card.src = cardDeck[0][10]
          break
        case 'Q':
          card.src = cardDeck[0][11]
          break
        case 'K':
          card.src = cardDeck[0][12]
          break
      }
      break
    case '♠':
      switch (value) {
        case 'A':
          card.src = cardDeck[1][0]
          break
        case '2':
          card.src = cardDeck[1][1]
          break
        case '3':
          card.src = cardDeck[1][2]
          break
        case '4':
          card.src = cardDeck[1][3]
          break
        case '5':
          card.src = cardDeck[1][4]
          break
        case '6':
          card.src = cardDeck[1][5]
          break
        case '7':
          card.src = cardDeck[1][6]
          break
        case '8':
          card.src = cardDeck[1][7]
          break
        case '9':
          card.src = cardDeck[1][8]
          break
        case '10':
          card.src = cardDeck[1][9]
          break
        case 'J':
          card.src = cardDeck[1][10]
          break
        case 'Q':
          card.src = cardDeck[1][11]
          break
        case 'K':
          card.src = cardDeck[1][12]
          break
      }
      break
    case '♦':
      switch (value) {
        case 'A':
          card.src = cardDeck[2][0]
          break
        case '2':
          card.src = cardDeck[2][1]
          break
        case '3':
          card.src = cardDeck[2][2]
          break
        case '4':
          card.src = cardDeck[2][3]
          break
        case '5':
          card.src = cardDeck[2][4]
          break
        case '6':
          card.src = cardDeck[2][5]
          break
        case '7':
          card.src = cardDeck[2][6]
          break
        case '8':
          card.src = cardDeck[2][7]
          break
        case '9':
          card.src = cardDeck[2][8]
          break
        case '10':
          card.src = cardDeck[2][9]
          break
        case 'J':
          card.src = cardDeck[2][10]
          break
        case 'Q':
          card.src = cardDeck[2][11]
          break
        case 'K':
          card.src = cardDeck[2][12]
          break
      }
      break
    case '♣':switch (value) {
      case 'A':
        card.src = cardDeck[3][0]
        break
      case '2':
        card.src = cardDeck[3][1]
        break
      case '3':
        card.src = cardDeck[3][2]
        break
      case '4':
        card.src = cardDeck[3][3]
        break
      case '5':
        card.src = cardDeck[3][4]
        break
      case '6':
        card.src = cardDeck[3][5]
        break
      case '7':
        card.src = cardDeck[3][6]
        break
      case '8':
        card.src = cardDeck[3][7]
        break
      case '9':
        card.src = cardDeck[3][8]
        break
      case '10':
        card.src = cardDeck[3][9]
        break
      case 'J':
        card.src = cardDeck[3][10]
        break
      case 'Q':
        card.src = cardDeck[3][11]
        break
      case 'K':
        card.src = cardDeck[3][12]
        break
    }
      break
  }
}