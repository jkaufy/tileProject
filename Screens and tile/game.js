var GAME_WIDTH = 500;
var GAME_HEIGHT = 500;
var GAME_SCALE = 4;
var DIM = 16;

var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var startStage = new PIXI.Container();
var insturctionStage = new PIXI.Container();
var creditStage = new PIXI.Container();
var endStage = new PIXI.Container();
var gameStage = new PIXI.Container();

var credits = false;
var instructions = false;
var start = true;
var game = false;
var endGame = false;

var intructionsBackButton;
var creditBackButton;
var endBackButton;
var playButton;
var instructionButton;
var creditButton;
var creditScreenImage;
var instuctionScreenImage;

PIXI.loader
  .add('img/BackButton.png')
  .add('img/playButton.png')
  .add('img/InstructionButton.png')
  .add('img/CreditButton.png')
  .add('img/creditspage.png')
  .add('img/Instructionspage.png')
  .load(setUp);

function setUp()
{
  // Load buttons
  var intructionsBackButton = new PIXI.Sprite(PIXI.loader.resources["img/BackButton.png"].texture);
  var creditBackButton = new PIXI.Sprite(PIXI.loader.resources["img/BackButton.png"].texture);
  var endBackButton = new PIXI.Sprite(PIXI.loader.resources["img/BackButton.png"].texture);
  var playButton = new PIXI.Sprite(PIXI.loader.resources["img/playButton.png"].texture);
  var instructionButton = new PIXI.Sprite(PIXI.loader.resources["img/InstructionButton.png"].texture);
  var creditButton = new PIXI.Sprite(PIXI.loader.resources["img/CreditButton.png"].texture);

  // Load screens
  var creditScreenImage = new PIXI.Sprite(PIXI.loader.resources["img/creditspage.png"].texture);
  var instuctionScreenImage = new PIXI.Sprite(PIXI.loader.resources["img/Instructionspage.png"].texture);

  // Start Screen
  startStage.addChild(playButton);
  startStage.addChild(instructionButton);
  startStage.addChild(creditButton);

  playButton.position.x = 185;
  playButton.position.y = 200;

  instructionButton.position.x = 125;
  instructionButton.position.y = 275;

  creditButton.position.x = 160;
  creditButton.position.y = 350;

  playButton.interactive = true;
  instructionButton.interactive = true;
  creditButton.interactive = true;

  playButton.on('mousedown', playButtonPush);
  instructionButton.on('mousedown', instructionButtonPush);
  creditButton.on('mousedown', creditButtonPush);

  // Instruction Screen
  insturctionStage.addChild(instuctionScreenImage);
  insturctionStage.addChild(intructionsBackButton);

  intructionsBackButton.interactive = true;
  intructionsBackButton.on('mousedown', intructionsBackButtonPush);

  intructionsBackButton.position.x = 185;
  intructionsBackButton.position.y = 400;

  // Credit Screen
  creditStage.addChild(creditScreenImage);
  creditStage.addChild(creditBackButton);

  creditBackButton.interactive = true;
  creditBackButton.on('mousedown', creditBackButtonPush);

  creditBackButton.position.x = 185;
  creditBackButton.position.y = 400;
}


// Changing screens on button clicks
function instructionButtonPush(e)
{
  instructions = true;
  start = false; 
}

function playButtonPush(e) {
  game = true;
  start = false; 
}

function creditButtonPush(e) {
  credits = true;
  start = false; 
}

function intructionsBackButtonPush(e) {
  instruction = false;
  start = true;
}

function creditBackButtonPush(e) {
  credits = false;
  start = true; 
}

// Game Screen
gameStage.scale.x = GAME_SCALE;
gameStage.scale.y = GAME_SCALE;

// Scene objects get loaded in the ready function
var player;
var world;
var water;

// Keyboard Key Constants
var W_KEY = 87;
var S_KEY = 83;
var A_KEY = 65;
var D_KEY = 68;
var MOVE_NONE = 0;

// Moving the player with the keyboard keys W,A,S,D
var map = {};
onkeydown = onkeyup = function(e){
    map[e.keyCode] = e.type == 'keydown';
    // move up & right (diagonal)
    if (map[W_KEY] && map[D_KEY]) {
      player.position.y -= 3; 
      player.position.x += 3;
    }
    // move up & left (diagnol)
    else if (map[W_KEY] && map[A_KEY]) {
      player.position.y -= 3; 
      player.position.x -= 3;
    }
    // move down & left (diagnol)
    else if (map[S_KEY] && map[A_KEY]) {
      player.position.y += 3; 
      player.position.x -= 3;
    }
    // move down & right (diagnol)
    else if (map[S_KEY] && map[D_KEY]) {
      player.position.y += 3; 
      player.position.x += 3;
    }
    // move up
    else if (map[W_KEY]) {
      player.position.y -= 3; 
    }
    // move down
    else if (map[S_KEY]) {
      player.position.y += 3; 
    }
    // move left
    else if (map[A_KEY]) {
      player.position.x -= 3;
    }
    // move right
    else if (map[D_KEY]) {
      player.position.x += 3;
    }
}

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map.json')
  .add('tileset.png')
  .add('player.png')
  .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map.json", "tileset.png");
  gameStage.addChild(world);

  player = new PIXI.Sprite(PIXI.loader.resources["player.png"].texture);
  player.gx = 9;
  player.gy = 5;
  player.width = 15;
  player.height = 15;
  player.x = player.gx*DIM;
  player.y = player.gy*DIM;
  player.anchor.x = 0.0;
  player.anchor.y = 1.0;

  // Find the entity layer
  var entities = world.getObject("Entities");
  entities.addChild(player);

  water = world.getObject("Water").data;

  player.direction = MOVE_NONE;
  player.moving = false;
  animate();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  update_camera();

  if (start)
  {
    renderer.render(startStage);
  }
  else if (game)
  {
    renderer.render(gameStage);
  }
  else if (endGame)
  {
    renderer.render(endStage);
  }
  else if (credits)
  {
    renderer.render(creditStage);
  }
  else if (instructions)
  {
    renderer.render(insturctionStage);
  }
}

function update_camera() {
  gameStage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  gameStage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  gameStage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -gameStage.x));
  gameStage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -gameStage.y));
}


