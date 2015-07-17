var game = new Phaser.Game(800, 600, Phaser.AUTO, 'jogo', { preload: preload, create: create, update: update });
BasicGame = {};
BasicGame.Boot = function (game) {
};
game.state.add('Boot', BasicGame.Boot);
var bostaSound, cogSound, corSound, cavSound, vitoriaSound, trilha, puloSound;
var txtTempo, scoreText, player, cogs, cavs, cors, bostas, sons;
var seFudeu = false, dancaDaVitoria = false, mudo = false;
var passinhos = 0, animaMorte = 0, caiNoChao = 0, loopCount = 0, vaiChover = 1, pulos=0, objRecolhidos=0;
var inicioJogo = new Date().getTime(), tempoPerdido = 0;
var rightButton, rightButtonDown, movingRight;
var leftButton, leftButtonDown, movingLeft;
var nomeVacilao = "Vacilãum bestãum";

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
    cogs.destroy();
    bostas.destroy();
    cors.destroy();
    cors.destroy();
    vitoriaSound.stop();
    // reiniciar variáveis controladoras
    seFudeu = false, dancaDaVitoria = false;
    passinhos = 0, animaMorte = 0, caiNoChao = 0, loopCount = 0, vaiChover = 1, pulos=0, objRecolhidos = 0;
//    trilha.stop();
    // re-criar o jogo
    create();
    game.input.keyboard.start();
    inicioJogo = new Date().getTime(), tempoPerdido = 0;
}

function preload() {
    // mobile
    if (mobile) {
        game.load.image("left arrow", "img/left_arrow.png");
        game.load.image("right arrow", "img/right_arrow.png");
        game.load.image("up arrow", "img/up_arrow.png");
    }
    // imagens
    game.load.image('sky', 'img/sky.png');
    game.load.image('ground', 'img/chao.png');
    game.load.image('coracao', 'img/coracao.png');
    game.load.image('bosta', 'img/bosta.png');
    game.load.image('cogumelo', 'img/cogumelo.png');
    game.load.image('bosta', 'img/bosta.png');
    game.load.image('caveira', 'img/caveira.png');
    game.load.spritesheet('bayer', 'img/bayer.png', 32, 48);
    game.load.spritesheet('mordente', 'img/mordente.png', 32, 48);
    game.load.spritesheet('carvalho', 'img/carvalho.png', 32, 48);
    // audios
    game.load.audio('vitoriaSound', ['audio/vitoria.ogg', 'audio/vitoria.m4a']);
    game.load.audio('bostaSound', ['audio/bosta.ogg', 'audio/bosta.m4a']);
    game.load.audio('trilha', ['audio/trilha.ogg', 'audio/trilha.m4a']);
    game.load.audio('cogSound', ['audio/cog.ogg', 'audio/cog.m4a']);
    game.load.audio('corSound', ['audio/derrota.ogg', 'audio/derrota.m4a']);
    game.load.audio('cavSound', ['audio/cav.ogg', 'audio/cav.m4a']);
    game.load.audio('puloSound', ['audio/pulo.ogg', 'audio/pulo.m4a']);
    nomeVacilao = prompt("Diz o seu nome, se vacilar feio te cadastro nos recordes!", "Vacilãum bestãum");
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.id = 'canvas';
    // plano de fundo do jogo
    game.add.sprite(0, 0, 'sky');
    // barulhos
    vitoriaSound = game.add.audio('vitoriaSound');
    bostaSound = game.add.audio('bostaSound');
    cogSound = game.add.audio('cogSound');
    corSound = game.add.audio('corSound');
    cavSound = game.add.audio('cavSound');
    puloSound = game.add.audio('puloSound');

    // score
    txtTempo = game.add.text(630, 16, '00:00:00', { fontSize: '32px', fill: '#FFFFFF' });
    scoreText = game.add.text(16, 16, 'placar: 0', { fontSize: '32px', fill: '#000' });
    platforms = game.add.group();
    platforms.enableBody = true;
    // Chão
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    // Escalar a imagem pra ocupar todo o chão
    ground.scale.setTo(2, 2);
    // chão não deve se mover
    ground.body.immovable = true;
    // plataformas acima do chão
    var ledge = platforms.create(100, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(600, 300, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    // Decidir aleatóriamente qual decrépito será o sprite
    switch(Math.floor((Math.random() * 3))) {
        case 0: player = game.add.sprite(32, game.world.height - 150, 'bayer');break;
        case 1: player = game.add.sprite(32, game.world.height - 150, 'mordente');break;
        case 2: player = game.add.sprite(32, game.world.height - 150, 'carvalho');
    }
    game.physics.arcade.enable(player);

    // propriedades físicas do decrépito
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  animações do sprite pra esquerda e direita.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    bostas = game.add.group();
    cogs = game.add.group();
    cavs = game.add.group();
    cors = game.add.group();
    bostas.enableBody = true;
    cogs.enableBody = true;
    cavs.enableBody = true;
    cors.enableBody = true;
    despencaCoisas();

    // agendar outra 'fileira' de obj
    game.time.events.add(Phaser.Timer.SECOND * 5, despencaCoisas, this);
    if (!trilha || !trilha.isPlaying) {
        trilha = game.add.audio('trilha', 1, true);
        trilha.play('',0,1,true);
    }
    // se estiver em mobile, criar controles do jogo
    if (mobile) {
        leftButton = game.add.button(30, 450, "left arrow", andarPraEsquerda);
        var leftButtonInput = new MobileButton(leftButton, movingLeft, leftButtonDown);
        rightButton = game.add.button(650, 450, "right arrow", andarPraDireita);
        var rightButtonInput = new MobileButton(rightButton, movingRight, rightButtonDown);
        pularButton = game.add.button(350, 450, "up arrow", pular);
    }
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

function update() {
    if (!mudo)
        trilha.volume = 0.5;
    //  Collide the player and the cogs with the platforms
    cors.forEachAlive(balancaCoracao, this);
    arcade = game.physics.arcade;
    arcade.collide(player, platforms);
    arcade.collide(cogs, platforms);
    arcade.collide(cavs, platforms);
    arcade.collide(cors, platforms);
    arcade.collide(bostas, platforms);
    arcade.overlap(player, cogs, pegaCogumelo, null, this);
    arcade.overlap(player, cavs, pegaCaveira, null, this);
    arcade.overlap(player, cors, morrer, null, this);
    arcade.overlap(player, bostas, pegaBosta, null, this);
    if (seFudeu && animaMorte > -1.5) {
        player.rotation = animaMorte;
        animaMorte -= 0.1;
    } else if (seFudeu) {
        player.y += caiNoChao;
        caiNoChao += 0.1;
    }
    txtTempo.text = imprimeTempoPerdido();

    if (dancaDaVitoria && passinhos <= 0) {
        player.body.velocity.x = -100;
        player.animations.play('left');
        passinhos--;
        if (passinhos == -30){
            passinhos = 1;
        }
    } else if (dancaDaVitoria && passinhos > 0) {
        player.body.velocity.x = 100;
        player.animations.play('right');
        passinhos++;
        if (passinhos == 30){
            passinhos = -1;
        }
    }

    cursors = game.input.keyboard.createCursorKeys();
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    if (leftKey.isDown || (mobile && leftButton.isDown)) {
        andarPraEsquerda();
    }
    if (rightKey.isDown || (mobile && rightButton.isDown)) {
        andarPraDireita();
    }

    if (cursors.left.isDown && !seFudeu) {
        
    } else if (cursors.right.isDown  && !seFudeu) {
        
    } else {
        if (player.body.velocity.x < 0)
            player.body.velocity.x += 5;
        else
            player.body.velocity.x -= 5;
        if (player.body.velocity.x < 7 && player.body.velocity.x > -7){
            player.body.velocity.x = 0;
            player.animations.stop();
        }
        player.frame = 4;
    }
    this.jumpkey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.jumpkey.onDown.add(pular, this);
    // a cada 3 loops, talvez chova corações
    vaiChover = Math.floor(Math.random()*2);
    if (loopCount > 195 && vaiChover == 1) {
        choveCoracao();
        loopCount = 0;
    }
    loopCount++;
}

function andarPraDireita() {
    if (!seFudeu) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
}
function andarPraEsquerda() {
    if (!seFudeu) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
}

function pular() {
 // pular do chão
    if (player.body.touching.down) {
        player.body.velocity.y = -200;
        cavSound.play();
        pulos = 1;
    } else if (!player.body.touching.down &&  pulos == 1) { // aumentar o pulo
        player.body.velocity.y += -200;
        cavSound.play();
        pulos = 2;
    }
}

function choveCoracao() {
    var arrCoracoes = [];
    while(arrCoracoes.length < 4) {
        var randomnumber=Math.floor(Math.random()*12)
        var found=false;
        for(var i=0;i<arrCoracoes.length;i++) {
            if(arrCoracoes[i]==randomnumber){found=true;break}
        }
        if(!found)arrCoracoes[arrCoracoes.length]=randomnumber;
    }
    for (x = 0; x< arrCoracoes.length; x++) {
        var cor = cors.create(arrCoracoes[x] * 70, 0, 'coracao');
        cor.body.gravity.y = 6 + Math.floor(Math.random())*3;
        cor.body.bounce.y = 0.9 + Math.random() * 0.2;
    }
}

function balancaCoracao(coracao){
    if (coracao.x < 2)
        coracao.body.velocity.x = Math.floor(Math.random()*80)-50;
    else
        coracao.body.velocity.x = 10;
}

function despencaCoisas() {
    // 8 cogumelos ou caveiras em posições aleatórias + 4 corações
    // sorteia uma posição pra pôr um coração da morte
    for (var i = 0; i < 12; i++) {
        // sorteia se vai ser bosta, caveira ou cogumelo
        sorteiaPeca = Math.floor((Math.random() * 3));
        var obj;
        if (sorteiaPeca == 0) {
            obj = cogs.create(i * 70, 0, 'cogumelo');
        } else if (sorteiaPeca == 2) {
            obj = bostas.create(i * 70, 0, 'bosta');
        } else {
            obj = cavs.create(i * 70, 0, 'caveira');
        }
        // pra cada um dos outros objetos, sorteia se vai ser caveira ou cogumelo
        obj.body.gravity.y = 6;
        obj.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
}

function pegaBosta(player, cav) {
    cav.kill();
    objRecolhidos++;
    bostaSound.play();
    verificaVitoria();
}

function pegaCaveira (player, cav) {
    cav.kill();
    objRecolhidos++;
    cavSound.play();
    verificaVitoria();
}

function morrer(player, cor) {
    if (!dancaDaVitoria) {
        cor.kill();
        game.input.keyboard.reset();
        corSound.play();
        scoreText.text = 'Vacilãum perdeu!! PERDEDOR!11!!';
        arcade.overlap(player, cogs, null, null, this);
        arcade.overlap(player, bostas, null, null, this);
        arcade.overlap(player, cavs, null, null, this);
        seFudeu = true;
    }
}

function pegaCogumelo (player, cog) {
    cog.kill();
    objRecolhidos++;
    cogSound.play();
    verificaVitoria();
}

function verificaVitoria() {
    if (!seFudeu) {
        if (objRecolhidos < 24) {
            scoreText.text = 'Placar: ' + objRecolhidos;
        } else {
            scoreText.text = 'Us vacilu táh edificaduh!!!';
            tempoPerdido = tempoPerdido = new Date().getTime() - inicioJogo;
            game.input.keyboard.reset();
            trilha.stop();
            vitoriaSound.loop = true;
            vitoriaSound.play();
            dancaDaVitoria = true;
            arcade.overlap(player, cors, null, null, this);
            enviaRecorde();
        }
    }
}

function enviaRecorde() {
    $.post('recorde.php',{ nome: nomeVacilao, tempo: tempoPerdido }, function(retorno) {
        if (retorno == "true") {
            alert("Tú vacilou feiãum! Te cadastrei!!1! S2");
        } else if (!retorno == "false") {
            setTimeout(enviaRecorde, 300);
        }
    });
}

function imprimeTempoPerdido() {
    if (!seFudeu && !dancaDaVitoria) {
        tempoPerdido = new Date().getTime() - inicioJogo;
    }
    var millis, seconds, minutes, hours;
    x = tempoPerdido;
    millis = Math.floor((x % 1000));
    x /= 1000;
    seconds = Math.floor(x % 60);
    x /= 60;
    minutes = Math.floor(x % 60);
    x /= 60;
    hours = Math.floor(x % 24);
    return [pad2(hours), pad2(minutes), pad2(seconds)].join(':');
}

function pad2(number) {
     return (number < 10 ? '0' : '') + number
   
}
