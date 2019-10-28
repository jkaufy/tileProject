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
  var intructionsBackButton = new PIXI.Sprite(PIXI.loader.resources["img/BackButton.png"].texture);
  var creditBackButton = new PIXI.Sprite(PIXI.loader.resources["img/BackButton.png"].texture);
  var endBackButton = new PIXI.Sprite(PIXI.loader.resources["img/BackButton.png"].texture);

  // Loads start screen buttons
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


// game screen
gameStage.scale.x = GAME_SCALE;
gameStage.scale.y = GAME_SCALE;

// Scene objects get loaded in the ready function
var hero;
var world;
var water;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {

  if (hero.direction == MOVE_NONE) {
    return;
  }


  var dx = 0;
  var dy = 0;

  if (hero.direction == MOVE_LEFT) dx -= 1;
  if (hero.direction == MOVE_RIGHT) dx += 1;
  if (hero.direction == MOVE_UP) dy -= 1;  
  if (hero.direction == MOVE_DOWN) dy += 1;

  hero.gx += dx;
  hero.gy += dy;
  
  createjs.Tween.get(hero).to({x: hero.gx*DIM, y: hero.gy*DIM}, 250).call(move);

}

/*window.addEventListener("mousedown", function (e) {
  e.preventDefault();
  if (instructionButton)
  {
    instructions = true;
    start = false; 
  }

});*/


// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!hero) return;
  if (e.repeat == true) return;
  
  hero.direction = MOVE_NONE;

  if (e.keyCode == 87)
    hero.direction = MOVE_UP;
  else if (e.keyCode == 83)
    hero.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    hero.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    hero.direction = MOVE_RIGHT;

  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!hero) return;
  hero.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map.json')
  .add('tileset.png')
  .add('hero.png')
  .load(ready);

function ready() {
  createjs.Ticker.setFPS(60);
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map.json", "tileset.png");
  gameStage.addChild(world);

  hero = new PIXI.Sprite(PIXI.loader.resources["hero.png"].texture);
  hero.gx = 9;
  hero.gy = 5;
  hero.x = hero.gx*DIM;
  hero.y = hero.gy*DIM;
  hero.anchor.x = 0.0;
  hero.anchor.y = 1.0;

  // Find the entity layer
  var entities = world.getObject("Entities");
  entities.addChild(hero);

  water = world.getObject("Water").data;

  hero.direction = MOVE_NONE;
  hero.moving = false;
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
  gameStage.x = -hero.x*GAME_SCALE + GAME_WIDTH/2 - hero.width/2*GAME_SCALE;
  gameStage.y = -hero.y*GAME_SCALE + GAME_HEIGHT/2 + hero.height/2*GAME_SCALE;
  gameStage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -gameStage.x));
  gameStage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -gameStage.y));
}


