function faseDois() {
    var inclinacao, tirosGrp, naveMinionGrp, fogueteMinionGrp, btnTiro, tmpTiro = 0;
    var tempoLancaNave1 = game.rnd.integerInRange(300, 3000);
    var tempoLancaNave2 = game.rnd.integerInRange(1000, 5000);
    var explosions, daniel, tirosMinion;

    this.create = function() {
        $('#loading').hide();
        somTiro = game.add.audio('somTiro');
        somLaser = game.add.audio('tiro_laser');
        somExplosao = game.add.audio('explosao');
        trilhaSonora.stop();
        trilhaSonoraChefe.stop();
        trilhaSonora = game.add.audio('trilha', 1, true);
        trilhaSonora.play('',0,1,true);
        game.physics.arcade.gravity.y = 0;
        game.physics.arcade.gravity.x = 0;
        cenario = game.add.tileSprite(0, 0, 800, 513, 'cenario');
        player = game.add.sprite(400, 400, 'jasa');
        player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.maxVelocity.setTo(400, 400);
        player.body.drag.setTo(400, 400);
        game.world.setBounds(0,0,800,513);
        player.body.collideWorldBounds = true;

        vidasGrp = game.add.group();
        vidasGrp.create(675, 15, 'vidas');
        vidasGrp.create(700, 15, 'vidas');
        vidasGrp.create(725, 15, 'vidas');
        vidasGrp.create(750, 15, 'vidas');
        vidasGrp.create(775, 15, 'vidas');
        vidasGrp.fixedToCamera = true;

        tirosGrp = game.add.group();
        tirosGrp.enableBody = true;
        tirosGrp.physicsBodyType = Phaser.Physics.ARCADE;
        tirosGrp.createMultiple(5, 'tiroFase2');
        tirosGrp.setAll('anchor.x', 0.5);
        tirosGrp.setAll('anchor.y', 1);
        tirosGrp.setAll('outOfBoundsKill', true);
        tirosGrp.setAll('checkWorldBounds', true);
        btnTiro = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // tiros inimigos
        tirosMinion = game.add.group();
        tirosMinion.enableBody = true;
        tirosMinion.physicsBodyType = Phaser.Physics.ARCADE;
        tirosMinion.createMultiple(30, 'blueEnemyBullet');
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
            rastroNave(fogueteMinion);
            fogueteMinion.events.onKilled.add(function() {
                fogueteMinion.trail.kill();
            });
        });
        //  objs p/ explosões
        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(30, 'rastro');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach( function(explosion) {
            explosion.animations.add('explosion');
        });
        lancaNaveMinion();
        lancaFogueteMinion();
        vidas = 5;
    }

    this.update = function() {
        game.physics.arcade.overlap(naveMinionGrp, tirosGrp, mataNaveMinion, null, this);
        game.physics.arcade.overlap(fogueteMinionGrp, tirosGrp, acertaFogueteMinion, null, this);
        game.physics.arcade.overlap(player, naveMinionGrp, trombaNave, null, this);
        game.physics.arcade.overlap(player, fogueteMinionGrp, trombaNave, null, this);
        game.physics.arcade.overlap(player, tirosMinion, machuca, null, this);
        cenario.tilePosition.y += 2;
        player.body.acceleration.x = 0;
        player.angle = player.body.velocity.x * 0.05;
        if (cursors.left.isDown) {
            player.body.acceleration.x = -500;
        } else if (cursors.right.isDown) {
            player.body.acceleration.x = 500;
        }
        if (btnTiro.isDown)
            atirar();
        if (daniel)
            daniel.animations.play('morte');
    }

    function trombaNave(player, naveInimiga) {
        mataNaveMinion(naveInimiga, tiroGrp.getFirstExists(false));
        machuca();
    }

    function machuca(jogador, tiro) {
        if (tiro)
            tiro.kill();
        // tirar uma vida do jogador, verificar se ele tem mais que zero vidas
        vidas -= 1;
        if (!(vidas >= 0)) {
            gameOver();
        } else {
            vidasGrp.getFirstAlive().kill();
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
        tempoLancaNave1 = game.rnd.integerInRange(300, 3000);
        if (naveMinion) {
            naveMinion.reset(game.rnd.integerInRange(0, game.width), -20);
            naveMinion.body.velocity.x = game.rnd.integerInRange(-300, 300);
            naveMinion.body.velocity.y = 300;
            naveMinion.body.drag.x = 100;
            naveMinion.trail.start(false, 800, 1);
            // TODO rever
            naveMinion.tiros = 1;
            naveMinion.ultimoTiro = 0;
            naveMinion.update = function() {
                naveMinion.angle = - game.math.radToDeg(Math.atan2(naveMinion.body.velocity.x, naveMinion.body.velocity.y));
                naveMinion.trail.x = naveMinion.x;
                naveMinion.trail.y = naveMinion.y - 10;
                tiro = tirosMinion.getFirstExists(false);
                // TODO rever isso
                if (tiro && this.alive && this.tiros && this.y > game.width / 8 && game.time.now > 2500 + this.ultimoTiro) {
                    this.ultimoTiro = game.time.now;
                    this.tiros = 0;
                    tiro.reset(this.x, this.y + this.height / 2);
                    var angle = game.physics.arcade.moveToObject(tiro, player, 400);
                    tiro.angle = game.math.radToDeg(angle);
                    somLaser.play();
                }
                // mata-los quando eles saem da tela
                if (naveMinion.y > game.height + 200) {
                    naveMinion.kill();
                }
            }
        }
        game.time.events.add(tempoLancaNave1, lancaNaveMinion);
    }

    function lancaFogueteMinion() {
        var foguete = fogueteMinionGrp.getFirstExists(false);
        tempoLancaNave2 = game.rnd.integerInRange(1000, 5000);
        if (foguete) {
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
        game.time.events.add(tempoLancaNave2, lancaFogueteMinion);
    }

    function mataNaveMinion(nave, tiro) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(nave.body.x + nave.body.halfWidth, nave.body.y + nave.body.halfHeight);
        explosion.body.velocity.y = nave.body.velocity.y;
        explosion.alpha = 0.7;
        somExplosao.play();
        explosion.play('explosion', 30, false, true);
        nave.kill();
        if (tiro)
            tiro.kill();
    }

    function acertaFogueteMinion(foguete, tiro) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(foguete.body.x + foguete.body.halfWidth, foguete.body.y + foguete.body.halfHeight);
        explosion.body.velocity.y = foguete.body.velocity.y;
        explosion.alpha = 0.7;
        somExplosao.play();
        explosion.play('explosion', 30, false, true);
        foguete.kill();
        if (tiro)
            tiro.kill();
    }

    function atirar() {
        var tiro = tirosGrp.getFirstExists(false);
        if (tiro && game.time.now > tmpTiro) {
            tiro.reset(player.x + (20 * Math.sin(game.math.degToRad(player.angle))), player.y);
            tiro.angle = player.angle;
            game.physics.arcade.velocityFromAngle(tiro.angle - 90, 400, tiro.body.velocity);
            tiro.body.velocity.x += player.body.velocity.x;
            somTiro.play();
            tmpTiro = game.time.now + 100;
        }
    }
}
