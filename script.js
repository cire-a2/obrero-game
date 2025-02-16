const GRID_SIZE = 10;  // Tamaño del mapa (10x10)
const TILE_SIZE = 40;  // Tamaño de cada casilla en píxeles
const GAME_WIDTH = GRID_SIZE * TILE_SIZE;
const GAME_HEIGHT = GRID_SIZE * TILE_SIZE;

let player;
let bricksMatrix = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)); // Matriz de ladrillos
let cursors;

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: true }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png'); 
    this.load.image('player', 'assets/worker.png'); 
    this.load.image('brick', 'assets/brick.png'); 
}

function create() {
    console.log("Juego cargado"); 

    // 🛠 Arreglamos el fondo
    let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT); 

    // 🏗 Creación del jugador
    player = this.physics.add.sprite(5 * TILE_SIZE, 9 * TILE_SIZE, 'player');
    player.setScale(TILE_SIZE / player.width);
    player.setCollideWorldBounds(true);

    // 🎮 Controles (Izquierda y Derecha)
    cursors = this.input.keyboard.createCursorKeys();

    // ⬇ Generar ladrillos cada segundo
    this.time.addEvent({
        delay: 1500,
        callback: spawnBrick,
        callbackScope: this,
        loop: true
    });
}

function spawnBrick() {
    let col = Phaser.Math.Between(0, GRID_SIZE - 1); // Columna aleatoria
    let targetRow = findLowestEmptyRow(col); // Encuentra la fila más baja disponible

    if (targetRow !== -1) { 
        let brick = this.physics.add.sprite(col * TILE_SIZE, -TILE_SIZE, 'brick'); 
        brick.setScale(TILE_SIZE / brick.width);

        this.tweens.add({
            targets: brick,
            y: targetRow * TILE_SIZE,
            duration: 700, 
            ease: 'Linear',
            onComplete: () => {
                bricksMatrix[targetRow][col] = brick; 
                console.log(`Ladrillo aterrizó en fila ${targetRow}, columna ${col}`);
            }
        });
    }
}

function findLowestEmptyRow(col) {
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (!bricksMatrix[row][col]) return row;
    }
    return -1; // Columna llena
}

// 🚀 Función para mover al worker
function movePlayer(direction) {
    let currentCol = Math.round(player.x / TILE_SIZE);
    let newCol = currentCol + direction;
    let currentRow = Math.round(player.y / TILE_SIZE);

    if (newCol >= 0 && newCol < GRID_SIZE) {
        if (bricksMatrix[currentRow][newCol]) { 
            if (currentRow > 0 && !bricksMatrix[currentRow - 1][newCol]) {
                // Puede subir un ladrillo
                player.x = newCol * TILE_SIZE;
                player.y = (currentRow - 1) * TILE_SIZE;
            }
        } else {
            // Movimiento normal
            player.x = newCol * TILE_SIZE;
        }
    }
}

// ⬇ Aplica gravedad al worker
function applyGravity() {
    let col = Math.round(player.x / TILE_SIZE);
    let row = Math.round(player.y / TILE_SIZE);

    if (row < GRID_SIZE - 1 && !bricksMatrix[row + 1][col]) {
        player.y += TILE_SIZE; // Cae una casilla si no hay ladrillo debajo
    }
}

function update() {
    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        console.log("Jugador se movió a la izquierda");
        movePlayer(-1);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        console.log("Jugador se movió a la derecha");
        movePlayer(1);
    }

    applyGravity(); // Aplicamos la gravedad para que el worker caiga
}
