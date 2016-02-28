function confrontoFinal() {
    this.create = function() {
        map = game.add.tilemap('cenariofinal');
        map.addTilesetImage('salao', 'salao_chefao');
        // map.setCollision([22000, 22801, 21802, 21803, 21804, 21605, 21606, 21607, 21608, 21609, 216010]);
        map.setCollisionBetween(21600, 21650);
        map.setCollisionBetween(21962, 21999);
        layer = map.createLayer('final');
        layer.resizeWorld();
        vidasGrp = game.add.group();
        vidas = 5;
        vidasGrp.create(675, 15, 'vidas');
        vidasGrp.create(700, 15, 'vidas');
        vidasGrp.create(725, 15, 'vidas');
        vidasGrp.create(750, 15, 'vidas');
        vidasGrp.create(775, 15, 'vidas');
        vidasGrp.fixedToCamera = true;

        caixaGrp = game.add.group();
        game.physics.arcade.enable(caixaGrp);
        tiros = 15;
        tiro = game.input.keyboard.addKey(Phaser.Keyboard.C);
        qtdeTirosTxt = game.add.text(25, 8, 'x15', { fontSize: '22px', fill: '#FFFFFF' });
        qtdeTirosTxt.fixedToCamera = true;

        infoTiro = game.add.image(5, 10, 'tiro');
        infoTiro.scale.x = 1.2;
        infoTiro.scale.y = 1.2;
        infoTiro.fixedToCamera = true;
        tiroGrp = game.add.group();

        daniel = game.add.sprite(50, 0, 'player');
        daniel.animations.add('andar_direita', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
        daniel.animations.add('andar_esquerda', [17, 16, 15, 14, 13, 12, 11, 10, 9], 10, true);
        daniel.animations.add('soco_direita', [18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
        daniel.animations.add('soco_esquerda', [35, 34, 33, 32, 31, 30, 29, 28, 27], 10, true);
        daniel.animations.add('tiro_direita', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 15, true);
        daniel.animations.add('tiro_esquerda', [63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50], 15, true);
        daniel.animations.add('morte', [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83], 5, false);
        daniel.animations.add('morto', [83], 1, false);
        daniel.animations.getAnimation("tiro_direita").onLoop.add(atirarDireita);
        daniel.animations.getAnimation("tiro_esquerda").onLoop.add(atirarEsquerda);

        game.physics.arcade.enable(daniel);
        game.physics.arcade.gravity.y = 250;

        daniel.body.linearDamping = 1;
        daniel.body.collideWorldBounds = true;

        cursors.right.onDown.add(ultMovimentoDireita, this);
        cursors.left.onDown.add(ultMovimentoEsquerda, this);
        //game.camera.follow(daniel);
    }

    this.update = function() {
        daniel.body.velocity.x = 0;
        game.physics.arcade.collide(daniel, layer);
        if (!seFudeu) {
            if (cursors.up.isDown) {
                if (daniel.body.blocked.down && corre.isDown)
                    daniel.body.velocity.y = -240;
                else if (daniel.body.blocked.down)
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
        }
    }

    function machuca(jogador, tiro) {
        if (tiro)
            tiro.kill();
        if (player.estaMachucado) // se já esta machucado nada acontece
            return ;
        // tirar uma vida do jogador, verificar se ele tem mais que zero vidas
        vidas -= 1;
        if (!(vidas >= 0)) {
            gameOver();
        } else {
            vidasGrp.getFirstAlive().kill();
            switch (game.rnd.integerInRange(0,5)) {
                case 0: sonsBayer.play('ai');break;
                case 1: sonsBayer.play('aai');break;
                case 2: sonsBayer.play('vish');break;
                case 3: sonsBayer.play('ohDesgraca');break;
                default: sonsBayer.play('argh');break;
            }
            player.estaMachucado = true;
            game.time.events.add(Phaser.Timer.SECOND*2, function(){player.estaMachucado = false;}, this);
        }
    }

    function sofre(player, obj) {
        if (!estaMachucado && player === daniel) {
            if (obj && obj.kill != null)
                obj.kill();
            if (vidas > 0) {
                vidas--;
                switch (game.rnd.integerInRange(0,5)) {
                case 0: sonsBayer.play('ai');break;
                case 1: sonsBayer.play('aai');break;
                case 2: sonsBayer.play('vish');break;
                case 3: sonsBayer.play('ohDesgraca');break;
                default: sonsBayer.play('argh');break;
                }
                vidasGrp.getFirstAlive().kill();
            } else {
                morre();
            }
            estaMachucado = true;
            game.time.events.add(Phaser.Timer.SECOND*2, function(){estaMachucado = false;});
        }
    }

    function gameOver() {
    }

    function ultMovimentoDireita() {
        ult_movimento_direita = true;
    }

    function ultMovimentoEsquerda() {
        ult_movimento_direita = false;
    }

    function atirarEsquerda() {
        if (tiros > 0) {
            var disparo;
            somTiro.play();
            disparo = tiroGrp.create(daniel.x, daniel.y + 23, 'tiro');
            game.physics.arcade.enable(disparo);
            disparo.body.gravity.x = -100;
            disparo.body.gravity.y = -250;
            // sortear numero

            switch (game.rnd.integerInRange(0, 20)) {
                case 1: sonsBayer.play('morreMinion');break;
                case 2: sonsBayer.play('viado');break;
                case 3: sonsBayer.play('hahaha');break;
                case 4: sonsBayer.play('morreAi');break;
                case 5: sonsBayer.play('coco');break;
                case 6: sonsBayer.play('teMatar');break;
            }
            tiros -= 1;
            qtdeTirosTxt.text = 'x' + tiros;
        } else {
            somTiroFalha.play();
        }
    }

    function atirarDireita() {
        if (tiros > 0) {
            var disparo;
            somTiro.play();
            disparo = tiroGrp.create(daniel.x+45, daniel.y + 23, 'tiro');
            game.physics.arcade.enable(disparo);
            disparo.body.gravity.x = 100;
            disparo.body.gravity.y = -250;

            switch (game.rnd.integerInRange(0, 20)) {
                case 1: sonsBayer.play('morreMinion');break;
                case 2: sonsBayer.play('viado');break;
                case 3: sonsBayer.play('hahaha');break;
                case 4: sonsBayer.play('morreAi');break;
                case 5: sonsBayer.play('coco');break;
                case 6: sonsBayer.play('teMatar');break;
            }
            tiros -= 1;
            qtdeTirosTxt.text = 'x' + tiros;
        } else {
            somTiroFalha.play();
        }
    }
}
