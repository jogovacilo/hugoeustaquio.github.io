var game = new Phaser.Game(800, 513, Phaser.AUTO, 'jogo');
//teste
window.onload = function () {
    game.stateTransition = game.plugins.add(Phaser.Plugin.StateTransition);
    this.game.stateTransition.configure({
        duration: Phaser.Timer.SECOND * 3,
        ease: Phaser.Easing.Exponential.InOut,
        properties: {
            alpha: 0,
            scale: {
                x: 1.4,
                y: 1.4
            }
        }
    });
    //game.state.add('aguarde', aguarde);
    game.state.add('faseUm', faseUm);
    game.state.add('animacaoFase1', animacaoFase1);
    game.state.add('faseDois', faseDois);
    game.state.add('faseTres', faseTres);
    game.state.add('zerou', zerou);
    game.state.start('faseUm');
}

function reiniciar() {
    vidas = 5, tiros = 15;
    seFudeu = false, ficaMorto = false, estaMachucado = false;
    daniel.x = 32;
    daniel.y = 400;
    if (btnRecomecar)
        btnRecomecar.destroy();
    if (game.state.current != 'faseUm'){
        this.game.stateTransition.to('faseUm');
    } else {
        qtdeTirosTxt.text = 'x15';
        minionGrp.removeAll();
        princesas.removeAll();
        frutasDaMorte.removeAll();
        vidasGrp.removeAll();
        caixaGrp.removeAll();
        if (chefeMinion) {
            chefeMinion.destroy();
            chefeMinion = null;
        }
    }
    inicioJogo();
}

var map, objs, tileset, layer, daniel, cursors, socao, corre, tiro, princesas, chefeMinion;
var tiroGrp, minionGrp, frutasDaMorte, firingTimer = 0, minionsVivos = [], frutasParadas = [], vidas=5, vidasGrp,
    caixaGrp, seFudeu = false, ficaMorto = false, tiros = 15, qtdeTirosTxt;
var estaMachucado = false;
var barraSaudeChefao;

// sons
var somMorri, somWhat, trilhaSonora, trilhaSonoraChefe, somDesgracado, sonsBayer, somSoco, somTiroFalha, somChefeMinion, somTiro;
var btnRecomecar, ult_movimento_direita = true, mudo = false;
var arcade, corrente;

function fullscreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.startFullScreen();
}

function inicioJogo() {
    vidasGrp.create(675, 15, 'vidas');
    vidasGrp.create(700, 15, 'vidas');
    vidasGrp.create(725, 15, 'vidas');
    vidasGrp.create(750, 15, 'vidas');
    vidasGrp.create(775, 15, 'vidas');
    vidasGrp.fixedToCamera = true;
    // criar caixas vida e tiros
    caixaGrp.create(3790, 300, 'caixa_tiro');
    caixaGrp.create(2878, 355, 'caixa_vida');
    game.physics.arcade.enable(caixaGrp);

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
    game.physics.arcade.enable(minionGrp);
    minionGrp.forEachAlive(function(minion){
        minion.movendo_direita = true;
        minion.foiSocado = false;
        minion.tempoPiscando = 0;
        minion.morrendo = false;
        minion.animations.add('normal', [0], 0, false);
        minion.animations.add('machucado', [1], 0, false);
        minion.animations.add('morrendo', [2,3,4,5,6,7,8,9,10,11], 5, true);
    });

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
    //somDesgracado.play();
    // cria uma corrente que só será quebrada quando todos os minions simples morrerem.
    // essa corrente impede chegar ao chefão
    corrente = game.add.group();
    corrente.enableBody = true;
    corrente.physicsBodyType = Phaser.Physics.ARCADE;
    corrente.create(2831, 220, 'chain');
    corrente.create(2831, 130, 'chain');
    corrente.create(2831, 0, 'chain');
    game.physics.arcade.enable(corrente);
    corrente.forEach(function(corrente) {
        corrente.body.gravity.y = -250;
        corrente.body.immovable = true;
    });
}

function toggleMudo() {
    if (mudo) {
        trilhaSonora.volume = 1;
        game.sound.mute = false;
        mudo = false;
        trilhaSonora.volume = 1;
        game.sound.mute = false;
        trilhaSonora.volume = 1;
    } else {
        mudo = true;
        game.sound.mute = true;
        trilhaSonora.volume = 0;
    }
    $("#mudo").toggleClass("mudo");
    $("#mudo").toggleClass("som");
}
