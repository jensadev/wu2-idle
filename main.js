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
  image: "https://c.tenor.com/KrDjEvI0oFsAAAAC/tenor.gif",
  health: 100,
  attack: {
    damage: {
      min: 2,
      max: 4,
    },
    idleSpeed: 1000,
    attackSpeed: 500,
    lastIdle: 0,
    lastActive: 0
  }
}
const enemyStats = {
  name: "Enemy",
  image: "https://c.tenor.com/UC10oty08kAAAAAC/tenor.gif",
  health: 100,
  attack: {
    damage: {
      min: 2,
      max: 4,
    },
    idleSpeed: 1000,
    lastIdle: 0,
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

const playerHistory = createGameElement("div", "history")
leftColumn.appendChild(playerHistory)
const enemyHistory = createGameElement("div", "history")
rightColumn.appendChild(enemyHistory)

const historyList = createGameElement("ul", "history-list")
playerHistory.appendChild(historyList)
enemyHistory.appendChild(historyList.cloneNode(true))

const addHistoryItem = (element, text) => {
  const historyItems = element.querySelectorAll(".history-item")
  if (historyItems.length >= 5) {
    historyItems[0].remove()
  }
  const li = createGameElement("li", "history-item")
  li.textContent = text
  element.appendChild(li)
}

attackButton.addEventListener("click", () => {
  const currentTime = Date.now();

  if (currentTime < playerStats.attack.lastActive + playerStats.attack.attackSpeed) {
    return; // Not ready to attack yet
  }

  playerStats.attack.lastActive = currentTime;

  const damage = randInt(playerStats.attack.damage.min, playerStats.attack.damage.max)
  attackAnimation(enemy, damage)
  enemyStats.health -= damage
  enemy.querySelector(".health").textContent = enemyStats.health
  addHistoryItem(playerHistory, `Player slashed for ${damage}`)
})

const attackAnimation = (element, damage) => {
  element.classList.add("attacked")
  const hitElement = createGameElement("div", "hit")
  hitElement.textContent = `-${damage}`
  // Randomize position using CSS variables
   hitElement.style.setProperty('--random-x', `${randInt(-40, 40)}px`)
   hitElement.style.setProperty('--random-y', `${randInt(-40, 40)}px`)
 
  element.appendChild(hitElement)
  setTimeout(() => {
    hitElement.remove()
  }, 500)
  setTimeout(() => {
    element.classList.remove("attacked")
  }, 50)
}


let lastTimestamp = 0
let idleInterval = 1000
const step = (timestamp) => {
  // if (timestamp - lastTimestamp >= idleInterval) {
  //   lastTimestamp = timestamp
  // }

  if (timestamp - playerStats.attack.lastIdle >= playerStats.attack.idleSpeed ) {
    const damage = randInt(playerStats.attack.damage.min, playerStats.attack.damage.max)
    attackAnimation(enemy, damage)
    enemyStats.health -= damage
    enemy.querySelector(".health").textContent = enemyStats.health
    playerStats.attack.lastIdle = timestamp
    addHistoryItem(playerHistory, `Player attacked for ${damage}`)
  }
  if (timestamp - enemyStats.attack.lastIdle >= enemyStats.attack.idleSpeed ) {
    const damage = randInt(enemyStats.attack.damage.min, enemyStats.attack.damage.max)
    attackAnimation(player, damage)
    playerStats.health -= damage
    player.querySelector(".health").textContent = playerStats.health
    enemyStats.attack.lastIdle = timestamp
    addHistoryItem(enemyHistory, `Enemy attacked for ${damage}`)
  }
  lastTimestamp = timestamp

  requestAnimationFrame(step)
}

requestAnimationFrame(step)
