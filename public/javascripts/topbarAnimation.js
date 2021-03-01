let winningAnimationContainer = document.querySelector('[data-winning-animation]')
let gameOutcome
let outcomeAmount
const timer = ms => new Promise(res => setTimeout(res, ms))

async function winningAnimation() {
  winningAnimationContainer.classList.remove('moneyLost')
  winningAnimationContainer.classList.remove('moneyWon')
  winningAnimationContainer.classList.remove('moneyReturned')
  winningAnimationContainer.style.top = `5vw`
  winningAnimationContainer.style.opacity = `1`
  if (gameOutcome == 'win') {
    winningAnimationContainer.classList.remove('hide')
    winningAnimationContainer.classList.add('moneyWon')
    winningAnimationContainer.textContent = `+${outcomeAmount}`
    winningAnimationContainer.innerHTML += '<img src=/images/topbar/moneta.svg height="30px" width="30px">'
  } else if (gameOutcome == 'lose') {
    winningAnimationContainer.classList.remove('hide')
    winningAnimationContainer.classList.add('moneyLost')
    winningAnimationContainer.textContent = `${outcomeAmount}`
    winningAnimationContainer.innerHTML += '<img src=/images/topbar/moneta.svg height="30px" width="30px">'
  } else if (gameOutcome == 'draw') {
    winningAnimationContainer.classList.remove('hide')
    winningAnimationContainer.classList.add('moneyReturned')
    winningAnimationContainer.textContent = `+${outcomeAmount}`
    winningAnimationContainer.innerHTML += '<img src=/images/topbar/moneta.svg height="30px" width="30px">'
  }
  await timer(1500)
  easeOut()
}

async function easeOut() {
  for (i = 0; i < 50; i++) {
    winningAnimationContainer.style.top = `${5-0.05*i}vw`
    winningAnimationContainer.style.opacity = `${1-0.02*i}`
    await timer(2)
    if (i == 49) {
      winningAnimationContainer.classList.add('hide')
    }
  }
}