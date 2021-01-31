//import {cardDeck} from './carddeck.js'

let playerCards = document.querySelectorAll("[data-player-card]")
let dealerCards = document.querySelectorAll("[data-dealer-card]")
let hitButton = document.querySelector("[data-hit-button]")
let standButton = document.querySelector("[data-stand-button]")
let playerPoints = document.querySelector("[data-player-points]")
let dealerPoints = document.querySelector("[data-dealer-points]")
let loseScreen = document.querySelector("[data-lose-screen]")
let winScreen = document.querySelector("[data-win-screen]")
let tieScreen = document.querySelector("[data-tie-screen]")
let restartButton = document.querySelector("[data-restart-button]")
let balance = document.querySelector("[data-balance]")
let stake = document.querySelector("[data-stake]")
let potentialWinnings = document.querySelector("[data-potential-winnings]")
let insuranceContainer = document.querySelector("[data-insurance-container]")
let insuranceStake = document.querySelector("[data-insurance-stake]")
let balanceValue = document.querySelector("[data-balance-value]")
let balanceRequestButton = document.querySelector("[data-balance-request-button]")
let balanceRequestContainer = document.querySelector("[data-balance-request-container]")
let betWindow = document.querySelector("[data-stake-input-container]")
let betField = document.querySelector("[data-stake-input-field]")
let betButton = document.querySelector("[data-stake-input-button]")
let insuranceInputContainer = document.querySelector("[data-insurance-input-container]")
let insuranceField = document.querySelector("[data-insurance-input-field]")
let insuranceButton = document.querySelector("[data-insurance-input-button]")
let insuranceReqButton = document.querySelector("[data-insurance-request-button]")
let withdrawButton = document.querySelector("[data-withdraw-money-button]")
let currentBalance
let currentStake
let currentInsurance

playerPoints.textContent = `0`
dealerPoints.textContent = `0`

const timer = ms => new Promise(res => setTimeout(res, ms))
let suits = ["♠", "♥", "♦", "♣"]
let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function randomSuit() {
    return suits[Math.floor(Math.random()*4)]
}

function randomCardValue() {
    return cardValues[Math.floor(Math.random()*13)]
}

function assignCardCombination(container) {
    container.firstElementChild.textContent = `${randomCardValue()}`
    container.firstElementChild.nextElementSibling.textContent = `${randomSuit()}`

    colorSuit(container.firstElementChild.nextElementSibling)
}

function gameLoad() {
    assignCardCombination(playerCards[0])
    assignCardCombination(playerCards[1])
    assignCardCombination(dealerCards[0])

    countThePoints(playerCards[0], playerPoints)
    countThePoints(playerCards[1], playerPoints)
    countThePoints(dealerCards[0], dealerPoints)

    insurance()
    blackjack()
}


/* Ši funkcija nustato, kiek pinigų turės žaidėjas žaidimo pradžioje */
function setPrimaryBalance() {
    if (Number.isInteger(Number(balanceValue.value)) && Number(balanceValue.value) > 0) {
        /* Number(balanceValue.value) yra tiek, kiek žaidėjas įrašo. Čia ir reikėtų GET requesto ir
        numinusuoti iš žaidėjo Number(balanceValue.value) pinigų. Aišku dar gali prireikt if'o, jeigu neturi pakankamai */
        currentBalance = Number(balanceValue.value)
        balance.textContent = balanceValue.value
        balanceRequestContainer.classList.add('hide')
    } else {
        alert('Error')
    }
}

function isStakeViable(amount) {
    if (amount <= Number(balance.textContent)
    && amount <= currentBalance
    && Number.isInteger(amount)
    && amount > 0) {
        return true
    } else {
        return false
    }
}

function placeBet() {
    if (isStakeViable(Number(betField.value))) {
        stake.textContent = betField.value
        currentStake = Number(betField.value)
        currentBalance -= currentStake
        balance.textContent = Number(balance.textContent) - Number(stake.textContent)
        betWindow.classList.add('hide')
        gameLoad()
        potentialGameWinnings()
    } else {
        alert('no')
    }
}

function potentialGameWinnings() {
    potentialWinnings.textContent = 2*Number(stake.textContent)
}

betButton.addEventListener('click', () => {
    placeBet()
    hitButton.disabled = false
    standButton.disabled = false
    withdrawButton.disabled = true
})

balanceRequestButton.addEventListener('click', () => {
    setPrimaryBalance()
    withdrawButton.disabled = false
    betWindow.classList.remove('hide')
})

window.addEventListener('load', f => {
    restartButton.disabled = true
    hitButton.disabled = true
    standButton.disabled = true
    withdrawButton.disabled = true
})

function colorSuit(suit) {
    if (suit.textContent === "♦" || suit.textContent === "♥") {
        suit.classList.add('redColor')
    }
}

function isFilled(container) {
    return container.firstElementChild.textContent === ''
}

function disableHitButton() {
    hitButton.disabled = true
}
function disableStandButton() {
    standButton.disabled = true
}

hitButton.addEventListener('click', f => {
    for (i = 0; i < 10; i++) {
        if (isFilled(playerCards[i])) {
            assignCardCombination(playerCards[i])
            countThePoints(playerCards[i], playerPoints)
            break
        } else continue
    }

    playerBust()
})

async function dealerMoves() {
    while (Number(dealerPoints.textContent) < 17
    && Number(dealerPoints.textContent) <= Number(playerPoints.textContent)) {
        for (i = 0; i < 10; i++) {
            if (isFilled(dealerCards[i])) {
                assignCardCombination(dealerCards[i])
                countThePoints(dealerCards[i], dealerPoints)
                break
            } else continue
        }
        await timer(1000)
    }

    dealerBust()
    tie()
    winner()
}

standButton.addEventListener('click', f => {
    disableHitButton()
    disableStandButton()

    dealerMoves()
})

function countThePoints(card, target) {
    let cardValue = card.firstElementChild
    let points = Number(target.textContent)

    if (cardValue.textContent == 'J'
    || cardValue.textContent == 'Q'
    || cardValue.textContent == 'K') {
        points += 10
    } else if (cardValue.textContent == 'A') {
        if (points <= 10) {
            points += 11
        } else {
            points += 1
        }
    } else {
        points += Number(cardValue.textContent)
    }
    target.textContent = `${points}`
}

function playerBust() {
    if (Number(playerPoints.textContent) > 21) {
        loseScreen.classList.remove('hide')

        if (check()) {
            balance.textContent = currentBalance
            currentStake = 0
            stake.textContent = `0`
            potentialWinnings.textContent = `0`
            
        } else {
            alert('sup cheat')
        }

        disableHitButton()
        disableStandButton()
        restartButton.disabled = false
        withdrawButton.disabled = false
    }
}

function dealerBust() {
    if (Number(dealerPoints.textContent) > 21) {
        winScreen.classList.remove('hide')

        if (check()) {
            currentBalance += 2*currentStake
            balance.textContent = currentBalance
            currentStake = 0
            stake.textContent = `0`
            potentialWinnings.textContent = `0`
        } else {
            alert('sup cheat')
        }

        disableHitButton()
        disableStandButton()
    }
}

function check() {
    if (Number(stake.textContent) === currentStake
        && Number(balance.textContent) === currentBalance) {
            return true
        } else {
            return false
        }
}

function tie() {
    if (Number(playerPoints.textContent) === Number(dealerPoints.textContent)) {
        tieScreen.classList.remove('hide')
        if (check()) {
            currentBalance += currentStake
            balance.textContent = currentBalance
            currentStake = 0
            stake.textContent = `0`
            potentialWinnings.textContent = `0`
            restartButton.disabled = false
        } else {
            alert('Error')
        }
    }
}

function winner() {
    if (Number(playerPoints.textContent) > Number(dealerPoints.textContent)) {
        winScreen.classList.remove('hide')
        if (check()) {
            currentBalance += 2*currentStake
            balance.textContent = currentBalance
            currentStake = 0
            stake.textContent = `0`
            potentialWinnings.textContent = `0`
            restartButton.disabled = false
            withdrawButton.disabled = false
            if (isThereInsurance()) {
                currentInsurance = 0
                insuranceReqButton.classList.add('hide')
                insuranceContainer.classList.add('hide')
            } else {
                insuranceReqButton.classList.add('hide')
                insuranceContainer.classList.add('hide')
            }
        } else {
            alert('Error')
        }
    }

    if (Number(playerPoints.textContent) < Number(dealerPoints.textContent)) {
        loseScreen.classList.remove('hide')
        if (check()) {
            balance.textContent = currentBalance
            currentStake = 0
            stake.textContent = `0`
            potentialWinnings.textContent = `0`
            restartButton.disabled = false
            withdrawButton.disabled = false
            if (isThereInsurance()) {
                currentBalance += currentInsurance
                balance.textContent = Number(balance.textContent) + Number(insuranceStake.textContent)
                currentInsurance = 0
                insuranceReqButton.classList.add('hide')
                insuranceContainer.classList.add('hide')
            } else {
                insuranceReqButton.classList.add('hide')
                insuranceContainer.classList.add('hide')
            }
        } else {
            alert('Error')
        }
    }
}

function cardValue(target) {
    switch (target.firstElementChild.textContent) {
        case 'K': case 'Q': case 'J': case '10':
            return 10
            break
        case 'A':
            return 11
            break
        default: return 0
    }
}

function dealerBlackjackIsPossible() {
    switch (dealerCards[0].firstElementChild.textContent) {
        case 'A': case 'K': case 'Q': case 'J': case '10':
            return true
            break
        default: false
    }
}

function blackjack() {
    if (cardValue(playerCards[0]) + cardValue(playerCards[1]) == 21) {
        if (dealerBlackjackIsPossible()) {
            assignCardCombination(dealerCards[1])
            countThePoints(dealerCards[1], dealerPoints)
            if (cardValue(dealerCards[0]) + cardValue(dealerCards[1]) === 21) {
                tie()
            } else winner()
        } else winner()
    }
}

function insurance() {
    if (dealerBlackjackIsPossible()) {
        insuranceReqButton.classList.remove('hide')
    }
}

insuranceReqButton.addEventListener('click', () => {
    disableHitButton()
    disableStandButton()
    insuranceReqButton.classList.add('hide')
    insuranceInputContainer.classList.remove('hide')
})

insuranceButton.addEventListener('click', () => {
    currentInsurance = Number(insuranceField.value)
    if (insuranceIsValid(currentStake, currentInsurance)) {
        insuranceInputContainer.classList.add('hide')
        insuranceContainer.classList.remove('hide')
        insuranceStake.textContent = currentInsurance
        currentBalance -= currentInsurance
        balance.textContent = Number(balance.textContent) - Number(insuranceStake.textContent)
        hitButton.disabled = false
        standButton.disabled = false
    } else{
        alert('Error')
    }
})

function insuranceIsValid(bet, insurance) {
    if (check()) {
        if (insurance*2 <= bet
            && insurance >= 0
            && insurance <= currentBalance
            && Number.isInteger(insurance)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function isThereInsurance() {
    if (Number(insuranceStake.textContent) > 0
    && check()
    && insuranceIsValid(currentStake, currentInsurance)) {
        return true
    } else {
        return false
    }
}


restartButton.addEventListener('click', () => {
    for (i = 0; i < playerCards.length; i++) {
        playerCards[i].firstElementChild.textContent = ``
        playerCards[i].firstElementChild.nextElementSibling.textContent = ``
        dealerCards[i].firstElementChild.textContent = ``
        dealerCards[i].firstElementChild.nextElementSibling.textContent = ``
    }

    playerPoints.textContent = `0`
    dealerPoints.textContent = `0`

    winScreen.classList.add('hide')
    loseScreen.classList.add('hide')
    tieScreen.classList.add('hide')
    hitButton.disabled = false
    standButton.disabled = false
    
    uncolor()
    betWindow.classList.remove('hide')
    restartButton.disabled = true
})

function uncolor() {
    for (i = 0; i < playerCards.length; i++) {
        playerCards[i].firstElementChild.nextElementSibling.classList.remove('redColor')
        dealerCards[i].firstElementChild.nextElementSibling.classList.remove('redColor')
    }
}

withdrawButton.addEventListener('click', () => {
    //Pervedimas į banką
    location.reload()
    return false
})