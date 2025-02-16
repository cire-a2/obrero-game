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
        arcade: { gravity: { y: 0 }, debug: false }
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
    // Fondo ajustado al tamaño de la cuadrícula
    let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.displayWidth = GAME_WIDTH;
    bg.displayHeight = GAME_HEIGHT;

    // Jugador
    player = this.physics.add.sprite(5 * TILE_SIZE, 9 * TILE_SIZE, 'player');
    player.setScale(TILE_SIZE / player.width);
    player.setCollideWorldBounds(true);

    // Controles (Izquierda y Derecha)
    cursors = this.input.keyboard.createCursorKeys();

    // Generar ladrillos cada segundo
    this.time.addEvent({
        delay: 1000,
        callback: spawnBrick,
        callbackScope: this,
        loop: true
    });
}

function spawnBrick() {
    let col = Phaser.Math.Between(0, GRID_SIZE - 1); // Columna aleatoria
    let row = findLowestEmptyRow(col); // Encuentra la fila más baja disponible

    if (row !== -1) { // Si hay espacio
        let brick = this.add.image(col * TILE_SIZE, row * TILE_SIZE, 'brick');
        brick.setScale(TILE_SIZE / brick.width);
        bricksMatrix[row][col] = brick; // Lo guardamos en la matriz
    }
}

function findLowestEmptyRow(col) {
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (!bricksMatrix[row][col]) return row;
    }
    return -1; // Columna llena
}

function movePlayer(direction) {
    let newCol = (player.x / TILE_SIZE) + direction;
    let newRow = player.y / TILE_SIZE;

    if (newCol >= 0 && newCol < GRID_SIZE) {
        if (bricksMatrix[newRow][newCol]) { // Hay un ladrillo
            if (newRow > 0 && !bricksMatrix[newRow - 1][newCol]) {
                // Puede saltar un ladrillo
                player.x = newCol * TILE_SIZE;
                player.y = (newRow - 1) * TILE_SIZE;
            }
        } else {
   

