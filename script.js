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
        arcade: {



