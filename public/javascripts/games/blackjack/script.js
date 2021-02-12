//import {cardDeck} from './carddeck.js'

let playerCards = document.querySelectorAll('[data-player-card]');
let dealerCards = document.querySelectorAll('[data-dealer-card]');
let hitButton = document.querySelector('[data-hit-button]');
let standButton = document.querySelector('[data-stand-button]');
let playerPoints = document.querySelector('[data-player-points]');
let dealerPoints = document.querySelector('[data-dealer-points]');
let loseScreen = document.querySelector('[data-lose-screen]');
let winScreen = document.querySelector('[data-win-screen]');
let tieScreen = document.querySelector('[data-tie-screen]');
let restartButton = document.querySelector('[data-restart-button]');
let balance = document.querySelector('[data-balance]');
let stake = document.querySelector('[data-stake]');
let potentialWinnings = document.querySelector('[data-potential-winnings]');
let balanceValue = document.querySelector('[data-balance-value]');
let balanceRequestButton = document.querySelector(
  '[data-balance-request-button]'
);
let balanceRequestContainer = document.querySelector(
  '[data-balance-request-container]'
);
let betWindow = document.querySelector('[data-stake-input-container]');
let betField = document.querySelector('[data-stake-input-field]');
let betButton = document.querySelector('[data-stake-input-button]');
let gameTable = document.querySelector('[data-game-table]');
let currentBalance;
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

function randomSuit() {
  return suits[Math.floor(Math.random() * 4)];
}

function randomCardValue() {
  return cardValues[Math.floor(Math.random() * 13)];
}

function assignCardCombination(container) {
  container.firstElementChild.textContent = `${randomCardValue()}`;
  container.firstElementChild.nextElementSibling.textContent = `${randomSuit()}`;

  colorSuit(container.firstElementChild.nextElementSibling);
}

function gameLoad() {
  assignCardCombination(playerCards[0]);
  assignCardCombination(playerCards[1]);
  assignCardCombination(dealerCards[0]);

  countThePoints(playerCards[0], playerPoints);
  countThePoints(playerCards[1], playerPoints);
  countThePoints(dealerCards[0], dealerPoints);

  blackjack();
}
/* Ši funkcija nustato, kiek pinigų turės žaidėjas žaidimo pradžioje */
function setPrimaryBalance() {
  if (
    Number.isInteger(Number(balanceValue.value)) &&
    Number(balanceValue.value) > 0
  ) {
    /* Number(balanceValue.value) yra tiek, kiek žaidėjas įrašo. Čia ir reikėtų GET requesto ir
        numinusuoti iš žaidėjo Number(balanceValue.value) pinigų. Aišku dar gali prireikt if'o, jeigu neturi pakankamai */
    currentBalance = Number(balanceValue.value);
    balance.textContent = balanceValue.value;
    balanceRequestContainer.classList.add('hide');
    balanceRequestContainer.classList.remove('balanceRequestContainer');
    errorOccurred = false;
  } else {
    alert('Error');
    errorOccurred = true;
  }
}

function isStakeViable(amount) {
  if (
    amount <= Number(balance.textContent) &&
    amount <= currentBalance &&
    Number.isInteger(amount) &&
    amount > 0
  ) {
    return true;
  } else {
    return false;
  }
}

function placeBet() {
  if (isStakeViable(Number(betField.value))) {
    stake.textContent = betField.value;
    currentStake = Number(betField.value);
    currentBalance -= currentStake;
    balance.textContent =
      Number(balance.textContent) - Number(stake.textContent);
    betWindow.classList.add('hide');
    betWindow.classList.remove('stakeInputContainer');
    gameLoad();
    potentialGameWinnings();
    errorOccurred = false;
  } else {
    alert('no');
    errorOccurred = true;
  }
}

async function placeBet() {
  console.log('called placeBet');
  let bet = Number(betField.value);
  let res = await betRequest(bet);
  console.log(res);
  // const block = JSON.parse(response).block;
  addPlayerCard(res.playerCards[0]); //{suit, value}
  addPlayerCard(res.playerCards[1]);
  addPlayerCard(res.dealerCard);
  // gameLoad();
  potentialGameWinnings();

  currentBalance -= currentStake;
  balance.textContent = Number(balance.textContent) - Number(stake.textContent);
  betWindow.classList.add('hide');
  betWindow.classList.remove('stakeInputContainer');

  if (isStakeViable(Number(betField.value))) {
    stake.textContent = betField.value;
    withdrawButton.disabled = false;
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

balanceRequestButton.addEventListener('click', () => {
  setPrimaryBalance();
  if (!errorOccurred) {
    betWindow.classList.remove('hide');
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

function addPlayerCard(card) {
  dealerCards.push(card);
  //TODO: display card on table
}

// function potentialGameWinnings() {
//   potentialWinnings.textContent = 2 * Number(stake.textContent);
// }

betButton.addEventListener('click', () => {
  placeBet();
  hitButton.disabled = false;
  standButton.disabled = false;
  withdrawButton.disabled = true;
});

window.addEventListener('load', f => {
  restartButton.disabled = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  withdrawButton.disabled = true;
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

hitButton.addEventListener('click', f => {
  for (i = 0; i < 10; i++) {
    if (isFilled(playerCards[i])) {
      assignCardCombination(playerCards[i]);
      countThePoints(playerCards[i], playerPoints);
      break;
    } else continue;
  }

  playerBust();
});

async function dealerMoves() {
  while (
    Number(dealerPoints.textContent) < 17 &&
    Number(dealerPoints.textContent) <= Number(playerPoints.textContent)
  ) {
    for (i = 0; i < 10; i++) {
      if (isFilled(dealerCards[i])) {
        assignCardCombination(dealerCards[i]);
        countThePoints(dealerCards[i], dealerPoints);
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
  disableHitButton();
  disableStandButton();

  dealerMoves();
});

function countThePoints(card, target) {
  let cardValue = card.firstElementChild;
  let points = Number(target.textContent);

  if (
    cardValue.textContent == 'J' ||
    cardValue.textContent == 'Q' ||
    cardValue.textContent == 'K'
  ) {
    points += 10;
  } else if (cardValue.textContent == 'A') {
    if (points <= 10) {
      points += 11;
    } else {
      points += 1;
    }
  } else {
    points += Number(cardValue.textContent);
  }
  target.textContent = `${points}`;
}

function playerBust() {
  if (Number(playerPoints.textContent) > 21) {
    loseScreen.classList.remove('hide');
    if (check()) {
      balance.textContent = currentBalance;
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
  withdrawButton.disabled = false;
}

function dealerBust() {
  if (Number(dealerPoints.textContent) > 21) {
    winScreen.classList.remove('hide');

    if (check()) {
      currentBalance += 2 * currentStake;
      balance.textContent = currentBalance;
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

function check() {
  if (
    Number(stake.textContent) === currentStake &&
    Number(balance.textContent) === currentBalance
  ) {
    return true;
  } else {
    return false;
  }
}

function tie() {
  if (Number(playerPoints.textContent) === Number(dealerPoints.textContent)) {
    tieScreen.classList.remove('hide');
    if (check()) {
      currentBalance += currentStake;
      balance.textContent = currentBalance;
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
      balance.textContent = currentBalance;
      currentStake = 0;
      stake.textContent = `0`;
      potentialWinnings.textContent = `0`;
      restartButton.disabled = false;
      disableHitButton();
      disableStandButton();
    } else {
      alert('Error');
    }
  }

  if (Number(playerPoints.textContent) < Number(dealerPoints.textContent)) {
    loseScreen.classList.remove('hide');
    if (check()) {
      balance.textContent = currentBalance;
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
  switch (dealerCards[0].firstElementChild.textContent) {
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

function blackjack() {
  if (cardValue(playerCards[0]) + cardValue(playerCards[1]) == 21) {
    if (dealerBlackjackIsPossible()) {
      assignCardCombination(dealerCards[1]);
      countThePoints(dealerCards[1], dealerPoints);
      if (cardValue(dealerCards[0]) + cardValue(dealerCards[1]) === 21) {
        tie();
      } else winner();
    } else winner();
  }
}

restartButton.addEventListener('click', () => {
  for (i = 0; i < playerCards.length; i++) {
    playerCards[i].firstElementChild.textContent = ``;
    playerCards[i].firstElementChild.nextElementSibling.textContent = ``;
    dealerCards[i].firstElementChild.textContent = ``;
    dealerCards[i].firstElementChild.nextElementSibling.textContent = ``;
  }

  playerPoints.textContent = `0`;
  dealerPoints.textContent = `0`;

  winScreen.classList.add('hide');
  loseScreen.classList.add('hide');
  tieScreen.classList.add('hide');
  hitButton.disabled = false;
  standButton.disabled = false;

  uncolor();
  betWindow.classList.remove('hide');
  betWindow.classList.add('stakeInputContainer');
  gameTable.classList.add('blur');
  restartButton.disabled = true;
});

function uncolor() {
  for (i = 0; i < playerCards.length; i++) {
    playerCards[i].firstElementChild.nextElementSibling.classList.remove(
      'redColor'
    );
    dealerCards[i].firstElementChild.nextElementSibling.classList.remove(
      'redColor'
    );
  }
}
