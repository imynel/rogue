// var game=new Game();
// game.init();
const widthArea = 40
const heightArea = 24

const element = document.querySelector('.field') // Игровое поле

const area = new Array(40)
for(let i = 0; i < area.length; i++) {
    area[i] = new Array(24)
}

function createArea(map) {
    const countRoom = Math.floor(Math.random() * 6 + 5) // сколько комнат
    const tunnelW = Math.floor(Math.random() * 3 + 3) // сколько туннелей по горризонтали
    const tunnelH = Math.floor(Math.random() * 3 + 3) // сколько туннелей по вертикале

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
        let sizeRoomW = Math.floor(Math.random() * 6 + 3)
        let sizeRoomH = Math.floor(Math.random() * 6 + 3)
    
        let randomX = Math.floor(Math.random() * (41 - sizeRoomW))
        let randomY = Math.floor(Math.random() * (25 - sizeRoomH))
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
                    area[randomX][randomY].dataset.damade = 25
                    break    

                case 'enemy': 
                    const healthEnemy = document.createElement('div')
                    healthEnemy.className='health'
                    healthEnemy.style.width = '100%'
                    area[randomX][randomY].className = 'tile tileE'
                    area[randomX][randomY].append(healthEnemy)
                    area[randomX][randomY].dataset.health = 100
                    area[randomX][randomY].dataset.damade = 20
                    break
                default: 
                    break
            }
            break
        }
    }
    
}

function randomNum(num) {
    return Math.floor(Math.random() * num)
}
createArea(area)

function movement(letter) {
    let hero = document.querySelector('.tileP')
    let health = hero.querySelector('.health')
    switch(letter) {
        case 'w':
        case 'ц':
            // if(hero.dataset.y - 1 >= 0 && area[hero.dataset.x][hero.dataset.y - 1].className === 'tile tileSW') {
            //     area[hero.dataset.x][hero.dataset.y - 1].className = 'tile'
            //     area[hero.dataset.x][hero.dataset.y - 1].damade = hero.dataset.damade + 50
            // }
            if(hero.dataset.y - 1 >= 0 && area[hero.dataset.x][hero.dataset.y - 1].className === 'tile') { // Проверка на границу и стены
                // debugger
                hero.className = 'tile'
                health.remove() // удаление полоски здоровья
                
                
                hero.dataset.y = Number(hero.dataset.y) - 1 
                area[hero.dataset.x][hero.dataset.y].className = 'tile tileP'
                area[hero.dataset.x][hero.dataset.y].append(health) // добавление полоски здоровья
                area[hero.dataset.x][hero.dataset.y].dataset.x = hero.dataset.x
                area[hero.dataset.x][hero.dataset.y].dataset.y = hero.dataset.y
                area[hero.dataset.x][hero.dataset.y].dataset.health = hero.dataset.health
                area[hero.dataset.x][hero.dataset.y].dataset.damade = hero.dataset.damade
                
            }
            break

        case 'a':
        case 'ф':
            if(Number(hero.dataset.x) - 1 >= 0 && area[Number(hero.dataset.x) - 1][hero.dataset.y].className === 'tile') {// Проверка на границу и стены
                hero.className = 'tile'
                health.remove()
                hero.dataset.x = Number(hero.dataset.x) - 1
                area[hero.dataset.x][hero.dataset.y].className = 'tile tileP'
                area[hero.dataset.x][hero.dataset.y].append(health)
                area[hero.dataset.x][hero.dataset.y].dataset.x = hero.dataset.x
                area[hero.dataset.x][hero.dataset.y].dataset.y = hero.dataset.y
                area[hero.dataset.x][hero.dataset.y].dataset.health = 100
            }
            break
            break

        case 'd':
        case 'в':
            if(Number(hero.dataset.x) + 1 < 40 && area[Number(hero.dataset.x) + 1][hero.dataset.y].className === 'tile') {// Проверка на границу и стены
                hero.className = 'tile'
                health.remove()
                hero.dataset.x = Number(hero.dataset.x) + 1
                area[hero.dataset.x][hero.dataset.y].className = 'tile tileP'
                area[hero.dataset.x][hero.dataset.y].append(health)
                area[hero.dataset.x][hero.dataset.y].dataset.x = hero.dataset.x
                area[hero.dataset.x][hero.dataset.y].dataset.y = hero.dataset.y
                area[hero.dataset.x][hero.dataset.y].dataset.health = 100
            }
            break

        case 's':
        case 'ы':
            if(Number(hero.dataset.y) + 1 < 24 && area[hero.dataset.x][Number(hero.dataset.y) + 1].className === 'tile') {// Проверка на границу и стены
                hero.className = 'tile'
                health.remove()
                hero.dataset.y = Number(hero.dataset.y) + 1
                area[hero.dataset.x][hero.dataset.y].className = 'tile tileP'
                area[hero.dataset.x][hero.dataset.y].append(health)
                area[hero.dataset.x][hero.dataset.y].dataset.x = hero.dataset.x
                area[hero.dataset.x][hero.dataset.y].dataset.y = hero.dataset.y
                area[hero.dataset.x][hero.dataset.y].dataset.health = 100
            }
            break

        case ' ':
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    if(area[Number(hero.dataset.x) - 1 + j][Number(hero.dataset.y) - 1 + i].className === 'tile tileE') {
                        area[Number(hero.dataset.x) - 1 + j][Number(hero.dataset.y) - 1 + i].className = 'tile'       
                    }
                }
            }
        break

        default: 
            break
    }
}

document.addEventListener('keyup', (event) => movement(event.key.toLowerCase()))

