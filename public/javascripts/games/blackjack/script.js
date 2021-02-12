let playerCards = [];
let dealerCards = [];
let playerValue = 0;
let dealerValue = 0;
let playerAces = 0;
let dealerAces = 0;
let hitInProgress = false;
let gameSessionID;
let playerCardPlaces = document.querySelectorAll('[data-player-card]');
let dealerCardPlaces = document.querySelectorAll('[data-dealer-card]');
let hitButton = document.querySelector('[data-hit-button]');
let standButton = document.querySelector('[data-stand-button]');
let playerPoints = document.querySelector('[data-player-points]');
let dealerPoints = document.querySelector('[data-dealer-points]');
let loseScreen = document.querySelector('[data-lose-screen]');
let winScreen = document.querySelector('[data-win-screen]');
let tieScreen = document.querySelector('[data-tie-screen]');
let restartButton = document.querySelector('[data-restart-button]');
let balance = 9999; //TODO: Get from top bar, when it will be built
let stake = document.querySelector('[data-stake]');
let potentialWinnings = document.querySelector('[data-potential-winnings]');
let balanceValue = document.querySelector('[data-balance-value]');
let balanceRequestContainer = document.querySelector(
  '[data-balance-request-container]'
);
let betWindow = document.querySelector('[data-stake-input-container]');
let betField = document.querySelector('[data-stake-input-field]');
let betButton = document.querySelector('[data-stake-input-button]');
let gameTable = document.querySelector('[data-game-table]');
// let currentBalance;
let currentStake;
let errorOccurred;

playerPoints.textContent = `0`;
dealerPoints.textContent = `0`;

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

function placeCardOnTable(card, cardPlace, pos) {
  cardPlace[pos].firstElementChild.textContent = `${cardValues[card.value]}`;

  cardPlace[pos].firstElementChild.nextElementSibling.textContent = `${
    suits[card.suit]
  }`;

  colorSuit(cardPlace[pos].firstElementChild.nextElementSibling);
}

function gameLoad() {
  countThePoints(playerCardPlaces[0], playerPoints);
  countThePoints(playerCardPlaces[1], playerPoints);
  countThePoints(dealerCardPlaces[0], dealerPoints);

  blackjack();
}
/* Ši funkcija nustato, kiek pinigų turės žaidėjas žaidimo pradžioje */
// function setPrimaryBalance() {
//   if (
//     Number.isInteger(Number(balanceValue.value)) &&
//     Number(balanceValue.value) > 0
//   ) {
//     /* Number(balanceValue.value) yra tiek, kiek žaidėjas įrašo. Čia ir reikėtų GET requesto ir
//         numinusuoti iš žaidėjo Number(balanceValue.value) pinigų. Aišku dar gali prireikt if'o, jeigu neturi pakankamai */
//     currentBalance = Number(balanceValue.value);
//     balance.textContent = balanceValue.value;
//     balanceRequestContainer.classList.add('hide');
//     balanceRequestContainer.classList.remove('balanceRequestContainer');
//     errorOccurred = false;
//   } else {
//     alert('Error');
//     errorOccurred = true;
//   }
// }

function isStakeViable(amount) {
  //     amount <= currentBalance &&
  if (amount <= balance && Number.isInteger(amount) && amount > 0) {
    return true;
  } else {
    return false;
  }
}

// function placeBet() {
//   if (isStakeViable(Number(betField.value))) {
//     stake.textContent = betField.value;
//     currentStake = Number(betField.value);
//     currentBalance -= currentStake;
//     balance.textContent =
//       Number(balance.textContent) - Number(stake.textContent);
//     betWindow.classList.add('hide');
//     betWindow.classList.remove('stakeInputContainer');
//     gameLoad();
//     potentialGameWinnings();
//     errorOccurred = false;
//   } else {
//     alert('no');
//     errorOccurred = true;
//   }
// }

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
    console.log('sent bet request');
  });
}

async function placeBet() {
  let bet = Number(betField.value);
  let res = await betRequest(bet);
  // const block = JSON.parse(response).block;
  addPlayerCard(res.playerCards[0]); //{suit, value}
  addPlayerCard(res.playerCards[1]);
  addDealerCard(res.dealerCard);
  gameSessionID = res.game_session_id;
  // gameLoad();
  // potentialGameWinnings();

  // currentBalance -= currentStake;
  // balance.textContent = Number(balance.textContent) - Number(stake.textContent);
  betWindow.classList.add('hide');
  betWindow.classList.remove('stakeInputContainer');

  if (isStakeViable(Number(betField.value))) {
    stake.textContent = betField.value;
    standButton.disabled = false;
  } else {
    alert('no');
  }
}

betButton.addEventListener('click', () => {
  placeBet();
  if (!errorOccurred) {
    hitButton.disabled = false;
    standButton.disabled = false;
    gameTable.classList.remove('blur');
  }
});

// balanceRequestButton.addEventListener('click', () => {
//   setPrimaryBalance();
//   if (!errorOccurred) {
//     betWindow.classList.remove('hide');
//   }
// });

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

function cardPoints(value) {
  if (value > 9) return 10;
  else return value + 1;
}

function addPlayerCard(card) {
  playerCards.push(card);
  playerValue += cardPoints(card.value);
    if (card.value == 0) playerAces++;
  placeCardOnTable(card, playerCardPlaces, playerCards.length - 1);
  if (playerValue > 21) {
    lost();
  } else if (playerValue == 21 || (playerAces > 0 && playerValue == 11)) {
    blackjack();
  } else {
    hitButton.disabled = false;
  }
  //TODO: display card on table
}

function lost() {
  loseScreen.classList.remove('hide');
  alert('lost');
  hitButton.disabled = true;
  restartButton.disabled = false;
}

function blackjack() {
  winScreen.classList.remove('hide');
  alert('blackjack');
  hitButton.disabled = true;
  restartButton.disabled = false;
}

function addDealerCard(card) {
  dealerCards.push(card);
  placeCardOnTable(card, dealerCardPlaces, dealerCards.length - 1);
  if (dealerValue > 21) {
    lost();
  } else if (dealerValue == 21 || (dealerAces > 0 && dealerValue == 11)) {
    blackjack();
  }
  //TODO: display card on table
}

function potentialGameWinnings() {
  potentialWinnings.textContent = 2 * Number(stake.textContent);
}

// betButton.addEventListener('click', () => {
//   placeBet();
//   hitButton.disabled = false;
//   standButton.disabled = false;
//   standButton.disabled = true;
// });

window.addEventListener('load', f => {
  restartButton.disabled = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  standButton.disabled = true;
});

// function colorSuit(suit) {
//   if (suit.textContent === '♦' || suit.textContent === '♥') {
//     suit.classList.add('redColor');
//   }
// }

// function isFilled(container) {
//   return container.firstElementChild.textContent === '';
// }

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
        resolve(JSON.parse(this.responseText).card);
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
    xhttp.send(JSON.stringify({ gameSessionID }));
  }).catch(e => console.log(e));
}

function hit() {
  hitRequest().then(card => {
    addPlayerCard(card);
  });
}

hitButton.addEventListener('click', () => {
  hit();
  // for (i = 0; i < 10; i++) {
  //   if (isFilled(playerCardPlaces[i])) {
  //     assignCardCombination(playerCardPlaces[i]);
  //     countThePoints(playerCardPlaces[i], playerPoints);
  //     break;
  //   } else continue;
  // }

  // playerBust();
});

async function dealerMoves() {
  while (
    Number(dealerPoints.textContent) < 17 &&
    Number(dealerPoints.textContent) <= Number(playerPoints.textContent)
  ) {
    for (i = 0; i < 10; i++) {
      if (isFilled(dealerCardPlaces[i])) {
        assignCardCombination(dealerCardPlaces[i]);
        countThePoints(dealerCardPlaces[i], dealerPoints);
        break;
      } else continue;
    }
    await timer(1000);
  }

  dealerBust();
  tie();
  winner();
}

standButton.addEventListener('click', f => {
  hitButton.disabled = true;
  standButton.disabled = true;

  dealerMoves();
});

function updatePoints() {
  playerPoints.textContent = `${points}`;
  dealerPoints.textContent = `${points}`;
}

function playerBust() {
  if (Number(playerPoints.textContent) > 21) {
    loseScreen.classList.remove('hide');
    if (check()) {
      // balance.textContent = currentBalance;
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

function dealerBust() {
  if (Number(dealerPoints.textContent) > 21) {
    winScreen.classList.remove('hide');

    if (check()) {
      currentBalance += 2 * currentStake;
      // balance.textContent = currentBalance;
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
    } else {
      alert('sup cheat');
    }

    disableHitButton();
    disableStandButton();
  }
}

// function check() {
//   if (
//     Number(stake.textContent) === currentStake &&
//     Number(balance.textContent) === currentBalance
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }

function tie() {
  if (Number(playerPoints.textContent) === Number(dealerPoints.textContent)) {
    tieScreen.classList.remove('hide');
    if (check()) {
      currentBalance += currentStake;
      // balance.textContent = currentBalance;
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
      restartButton.disabled = false;
    } else {
      alert('Error');
    }
  }
}

function winner() {
  if (Number(playerPoints.textContent) > Number(dealerPoints.textContent)) {
    winScreen.classList.remove('hide');
    if (check()) {
      currentBalance += 2 * currentStake;
      // balance.textContent = currentBalance;
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
      restartButton.disabled = false;
      hitButton.disabled = true;
      standButton.disabled = true;
    } else {
      alert('Error');
    }
  }

  if (Number(playerPoints.textContent) < Number(dealerPoints.textContent)) {
    loseScreen.classList.remove('hide');
    if (check()) {
      // balance.textContent = currentBalance;
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
      restartButton.disabled = false;
    } else {
      alert('Error');
    }
  }
}

function cardValue(target) {
  switch (target.firstElementChild.textContent) {
    case 'K':
    case 'Q':
    case 'J':
    case '10':
      return 10;
      break;
    case 'A':
      return 11;
      break;
    default:
      return 0;
  }
}

function dealerBlackjackIsPossible() {
  switch (dealerCardPlaces[0].firstElementChild.textContent) {
    case 'A':
    case 'K':
    case 'Q':
    case 'J':
    case '10':
      return true;
      break;
    default:
      false;
  }
}

// function blackjack() {
//   if (cardValue(playerCardPlaces[0]) + cardValue(playerCardPlaces[1]) == 21) {
//     if (dealerBlackjackIsPossible()) {
//       assignCardCombination(dealerCardPlaces[1]);
//       countThePoints(dealerCardPlaces[1], dealerPoints);
//       if (
//         cardValue(dealerCardPlaces[0]) + cardValue(dealerCardPlaces[1]) ===
//         21
//       ) {
//         tie();
//       } else winner();
//     } else winner();
//   }
// }

restartButton.addEventListener('click', () => {
  playerCards = [];
  dealerCards = [];
  playerValue = 0;
  dealerValue = 0;
  playerAces = 0;
  dealerAces = 0;
  for (i = 0; i < playerCardPlaces.length; i++) {
    playerCardPlaces[i].firstElementChild.textContent = ``;
    playerCardPlaces[i].firstElementChild.nextElementSibling.textContent = ``;
    dealerCardPlaces[i].firstElementChild.textContent = ``;
    dealerCardPlaces[i].firstElementChild.nextElementSibling.textContent = ``;
  }

  playerPoints.textContent = `0`;
  dealerPoints.textContent = `0`;

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
  for (i = 0; i < playerCardPlaces.length; i++) {
    playerCardPlaces[i].firstElementChild.nextElementSibling.classList.remove(
      'redColor'
    );
    dealerCardPlaces[i].firstElementChild.nextElementSibling.classList.remove(
      'redColor'
    );
  }
}
