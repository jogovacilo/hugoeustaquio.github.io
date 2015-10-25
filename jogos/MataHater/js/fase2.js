function faseDois() {
    var inclinacao, tirosGrp, btnTiro, tmpTiro = 0;
    var temp = game.rnd.integerInRange(300, 3000);
    var explosions;

    this.preload = function() {
        // TODO escolher trilha da fase 2
        game.load.image('cenario', 'img/CenarioFaseDois.jpg');
        game.load.image('jasa', 'img/jasa.png');
        game.load.image('nave_minion1', 'img/nave_minion1.png');
        game.load.image('tiro', 'img/tiro_f2.png');
        game.load.audio('somTiro', ['audio/tiro_f2.ogg', 'audio/tiro_f2.m4a']);
        game.load.spritesheet('rastro', 'img/rastro.png', 128, 128);
    }

    this.create = function() {
        $('#loading').hide();
        somTiro = game.add.audio('somTiro');
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

        tirosGrp = game.add.group();
        tirosGrp.enableBody = true;
        tirosGrp.physicsBodyType = Phaser.Physics.ARCADE;
        tirosGrp.createMultiple(5, 'tiro');
        tirosGrp.setAll('anchor.x', 0.5);
        tirosGrp.setAll('anchor.y', 1);
        tirosGrp.setAll('outOfBoundsKill', true);
        tirosGrp.setAll('checkWorldBounds', true);
        btnTiro = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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
        //  An explosion pool
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
        temp = game.rnd.integerInRange(300, 3000);
        if (naveMinion) {
            naveMinion.reset(game.rnd.integerInRange(0, game.width), -20);
            naveMinion.body.velocity.x = game.rnd.integerInRange(-300, 300);
            naveMinion.body.velocity.y = 300;
            naveMinion.body.drag.x = 100;
            naveMinion.trail.start(false, 800, 1);
            naveMinion.update = function() {
                naveMinion.angle = - game.math.radToDeg(Math.atan2(naveMinion.body.velocity.x, naveMinion.body.velocity.y));
                naveMinion.trail.x = naveMinion.x;
                naveMinion.trail.y = naveMinion.y - 10;
                // Kill enemies once they go off screen
                if (naveMinion.y > game.height + 200) {
                    naveMinion.kill();
                }
            }
        }
        game.time.events.add(temp, lancaNaveMinion);
    }

    this.update = function() {
        game.physics.arcade.overlap(naveMinionGrp, tirosGrp, mataNaveMinion, null, this);
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
    }

    function mataNaveMinion(enemy, bullet) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        enemy.kill();
        bullet.kill()
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
