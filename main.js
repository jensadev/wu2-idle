import "./style.css"

const createGameElement = (type, className) => {
  const element = document.createElement(type)
  element.classList.add(className)
  return element
}

const createUnitCard = (unit) => {
  const card = createGameElement("div", "card")
  const title = createGameElement("h2", "title")
  title.textContent = unit.name
  card.appendChild(title)
  const image = createGameElement("img", "image")
  image.src = unit.image
  card.appendChild(image)
  const health = createGameElement("div", "health")
  health.textContent = unit.health
  card.appendChild(health)
  return card
}

const app = document.querySelector("#app")
const gameGrid = createGameElement("main", "grid")
gameGrid.dataset.layout = "50-50"
app.appendChild(gameGrid)
const leftColumn = createGameElement("div", "column")
gameGrid.appendChild(leftColumn)
const rightColumn = createGameElement("div", "column")
rightColumn.classList.add("column")
gameGrid.appendChild(rightColumn)

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const playerStats = {
  name: "Player",
  image: "https://via.placeholder.com/150",
  health: 100,
  attack: {
    damage: {
      min: 2,
      max: 4,
    },
    speed: 1000,
    last: 0,
  }
}
const enemyStats = {
  name: "Enemy",
  image: "https://via.placeholder.com/150",
  health: 100,
  attack: {
    damage: {
      min: 2,
      max: 4,
    },
    speed: 1000,
    last: 0,
  }
}
const player = createUnitCard(playerStats)
leftColumn.appendChild(player)

const enemy = createUnitCard(enemyStats)
rightColumn.appendChild(enemy)

const attackButton = document.createElement("button")
attackButton.textContent = "Attack"
attackButton.id = "attack"
leftColumn.appendChild(attackButton)

attackButton.addEventListener("click", () => {
  const damage = randInt(playerStats.attack.damage.min, playerStats.attack.damage.max)
  attackAnimation(enemy, damage)
  enemyStats.health -= damage
  enemy.querySelector(".health").textContent = enemyStats.health
})

const attackAnimation = (element, damage) => {
  element.classList.add("attacked")
  const hit = createGameElement("div", "hit")
  hit.textContent = damage
  element.appendChild(hit)
  setTimeout(() => {
    hit.remove()
  }, 300)
  setTimeout(() => {
    element.classList.remove("attacked")
  }, 100)
}


let lastTimestamp = 0
let idleInterval = 1000
const step = (timestamp) => {
  // if (timestamp - lastTimestamp >= idleInterval) {
  //   lastTimestamp = timestamp
  // }

  if (timestamp - playerStats.attack.last >= playerStats.attack.speed ) {
    console.log("player smash enemy")
    const damage = randInt(playerStats.attack.damage.min, playerStats.attack.damage.max)
    attackAnimation(enemy, damage)
    enemyStats.health -= damage
    enemy.querySelector(".health").textContent = enemyStats.health
    playerStats.attack.last = timestamp
  }
  if (timestamp - enemyStats.attack.last >= enemyStats.attack.speed ) {
    console.log("enemy smash player")
    const damage = randInt(enemyStats.attack.damage.min, enemyStats.attack.damage.max)
    attackAnimation(player, damage)
    playerStats.health -= damage
    player.querySelector(".health").textContent = playerStats.health
    enemyStats.attack.last = timestamp
  }
  lastTimestamp = timestamp

  requestAnimationFrame(step)
}

requestAnimationFrame(step)
