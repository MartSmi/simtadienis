let pacman = document.querySelector('[data-pacman]')
let tetris = document.querySelector('[data-tetris]')
let snake = document.querySelector('[data-snake]')
let roulette = document.querySelector('[data-roulette]')
let slots = document.querySelector('[data-slots]')
let blackjack = document.querySelector('[data-blackjack]')
let bank = document.querySelector('[data-bank]')

pacman.addEventListener('mouseover', () => {
    pacman.src = '/images/game-map/pacman-h.svg'
})
pacman.addEventListener('mouseleave', () => {
    pacman.src = '/images/game-map/pacman.svg'
})

tetris.addEventListener('mouseover', () => {
    tetris.src = '/images/game-map/tetris-h.svg'
})
tetris.addEventListener('mouseleave', () => {
    tetris.src = '/images/game-map/tetris.svg'
})

snake.addEventListener('mouseover', () => {
    snake.src = '/images/game-map/snake-h.svg'
})
snake.addEventListener('mouseleave', () => {
    snake.src = '/images/game-map/snake.svg'
})

roulette.addEventListener('mouseover', () => {
    roulette.src = '/images/game-map/rulete-h.svg'
})
roulette.addEventListener('mouseleave', () => {
    roulette.src = '/images/game-map/rulete.svg'
})

slots.addEventListener('mouseover', () => {
    slots.src = '/images/game-map/slots-h.svg'
})
slots.addEventListener('mouseleave', () => {
    slots.src = '/images/game-map/slots.svg'
})

blackjack.addEventListener('mouseover', () => {
    blackjack.src = '/images/game-map/blackjack-h.svg'
})
blackjack.addEventListener('mouseleave', () => {
    blackjack.src = '/images/game-map/blackjack.svg'
})

bank.addEventListener('mouseover', () => {
    bank.src = '/images/game-map/bankas-h.svg'
})
bank.addEventListener('mouseleave', () => {
    bank.src = '/images/game-map/bankas.svg'
})