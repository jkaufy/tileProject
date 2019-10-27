// Project 3 - Tiles - CS413
// Authors: Steven Enriquez & Jacob Kaufman

GAME_WIDTH = 500;
GAME_HEIGHT = 500;

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({ width: GAME_WIDTH, height: GAME_HEIGHT, 
                                         backgroundColor: 0xd6d6d6});

gameport.appendChild(renderer.view);

// Create screens
var stage = new PIXI.Container();
var startScreen = new PIXI.Container();
var gameScreen = new PIXI.Container();
var endScreen = new PIXI.Container();
var creditScreen = new PIXI.Container();
var instructionScreen = new PIXI.Container();

// Set booleans for identifying the current screen 
var game = false;
var end = false;
var start = true;
var instruction = false;
var credit = false;

// Loads back button
var intructionsBackButton = new PIXI.Sprite(PIXI.Texture.from("img/BackButton.png"));
var creditBackButton = new PIXI.Sprite(PIXI.Texture.from("img/BackButton.png"));
var endBackButton = new PIXI.Sprite(PIXI.Texture.from("img/BackButton.png"));

// Loads start screen buttons
var playButton = new PIXI.Sprite(PIXI.Texture.from("img/playButton.png"));
var instructionButton = new PIXI.Sprite(PIXI.Texture.from("img/InstructionButton.png"));
var creditButton = new PIXI.Sprite(PIXI.Texture.from("img/CreditButton.png"));

// Load screens
var creditScreenImage = new PIXI.Sprite(PIXI.Texture.from("img/creditspage.png"));
var instuctionScreenImage = new PIXI.Sprite(PIXI.Texture.from("img/Instructionspage.png"));

// Start Screen
startScreen.addChild(playButton);
startScreen.addChild(instructionButton);
startScreen.addChild(creditButton);

playButton.position.x = 185;
playButton.position.y = 200;

instructionButton.position.x = 125;
instructionButton.position.y = 275;

creditButton.position.x = 160;
creditButton.position.y = 350;

// Changing screens on button clicks
playButton.interactive = true;
playButton.click = function(event) {
  game = true;
  start = false; 
}
instructionButton.interactive = true;
instructionButton.click = function(event) {
  instruction = true;
  start = false;
}
creditButton.interactive = true;
creditButton.click = function(event) {
  credit = true;
  start = false; 
}
intructionsBackButton.interactive = true;
intructionsBackButton.click = function(event) {
  instruction = false;
  start = true;
}
creditBackButton.interactive = true;
creditBackButton.click = function(event) {
  credit = false;
  start = true; 
}

// Instruction Screen
instructionScreen.addChild(instuctionScreenImage);
instructionScreen.addChild(intructionsBackButton);

intructionsBackButton.position.x = 185;
intructionsBackButton.position.y = 400;

// Credit Screen
creditScreen.addChild(creditScreenImage);
creditScreen.addChild(creditBackButton);

creditBackButton.position.x = 185;
creditBackButton.position.y = 400;

// Game Screen
var player = new PIXI.Sprite(PIXI.Texture.from("img/ball.png"));

player.anchor.x = 0.5;
player.anchor.y = 0.5;
player.width = 40;
player.height = 40;
player.position.x = 250;
player.position.y = 250;

gameScreen.addChild(player);

var goldTotal = 0;

goldText = new PIXI.Text("Gold: " + goldTotal);
goldText.position.x = 30;
goldText.position.y = 30;
goldText.style.fill = 0xfc9700;
goldText.style.fontSize = 26;
goldText.style.fontWeight = 'bold';

gameScreen.addChild(goldText);

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var NOT_MOVING = 0;
// Keyboard key constants:
var W_KEY = 87;
var S_KEY = 83;
var A_KEY = 65;
var D_KEY = 68;

// Function: movePlayer
// Desc: Moves the player with tweening. The method was adapted from the
//       TileDungeon example on BBLearn.
function movePlayer() {
  if (player.direction == NOT_MOVING) {
    player.moving = false;
    return;
  }
  player.moving = true;
  
  if (player.direction == MOVE_LEFT) 
  {
    createjs.Tween.get(player).to({x: player.x - 16}, 120).call(movePlayer);
  }
  if (player.direction == MOVE_RIGHT)
  {
    createjs.Tween.get(player).to({x: player.x + 16}, 120).call(movePlayer);
  }
  if (player.direction == MOVE_UP)
  {
    createjs.Tween.get(player).to({y: player.y - 16}, 120).call(movePlayer);
  }
  if (player.direction == MOVE_DOWN)
  {
    createjs.Tween.get(player).to({y: player.y + 16}, 120).call(movePlayer);
  }
}

// Determines which way the player should move on key press,
// then calls the movePlayer function
window.addEventListener("keydown", function (event) {
  event.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (event.repeat == true) return;
  
  player.direction = NOT_MOVING;

  if (event.keyCode == W_KEY)
  {
    player.direction = MOVE_UP;
  }
  else if (event.keyCode == S_KEY)
  {
    player.direction = MOVE_DOWN;
  }
  else if (event.keyCode == A_KEY)
  {
    player.direction = MOVE_LEFT;
  }
  else if (event.keyCode == D_KEY)
  {
    player.direction = MOVE_RIGHT;
  }

  movePlayer();
});

// When keyboard press has stopped, the player should not move
window.addEventListener("keyup", function onKeyUp(event) {
  event.preventDefault();
  if (!player) return;
  player.direction = NOT_MOVING;
});

// Function: dropGold()
// Desc: Drop gold at a TBD location
function dropGold() {

}

// Function: collectGold()
// Desc: Increase the gold by the value picked up
function collectGold(value) {
  goldTotal += value;
  goldText.text = "Gold: " + goldTotal;
}

// Function: collisionDetection(first, second)
// Desc: Detects when two sprites collide.
//       I got the idea for this function from:
//       http://www.html5gamedevs.com/topic/24408-collision-detection/
function collisionDetection(first, second) {
  var firstBounds = first.getBounds();
  var secondBounds = second.getBounds();

  return firstBounds.x + firstBounds.width > secondBounds.x
      && firstBounds.x < secondBounds.x + secondBounds.width 
      && firstBounds.y + firstBounds.height > secondBounds.y
      && firstBounds.y < secondBounds.y + secondBounds.height;
}

// Function: movePlayerWithMouse()
// Desc: Calculates the coordinates of the current mouse position
//       in the available range (behind the edges), and moves the
//       player to those coordinates
function movePlayerWithMouse() {
  mouseCoords = renderer.plugins.interaction.mouse.global;

  if (mouseCoords.x > 30 && mouseCoords.y > 30 && 
      mouseCoords.x < 470 && mouseCoords.y < 470) {
        player.position.x = mouseCoords.x;
        player.position.y = mouseCoords.y;
      }
}

// Uncomment out when there is a player sprite
// document.getElementById("gameport").onmousemove = movePlayerWithMouse;

// Function: spawnPlayer()
// Desc: Sets up player and adds sprite to stage
function spawnPlayer() {

}

// // Function: checkForGoldHit(first, second)
// // Desc: Check for a collision between the player and gold
function checkForGoldHit(first, second, value) {
  if(collisionDetection(first, second)) {
    collectGold(value);
  }
}

// Function: animate()
function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);

  if (game)
  {
    renderer.render(gameScreen);
  }
  else if(end)
  {
    renderer.render(endScreen);
  }
  else if(instruction)
  {
    renderer.render(instructionScreen);
  }
  else if(start)
  {
    renderer.render(startScreen);
  }
  else if(credit)
  {
    renderer.render(creditScreen);
  }
}

function update_camera() {
  stage.x = -hero.x*GAME_SCALE + GAME_WIDTH/2 - hero.width/2*GAME_SCALE;
  stage.y = -hero.y*GAME_SCALE + GAME_HEIGHT/2 + hero.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

animate();
