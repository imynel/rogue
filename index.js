// var game=new Game();
// game.init();
const widthArea = 40
const heightArea = 24

const element = document.querySelector('.field') // Игровое поле

const area = new Array(widthArea)
for(let i = 0; i < area.length; i++) {
    area[i] = new Array(heightArea)
}

function createArea(map) {
    const countRoom = randomNum(11, 5) // сколько комнат
    const tunnelW = randomNum(6, 3) // сколько туннелей по горризонтали
    const tunnelH = randomNum(6, 3) // сколько туннелей по вертикале

    map.forEach((row, indexW) => { // вывод арены
        for(let indexH = 0; indexH < row.length; indexH++) {
            let tile = document.createElement('div')
            tile.style.left = `${30 * indexW}px`
            tile.style.top = `${30 * indexH}px`
            tile.className = 'tile tileW'
            area[indexW][indexH] = tile
            element.append(tile)
        }
    })

    // createTunnel(tunnelW, 40)
    // createTunnel(tunnelH, 24)
    createRoom(countRoom)
    createTunnel(tunnelW, tunnelH)

    addAll()
}

function createRoom(count) { // генерация комнат 
    for(let i = 0; i < count; i++) { 
        let sizeRoomW = randomNum(9, 3) // ширина комнаты
        let sizeRoomH = randomNum(9, 3) // высота комнаты
    
        let randomX = randomNum(41 - sizeRoomW) // случайное расположение комнаты
        let randomY = randomNum(25 - sizeRoomH)
        for(let k = 0; k < sizeRoomW; k++) {
            for(let l = 0; l < sizeRoomH; l++) {
                area[randomX + k][randomY + l].className = 'tile' 
            }
        }
    }
} 

function createTunnel(verticalCount, horizontalCount) {
    let vertical = verticalCount
    while(vertical > 0) {
        let randomY = randomNum(40)
        if(area[randomY][randomNum(24)].className === 'tile') continue
        else vertical--
        for(let j = 0; j < area[0].length; j++) {
            area[randomY][j].className = 'tile'
        }
    }

    let horizontal = horizontalCount
    while(horizontal > 0) {
        let randomX = randomNum(24)
        if(area[randomNum(40)][randomX].className === 'tile') continue 
        else horizontal--
        for(let j = 0; j < area.length; j++) {
          area[j][randomX].className = 'tile'
        }
    }
}

function addAll() { // генерация предметов и юнитов
    for(let i = 0; i < 2; i++) {
        additem('sword')
    }

    additem('hero')

    for(let i = 0; i < 10; i++) {
        additem('potion')
        additem('enemy')
    }
}

function additem(item) { // функция создания предметов и юнитов 
    for(;;) {
        let randomX = randomNum(40)
        let randomY = randomNum(24)
        if(area[randomX][randomY].className === 'tile') {
            switch(item) {
                case 'sword': 
                    area[randomX][randomY].className = 'tile tileSW'
                    break

                case 'potion': 
                    area[randomX][randomY].className = 'tile tileHP'
                    break

                case 'hero': 
                    const health = document.createElement('div')
                    health.className='health'
                    health.style.width = '100%'  
                    area[randomX][randomY].className = 'tile tileP'
                    area[randomX][randomY].append(health)
                    area[randomX][randomY].dataset.x = randomX
                    area[randomX][randomY].dataset.y = randomY
                    area[randomX][randomY].dataset.health = 100
                    area[randomX][randomY].dataset.damage = 25
                    break    

                case 'enemy': 
                    const healthEnemy = document.createElement('div')
                    healthEnemy.className='health'
                    healthEnemy.style.width = '100%'
                    area[randomX][randomY].className = 'tile tileE'
                    area[randomX][randomY].append(healthEnemy)
                    area[randomX][randomY].dataset.x = randomX
                    area[randomX][randomY].dataset.y = randomY
                    area[randomX][randomY].dataset.health = 100
                    area[randomX][randomY].dataset.damage = 20
                    break
                default: 
                    break
            }
            break
        }
    }
    
}

function randomNum(max, min = 0) { 
    return Math.floor(Math.random() * (max - min) + min)
}

function movement(letter) { // функция, отвечает за передвижение героя
    let hero = document.querySelector('.tileP')
    let health = hero.querySelector('.health')
    let inventory = document.querySelector('.inventory')

    function oneZone(x = 0, y = 0) {
        return area[Number(hero.dataset.x) + x][Number(hero.dataset.y) + y]
    }

    function movementEnemy() { // функция атаки и передвиженеи героя
        const allEnemy = element.querySelectorAll('.tileE')
        allEnemy.forEach((enemy, index) => {
            let kick = false // флаг на удар по персонажу

            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    if((Number(enemy.dataset.x) - 1 + i >= 0 && Number(enemy.dataset.x) - 1 + i < 40 ) && (Number(enemy.dataset.y) - 1 + j >= 0 && Number(enemy.dataset.y) - 1 + j < 24) && area[Number(enemy.dataset.x) - 1 + i][Number(enemy.dataset.y) - 1 + j].className === 'tile tileP') { // Поиск у каждго врага вокруг себя на наличие героя
                        let cuHero = area[Number(enemy.dataset.x) - 1 + i][Number(enemy.dataset.y) - 1 + j]
                        cuHero.dataset.health -= enemy.dataset.damage // наносим урон по герою
                        cuHero.querySelector('.health').style.width = `${cuHero.dataset.health}%` // меняем полоску здоровья
                        kick = true // удар был
                        if(cuHero.dataset.health <= 0) {
                            cuHero.querySelector('.health').remove()
                            cuHero.className = 'tile' 
                            location.reload() // перезапускаем страничку после поражения 
                        }
                    } 
                }
            }
            if(!kick) { // если удар был => не передвигается
                switch(randomNum(4).toString()) { // случайное число указывающее в какое направление случайно двигаться
                    case '0': // вверх
                        if(enemy.dataset.y - 1 >= 0 && area[enemy.dataset.x][Number(enemy.dataset.y) - 1].className === 'tile') {
                            enemy.className = 'tile'
                            enemy.querySelector('.health').remove() // удаление полоски здоровья
                            enemy.dataset.y = Number(enemy.dataset.y) - 1 
                            area[enemy.dataset.x][enemy.dataset.y].className = 'tile tileE'
                            let enemyHealth = document.createElement('div')
                            enemyHealth.className = 'health'
                            enemyHealth.style.width = `${enemy.dataset.health}%` 
                            area[enemy.dataset.x][enemy.dataset.y].append(enemyHealth) // добавление полоски здоровья
                            area[enemy.dataset.x][enemy.dataset.y].dataset.x = enemy.dataset.x
                            area[enemy.dataset.x][enemy.dataset.y].dataset.y = enemy.dataset.y
                            area[enemy.dataset.x][enemy.dataset.y].dataset.health = enemy.dataset.health
                            area[enemy.dataset.x][enemy.dataset.y].dataset.damage = enemy.dataset.damage
                            
                        }
                        break

                    case '1': // направо
                        if(Number(enemy.dataset.x) + 1 < 40 && area[Number(enemy.dataset.x) + 1][enemy.dataset.y].className === 'tile') {
                            enemy.className = 'tile'
                            enemy.querySelector('.health').remove() // удаление полоски здоровья
                            enemy.dataset.x = Number(enemy.dataset.x) + 1 
                            area[enemy.dataset.x][enemy.dataset.y].className = 'tile tileE'
                            let enemyHealth = document.createElement('div')
                            enemyHealth.className = 'health'
                            enemyHealth.style.width = `${enemy.dataset.health}%` 
                            area[enemy.dataset.x][enemy.dataset.y].append(enemyHealth) // добавление полоски здоровья
                            area[enemy.dataset.x][enemy.dataset.y].dataset.x = enemy.dataset.x
                            area[enemy.dataset.x][enemy.dataset.y].dataset.y = enemy.dataset.y
                            area[enemy.dataset.x][enemy.dataset.y].dataset.health = enemy.dataset.health
                            area[enemy.dataset.x][enemy.dataset.y].dataset.damage = enemy.dataset.damage
                            
                        }
                        break

                    case '2': // вниз
                        if(Number(enemy.dataset.y) + 1 < 24 && area[enemy.dataset.x][Number(enemy.dataset.y) + 1].className === 'tile') {
                            enemy.className = 'tile'
                            enemy.querySelector('.health').remove() // удаление полоски здоровья
                            enemy.dataset.y = Number(enemy.dataset.y) + 1 
                            area[enemy.dataset.x][enemy.dataset.y].className = 'tile tileE'
                            let enemyHealth = document.createElement('div')
                            enemyHealth.className = 'health'
                            enemyHealth.style.width = `${enemy.dataset.health}%` 
                            area[enemy.dataset.x][enemy.dataset.y].append(enemyHealth) // добавление полоски здоровья
                            area[enemy.dataset.x][enemy.dataset.y].dataset.x = enemy.dataset.x
                            area[enemy.dataset.x][enemy.dataset.y].dataset.y = enemy.dataset.y
                            area[enemy.dataset.x][enemy.dataset.y].dataset.health = enemy.dataset.health
                            area[enemy.dataset.x][enemy.dataset.y].dataset.damage = enemy.dataset.damage
                        }
                        break

                    case '3': // налево
                        if(enemy.dataset.x - 1 >= 0 && area[Number(enemy.dataset.x) - 1][enemy.dataset.y].className === 'tile') {
                            enemy.className = 'tile'
                            enemy.querySelector('.health').remove() // удаление полоски здоровья
                            enemy.dataset.x = Number(enemy.dataset.x) - 1 
                            area[enemy.dataset.x][enemy.dataset.y].className = 'tile tileE'
                            let enemyHealth = document.createElement('div')
                            enemyHealth.className = 'health'
                            enemyHealth.style.width = `${enemy.dataset.health}%` 
                            area[enemy.dataset.x][enemy.dataset.y].append(enemyHealth) // добавление полоски здоровья
                            area[enemy.dataset.x][enemy.dataset.y].dataset.x = enemy.dataset.x
                            area[enemy.dataset.x][enemy.dataset.y].dataset.y = enemy.dataset.y
                            area[enemy.dataset.x][enemy.dataset.y].dataset.health = enemy.dataset.health
                            area[enemy.dataset.x][enemy.dataset.y].dataset.damage = enemy.dataset.damage
                        }
                        break
                }
            }    
        })
        
    }

    switch(letter) {
        case 'w':
        case 'ц':
            if(hero.dataset.y - 1 >= 0 && oneZone(0, -1).className === 'tile tileHP') { // если наступил на зелье
                oneZone(0, -1).className = 'tile'
                hero.dataset.health = 100 // восполняем здоровье героя 
                hero.querySelector('.health').style.width = `${hero.dataset.health}%`
            }

            if(hero.dataset.y - 1 >= 0 && oneZone(0, -1).className === 'tile tileSW') { // если наступил на меч
                oneZone(0, -1).className = 'tile'
                hero.dataset.damage *= 2 // увеличиваем урон героя в два раза
                const sword = document.createElement('div') // создаем меч
                sword.className = 'tileSW'
                inventory.append(sword) // добавляем меч в инвентарь
            }

            if(hero.dataset.y - 1 >= 0 && area[hero.dataset.x][Number(hero.dataset.y) - 1].className === 'tile') { // Проверка на границу и стены
                hero.className = 'tile'
                health.remove() // удаление полоски здоровья
                hero.dataset.y = Number(hero.dataset.y) - 1 
                oneZone().className = 'tile tileP'
                oneZone().append(health) // добавление полоски здоровья
                oneZone().dataset.x = hero.dataset.x
                oneZone().dataset.y = hero.dataset.y
                oneZone().dataset.health = hero.dataset.health
                oneZone().dataset.damage = hero.dataset.damage        
            }
            movementEnemy()
            break

        case 'a':
        case 'ф':
            if(hero.dataset.x - 1 >= 0 && oneZone(-1, 0).className === 'tile tileHP') { // если наступил на зелье
                oneZone(-1, 0).className = 'tile'
                hero.dataset.health = 100 // восполняем здоровье героя 
                hero.querySelector('.health').style.width = `${hero.dataset.health}%`
            }

            if(hero.dataset.x - 1 >= 0 && oneZone(-1, 0).className === 'tile tileSW') { // если наступил на меч
                oneZone(-1, 0).className = 'tile' // убираем меч с карты
                hero.dataset.damage *= 2 // увеличиваем урон героя в два раза
                const sword = document.createElement('div') // создаем меч
                sword.className = 'tileSW'
                inventory.append(sword) // добавляем меч в инвентарь
            }

            if(Number(hero.dataset.x) - 1 >= 0 && area[Number(hero.dataset.x) - 1][hero.dataset.y].className === 'tile') {// Проверка на границу и стены
                hero.className = 'tile'
                health.remove()
                hero.dataset.x = Number(hero.dataset.x) - 1
                oneZone().className = 'tile tileP'
                oneZone().append(health)
                oneZone().dataset.x = hero.dataset.x
                oneZone().dataset.y = hero.dataset.y
                oneZone().dataset.health = hero.dataset.health
                oneZone().dataset.damage = hero.dataset.damage
            }
            movementEnemy()
            break

        case 'd':
        case 'в':
            if(Number(hero.dataset.x) + 1 < 40 && oneZone(1, 0).className === 'tile tileHP') { // если наступил на зелье
                oneZone(1, 0).className = 'tile'
                hero.dataset.health = 100 // восполняем здоровье героя 
                hero.querySelector('.health').style.width = `${hero.dataset.health}%`
            }

            if(Number(hero.dataset.x) + 1 < 40 && oneZone(1, 0).className === 'tile tileSW') { // если наступил на меч
                oneZone(1, 0).className = 'tile' // убираем меч с карты
                hero.dataset.damage *= 2 // увеличиваем урон героя в два раза
                const sword = document.createElement('div') // создаем меч
                sword.className = 'tileSW'
                inventory.append(sword) // добавляем меч в инвентарь
            }

            if(Number(hero.dataset.x) + 1 < 40 && oneZone(1, 0).className === 'tile') {// Проверка на границу и стены
                hero.className = 'tile'
                health.remove()
                hero.dataset.x = Number(hero.dataset.x) + 1
                oneZone().className = 'tile tileP'
                oneZone().append(health)
                oneZone().dataset.x = hero.dataset.x
                oneZone().dataset.y = hero.dataset.y
                oneZone().dataset.health = hero.dataset.health
                oneZone().dataset.damage = hero.dataset.damage
            }
            movementEnemy()
            break

        case 's':
        case 'ы':
            if(Number(hero.dataset.y) + 1 < 24 && oneZone(0, 1).className === 'tile tileHP') { // если наступил на зелье
                oneZone(0, 1).className = 'tile'
                hero.dataset.health = 100 // восполняем здоровье героя 
                hero.querySelector('.health').style.width = `${hero.dataset.health}%`
            }

            if(Number(hero.dataset.y) + 1 < 24 && oneZone(0, 1).className === 'tile tileSW') { // если наступил на меч
                oneZone(0, 1).className = 'tile' // убираем меч с карты
                hero.dataset.damage *= 2 // увеличиваем урон героя в два раза
                const sword = document.createElement('div') // создаем меч
                sword.className = 'tileSW'
                inventory.append(sword) // добавляем меч в инвентарь
            }

            if(Number(hero.dataset.y) + 1 < 24 && oneZone(0, 1).className === 'tile') {// Проверка на границу и стены
                hero.className = 'tile'
                health.remove()
                hero.dataset.y = Number(hero.dataset.y) + 1
                oneZone().className = 'tile tileP'
                oneZone().append(health)
                oneZone().dataset.x = hero.dataset.x
                oneZone().dataset.y = hero.dataset.y
                oneZone().dataset.health = hero.dataset.health
                oneZone().dataset.damage = hero.dataset.damage
            }
            movementEnemy()
            break

        case ' ': // Атака на пробел
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    console.log()
                    if((Number(hero.dataset.x) - 1 + i >= 0 && Number(hero.dataset.x) - 1 + i < 40) && (Number(hero.dataset.y) - 1 + j >= 0 && Number(hero.dataset.y) - 1 + j < 24) && area[Number(hero.dataset.x) - 1 + i][Number(hero.dataset.y) - 1 + j].className === 'tile tileE') { // поиск врага вокруг себя
                        const enemy = area[Number(hero.dataset.x) - 1 + i][Number(hero.dataset.y) - 1 + j] 

                        enemy.dataset.health -= hero.dataset.damage // отнимаем хп врагу
                        enemy.querySelector('.health').style.width = `${enemy.dataset.health}%` // убавляем полоску хп
                        
                        if(enemy.dataset.health <= 0) { // если здоровье врага падает ниже 0, он умирает и пропадает
                            enemy.querySelector('.health').remove() // убираем полоску
                            enemy.className = 'tile' // убираем иконку
                        }
                    }
                }
            }

            movementEnemy()
            break

        // default: 
        //     break
    }
}

createArea(area)
document.addEventListener('keyup', (event) => movement(event.key.toLowerCase()))

