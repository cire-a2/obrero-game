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
        arcade: { gravity: { y: 0 }, debug: true } // Activamos debug para ver colisiones
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    console.log("Cargando assets..."); // Verificar si Phaser llega aquí
    this.load.image('background', 'assets/background.png'); 
    this.load.image('player', 'assets/worker.png'); 
    this.load.image('brick', 'assets/brick.png'); 
}

function create() {
    console.log("Juego cargado"); // Confirmar que se ejecuta `create()`
    
    // 🛠 Arreglamos el fondo
    let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT); // Ajuste al tamaño del juego

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
    let col = Phaser.Math.Between(0, GRID_SIZE - 1); // Columna aleatoria
    let targetRow = findLowestEmptyRow(col); // Encuentra la fila más baja disponible

    if (targetRow !== -1) { // Si hay espacio
        let brick = this.physics.add.sprite(col * TILE_SIZE, -TILE_SIZE, 'brick'); // Aparece arriba y cae
        brick.setScale(TILE_SIZE / brick.width);

        this.tweens.add({
            targets: brick,
            y: targetRow * TILE_SIZE,
            duration: 500, // Tiempo de caída
            ease: 'Linear',
            onComplete: () => {
                bricksMatrix[targetRow][col] = brick; // Se guarda en la matriz al aterrizar
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

function update() {
    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        console.log("Jugador se movió a la izquierda");
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        console.log("Jugador se movió a la derecha");
    }
}





