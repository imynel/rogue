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

    createRoom(countRoom)
    createTunnel(tunnelW, tunnelH)
    addSwordPotion()
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

function createTunnel(countW, countH) { // генерация туннелей
    for(let i = 0; i < countW; i++) { // туннели по вертикали
        let randomY = Math.floor(Math.random() * 40)
        for(let j = 0; j < area[0].length; j++) {
            area[randomY][j].className = 'tile'
        }
        
    }

    for(let i = 0; i < countH; i++) { // туннели по горризонтали
        let randomX = Math.floor(Math.random() * 24)
        for(let j = 0; j < area.length; j++) {
            area[j][randomX].className = 'tile'
        }
    }
}

function addSwordPotion() { // генерация мечей и делей
    for(let i = 0; i < 2; i++) {
        additem(true)
    }
    for(let i = 0; i < 10; i++) {
        additem(false)
    }

    function additem(bool) {
        for(;;) {
            let randomX = Math.floor(Math.random() * 24)
            let randomY = Math.floor(Math.random() * 40)
            if(area[randomY][randomX].className === 'tile') {
                console.log(area[randomY][randomX])
                bool ? area[randomY][randomX].className = 'tile tileSW' : area[randomY][randomX].className = 'tile tileHP'
                break
            }
        }
        
    }
}

createArea(area)