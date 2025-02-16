const GRID_SIZE = 10;  // Tamaño del mapa (10x10)
const TILE_SIZE = 40;  // Tamaño de cada casilla en píxeles
const GAME_WIDTH = GRID_SIZE * TILE_SIZE;
const GAME_HEIGHT = GRID_SIZE * TILE_SIZE;

let player;
let bricks;

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

    // Grupo de ladrillos
    bricks = this.physics.add.group();

    // Jugador centrado en la cuadrícula
    player = this.physics.add.sprite(5 * TILE_SIZE, 9 * TILE_SIZE, 'player');
    player.setScale(TILE_SIZE / player.width); // Ajusta su tamaño a una casilla

    // Configurar teclas
    this.input.keyboard.on('keydown-LEFT', () => {
        if (player.x > 0) player.x -= TILE_SIZE;
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
        if (player.x < (GRID_SIZE - 1) * TILE_SIZE) player.x += TILE_SIZE;
    });

    this.input.keyboard.on('keydown-UP', () => {
        if (player.y > 0) player.y -= TILE_SIZE;
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        if (player.y < (GRID_SIZE - 1) * TILE_SIZE) player.y += TILE_SIZE;
    });

    // Generar ladrillos cada segundo
    this.time.addEvent({
        delay: 1000,
        callback: spawnBrick,
        callbackScope: this,
        loop: true
    });

    // Colisiones
    this.physics.add.collider(player, bricks, gameOver, null, this);
}

function spawnBrick() {
    let col = Phaser.Math.Between(0, GRID_SIZE - 1); // Columna aleatoria
    let brick = bricks.create(col * TILE_SIZE, 0, 'brick'); // Cae desde arriba
    brick.setScale(TILE_SIZE / brick.width); // Ajustar tamaño a 1 casilla
    brick.setVelocityY(100); // Velocidad de caída
}

function gameOver() {
    alert("¡Perdiste! Un ladrillo te golpeó.");
    location.reload(); // Reiniciar el juego
}

function update() {
    // Evita que el jugador salga de los límites
    player.x = Phaser.Math.Clamp(player.x, 0, (GRID_SIZE - 1) * TILE_SIZE);
    player.y = Phaser.Math.Clamp(player.y, 0, (GRID_SIZE - 1) * TILE_SIZE);
}
