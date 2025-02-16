const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: { preload, create, update }
};

let player, cursors, bricks;
const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png'); 
    this.load.image('player', 'assets/worker.png'); 
    this.load.image('brick', 'assets/brick.png'); 
}

function create() {
    this.add.image(200, 300, 'background'); 
    player = this.physics.add.sprite(200, 550, 'player').setCollideWorldBounds(true);
    
    bricks = this.physics.add.group({ key: 'brick', repeat: 4, setXY: { x: 100, y: 50, stepX: 80 } });
    bricks.children.iterate(brick => brick.setVelocityY(100));
    
    this.physics.add.collider(player, bricks);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocityX(0);
    if (cursors.left.isDown) player.setVelocityX(-160);
    else if (cursors.right.isDown) player.setVelocityX(160);
    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-300);
}