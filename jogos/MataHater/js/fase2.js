function faseDois() {
    var inclinacao, tirosGrp, naveMinionGrp, fogueteMinionGrp, tmpTiro = 0;
    var tempoLancaNave1 = game.rnd.integerInRange(300, 3000);
    var tempoLancaNave2 = game.rnd.integerInRange(1000, 5000);
    var explosions, daniel, tirosMinion, navesMortas = 0, foguetesMortos = 0;
    // quantidade de naves e foguetes a serem abatidos antes de chegar no chefão
    var qtdeNaves = 45, qtdeFoguetes = 30, enfrentandoChefao = false;
    var legendaQtdeFoguetes, legendaQtdeNaves, nivelTiro = 0;

    this.create = function() {
        somTiro = game.add.audio('somTiro');
        somLaser = game.add.audio('tiro_laser');
        somExplosao = game.add.audio('explosao');
        trilhaSonora.stop();
        trilhaSonoraChefe.stop();
        trilhaSonora = game.add.audio('trilhaFase2', 1, true);
        trilhaSonora.play('',0,1,true);
        game.physics.arcade.gravity.y = 0;
        game.physics.arcade.gravity.x = 0;
        cenario = game.add.tileSprite(0, 0, 800, 513, 'cenarioFaseDois');
        player = game.add.sprite(400, 400, 'jasa');
        player.anchor.setTo(0.5, 0.5);
        player.scale.x = 0.7;
        player.scale.y = 0.7;
        game.physics.arcade.enable(player);
        player.body.maxVelocity.setTo(400, 400);
        player.body.drag.setTo(400, 400);
        game.world.setBounds(0,0,800,513);
        player.body.collideWorldBounds = true;
        player.estaMachucado = false;

        // chefão que será enfrentado no final da fase
        chefe_f2 = game.add.sprite(400, -200, 'chefe_f2');
        chefe_f2.exists = false;
        chefe_f2.alive = false;
        chefe_f2.explodindo = false;
        chefe_f2.entradaTriunfal = true;
        chefe_f2.anchor.setTo(0.5, 0.5);
        chefe_f2.ultimoTiro = 0;
        chefe_f2.morre = function() {
            this.ultimoTiro = game.time.now + 50000;
            this.explodindo = true;
            game.time.events.add(Phaser.Timer.SECOND*3, function(){this.game.stateTransition.to('animacaoFase2');});
        };
        chefe_f2.update = function() {
            if (tiro && this.alive && !this.entradaTriunfal && game.time.now > 2500 + this.ultimoTiro) {
                for (i=0; i<3; i++) {
                    tiro = tirosMinion.getFirstExists(false);
                    this.ultimoTiro = game.time.now;
                    if (i == 0)
                        tiro.reset(this.x -25, 130);
                    else if (i == 1)
                        tiro.reset(this.x -125, 130);
                    else if (i == 2)
                        tiro.reset(this.x +125, 130);
                    var angle = game.physics.arcade.moveToObject(tiro, player, 340);
                    tiro.angle = game.math.radToDeg(angle);
                    somLaser.play();
                }
            }
            if (this.explodindo) {
                for (i=0; i<60; i++) {
                    var explosion = explosions.getFirstExists(false);
                    if (explosion) {
                        explosion.reset(this.body.x + game.rnd.integerInRange(-200, 500), this.body.y + game.rnd.integerInRange(-200, 200));
                        explosion.alpha = 0.7;
                        somExplosao.play();
                        explosion.play('explosion', 30, false, true);
                    }
                }
            }
        }
        game.physics.arcade.enable(chefe_f2);

        var imgQtdeFoguetes = game.add.image(10, 12, 'nave_minion2');
        var imgQtdeNaves = game.add.image(85, 15, 'nave_minion1');
        imgQtdeFoguetes.scale.x = 0.12;
        imgQtdeFoguetes.scale.y = 0.12;
        imgQtdeNaves.scale.x = 0.4;
        imgQtdeNaves.scale.y = 0.4;
        legendaQtdeNaves = game.add.text(115, 15, ': 30', { fontSize: '18px', fill: '#FFFFFF' });
        legendaQtdeFoguetes = game.add.text(40, 15, ': 15', { fontSize: '18px', fill: '#FFFFFF' });
        caixaGrp = game.add.group();

        vidasGrp = game.add.group();
        vidasGrp.create(625, 15, 'vidas');
        vidasGrp.create(650, 15, 'vidas');
        vidasGrp.create(675, 15, 'vidas');
        vidasGrp.create(700, 15, 'vidas');
        vidasGrp.create(725, 15, 'vidas');
        vidasGrp.create(750, 15, 'vidas');
        vidasGrp.create(775, 15, 'vidas');
        vidasGrp.fixedToCamera = true;
        vidas = 7;

        tirosGrp = game.add.group();
        tirosGrp.enableBody = true;
        tirosGrp.physicsBodyType = Phaser.Physics.ARCADE;
        tirosGrp.createMultiple(5, 'tiroFase2');
        tirosGrp.setAll('anchor.x', 0.5);
        tirosGrp.setAll('anchor.y', 1);
        tirosGrp.setAll('outOfBoundsKill', true);
        tirosGrp.setAll('checkWorldBounds', true);

        // tiros inimigos
        tirosMinion = game.add.group();
        tirosMinion.enableBody = true;
        tirosMinion.physicsBodyType = Phaser.Physics.ARCADE;
        tirosMinion.createMultiple(30, 'tiroMinion');
        tirosMinion.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
        tirosMinion.setAll('alpha', 0.9);
        tirosMinion.setAll('anchor.x', 0.5);
        tirosMinion.setAll('anchor.y', 0.5);
        tirosMinion.setAll('outOfBoundsKill', true);
        tirosMinion.setAll('checkWorldBounds', true);
        tirosMinion.forEach(function(enemy){
            enemy.body.setSize(20, 20);
        });

        //  naves inimigas
        naveMinionGrp = game.add.group();
        naveMinionGrp.enableBody = true;
        naveMinionGrp.physicsBodyType = Phaser.Physics.ARCADE;
        naveMinionGrp.createMultiple(5, 'nave_minion1');
        naveMinionGrp.setAll('anchor.x', 0.5);
        naveMinionGrp.setAll('anchor.y', 0.5);
        naveMinionGrp.setAll('scale.x', 0.5);
        naveMinionGrp.setAll('scale.y', 0.5);
        naveMinionGrp.forEach(function(naveMinion) {
            rastroNave(naveMinion);
            naveMinion.events.onKilled.add(function() {
                naveMinion.trail.kill();
            });
        });
        //  naves inimigas2
        fogueteMinionGrp = game.add.group();
        fogueteMinionGrp.enableBody = true;
        fogueteMinionGrp.physicsBodyType = Phaser.Physics.ARCADE;
        fogueteMinionGrp.createMultiple(5, 'nave_minion2');
        fogueteMinionGrp.setAll('anchor.x', 0.6);
        fogueteMinionGrp.setAll('anchor.y', 0.6);
        fogueteMinionGrp.setAll('scale.x', 0.6);
        fogueteMinionGrp.setAll('scale.y', 0.6);
        fogueteMinionGrp.forEach(function(fogueteMinion) {
            fogueteMinion.jaFoiAcertado = false; // o foguete só será explodido quando receber um segundo tiro
            rastroNave(fogueteMinion);
            fogueteMinion.events.onKilled.add(function() {
                fogueteMinion.trail.kill();
            });
        });
        //  objs p/ explosões
        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(60, 'rastro');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach( function(explosion) {
            explosion.animations.add('explosion');
        });

        lancaNaveMinion();
        lancaFogueteMinion();
        // adiciona controle similar a fase 1, mas permite tb que use o espaco pra atirar
        tiroF1 = game.input.keyboard.addKey(Phaser.Keyboard.C);
    }

    this.update = function() {
        game.physics.arcade.overlap(naveMinionGrp, tirosGrp, mataNaveMinion, null, this);
        game.physics.arcade.overlap(fogueteMinionGrp, tirosGrp, acertaFogueteMinion, null, this);
        game.physics.arcade.collide(player, caixaGrp, pegaCaixa, null, this);
        if (!player.estaMachucado) {
            game.physics.arcade.overlap(player, naveMinionGrp, trombaNave, null, this);
            game.physics.arcade.overlap(player, fogueteMinionGrp, trombaNave, null, this);
            game.physics.arcade.overlap(player, tirosMinion, machuca, null, this);
        }

        // chefão da fase terá uma entrada triunfal
        if (chefe_f2.exists && chefe_f2.entradaTriunfal) {
            if (chefe_f2.y < 100)
                chefe_f2.y++;
            else
                chefe_f2.entradaTriunfal = false; // já fez sua entrada triunfal
        } else if (chefe_f2.exists) {
            game.physics.arcade.overlap(tirosGrp, chefe_f2, acertaChefeMinion, null, this);
            game.physics.arcade.overlap(player, chefe_f2, trombaChefe, null, this);
        }

        // fuga do chefe minion
        if (chefe_f2.explodindo) {
            chefe_f2.y--;
        }

        cenario.tilePosition.y += 2;
        player.angle = player.body.velocity.x * 0.05;
        player.body.acceleration.x = 0;
        player.body.acceleration.y = 0;
        if (cursors.left.isDown) {
            player.body.acceleration.x = -500;
        } else if (cursors.right.isDown) {
            player.body.acceleration.x = 500;
        }
        if (tiroF1.isDown)
            atirar();
        if (cursors.up.isDown) {
            player.body.acceleration.y = -420;
        } else if (cursors.down.isDown) {
            player.body.acceleration.y = 420;
        }
        if (daniel)
            daniel.animations.play('morte');
        if (player.estaMachucado) {
            player.alpha = (player.alpha == 1) ? 0 : 1;
        } else {
            player.alpha = 1;
        }
    }

    function trombaNave(player, naveInimiga) {
        mataNaveMinion(naveInimiga, null);
        machuca();
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

    function gameOver() {
        trilhaSonora.stop();
        // criar explosoes e matar o jogador
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.body.velocity.y = player.body.velocity.y;
        explosion.alpha = 0.7;
        somExplosao.play();
        explosion.play('explosion', 30, false, true);
        player.kill();

        // arremessar a imagem do daniel em direção aleatória
        daniel = game.add.sprite(player.x, player.y, 'player'); // será usada a animação quando ele morre
        anim = daniel.animations.add('morte', [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83], 5, false);
        anim.onComplete.add(function(a,b){daniel.kill();}, this);
        game.physics.arcade.enable(daniel);
        game.physics.arcade.gravity.y = game.rnd.integerInRange(-20, -80);
        game.physics.arcade.gravity.x = game.rnd.integerInRange(-50, 50);
        daniel.body.angularAcceleration =  game.rnd.integerInRange(5, 20);

        somMorri.play();
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            btnRecomecar = game.add.button(350, 250, 'button', reiniciar, this, 2, 1, 0);
            btnRecomecar.fixedToCamera = true;
            trilhaSonora = null;
        }, this);
    }

    function rastroNave(naveMinion) {
        var rastro = game.add.emitter(naveMinion.x, player.y - 10, 100);
        rastro.width = 10;
        rastro.makeParticles('rastro', [1,2,3,4,5]);
        rastro.setXSpeed(20, -20);
        rastro.setRotation(50,-50);
        rastro.setAlpha(0.4, 0, 800);
        rastro.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
        naveMinion.trail = rastro;
    }

    function lancaNaveMinion() {
        var naveMinion = naveMinionGrp.getFirstExists(false);
        if (!enfrentandoChefao)
            tempoLancaNave1 = game.rnd.integerInRange(500, 2700);
        else
            tempoLancaNave1 = game.rnd.integerInRange(2000, 2500);
        if (naveMinion) {
            naveMinion.reset(game.rnd.integerInRange(0, game.width), -20);
            naveMinion.body.velocity.x = game.rnd.integerInRange(-300, 300);
            naveMinion.body.velocity.y = 300;
            naveMinion.body.drag.x = 100;
            naveMinion.trail.start(false, 800, 1);
            // tiros que as naves minions disparam
            naveMinion.tiros = 1;
            naveMinion.ultimoTiro = 0;
            naveMinion.update = function() {
                naveMinion.angle = - game.math.radToDeg(Math.atan2(naveMinion.body.velocity.x, naveMinion.body.velocity.y));
                naveMinion.trail.x = naveMinion.x;
                naveMinion.trail.y = naveMinion.y - 10;
                tiro = tirosMinion.getFirstExists(false);
                if (tiro && this.alive && this.tiros && this.y > game.width / 8 && game.time.now > 2500 + this.ultimoTiro) {
                    this.ultimoTiro = game.time.now;
                    this.tiros = 0;
                    tiro.reset(this.x, this.y + this.height / 2);
                    var angle = game.physics.arcade.moveToObject(tiro, player, 340);
                    tiro.angle = game.math.radToDeg(angle);
                    somLaser.play();
                }
                // mata-los quando eles saem da tela
                if (naveMinion.y > game.height + 200) {
                    naveMinion.kill();
                }
            }
        }
        if (!chefe_f2.explodindo)
            game.time.events.add(tempoLancaNave1, lancaNaveMinion);
    }

    function lancaFogueteMinion() {
        var foguete = fogueteMinionGrp.getFirstExists(false);
        if (!enfrentandoChefao)
            tempoLancaNave2 = game.rnd.integerInRange(900, 3700);
        else
            tempoLancaNave2 = game.rnd.integerInRange(3000, 6000);
        if (foguete) {
            foguete.jaFoiAcertado = false;
            foguete.alpha = 1;
            foguete.reset(game.rnd.integerInRange(0, game.width), -200);
            foguete.body.velocity.x = game.rnd.integerInRange(-500, 500);
            foguete.body.velocity.y = 300;
            foguete.body.drag.x = 100;
            foguete.trail.start(false, 800, 1);
            foguete.update = function() {
                foguete.angle = - game.math.radToDeg(Math.atan2(foguete.body.velocity.x, foguete.body.velocity.y));
                foguete.trail.x = foguete.x;
                foguete.trail.y = foguete.y - 10;
                if (foguete.y > game.height + 200) {
                    foguete.kill();
                }
            }
        }
        if (!chefe_f2.explodindo)
            game.time.events.add(tempoLancaNave2, lancaFogueteMinion);
    }

    function mataNaveMinion(nave, tiro) {
        var explosion = explosions.getFirstExists(false);
        if (explosion) {
            explosion.reset(nave.body.x + nave.body.halfWidth, nave.body.y + nave.body.halfHeight);
            explosion.body.velocity.y = nave.body.velocity.y;
            explosion.alpha = 0.7;
            somExplosao.play();
            explosion.play('explosion', 30, false, true);
        }
        qtdeNaves--;
        if (qtdeNaves >= 0) {
            legendaQtdeNaves.setText(': ' + qtdeNaves);
            // a cada 10 naves abatidas joga uma caixa de vida
            if (qtdeNaves % 10 == 0) {
                jogaCaixa('caixa_vida', nave.x, nave.y);
            }
        }
        if (qtdeNaves <= 0 && qtdeFoguetes <= 0 && !enfrentandoChefao) {
            game.time.events.add(Phaser.Timer.SECOND * 5, chamaChefao, this);
            enfrentandoChefao = true;
        }
        nave.kill();
        acertaTiro();
        if (tiro)
            tiro.kill();
    }

    function acertaFogueteMinion(foguete, tiro) {
        if (tiro)
            tiro.kill();
        if (foguete.jaFoiAcertado) {
            var explosion = explosions.getFirstExists(false);
            if (explosion) {
                explosion.reset(foguete.body.x + foguete.body.halfWidth, foguete.body.y + foguete.body.halfHeight);
                explosion.body.velocity.y = foguete.body.velocity.y;
                explosion.alpha = 0.7;
                somExplosao.play();
                explosion.play('explosion', 30, false, true);
            }
            foguete.kill();
            qtdeFoguetes--;
            if (qtdeFoguetes >= 0) {
                legendaQtdeFoguetes.setText(': ' + qtdeFoguetes);
                // a cada 5 foguetes abatidos melhora um pouco o tiro
                if (qtdeFoguetes % 5 == 0) {
                    jogaCaixa('caixa_tiro', foguete.x, foguete.y);
                }
            }
            acertaTiro();
            if (qtdeNaves <= 0 && qtdeFoguetes <= 0 && !enfrentandoChefao) {
                game.time.events.add(Phaser.Timer.SECOND * 5, chamaChefao, this);
                enfrentandoChefao = true;
            }
        } else {
            foguete.jaFoiAcertado = true;
            foguete.alpha = 0.5;
        }
    }

    function chamaChefao() {
        chefe_f2.exists = true;
        chefe_f2.alive = true;
        chefe_f2.reset(game.width / 2, -chefe_f2.height);
        chefe_f2.health = 350;
        tmpChefeAtira = game.time.now + 5000;
        barraSaudeChefao = new HealthBar(game, {x: 380, y: 490, height: 30,bar: {color: '#660099'},});
    }

    function acertaChefeMinion(chefe, tiro) {
        chefe.health--;
        barraSaudeChefao.setPercent(Math.round((chefe.health * 100) / 350 ));
        if (chefe.health <= 0) {
            chefe.morre();
        } else {
            var explosion = explosions.getFirstExists(false);
            explosion.reset(tiro.body.x + tiro.body.halfWidth, tiro.body.y + tiro.body.halfHeight);
            explosion.alpha = 0.7;
            somExplosao.play();
            explosion.play('explosion', 30, false, true);
            acertaTiro();
        }
        tiro.kill();
    }

    function trombaChefe(player, chefe) {
        machuca();
        player.y += 15;
    }

    function jogaCaixa(imgCaixa, x, y) {
        novaCaixa = caixaGrp.create(x, y, imgCaixa);
        game.physics.arcade.enable(novaCaixa);
        novaCaixa.body.gravity.y = 175;
        novaCaixa.body.gravity.x = 0;
    }

    function pegaCaixa(player, caixa) {
        if (caixa.key == 'caixa_vida' && vidas < 7) {
            vidas = 7;
            vidasGrp.forEachDead(function(vida){vida.revive()});
        } else if (caixa.key == 'caixa_tiro') {
            tirosGrp.createMultiple(3, 'tiroFase2');
            tirosGrp.setAll('anchor.x', 0.5);
            tirosGrp.setAll('anchor.y', 1);
            tirosGrp.setAll('outOfBoundsKill', true);
            tirosGrp.setAll('checkWorldBounds', true);
            nivelTiro++;
        }
        caixa.kill();
    }

    function atirar() {
        var qtdeTirosDisparados = (nivelTiro < 2) ? 1 : 2;
        var disparou = false;
        for (i = 0; i < qtdeTirosDisparados; i++) {
            var tiro = tirosGrp.getFirstExists(false);
            if (tiro && game.time.now > tmpTiro) {
                tiro.reset(player.x + (20 * Math.sin(game.math.degToRad(player.angle))), player.y);
                if (nivelTiro < 2) {
                    tiro.angle = player.angle;
                } else if (i == 0){
                    tiro.angle = player.angle - 20;
                } else {
                    tiro.angle = player.angle + 20;
                }
                game.physics.arcade.velocityFromAngle(tiro.angle - 90, 400, tiro.body.velocity);
                tiro.body.velocity.x += player.body.velocity.x;
                disparou = true;
            }
        }
        if (disparou) {
            somLaser.play();
            tmpTiro = game.time.now + 125;
        }
    }

    function acertaTiro() {
        probabilidade = 20;
        if (chefe_f2.alive) {
            probabilidade = 140;
        }
        switch (game.rnd.integerInRange(0, probabilidade)) {
            case 1: sonsBayer.play('morreMinion');break;
            case 2: sonsBayer.play('viado');break;
            case 3: sonsBayer.play('hahaha');break;
            case 4: sonsBayer.play('morreAi');break;
            case 5: sonsBayer.play('coco');break;
            case 6: sonsBayer.play('teMatar');break;
        }
    }
}
