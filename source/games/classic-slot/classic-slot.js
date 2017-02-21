var game = new Phaser.Game(core.canvas.getWidth(), core.canvas.getHeight(), Phaser.AUTO, 'canvas', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.image('bg', '/games/classic-slot/images/bg.png');
  game.load.spritesheet('symbols', '/games/classic-slot/images/symbols.png', 430/3, 425/3 ,9);
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.setScreenSize();
}

var symbols;

function create() {
game.add.image(game.world.centerX ,game.world.centerY, 'bg').anchor.set(0.5)

  var a = game.add.sprite(game.world.centerX - 170,game.world.centerY,'symbols')
  a.anchor.set(0.5)
  var b = game.add.sprite(game.world.centerX ,game.world.centerY,'symbols')
  b.anchor.set(0.5)
  var c = game.add.sprite(game.world.centerX +170,game.world.centerY,'symbols')
  c.anchor.set(0.5)
  symbols = [a,b,c];

  $.getJSON(core.api("/games/classic-slot"), function(data) {
    $.each(symbols, function(i,symbol) {
      symbol.frame = data.stops[i];
    });
  });

  core.addButton("Spin!", spin);
  core.ready();
}
var timeout;
function random() {
  $.each(symbols, function(i,symbol) {
    symbol.frame = Math.floor(Math.random() * 9)
  });
  timeout = setTimeout(random, 100);
}
function spin() {
  random();
  $.post(core.api("/games/classic-slot/spins"), {amount: core.coin})
    .done(function(data) {
      $.each(symbols, function(i,symbol) {
        symbol.frame = data.stops[i];
      });
      core.setBalance(data.balance);
    })
    .fail(core.handleError)
    .always(function() {
      clearTimeout(timeout);
    })
}

function update() {

}

function render() {
  // game.debug.cameraInfo(game.camera, 32, 32);
}