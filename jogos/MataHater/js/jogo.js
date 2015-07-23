var game = new Phaser.Game(800, 513, Phaser.AUTO, 'jogo', {preload : preload, create : create, update : update, render: render});
var map, objs, tileset, layer, p, cursors, princesas;
var correndo = false;

function preload() {
    game.load.audio('trilha', ['audio/ratm.ogg', 'audio/ratm.m4a']);
    game.load.tilemap('cenariojs', 'js/cenario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('cenarioimg', 'img/cenario.png');
    game.load.image('jcpr', 'img/jcpr.png');
    game.load.image('mord', 'img/rosa.png');
    game.load.image('sequestrador', 'img/minion_sequestrador.png');
    game.load.spritesheet('player', 'img/matador.png', 45, 75);
}

function create() {
    trilha = game.add.audio('trilha', 1, true);
    trilha.play('',0,1,true);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.id = 'canvas';
//    game.stage.backgroundColor = '#787878';
    map = game.add.tilemap('cenariojs');
    map.addTilesetImage('cenario', 'cenarioimg');
//
    map.setCollision(711);
    map.setCollision(657);
    map.setCollision(666);
    map.setCollision(559);
    map.setCollision(750);
//    map.setCollision(3193);
//    map.setCollisionBetween(14, 15);

    layer = map.createLayer('World1');
    layer.resizeWorld();
//    layer.setScale(1.17);

    objs = game.add.group();
    princesas = game.add.group();
    princesas.create(50, 165, 'jcpr');
    princesas.create(150, 165, 'mord');
    princesas.create(360, 20, 'sequestrador');
    game.physics.arcade.enable(princesas);
    princesas.getChildAt(0).body.gravity.x = 100;
    princesas.getChildAt(0).body.gravity.y = -250;
    princesas.getChildAt(1).body.gravity.x = 100;
    princesas.getChildAt(1).body.gravity.y = -250;
    princesas.getChildAt(2).body.gravity.x = 100;
    princesas.getChildAt(2).body.gravity.y = -250;
    princesas.width = 130;
    princesas.height = 155;
//    princesas.scale = 2;

    p = game.add.sprite(32, 400, 'player');
    p.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    p.animations.add('left', [17, 16, 15, 14, 13, 12, 11, 10, 9], 10, true);

    game.physics.arcade.enable(p);
    game.physics.arcade.gravity.y = 250;

//    p.body.bounce.y = 0.2;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;

    game.camera.follow(p);
    cursors = game.input.keyboard.createCursorKeys();
//    cursors.addKeyCapture([16, 17, 18]);
}

addEventListener("keypress", function(event){

});

function update() {
    game.physics.arcade.bounds.height = 600;
    game.physics.arcade.collide(p, layer);
    game.physics.arcade.collide(p, objs);
//    game.physics.arcade.collide(p, coins);
    p.body.velocity.x = 0;
    if (cursors.up.isDown) {
        if (p.body.onFloor()) {
            p.body.velocity.y = -200;
        }
    }
    if (cursors.left.isDown) {
        p.body.velocity.x = -(correndo ? 180 : 150);
        p.animations.play('left');
    } else if (cursors.right.isDown) {
        p.body.velocity.x = correndo ? 180 : 150;
        p.animations.play('right');
    } else {
        p.animations.stop();
    }
}

function corre() {
    correndo = !correndo;
}

function render() {
//     game.debug.body(p);
//    game.debug.bodyInfo(p, 32, 320);
}