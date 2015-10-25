function faseUm() {
    function animacaoChefao() {
        mostraAnimacao = true;
        barraSaudeChefao = new HealthBar(game, {x: game.camera.position.x, y: 50, height: 30,bar: {color: '#660099'},});
        trilhaSonora.stop();
        trilhaSonoraChefe.play();
        // colocar o minion do mal perto do bayer

        chefeMinion = game.add.sprite(daniel.x + 100, daniel.y -150, 'chefe_minion');
        game.physics.arcade.enable(chefeMinion);
        chefeMinion.tirosRecebidos = 0;
        chefeMinion.scale.x = 1.5;
        chefeMinion.scale.y = 1.5;
        chefeMinion.movendo_direita = true;
        chefeMinion.animations.add('correr_direita', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34], 10, true);
        chefeMinion.animations.add('correr_esquerda', [69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35], 10, true);
        chefeMinion.animations.getAnimation("correr_direita").onLoop.add(function() {
            somChefeMinion.restart();
        });
        chefeMinion.animations.getAnimation("correr_esquerda").onLoop.add(function() {
            somChefeMinion.restart();
        });
        somChefeMinion.play();
    }

    function animacaoPassaFase1() {
        trilhaSonora.stop();
        trilhaSonoraChefe.stop();
        $('#loading').show();
        this.game.stateTransition.to('animacaoFase1');
    }

    this.preload = function() {
        game.load.audio('sonsBayer', ['audio/sons_bayer.ogg', 'audio/sons_bayer.m4a']);
        game.load.audio('chefeMinion', ['audio/chefe_minion.ogg', 'audio/chefe_minion.m4a']);
        game.load.audio('trilha1', ['audio/ratm.ogg', 'audio/ratm.m4a']);
        game.load.audio('trilha2', ['audio/pantera.ogg', 'audio/pantera.m4a']);
        game.load.audio('tiro_falhou', ['audio/tiro_falhou.ogg', 'audio/tiro_falhou.m4a']);
        game.load.audio('what', ['audio/what.ogg', 'audio/what.m4a']);
        game.load.audio('morri', ['audio/morri.ogg', 'audio/morri.m4a']);
        game.load.audio('punch', ['audio/punch.ogg', 'audio/punch.m4a']);
        game.load.audio('desgracado', ['audio/desgracado.ogg', 'audio/desgracado.m4a']);
        game.load.audio('somTiro', ['audio/tiro_f1.ogg', 'audio/tiro_f1.m4a']);
        game.load.tilemap('cenariojs', 'js/cenario.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('placa', 'img/placa.png');
        game.load.image('cenarioimg', 'img/cenario.png');
        game.load.image('jcpr', 'img/jcpr.png');
        game.load.image('mord', 'img/rosa.png');
        game.load.image('tiro', 'img/tiro.png');
        game.load.spritesheet('minion1', 'img/minion1.png', 40, 55);
        game.load.spritesheet('minion2', 'img/minion2.png', 50, 82);
        game.load.spritesheet('minion3', 'img/minion3.png', 40, 55);
        game.load.spritesheet('chefe_minion', 'img/evil_minion_sprite.png', 80, 100);
        game.load.image('caixa_tiro', 'img/caixa_tiro.png');
        game.load.image('caixa_vida', 'img/caixa_vida.png');
        game.load.image('vidas', 'img/vdd.png');
        game.load.image('button', 'img/recomecar.png');
        game.load.image('sequestrador', 'img/minion_sequestrador.png');
        game.load.spritesheet('frutas', 'img/frutas.png', 22, 22);
        game.load.spritesheet('player', 'img/matador.png', 50, 62);
        game.load.image('chain', 'img/chain.png');

     // preload da fase 2
        game.load.image('jasa', 'img/jasa.png');
    }

    this.create = function() {
        $('#loading').hide();

        somDesgracado = game.add.audio('desgracado');
        somTiroFalha = game.add.audio('tiro_falhou');
        somChefeMinion = game.add.audio('chefeMinion');
        trilhaSonora = game.add.audio('trilha1', 1, true);
        trilhaSonoraChefe = game.add.audio('trilha2', 1, true);
        somMorri = game.add.audio('morri');
        somWhat = game.add.audio('what');
        trilhaSonora.play('',0,1,true);
        somSoco = game.add.audio('punch');
        somTiro = game.add.audio('somTiro');
        sonsBayer = game.add.audio('sonsBayer');
        sonsBayer.allowMultiple = true;
        sonsBayer.addMarker('coco', 2.7, 2.0);
        sonsBayer.addMarker('teMatar', 5.1, 2.0);
        sonsBayer.addMarker('argh', 12.0, 0.5);
        sonsBayer.addMarker('ai', 14.2, 1.1);
        sonsBayer.addMarker('vish', 16.3, 1.3);
        sonsBayer.addMarker('uai', 18.8, 1.0);
        sonsBayer.addMarker('morreAi', 21.5, 1.3);
        sonsBayer.addMarker('aai', 23.8, 1.0);
        sonsBayer.addMarker('hahaha', 25.5, 2.0);
        sonsBayer.addMarker('viado', 27.9, 2.3);
        sonsBayer.addMarker('morreMinion', 32.0, 1.6);
        sonsBayer.addMarker('ohDesgraca', 34.5, 1.6);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.canvas.id = 'canvas';
        map = game.add.tilemap('cenariojs');
        map.addTilesetImage('cenario', 'cenarioimg');
        map.setCollision([711, 657, 666, 559, 750, 733, 416]);

        layer = map.createLayer('World1');
        layer.resizeWorld();

        placa = game.add.image(80, 228, 'placa');
        placa.scale.x = 0.8;
        placa.scale.y = 0.8;

        infoTiro = game.add.image(5, 10, 'tiro');
        infoTiro.scale.x = 1.2;
        infoTiro.scale.y = 1.2;
        infoTiro.fixedToCamera = true;

        tiroGrp = game.add.group();
        minionGrp = game.add.group();
        frutasDaMorte = game.add.group();
        objs = game.add.group();
        vidasGrp = game.add.group();
        caixaGrp = game.add.group();

        daniel = game.add.sprite(32, 400, 'player');
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

        game.camera.follow(daniel);
        cursors = game.input.keyboard.createCursorKeys();
        corre = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        socao = game.input.keyboard.addKey(Phaser.Keyboard.X);
        tiro = game.input.keyboard.addKey(Phaser.Keyboard.C);
        game.input.keyboard.addKeyCapture([16,17,18]);
        cursors.right.onDown.add(ultMovimentoDireita, this);
        cursors.left.onDown.add(ultMovimentoEsquerda, this);
        qtdeTirosTxt = game.add.text(25, 8, 'x15', { fontSize: '22px', fill: '#FFFFFF' });
        qtdeTirosTxt.fixedToCamera = true;
        tiroGrp.collideWorldBounds = true;

        inicioJogo();
    }

    function gameOver() {
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

    function ultMovimentoDireita() {
        ult_movimento_direita = true;
    }

    function ultMovimentoEsquerda() {
        ult_movimento_direita = false;
    }

    function sofre(player, obj) {
        if (!estaMachucado) {
            if (obj)
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
                gameOver();
            }
            estaMachucado = true;
            game.time.events.add(Phaser.Timer.SECOND*2, function(){estaMachucado = false;});
        }
    }

    this.update = function() {
        if (!estaMachucado || seFudeu){
            daniel.alpha = 1;
        } else {
            daniel.alpha = (daniel.alpha == 1) ? 0 : 1;
        }
        minionGrp.forEachAlive(function(minion) {
            if (minion.foiSocado && game.time.now > minion.tempoPiscando) {
                minion.alpha = 1;
            } else if (minion.foiSocado) {
                minion.alpha = (minion.alpha == 1) ? 0.5 : 1;
            }
        });
        if (chefeMinion) {
            game.physics.arcade.collide(chefeMinion, layer);
            // chefe minion persegue o jogador
            if (chefeMinion.movendo_direita) {
                if (chefeMinion.x - daniel.x > 330 || chefeMinion.body.blocked.right)
                    chefeAndarEsquerda();
            } else {
                if (chefeMinion.x - daniel.x < -330 || chefeMinion.body.blocked.left)
                    chefeAndarDireita();
            }
            if (chefeMinion.movendo_direita) {
                chefeMinion.body.velocity.x = 90;
            } else {
                chefeMinion.body.velocity.x = -90;
            }
            game.physics.arcade.collide(chefeMinion, daniel, function(chefeMinion, daniel) {
                sofre(daniel, null);
                chefeMinion.movendo_direita = (chefeMinion.x - daniel.x > 0);
            }, null, this);
            // fazer a barrinha de saúde do chefão acompanhar a tela:
            barraSaudeChefao.setPosition(game.camera.position.x, 50);
            game.physics.arcade.collide(chefeMinion, tiroGrp, function(chefeMinion, tiro){
                tiro.kill();
                chefeMinion.tirosRecebidos++;
                if (chefeMinion.tirosRecebidos < 20)
                    barraSaudeChefao.setPercent(100 - (5 * chefeMinion.tirosRecebidos));
                else if (!seFudeu)
                    animacaoPassaFase1();
            });
            if (chefeMinion.movendo_direita)
                chefeMinion.animations.play('correr_esquerda');
            else
                chefeMinion.animations.play('correr_direita');
        }
        game.physics.arcade.bounds.height = 600;
        game.physics.arcade.collide(caixaGrp, layer);
        game.physics.arcade.collide(daniel, layer);
        game.physics.arcade.collide(daniel, objs);
        game.physics.arcade.collide(frutasDaMorte, layer);
        game.physics.arcade.collide(minionGrp, layer);
        game.physics.arcade.collide(daniel, corrente);
        game.physics.arcade.collide(daniel, caixaGrp, function(daniel, caixa){
            if (caixa.key == "caixa_vida") {
                // bônus que restaura as vidas
                vidas = 5;
                vidasGrp.forEachDead(function(vida){vida.revive()});
            } else {
                // bônus tiros
                tiros += 5;
                qtdeTirosTxt.text = 'x' + tiros;
                // terá mais tiros depois de 8 segundos
                game.time.events.add(Phaser.Timer.SECOND * 8, function() {
                    novaCaixa = caixaGrp.create(3790, 300, 'caixa_tiro');
                    game.physics.arcade.enable(novaCaixa);
                }, this);
            }
            caixa.kill();
        });
        game.physics.arcade.collide(layer, tiroGrp, function(tiro, layer) {
            tiro.kill();
        }, null, this);
        game.physics.arcade.collide(tiroGrp, layer);
        game.physics.arcade.overlap(frutasDaMorte, tiroGrp, function(fruta, tiro) {
            fruta.kill();
        }, null, this);
        game.physics.arcade.collide(daniel, minionGrp, function(daniel, minion) {
            if (socao.isDown && !seFudeu) {
                if (minion.foiSocado && game.time.now > minion.tempoPiscando && !minion.morrendo) {
                    somSoco.play();
                    minion.morrendo = true;
                    somWhat.play();
                    minion.animations.play('morrendo', 3, false, true);
                    game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                        minion.destroy();
                        quebraCorrente();
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
        game.physics.arcade.overlap(frutasDaMorte, daniel, sofre, null, this);
        game.physics.arcade.overlap(minionGrp, tiroGrp, function(minion, tiro) {
            somWhat.play();
            minion.animations.play('morrendo', 3, false, true);
            minion.morrendo = true;
            game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                minion.destroy();
                quebraCorrente();
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
        minionGrp.forEachAlive(function(minion){
            if (minion.movendo_direita) {
                minion.body.velocity.x = 50;
            } else {
                minion.body.velocity.x = -50;
            }
        });

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
        if (daniel.x > 2848 && !chefeMinion) {
            animacaoChefao();
        }
    }

    // quando o último minion comum morrer, quebra a corrente para enfrentar o chefão
    function quebraCorrente() {
        if (minionGrp.countLiving() == 0) {
            corrente.destroy();
        }
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

    // muda a direção que o chefe anda para a direita
    function chefeAndarDireita() {
        chefeMinion.movendo_direita = true;
        somChefeMinion.restart();
    }

    // muda a direção que o chefe anda para a esquerda
    function chefeAndarEsquerda() {
        chefeMinion.movendo_direita = false;
        somChefeMinion.restart();
    }
}
