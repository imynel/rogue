class Unit {
    constructor(name, x, y, damage, health) {
        this.name = name
        this.x = x
        this.y = y
        this.damage = damage
        this.health = health
    }

    updatePosition() {
        gameState.area[this.x][this.y].className = this.name
        this.updateHealth()
    }

    kick(unit) {
        unit.health -= this.damage
        unit.updateHealth()
        if (unit.health <= 0) {
            if (unit.name === tiles.hero) location.reload()
            gameState.area[unit.x][unit.y].className = 'tile'
            gameState.enemies = gameState.enemies.filter((element) => !(element.x === unit.x && element.y === unit.y))
        }

    }

    updateHealth() {
        const existingHealthbar = gameState.area[this.x][this.y].querySelector('.health')
        if (existingHealthbar) {
            existingHealthbar.remove()
        }

        const healthbar = document.createElement('div')
        healthbar.className = 'health'
        healthbar.style.width = `${this.health}%`
        gameState.area[this.x][this.y].append(healthbar)
    }
}
const gameState = {
    hero: null,
    widthArea: 40,
    heightArea: 24,
    area: [],
    enemies: [],
    items: {
        sword: {
            count: 2,
            dopDamage: 2, // множитель урона
        },
        potion: {
            count: 10,
            health: 100,
        }
    },
}
const tiles = {
    field: ".field",
    tile: "tile",
    wall: "tile tileW",
    hero: 'tile tileP',
    enemy: 'tile tileE',
    potion: 'tile tileHP',
    sword: "tile tileSW"
}
const element = document.querySelector(tiles.field) // Игровое поле

function createRoom(count) {
    let rooms = []; // массив для хранения координат комнат

    // Создаем комнаты и сохраняем их координаты
    for (let i = 0; i < count; i++) {
        let sizeRoomW = Math.floor(Math.random() * 6 + 3);
        let sizeRoomH = Math.floor(Math.random() * 6 + 3);
        let randomX = Math.floor(Math.random() * (41 - sizeRoomW));
        let randomY = Math.floor(Math.random() * (25 - sizeRoomH));

        // Создаем комнату
        for (let k = 0; k < sizeRoomW; k++) {
            for (let l = 0; l < sizeRoomH; l++) {
                gameState.area[randomX + k][randomY + l].className = 'tile';
            }
        }

        // Сохраняем центр комнаты
        rooms.push({
            x: randomX + Math.floor(sizeRoomW / 2),
            y: randomY + Math.floor(sizeRoomH / 2)
        });
    }

    // Соединяем каждую комнату с следующей коридором
    for (let i = 0; i < rooms.length - 1; i++) {
        connectRooms(rooms[i], rooms[i + 1]);
    }
}

function connectRooms(room1, room2) {
    let x = room1.x;
    let y = room1.y;

    // Сначала идем по X
    while (x !== room2.x) {
        gameState.area[x][y].className = 'tile';
        x += x < room2.x ? 1 : -1;
    }

    // Затем идем по Y
    while (y !== room2.y) {
        gameState.area[x][y].className = 'tile';
        y += y < room2.y ? 1 : -1;
    }
}

function createTunnel(verticalCount, horizontalCount) {
    let vertical = verticalCount
    while (vertical > 0) {
        let randomY = randomNum(40)
        if (gameState.area[randomY][randomNum(24)].className === 'tile') continue
        else vertical--
        for (let j = 0; j < gameState.area[0].length; j++) {
            gameState.area[randomY][j].className = 'tile'
        }
    }

    let horizontal = horizontalCount
    while (horizontal > 0) {
        let randomX = randomNum(24)
        if (gameState.area[randomNum(40)][randomX].className === 'tile') continue
        else horizontal--
        for (let j = 0; j < gameState.area.length; j++) {
            gameState.area[j][randomX].className = 'tile'
        }
    }
}

function randomNum(num) {
    return Math.floor(Math.random() * num)
}

function createArea(map) {
    gameState.area = Array(gameState.widthArea).fill().map(() => Array(gameState.heightArea).fill(null))

    for (let indexW = 0; indexW < gameState.widthArea; indexW++) {
        for (let indexH = 0; indexH < gameState.heightArea; indexH++) {
            let tile = document.createElement('div')
            tile.style.left = `${30 * indexW}px`
            tile.style.top = `${30 * indexH}px`
            tile.className = tiles.wall
            gameState.area[indexW][indexH] = tile
            element.append(tile)
        }
    }

    const countRoom = Math.floor(Math.random() * 6 + 5) // сколько комнат
    const tunnelW = Math.floor(Math.random() * 3 + 3) // сколько туннелей по горризонтали
    const tunnelH = Math.floor(Math.random() * 3 + 3) // сколько туннелей по вертикале

    // createTunnel(tunnelW, 40)
    // createTunnel(tunnelH, 24)
    createRoom(countRoom)
    createTunnel(tunnelW, tunnelH)

    // addAll()
    for (let i = 0; i < gameState.items.sword.count; i++) {
        additem('sword')
    }

    for (let i = 0; i < gameState.items.potion.count; i++) {
        additem('potion')
    }

    additem('hero')

    for (let i = 0; i < 10; i++) {
        additem('enemy')
    }
}

function movement(unit, directionX = 0, directionY = 0) {
    gameState.area[unit.x][unit.y].querySelector('.health').remove() // удаление здоровья
    gameState.area[unit.x][unit.y].className = 'tile'
    directionX ? unit.x += directionX : unit.y += directionY
    unit.updatePosition()
}

function additem(item) { // функция создания предметов и юнитов 
    for (; ;) {
        let randomX = randomNum(40)
        let randomY = randomNum(24)
        if (gameState.area[randomX][randomY].className === 'tile') {
            switch (item) {
                case 'sword':
                    gameState.area[randomX][randomY].className = tiles.sword
                    break

                case 'potion':
                    gameState.area[randomX][randomY].className = tiles.potion
                    break

                case 'hero':
                    gameState.hero = new Unit(tiles.hero, randomX, randomY, 25, 100)
                    gameState.hero.updatePosition()
                    break

                case 'enemy':
                    gameState.enemies.push(new Unit(tiles.enemy, randomX, randomY, 20, 100))
                    gameState.enemies[gameState.enemies.length - 1].updatePosition()
                    break
                default:
                    break
            }
            break
        }
    }
}

function addItemInventory(field) {
    const item = document.createElement('div')
    item.className = field
    document.querySelector('.inventory').append(item)
}

function arrows(letter) {
    switch (letter) {
        case 'w':
        case 'ц':
            if (gameState.hero.y - 1 >= 0) {
                if (gameState.area[gameState.hero.x][gameState.hero.y - 1].className === 'tile') {
                    movement(gameState.hero, 0, -1)
                } else if (gameState.area[gameState.hero.x][gameState.hero.y - 1].className === tiles.potion) {
                    gameState.hero.health = gameState.items.potion.health
                    movement(gameState.hero, 0, -1)
                } else if (gameState.area[gameState.hero.x][gameState.hero.y - 1].className === tiles.sword) {
                    gameState.hero.damage *= gameState.items.sword.dopDamage
                    movement(gameState.hero, 0, -1)
                    addItemInventory('tileSW')
                }
            }

            movementEnemies()
            break

        case 'a':
        case 'ф':
            if (gameState.hero.x - 1 >= 0) {
                if (gameState.area[gameState.hero.x - 1][gameState.hero.y].className === 'tile') {
                    movement(gameState.hero, -1, 0)
                } else if (gameState.area[gameState.hero.x - 1][gameState.hero.y].className === tiles.potion) {
                    gameState.hero.health = gameState.items.potion.health
                    movement(gameState.hero, -1, 0)
                } else if (gameState.area[gameState.hero.x - 1][gameState.hero.y].className === tiles.sword) {
                    gameState.hero.damage *= gameState.items.sword.dopDamage
                    movement(gameState.hero, -1, 0)
                    addItemInventory('tileSW')
                }
            }
            movementEnemies()
            break

        case 'd':
        case 'в':
            if (gameState.hero.x + 1 < 40) {
                if (gameState.area[gameState.hero.x + 1][gameState.hero.y].className === 'tile') {
                    movement(gameState.hero, 1, 0)
                } else if (gameState.area[gameState.hero.x + 1][gameState.hero.y].className === tiles.potion) {
                    gameState.hero.health = gameState.items.potion.health
                    movement(gameState.hero, 1, 0)
                } else if (gameState.area[gameState.hero.x + 1][gameState.hero.y].className === tiles.sword) {
                    gameState.hero.damage *= gameState.items.sword.dopDamage
                    movement(gameState.hero, 1, 0)
                    addItemInventory('tileSW')
                }
            }
            movementEnemies()
            break

        case 's':
        case 'ы':
            if (gameState.hero.y + 1 < 24) {
                if (gameState.area[gameState.hero.x][gameState.hero.y + 1].className === 'tile') {
                    movement(gameState.hero, 0, 1)
                } else if (gameState.area[gameState.hero.x][gameState.hero.y + 1].className === tiles.potion) {
                    gameState.hero.health = gameState.items.potion.health
                    movement(gameState.hero, 0, 1)
                } else if (gameState.area[gameState.hero.x][gameState.hero.y + 1].className === tiles.sword) {
                    gameState.hero.damage *= gameState.items.sword.dopDamage
                    movement(gameState.hero, 0, 1)
                    addItemInventory('tileSW')
                }
            }
            movementEnemies()
            break

        case ' ':
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let currntEnemy = gameState.enemies.find((enemy) => enemy.x === gameState.hero.x - 1 + j && enemy.y === gameState.hero.y - 1 + i)
                    if (currntEnemy) gameState.hero.kick(currntEnemy)
                }
            }
            movementEnemies()
            break

        default:
            break
    }
}

function movementEnemies() {
    gameState.enemies.forEach((enemy) => {
        let kicked = false
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (enemy.x - 1 + j >= 0 && enemy.x - 1 + j < 40 && enemy.y - 1 + i >= 0 && enemy.y - 1 + i < 24) {
                    if (gameState.area[enemy.x - 1 + j][enemy.y - 1 + i].className === tiles.hero) {
                        enemy.kick(gameState.hero)
                        kicked = true
                        break
                    }
                }
            }
        }
        for (; !kicked;) {
            let randomDirection = randomNum(4)
            if (randomDirection === 0 && enemy.y - 1 >= 0 && gameState.area[enemy.x][enemy.y - 1].className === tiles.tile) {
                movement(enemy, 0, -1)
                break
            } else if (randomDirection === 1 && enemy.x + 1 < 40 && gameState.area[enemy.x + 1][enemy.y].className === tiles.tile) {
                movement(enemy, 1, 0)
                break
            } else if (randomDirection === 2 && enemy.y + 1 < 24 && gameState.area[enemy.x][enemy.y + 1].className === tiles.tile) {
                movement(enemy, 0, 1)
                break
            } else if (randomDirection === 3 && enemy.x - 1 >= 0 && gameState.area[enemy.x - 1][enemy.y].className === tiles.tile) {
                movement(enemy, -1, 0)
                break
            }
        }

    })
}

createArea(gameState.area)
document.addEventListener('keyup', (event) => arrows(event.key.toLowerCase()))
