function creditos() {
    game.paused = true;
}

function fullscreen() {
    var el = document.getElementById('canvas');
    if (el.webkitRequestFullScreen) {
        el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen){
        el.msRequestFullscreen();
    } else {
        el.requestFullscreen();
    }
}

$(document).ready(function() {
    $("#ranking").fancybox({
        width    : 800,
        height   : 600,
        fitToView   : true,
        type        : 'iframe',
        afterClose  : function() {
            game.paused = false;
        }
    });
    $(".various").fancybox({
        maxWidth    : 800,
        maxHeight   : 600,
        fitToView   : false,
        width       : '70%',
        height      : '70%',
        autoSize    : false,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none',
        afterClose  : function() {
            game.paused = false;
        }
    });
});
$(document).ready(function(){
    $(document).keypress(function(e){
        if (e.charCode && e.charCode == 114) {
            reiniciar();
        } else if (e.which && e.which == 114) {
            reiniciar();
        }
        if (e.charCode && e.charCode == 102) {
            fullscreen();
        } else if (e.which && e.which == 102) {
            fullscreen();
        }
    });
});