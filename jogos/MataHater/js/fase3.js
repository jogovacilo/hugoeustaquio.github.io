function faseTres() {
    function criaMinion(x, y, minX, maxX, movendoDireita, tipoMinion) {
        minion = minionGrp.create(x, y, tipoMinion);
        minion.max_x = maxX;
        minion.min_x = minX;
        minion.movendo_direita = movendoDireita;
    }

    this.create = function() {
        map = game.add.tilemap('cenario3js');
        map.addTilesetImage('cenario_f2', 'cenario3img');
        map.setTileIndexCallback(49, sofre, this);
        map.setCollision([28, 25, 30, 26, 29, 33, 45, 50, 47, 51]);
        layer = map.createLayer('World2');
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
        cxTiro = caixaGrp.create(3310, 435, 'caixa_tiro');
        cxVida = caixaGrp.create(3330, 400, 'caixa_vida');
        game.physics.arcade.enable(caixaGrp);
        cxTiro.body.collideWorldBounds = true;
        cxVida.body.collideWorldBounds = true;
        tiros = 15;
        tiro = game.input.keyboard.addKey(Phaser.Keyboard.C);
        qtdeTirosTxt = game.add.text(25, 8, 'x15', { fontSize: '22px', fill: '#FFFFFF' });
        qtdeTirosTxt.fixedToCamera = true;

        infoTiro = game.add.image(5, 10, 'tiro');
        infoTiro.scale.x = 1.2;
        infoTiro.scale.y = 1.2;
        infoTiro.fixedToCamera = true;
        tiroGrp = game.add.group();

        daniel = game.add.sprite(32, 300, 'player');
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
        game.camera.follow(daniel);

        minionGrp = game.add.group();
        criaMinion(550, 380, 480, 974, false, 'minion2');
        criaMinion(800, 380, 480, 974, true, 'minion1');
        criaMinion(1065, 320, 1065, 1102, true, 'minion3');
        criaMinion(1274, 250, 1133, 1412, true, 'minion2');
        criaMinion(1630, 160, 1515, 1738, false, 'minion1');
        criaMinion(2106, 350, 2048, 2218, false, 'minion3');
        criaMinion(2803, 250, 2772, 2825, false, 'minion2');
        criaMinion(3159, 320, 2996, 3402, false, 'minion3');

        criaMinion(3550, 420, 3424, 4353, false, 'minion1');
        criaMinion(3830, 420, 3424, 4353, true, 'minion3');
        criaMinion(4047, 410, 3424, 4353, true, 'minion2');
        criaMinion(4260, 410, 3424, 4353, false, 'minion2');

        criaMinion(4820, 320, 4505, 5143, false, 'minion3');
        criaMinion(4820, 320, 4505, 5143, true, 'minion2');
        criaMinion(5408, 150, 5302, 5508, true, 'minion2');

        game.physics.arcade.enable(minionGrp);
        minionGrp.forEach(function(minion) {
            minion.foiSocado = false;
            minion.tempoPiscando = 0;
            minion.morrendo = false;
            minion.animations.add('normal', [0], 0, false);
            minion.animations.add('machucado', [1], 0, false);
            minion.animations.add('morrendo', [2,3,4,5,6,7,8,9,10,11], 5, true);
        });
        //firingTimer = 0;
        frutasDaMorte = game.add.group();
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

    this.update = function() {
        game.physics.arcade.collide(caixaGrp, layer);
        game.physics.arcade.collide(daniel, layer);
        game.physics.arcade.collide(minionGrp, layer);
        game.physics.arcade.collide(layer, tiroGrp, function(tiro, layer) {
            tiro.kill();
        }, null, this);
        game.physics.arcade.collide(tiroGrp, layer);
        game.physics.arcade.overlap(frutasDaMorte, tiroGrp, function(fruta, tiro) {
            fruta.kill();
        }, null, this);
        game.physics.arcade.collide(frutasDaMorte, layer);
        game.physics.arcade.overlap(frutasDaMorte, daniel, sofre, null, this);
        game.physics.arcade.overlap(minionGrp, tiroGrp, function(minion, tiro) {
            somWhat.play();
            minion.animations.play('morrendo', 3, false, true);
            minion.morrendo = true;
            game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                minion.destroy();
            }, this);
            tiro.destroy();
        }, null, this);
        game.physics.arcade.overlap(layer, minionGrp, function(minion, layer) {
            if (minion.body.blocked.left){
                minion.movendo_direita = true;
            }
            else if (minion.body.blocked.right){
                minion.movendo_direita = false;
            }
        }, null, this);
        game.physics.arcade.collide(daniel, caixaGrp, function(daniel, caixa){
            if (caixa.key == "caixa_vida") {
                vidas = 5;
                vidasGrp.forEachDead(function(vida){vida.revive()});
            } else {
                tiros += 5;
                qtdeTirosTxt.text = 'x' + tiros;
            }
            caixa.kill();
        });
        game.physics.arcade.collide(daniel, minionGrp, function(daniel, minion) {
            if (socao.isDown && !seFudeu) {
                if (minion.foiSocado && game.time.now > minion.tempoPiscando && !minion.morrendo) {
                    somSoco.play();
                    minion.morrendo = true;
                    somWhat.play();
                    minion.animations.play('morrendo', 3, false, true);
                    game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                        minion.destroy();
                    }, this);
                } else if (minion.tempoPiscando == 0) {
                    minion.tempoPiscando = game.time.now + 3000;
                    somSoco.play();
                    minion.animations.play('machucado');
                    somWhat.play();
                    minion.foiSocado = true;
                }
            }
        }, null, this);
        minionGrp.forEachAlive(function(minion) {
            if (minion.movendo_direita) {
                minion.body.velocity.x = 50;
                if (minion.x > minion.max_x) {
                    minion.movendo_direita = false;
                }
            } else {
                minion.body.velocity.x = -50;
                if (minion.x < minion.min_x) {
                    minion.movendo_direita = true;
                }
            }
        });

        if (!estaMachucado || seFudeu){
            daniel.alpha = 1;
        } else {
            daniel.alpha = (daniel.alpha == 1) ? 0 : 1;
        }

        daniel.body.velocity.x = 0;
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
        if (game.time.now > firingTimer) {
            arremessoMinion();
        }
        if (daniel.x > 6333) {
            // entrar no castelo do chefão
        }
    }

    function morre(sprite, tile) {
        if (!seFudeu) {
            seFudeu = true;
            trilhaSonora.stop();
            trilhaSonoraChefe.stop();
            somMorri.play();
            trilhaSonora.stop();
            daniel.animations.play('morte', 5, false);
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {daniel.play('morto');}, this);
            game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                btnRecomecar = game.add.button(350, 250, 'button', reiniciar, this, 2, 1, 0);
                btnRecomecar.fixedToCamera = true;
            }, this);
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

    function arremessoMinion () {
        frutasParadas.length=0;
        frutasDaMorte.forEachAlive(function(fruta) {
            if (fruta.body.velocity.y == 0 && fruta.body.velocity.x == 0)
                frutasParadas.push(fruta);
        });
        if (frutasParadas.length > 0)
            frutaArremesso = frutasParadas[game.rnd.integerInRange(0,frutasParadas.length-1)];
        else
            frutaArremesso = frutasDaMorte.getRandom(false);

        minionsVivos.length=0;
        minionGrp.forEachAlive(function(minion) {
            if (!minion.morrendo)
                minionsVivos.push(minion);
        });

        if (frutaArremesso && minionsVivos.length > 0) {
            var random = game.rnd.integerInRange(0,minionsVivos.length-1);
            var shooter=minionsVivos[random];
            frutaArremesso.reset(shooter.body.x, shooter.body.y);
            frutaArremesso.body.velocity.x = game.rnd.integerInRange(-150,150);
            frutaArremesso.body.velocity.y = game.rnd.integerInRange(-300,250);
            if (frutaArremesso.body.velocity.x < 0)
                frutaArremesso.body.gravity.x = game.rnd.integerInRange(-90,-50);
            else
                frutaArremesso.body.gravity.x = game.rnd.integerInRange(50,90);
            firingTimer = game.time.now + (3000 / minionGrp.countLiving());
        }
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
