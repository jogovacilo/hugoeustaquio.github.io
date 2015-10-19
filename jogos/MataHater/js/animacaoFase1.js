function animacaoFase1() {
    var textoDaniel = ["Cadê meus amigos?", "Fala logo!", "Você só diz 'banana'?", "Não tenho tempo, vou pro seu planeta procura-los!"];
    var textoCorrente = 0;

    this.preload = function() {
        game.load.image('cenario', 'img/CenarioAnimacao1.png');
        game.load.audio('trilha', ['audio/mt1.ogg', 'audio/mt1.m4a']);
    }

    this.create = function() {
        $('#loading').hide();
        trilhaSonora.stop();
        trilhaSonora = game.add.audio('trilha');
        trilhaSonora.play();
        cenario = game.add.tileSprite(0, 0, 800, 513, 'cenario');
        daniel.bringToTop();
        daniel = game.add.sprite(700, 250, 'player');
        daniel.animations.add('andar_esquerda', [17, 16, 15, 14, 13, 12, 11, 10, 9], 10, true);
        daniel.animations.add('soco_esquerda', [35, 34, 33, 32, 31, 30, 29, 28, 27], 10, true);
        daniel.animations.add('tiro_esquerda', [63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50], 15, true);

        daniel.scale.x = 4;
        daniel.scale.y = 4;
        chefeMinion = game.add.sprite(daniel.x - 100, daniel.y, 'chefe_minion');
        chefeMinion.animations.add('chora', [70,71,72,73], 2, true);
        chefeMinion.animations.add('fala', [69], 1, false);
        chefeMinion.scale.x = 2;
        chefeMinion.scale.y = 2;
        legenda = game.add.text(25, 8, '', { fontSize: '22px', fill: '#FFFFFF' });
        game.time.events.add(Phaser.Timer.SECOND * 15, trocaLegendaMinion, this);
        // TODO adicionar os eventos
    }

    this.update = function() {
        // TODO verificar o tempo e fazer o Daniel:
        // a) empurrar o minion até a cadeira
        if (daniel.x > 300) {
            daniel.x -= 1;
            daniel.animations.play('andar_esquerda');
            chefeMinion.animations.play('fala');
        } else {
            daniel.animations.stop();
        }
        if (chefeMinion.x > 20) {
            chefeMinion.x -= (chefeMinion.x > 300) ? 1 : 3;
        } else {
            chefeMinion.animations.play('chora');
        }
        // b) bater no minion em tempos específicos
        // c) dar um papel pra ele escrever
        // d) deixar uma dinamite e ir embora
        // e) explodir tudo
        // f) passar para a fase2
        //this.game.stateTransition.to('faseDois');
    }

    function trocaLegendaMinion() {
        legenda.setText('Minion: "Foram pro meu planeta!"');
        game.time.events.add(Phaser.Timer.SECOND * 4, trocaLegendaDaniel, this);
    }

    function trocaLegendaDaniel() {
        if (textoDaniel[textoCorrente]) {
            legenda.setText("Daniel: \"" +  textoDaniel[textoCorrente] + "\"");
            textoCorrente++;
            game.time.events.add(Phaser.Timer.SECOND * 4, trocaLegendaMinion, this);
        } else {
            game.time.events.add(Phaser.Timer.SECOND * 4, passaFaseDois, this);
        }
    }

    function passaFaseDois() {
        $('#loading').show();
        this.game.stateTransition.to('faseDois');
    }
}
