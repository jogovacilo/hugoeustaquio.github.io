var game = new Phaser.Game(800, 513, Phaser.AUTO, 'jogo', {preload : preload, create : create, update : update});
var map, objs, tileset, layer, daniel, cursors, socao, corre, tiro, princesas, somWhat;
var tiroGrp, minionGrp, frutasDaMorte, frequenciaDisparo = 850, firingTimer = 0, livingEnemies = [], vidas=3, vidasGrp;
var ult_movimento_direita = true;

function reiniciar() {
    frequenciaDisparo = 850, vidas = 3;
    game.destroy();
    game = new Phaser.Game(800, 513, Phaser.AUTO, 'jogo', {preload : preload, create : create, update : update});
    trilha.stop();
    desgracado.stop();
    create();
}

function preload() {
    game.load.audio('trilha', ['audio/ratm.ogg', 'audio/ratm.m4a']);
    game.load.audio('what', ['audio/what.ogg', 'audio/what.m4a']);
    game.load.audio('desgracado', ['audio/desgracado.ogg', 'audio/desgracado.m4a']);
    game.load.tilemap('cenariojs', 'js/cenario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('cenarioimg', 'img/cenario.png');
    game.load.image('jcpr', 'img/jcpr.png');
    game.load.image('mord', 'img/rosa.png');
    game.load.image('tiro', 'img/tiro.png');
    game.load.image('minion1', 'img/minion1.png');
    game.load.image('minion2', 'img/minion2.png');
    game.load.image('minion3', 'img/minion3.png');
    game.load.image('vidas', 'img/vdd.png');
    game.load.image('sequestrador', 'img/minion_sequestrador.png');
    game.load.spritesheet('frutas', 'img/frutas.png', 22, 22);
    game.load.spritesheet('player', 'img/matador.png', 50, 62);
}

function create() {
    $('#loading').hide();
    desgracado = game.add.audio('desgracado');
    desgracado.play();
    somWhat = game.add.audio('what');
    trilha = game.add.audio('trilha', 1, true);
    trilha.play('',0,1,true);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.id = 'canvas';
    map = game.add.tilemap('cenariojs');
    map.addTilesetImage('cenario', 'cenarioimg');
    map.setCollision([711, 657, 666, 559, 750, 733, 416]);

    layer = map.createLayer('World1');
    layer.resizeWorld();

    tiroGrp = game.add.group();
    minionGrp = game.add.group();
    frutasDaMorte = game.add.group();

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

    vidasGrp = game.add.group();
    vidasGrp.create(700, 15, 'vidas');
    vidasGrp.create(725, 15, 'vidas');
    vidasGrp.create(750, 15, 'vidas');
    vidasGrp.fixedToCamera = true;
    daniel = game.add.sprite(32, 400, 'player');
    daniel.sofre = function(d, obj) {
        console.log('ele tá sofrendo!');
        obj.kill();
        if (vidas > 0) {
            vidas--;
            vidasGrp.getFirstAlive().kill();
        } else {
            gameOver();
        }
    }

    daniel.animations.add('andar_direita', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    daniel.animations.add('andar_esquerda', [17, 16, 15, 14, 13, 12, 11, 10, 9], 10, true);
    daniel.animations.add('soco_direita', [18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
    daniel.animations.add('soco_esquerda', [35, 34, 33, 32, 31, 30, 29, 28, 27], 10, true);
    daniel.animations.add('tiro_direita', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);
    daniel.animations.add('tiro_esquerda', [63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50], 10, true);

    game.physics.arcade.enable(daniel);
    game.physics.arcade.gravity.y = 250;

    daniel.body.linearDamping = 1;
    daniel.body.collideWorldBounds = true;

    game.camera.follow(daniel);
    cursors = game.input.keyboard.createCursorKeys();
    corre = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    socao = game.input.keyboard.addKey(Phaser.Keyboard.X);
    tiro = game.input.keyboard.addKey(Phaser.Keyboard.C);
    game.input.keyboard.addKeyCapture([16,17,18]);
    cursors.right.onDown.add(ultMovimentoDireita, this);
    cursors.left.onDown.add(ultMovimentoEsquerda, this);

    // criando os inimigos
    minionGrp.create(550, 380, 'minion1');
    minionGrp.create(750, 380, 'minion2');
    minionGrp.create(850, 380, 'minion3');
    minionGrp.create(1000, 380, 'minion2');
    minionGrp.create(1180, 380, 'minion1');
    minionGrp.create(1520, 380, 'minion2');
    minionGrp.create(1750, 380, 'minion1');
    minionGrp.create(1830, 380, 'minion3');
    minionGrp.create(1950, 380, 'minion2');
    minionGrp.create(2150, 380, 'minion3');
    minionGrp.create(2288, 380, 'minion3');
    minionGrp.create(2570, 380, 'minion2');
    minionGrp.forEachAlive(function(minion){minion.movendo_direita = true;});
    game.physics.arcade.enable(minionGrp);

    frutasDaMorte.enableBody = true;
    frutasDaMorte.physicsBodyType = Phaser.Physics.ARCADE;
    frutasDaMorte.createMultiple(25, 'frutas', 0);
    frutasDaMorte.createMultiple(10, 'frutas', 1);
    frutasDaMorte.createMultiple(10, 'frutas', 2);
    frutasDaMorte.createMultiple(10, 'frutas', 3);
    frutasDaMorte.createMultiple(10, 'frutas', 4);
    frutasDaMorte.setAll('anchor.x', 0.5);
    frutasDaMorte.setAll('anchor.y', 1);
    frutasDaMorte.setAll('outOfBoundsKill', true);
    frutasDaMorte.setAll('checkWorldBounds', true);
    game.physics.arcade.enable(frutasDaMorte);
    
}

function gameOver() {
    
}

function ultMovimentoDireita() {
    ult_movimento_direita = true;
}

function ultMovimentoEsquerda() {
    ult_movimento_direita = false;
}

function update() {
    game.physics.arcade.bounds.height = 600;
    game.physics.arcade.collide(daniel, layer);
    game.physics.arcade.collide(daniel, objs);
    game.physics.arcade.collide(frutasDaMorte, layer);
    game.physics.arcade.collide(frutasDaMorte, daniel);
    game.physics.arcade.overlap(layer, tiroGrp, function(bullet, layer) {
        bullet.kill();
    }, null, this);
    game.physics.arcade.overlap(daniel, frutasDaMorte, daniel.sofre, null, this);
    game.physics.arcade.overlap(minionGrp, tiroGrp, function(minion, tiro) {
        somWhat.play();
        minion.kill();
        tiro.kill();
    }, null, this);
    game.physics.arcade.overlap(layer, minionGrp, function(minion, layer) {
        if (minion.body.blocked.left)
            minion.movendo_direita = true;
        else if (minion.body.blocked.right)
            minion.movendo_direita = false;
    }, null, this);
    minionGrp.forEachAlive(function(minion){
        if (minion.movendo_direita) {
            minion.body.velocity.x = 50;
        } else {
            minion.body.velocity.x = -50;
        }
    });

    daniel.body.velocity.x = 0;
    if (cursors.up.isDown) {
        if (daniel.body.onFloor() && corre.isDown)
            daniel.body.velocity.y = -240;
        else if (daniel.body.onFloor())
            daniel.body.velocity.y = -200;
    }
    if (cursors.left.isDown) {
        daniel.body.velocity.x = -(corre.isDown ? 180 : 140);
        if (socao.isDown)
            daniel.animations.play('soco_esquerda');
        else if (tiro.isDown)
            daniel.animations.play('tiro_esquerda');
        else
            daniel.animations.play('andar_esquerda');
    } else if (cursors.right.isDown) {
        daniel.body.velocity.x = corre.isDown ? 180 : 140;
            if (socao.isDown)
                daniel.animations.play('soco_direita');
            else if (tiro.isDown)
                daniel.animations.play('tiro_direita');
            else
                daniel.animations.play('andar_direita');
    } else if (socao.isDown) {
        if (ult_movimento_direita)
            daniel.animations.play('soco_direita');
        else
            daniel.animations.play('soco_esquerda');
    } else if (tiro.isDown) {
        if (ult_movimento_direita)
            daniel.animations.play('tiro_direita');
        else
            daniel.animations.play('tiro_esquerda');
    } else {
        if (ult_movimento_direita)
            daniel.animations.play('andar_direita');
        else
            daniel.animations.play('andar_esquerda');
        daniel.animations.stop();
    }
    // soltar tiro no máximo uma vez por segundo
    if (tiro.isDown && game.time.now > frequenciaDisparo) {
        atirar();
        frequenciaDisparo = game.time.now + 850;
    }
    if (game.time.now > firingTimer) {
        arremessoMinion();
    }
}

function atirar() {
    var disparo;
    if (ult_movimento_direita) {
        disparo = tiroGrp.create(daniel.x+45, daniel.y + 23, 'tiro');
        game.physics.arcade.enable(disparo);
        disparo.body.gravity.x = 100;
    } else {
        disparo = tiroGrp.create(daniel.x, daniel.y + 23, 'tiro');
        game.physics.arcade.enable(disparo);
        disparo.body.gravity.x = -100;
    }
    disparo.body.gravity.y = -250;
}

function arremessoMinion () {
    enemyBullet = frutasDaMorte.getRandom(false);
    livingEnemies.length=0;
    minionGrp.forEachAlive(function(minion) {
        livingEnemies.push(minion);
    });
    if (enemyBullet && livingEnemies.length > 0) {
        var random = game.rnd.integerInRange(0,livingEnemies.length-1);
        var shooter=livingEnemies[random];
        enemyBullet.reset(shooter.body.x, shooter.body.y);
        enemyBullet.body.velocity.x = game.rnd.integerInRange(-200,200);
        enemyBullet.body.velocity.y = game.rnd.integerInRange(-300,250);
        enemyBullet.body.gravity.x = -90;
        firingTimer = game.time.now + 250;
    }
}