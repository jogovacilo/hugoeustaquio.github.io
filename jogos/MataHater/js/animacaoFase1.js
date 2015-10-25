function animacaoFase1() {
    var textoDaniel = ["Cadê meus amigos?", "Fala logo!", "Você só diz 'banana'?", "Não tenho tempo, vou pro \nseu planeta procura-los!"];
    var textoCorrente = 0;
    var choroMinion;
    var irEmbora = false;
    var tirosGrp;

    this.preload = function() {
        game.load.image('cenario', 'img/CenarioAnimacao1.png');
        game.load.audio('trilha', ['audio/mt1.ogg', 'audio/mt1.m4a']);
        game.load.audio('choraminion', ['audio/choraminion.ogg', 'audio/choraminion.m4a']);
        game.load.image('tiro', 'img/tiro.png');
        game.load.spritesheet('rastro', 'img/rastro.png', 128, 128);
    }

    this.create = function() {
        $('#loading').hide();
        trilhaSonora.stop();
        game.physics.arcade.gravity.y = 0;
        game.physics.arcade.gravity.x = 0;
        trilhaSonora = game.add.audio('trilha');
        choroMinion = game.add.audio('choraminion');
        trilhaSonora.play();
        cenario = game.add.tileSprite(0, 0, 800, 513, 'cenario');
        daniel.bringToTop();
        daniel = game.add.sprite(700, 250, 'player');
        daniel.animations.add('andar_esquerda', [17, 16, 15, 14, 13, 12, 11, 10, 9], 10, true);
        daniel.animations.add('soco_esquerda', [35, 34, 33, 32, 31, 30, 29, 28, 27], 10, true);
        daniel.animations.add('tiro_esquerda', [63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50], 15, true);
        daniel.animations.getAnimation("tiro_esquerda").onLoop.add(atirarEsquerda);

        tirosGrp = game.add.group();
        tirosGrp.createMultiple(40, 'tiro');
        game.physics.arcade.enable(tirosGrp);

        daniel.scale.x = 4;
        daniel.scale.y = 4;
        chefeMinion = game.add.sprite(daniel.x - 100, daniel.y, 'chefe_minion');
        chefeMinion.animations.add('chora', [70,71,72,73], 2, true);
        chefeMinion.animations.add('fala', [69], 1, false);
        chefeMinion.scale.x = 2;
        chefeMinion.scale.y = 2;
        game.physics.arcade.enable(chefeMinion);
        legenda = game.add.text(220, 450, '', { fontSize: '22px', fill: '#FFFFFF' });
        game.time.events.add(Phaser.Timer.SECOND * 15, trocaLegendaDaniel, this);

        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(40, 'rastro');
        explosions.forEach( function(explosion) {
            explosion.animations.add('explosion');
        });
    }

    this.update = function() {
        game.physics.arcade.collide(tirosGrp, chefeMinion, explodeMinion, null, this);
        if (daniel.x > 300 && !irEmbora) {
            daniel.x -= 1;
            daniel.animations.play('andar_esquerda');
            chefeMinion.animations.play('fala');
        } else if (!irEmbora) {
            daniel.animations.stop();
        }
        if (chefeMinion.x > 20 && !irEmbora) {
            chefeMinion.x -= (chefeMinion.x > 300) ? 1 : 3;
        } else if (!irEmbora){
            chefeMinion.animations.play('chora');
        }
        if (irEmbora) {
            daniel.x += 1;
            daniel.animations.play('tiro_esquerda');
        }
    }

    function trocaLegendaMinion() {
        legenda.style.fill = "#FF00FF";
        legenda.setText('Minion: "Foram pro meu planeta!"');
        choroMinion.play();
        game.time.events.add(Phaser.Timer.SECOND * 5, trocaLegendaDaniel, this);
    }

    function trocaLegendaDaniel() {
        legenda.style.fill = "#FFFFFF";
        if (textoDaniel[textoCorrente]) {
            legenda.setText("Daniel: \"" +  textoDaniel[textoCorrente] + "\"");
            textoCorrente++;
            game.time.events.add(Phaser.Timer.SECOND * 5, trocaLegendaMinion, this);
        } else {
            irEmbora = true;
            game.time.events.add(Phaser.Timer.SECOND * 8, mataMinion, this);
            game.time.events.add(Phaser.Timer.SECOND * 10, passaFaseDois, this);
        }
        somDesgracado.play();
    }

    function mataMinion() {
        chefeMinion.kill();
    }

    function passaFaseDois() {
        $('#loading').show();
        this.game.stateTransition.to('faseDois');
    }

    function atirarEsquerda() {
        var disparo = tirosGrp.getFirstExists(false);
        disparo.reset(daniel.x, daniel.y + 70);
        somTiro.play();
        disparo.scale.x = 5;
        disparo.scale.y = 5;
        disparo.body.velocity.x = 0;
        disparo.body.velocity.x = -70;
    }

    function explodeMinion(minion, tiro) {
        console.log('faz explodir');
        var explosion = explosions.getFirstExists(false);
        explosion.reset(minion.body.x+50, minion.body.y+50);
        explosion.body.velocity.y = minion.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        minion.body.velocity.y = 0;
        minion.body.velocity.x = 0;
        tiro.kill()
    }
}
