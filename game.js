// Project 3 - Tiles - CS413
// Authors: Steven Enriquez & Jacob Kaufman

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({ width: 500, height: 500, 
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
var intructionsBackButton = new PIXI.Sprite(PIXI.Texture.from("BackButton.png"));
var creditBackButton = new PIXI.Sprite(PIXI.Texture.from("BackButton.png"));
var endBackButton = new PIXI.Sprite(PIXI.Texture.from("BackButton.png"));

// Loads start screen buttons
var playButton = new PIXI.Sprite(PIXI.Texture.from("playButton.png"));
var instructionButton = new PIXI.Sprite(PIXI.Texture.from("InstructionButton.png"));
var creditButton = new PIXI.Sprite(PIXI.Texture.from("CreditButton.png"));

// Load screens
var creditScreenImage = new PIXI.Sprite(PIXI.Texture.from("creditspage.png"));
var instuctionScreenImage = new PIXI.Sprite(PIXI.Texture.from("Instructionspage.png"));

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
var goldTotal = 0;

goldText = new PIXI.Text("Gold: " + goldTotal);
goldText.position.x = 30;
goldText.position.y = 30;
goldText.style.fill = 0xfc9700;
goldText.style.fontSize = 26;
goldText.style.fontWeight = 'bold';

gameScreen.addChild(goldText);

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
