const GRID_SIZE = 10;  // Tamaño del mapa (10x10)
const TILE_SIZE = 40;  // Tamaño de cada casilla en píxeles
const GAME_WIDTH = GRID_SIZE * TILE_SIZE;
const GAME_HEIGHT = GRID_SIZE * TILE_SIZE;

let player;
let bricksMatrix = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)); // Matriz de ladrillos
let cursors;
let gravityEnabled = true; // Controla la gravedad del obrero

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
    // 🛠 Arreglamos el fondo
    let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT); // Asegura que se ajuste bien al tamaño del juego

    // 🏗 Creación del jugador
    player = this.physics.add.sprite(5 * TILE_SIZE, 9 * TILE_SIZE, 'player');
    player.setScale(TILE_SIZE / player.width);
    player.setCollideWorldBounds(true);

    // 🎮 Controles (Izquierda y Derecha)
    cursors = this.input.keyboard.createCursorKeys();

    // ⬇ Generar ladrillos cada segundo
    this.time.addEvent({
        delay: 1000,
        callback: spawnBrick,
        callbackScope: this,
        loop: true
    });
}

function spawnBrick() {
    let col 




