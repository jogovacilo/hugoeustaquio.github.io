function animacaoFase2() {
    var mudouAnimacao = false;

    this.create = function() {
        // trilhaSonora.stop();
        game.physics.arcade.gravity.y = 0;
        game.physics.arcade.gravity.x = 0;
        // trilhaSonora = game.add.audio('trilhaAnimacao1');
        // trilhaSonora.play();

        cenario = game.add.tileSprite(0, 0, 800, 513, 'cenarioTransicaoFase3_1');
        // cenario = game.add.tileSprite(0, 0, 800, 513, 'cenarioTransicaoFase3_2');
        player = game.add.sprite(825, 250, 'jasa');
        player.anchor.setTo(0.5, 0.5);
        player.scale.x = 0.7;
        player.scale.y = 0.7;
        player.angle = -90;
        //player = game.add.sprite(400, -45, 'jasa');
    }

    this.update = function() {
        // game.physics.arcade.collide(player, , explodeMinion, null, this);
        if (player.x > 460) {
            player.x--;
        } else if (!mudouAnimacao) {
            mudouAnimacao = true;
            cenario = game.add.tileSprite(0, 0, 800, 513, 'cenarioTransicaoFase3_2');
            player.x = 400;
            player.y = -45;
            player.bringToTop();
            player.angle = 0;
        } else if (mudouAnimacao && player.y < 460) {
            player.y++;
        } else {
            passaFaseTres();
        }
    }

    function passaFaseTres() {
        this.game.stateTransition.to('faseTres');
    }
}
