var game = new Phaser.Game(800, 600, Phaser.AUTO, 'jogo', { preload: preload, create: create, update: update });

BasicGame = {};
BasicGame.Boot = function (game) {};

game.state.add('Boot', BasicGame.Boot);
var scoreText, player;
var seFudeu = false, dancaDaVitoria = false, mudo = false;
var passinhos = 0, animaMorte = 0, caiNoChao = 0, objRecolhidos = 0, trilha;
var inicioJogo = new Date().getTime(), tempoPerdido = 0, nomeVacilao = "Vacilãum bestãum";
var ultimoChute = 0, frutas, soldados, carros, background;
var somBicudao, somLua, somVacilo, somLouco, somVeia, somTrivela, somMoral, somBoom, somZoeira;
var fase = 1, ultimo;
var btnRecomecar, vitoria = false;

var MobileButton = function (button, pressedMethod) {
    button.events.onInputDown.add(function () {
        button.isDown = true;
    });
    button.events.onInputUp.add(function () {
        button.isDown = false;
    });
};

window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    if (check) {
        $("#frase_fim").hide();
    }
    return check;
}
var mobile = window.mobileAndTabletcheck();

function reiniciar() {
    // destruir todos os bonus e perigos
    game.time.events.removeAll();
    player.destroy();
    if (seFudeu && !mudo) {
        trilha.play();
    }
    // reiniciar variáveis controladoras
    seFudeu = false, dancaDaVitoria = false;
    passinhos = 0, animaMorte = 0, caiNoChao = 0, loopCount = 0, vaiChover = 1, objRecolhidos = 0, ultimoChute = 0, fase = 1;
    // re-criar o jogo
    create();
    game.input.keyboard.start();
    inicioJogo = new Date().getTime(), tempoPerdido = 0;
}

function preload() {
    game.load.image('grama', 'img/chao.jpg');
    game.load.image('asfalto', 'img/asfalto.jpg');
    game.load.spritesheet('JaoChutaFruta', 'img/JaoChutaFruta.png', 100, 130, 7);
    game.load.image('soldado1', 'img/sold1.png');
    game.load.image('soldado2', 'img/sold2.png');
    game.load.image('soldado3', 'img/sold3.png');
    game.load.image('soldado4', 'img/sold4.png');
    game.load.image('carro', 'img/honda.png');
    game.load.image('morreu', 'img/morreu.png');
    game.load.image('button', 'img/reiniciar.png');
    game.load.spritesheet('explode', 'img/explode.png', 128, 128);

    game.load.audio('trilha', ['audio/trilha.ogg', 'audio/trilha.m4a']);
    game.load.audio('bicudao', ['audio/bicudao.ogg', 'audio/bicudao.m4a']);
    game.load.audio('lua', ['audio/lua.ogg', 'audio/lua.m4a']);
    game.load.audio('vacilo', ['audio/vacilo.ogg', 'audio/vacilo.m4a']);
    game.load.audio('louco', ['audio/louco.ogg', 'audio/louco.m4a']);
    game.load.audio('veia', ['audio/veia.ogg', 'audio/veia.m4a']);
    game.load.audio('trivela', ['audio/trivela.ogg', 'audio/trivela.m4a']);
    game.load.audio('moral', ['audio/moral.ogg', 'audio/moral.m4a']);
    game.load.audio('boom', ['audio/boom.ogg', 'audio/boom.m4a']);
    game.load.audio('zoeira', ['audio/zoeira.ogg', 'audio/zoeira.m4a']);

    game.load.image('fogo1', 'img/fire/fire1.png');
    game.load.image('fogo2', 'img/fire/fire2.png');
    game.load.image('fogo3', 'img/fire/fire3.png');
    game.load.image('fumaca', 'img/fire/smoke-puff.png');

    game.load.spritesheet('laranja', 'img/laranja.png');
    game.load.spritesheet('cereja', 'img/cereja.png');
    game.load.spritesheet('maca', 'img/maca.png');
    game.load.spritesheet('morango', 'img/morango.png');
    game.load.spritesheet('pera', 'img/pera.png');
    game.load.spritesheet('uva', 'img/uva.png');
    game.load.spritesheet('banana', 'img/banana.png');
    game.load.spritesheet('coco', 'img/coco.png');
}

function create() {
    somBicudao = game.add.audio('bicudao');
    somVacilo = game.add.audio('vacilo');
    somLouco = game.add.audio('louco');
    somLua = game.add.audio('lua');
    somVeia = game.add.audio('veia');
    somTrivela = game.add.audio('trivela');
    somMoral = game.add.audio('moral');
    somBoom = game.add.audio('boom');
    somZoeira = game.add.audio('zoeira');
    somLua.play();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 0;
    game.physics.arcade.gravity.x = 0;
    game.canvas.id = 'canvas';
//    game.add.sprite(0, 0, 'grama');
    background = game.add.tileSprite(0, 0, 800, 600, "grama");
    if (!trilha || !trilha.isPlaying) {
        trilha = game.add.audio('trilha', 1, true);
        trilha.play('',0,1,true);
    }

    scoreText = game.add.text(16, 16, 'placar: 0', { fontSize: '32px', fill: '#FFFFFF' });
    player = game.add.sprite(0, game.world.height - 130, 'JaoChutaFruta');
    game.physics.arcade.enable(player);

    //  animação pra chutar a bola.
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 15, true);

    carros = game.add.group();
    carros.enableBody = true;
    frutas = game.add.group();
    frutas.enableBody = true;
    soldados = game.add.group();
    soldados.enableBody = true;
    cursor = game.input.keyboard;
    inimigosFaseUm();
}

function explode(fruta, soldado) {
    objRecolhidos++;
    scoreText.text = 'Placar: ' + objRecolhidos;
    mataSoldado = game.add.sprite(soldado.x - (soldado.width / 2), soldado.y - (soldado.height / 2), 'explode');
    mataSoldado.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 16, true);
    mataSoldado.animations.play('explode', 20, false, true);
    frutas.remove(fruta, true);
    soldados.remove(soldado, true);
    somBoom.play();
    if (objRecolhidos == 35) {
        fase = 2;
        somVacilo.stop();
        somBicudao.stop();
        somVeia.stop();
        somLouco.play();
        background.loadTexture('asfalto');
        setTimeout("background.loadTexture('asfalto')", 1);
        setTimeout("somTrivela.play()", 7000);
        setTimeout(inimigosFaseDois, 7000);
    }
}

function explodeCarro(coco, carro) {
    if (!carro.atropela) {
        objRecolhidos++;
        scoreText.text = 'Placar: ' + objRecolhidos;
        frutas.remove(coco, true);
        if (carro.chutado) {
            carros.remove(carro);
            mataSoldado = game.add.sprite(carro.x, carro.y, 'explode');
            mataSoldado.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 16, true);
            mataSoldado.animations.play('explode', 20, false, true);
            somBoom.play();
        } else {
            carro.chutado = true;
        }
    }
}

function update() {
    arcade = game.physics.arcade;
    try {
        arcade.overlap(frutas, soldados, explode, null, this);
        arcade.overlap(frutas, carros, explodeCarro, null, this);
    }
    catch(err) {}

    rightKey = cursor.addKey(Phaser.Keyboard.RIGHT);
    upKey = cursor.addKey(Phaser.Keyboard.UP);
    downKey = cursor.addKey(Phaser.Keyboard.DOWN);
    if (upKey.isDown && player.y > -100 && !seFudeu) {
        player.y -= 1.5;
    }
    if (downKey.isDown && player.y < game.world.height - 130 && !seFudeu) {
        player.y += 1.5;
    }
    if (rightKey.isDown && !seFudeu) {
        player.animations.play('right');
        // decidir se tem tempo que deu o último chute
        if (ultimoChute == 0) {
            chutaFruta();
        }
    } else {
        player.animations.stop();
    }

    frutas.forEach(function(item) {
        if (item.x == 778 || item.key == "coco" && item.x > 767) {
            frutas.remove(item, true);
        } else if (sprite && sprite.body) {
            emitter = item.getChildAt(0);
            var px = (sprite.body.velocity.x * -1) +20;
            var py = (sprite.body.velocity.y * -1) +20;
            emitter.minParticleSpeed.set(px, py);
            emitter.maxParticleSpeed.set(px, py);
            emitter.emitParticle();
            game.world.wrap(item, 64);
        }
    });

    soldados.forEach(function(soldado){
        if (soldado.alive === true && soldado.x < game.world.bounds.x && !seFudeu) {
            trilha.stop();
            somMoral.play();
            soldado.body.acceleration.set(0);
            soldado.y = player.y + 15;
            soldado.x = player.x + 15;
            soldado.body.gravity.x = 0;
            soldado.body.velocity.x = 0;
            seFudeu = true;
            game.add.text(300, 275, 'GAME OVER', { fontSize: '32px', fill: '#FFFFFF' });
            btnRecomecar = game.add.button(game.world.centerX - 40, game.world.centerY+10, 'button', reiniciar, this, 2, 1, 0);
            teste = soldado;
        }
    });

    carros.forEach(function(carro){
        if (!carro.atropela && seFudeu) {
            carros.remove(carro);
        }
        if (carro.chutado && carro.alpha != 0.7) {
            carro.alpha = 0.7;
        } else if (carro.chutado) {
            carro.alpha = 1;
        }
        if (carro.alive === true && carro.x < 2 && !seFudeu) {
            trilha.stop();
            game.add.text(300, 275, 'GAME OVER', { fontSize: '32px', fill: '#FFFFFF' });
            btnRecomecar = game.add.button(game.world.centerX - 40, game.world.centerY+10, 'button', reiniciar, this, 2, 1, 0);
            seFudeu = true;
            carro.atropela = true;
            carro.cima = true;
            carro.baixo = false;
            carro.body.acceleration.set(0);
            carro.body.gravity.y = 0;
            carro.body.gravity.x = 0;
            carro.chutado = false;
            carro.x = 140;
            carro.angle = 99;
            somZoeira.play();
        }
        if (carro.atropela && carro.cima){
            carro.y -= 1;
            if (carro.y <= 2) {
                carro.cima = false;
                carro.baixo = true;
            }
        }
        if (carro.atropela && carro.baixo){
            carro.y += 1;
            if (carro.y >= 423) {
                carro.cima = true;
                carro.baixo = false;
            }
        }
    });
    if (vitoria && (!seFudeu) && carros.length == 0 && soldados.length == 0) {
        scoreText.text = 'Mãe... No Céu tem vacilo?';
        morto = game.add.group();
        morto.create(100 , 100, 'morreu');
        game.add.text(600, 400, 'E MORREU!', { fontSize: '32px', fill: '#FFFFFF' });
    }
}

function chutaFruta() {
    ultimoChute = 1;
    var sprite_fruta;
    if (fase == 1) {
        switch (Math.floor(Math.random()*6)) {
        case 0:
            sprite_fruta = "laranja";
            break;
        case 1:
            sprite_fruta = "maca";
            break;
        case 2:
            sprite_fruta = "morango";
            break;
        case 3:
            sprite_fruta = "banana";
            break;
        case 4:
            sprite_fruta = "pera";
            break;
        case 5:
            sprite_fruta = "uva";
            break;
        default:
            sprite_fruta = "cereja";
            break;
        }
    } else {
        sprite_fruta = "coco";
    }
    sprite = frutas.create(player.x+30, player.y+120, sprite_fruta);
    game.physics.arcade.enable(sprite);
    sprite.body.bounce.set(0);
    sprite.body.velocity.set(140, 0);
    sprite.body.collideWorldBounds = true;

    emitter = game.add.emitter(player.x+30, player.y+120, 400);
    emitter.makeParticles( [ 'fogo1', 'fogo2', 'fogo3', 'fumaca' ] );
    sprite.addChild(emitter);
    emitter.y = 10;
    emitter.x = -10;
    emitter.gravity = -20;
    emitter.setAlpha(1, 0, 1000);
    emitter.setScale(0.3, 0, 0.3, 0, 1000);
    switch (Math.floor(Math.random()*15)) {
        case 0:somBicudao.play();break;
        case 1:somBicudao.play();break;
        case 2:somBicudao.play();break;
        case 3:somVacilo.play();break;
        case 4:somVacilo.play();break;
        case 5:somVeia.play();break;
    }
    setTimeout(zeraChutes, 1000);
}

function inimigosFaseUm() {
    var i = Math.floor((Math.random() * 8));
    // sorteia o tipo de soldado
    var obj;
    switch (Math.floor((Math.random() * 4))) {
        case 0: obj = soldados.create(800, i * 70, 'soldado1');break;
        case 1: obj = soldados.create(800, i * 70, 'soldado2');break;
        case 2: obj = soldados.create(800, i * 70, 'soldado3');break;
        case 3: obj = soldados.create(700, i * 70, 'soldado4');break;
    }
    obj.enableBody = true;
    obj.body.gravity.x = -5 - Math.floor((Math.random() * 6));
    if (fase == 1 && !seFudeu)
        setTimeout(inimigosFaseUm, Math.random() * 2500);
}

function inimigosFaseDois() {
    var i = Math.floor((Math.random() * 8));
    // sorteia o tipo de soldado
    var obj;
    if (ultimo != 'carro') {
        obj = carros.create(700, i * 70, 'carro');
        obj.body.collideWorldBounds = true;
        ultimo = 'carro';
    } else {
        switch (Math.floor((Math.random() * 4))) {
            case 0: obj = soldados.create(800, i * 70, 'soldado1');break;
            case 1: obj = soldados.create(800, i * 70, 'soldado2');break;
            case 2: obj = soldados.create(800, i * 70, 'soldado3');break;
            case 3: obj = soldados.create(700, i * 70, 'soldado4');break;
        }
        ultimo = 'soldado';
    }
    obj.enableBody = true;
    obj.body.gravity.x = -5 - Math.floor((Math.random() * 6));
    if (objRecolhidos < 50 && !seFudeu)
        setTimeout(inimigosFaseDois, Math.random() * 2500);
    else
        vitoria = true;
}

function zeraChutes() {
    ultimoChute = 0;
}

function toggleMudo() {
    if (mudo) {
        trilha.volume = 0.5;
        game.sound.mute = false;
        mudo = false;
    } else {
        trilha.volume = 0;
        mudo = true;
        game.sound.mute = true;
    }
    $("#mudo").toggleClass("mudo");
    $("#mudo").toggleClass("som");
}
