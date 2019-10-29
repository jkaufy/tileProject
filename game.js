// Project 2 - 413
// Author: Steven Enriquez

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({ width: 500, 
                                         height: 500, 
                                         backgroundImage: 0x6b6b6b});

gameport.appendChild(renderer.view);

const START_SCREEN = 0;
const GAME_SCREEN = 1;
const END_SCREEN = 2;
const INSTRUC_SCREEN = 3;
const CREDITS_SCREEN = 4;

var stageID = START_SCREEN;

var stage = new PIXI.Container();
var gameStage = new PIXI.Container();
var endGameStage = new PIXI.Container();
var instrucStage = new PIXI.Container();
var creditsStage = new PIXI.Container();

// Create sprites
var backgroundImage = new PIXI.Sprite(PIXI.Texture.from("img/background.png"));
var backgroundImage2 = new PIXI.Sprite(PIXI.Texture.from("img/background2.png"));
// Create GAME_SCREEN sprites
var player = new PIXI.Sprite(PIXI.Texture.from("img/ball.png"));
var coin = new PIXI.Sprite(PIXI.Texture.from("img/player.png"));

// Load spritesheet
PIXI.loader
	.add("img/assets.json")
	.load(ready);

var bgMusic = PIXI.sound.Sound.from({
url: 'sound/bestBgMusic.wav',
loop: true
});

var pickupSound = PIXI.sound.Sound.from({
url: 'sound/pickup.wav',
});

stage.addChild(backgroundImage);

const titleStyle = new PIXI.TextStyle({
  fontSize: 35,
  fill: 'greenyellow',
  fontWeight: 'bold',
});

var graphics = new PIXI.Graphics();
graphics.beginFill('black');
graphics.drawRect(80, 140, 350, 60);
graphics.endFill();
stage.addChild(graphics);

titleText = new PIXI.Text("SEGWAY CATCHER", titleStyle);
titleText.position.x = 90;
titleText.position.y = 150;

stage.addChild(titleText);

startGameText = new PIXI.Text("Start Game");
startGameText.position.x = 180;
startGameText.position.y = 220;

stage.addChild(startGameText);

startGameText.interactive = true;
startGameText.click = function(event) {
	setupGame();
}

instructionText = new PIXI.Text("Instructions");
instructionText.position.x = 180;
instructionText.position.y = 270;

stage.addChild(instructionText);

instructionText.interactive = true;
instructionText.click = function(event) {
	setupInstructions();
}

creditsText = new PIXI.Text("Credits");
creditsText.position.x = 200;
creditsText.position.y = 320;

stage.addChild(creditsText);

creditsText.interactive = true;
creditsText.click = function(event) {
	setupCredits();
}

const gameScoreStyle = new PIXI.TextStyle({
  fontSize: 22,
  fontWeight: 'bold',
});

var gameScore = 0;

gameScoreText = new PIXI.Text("Score: " + gameScore, gameScoreStyle);
gameScoreText.position.x = 30;
gameScoreText.position.y = 30;

// Function: updateScore()
// Desc: Increase the score by one and display to player
function updateScore() {
  gameScore += 1;
  gameScoreText.text = "Score: " + gameScore;
}

// Keyboard Key Constants
var W_KEY = 87;
var S_KEY = 83;
var A_KEY = 65;
var D_KEY = 68;

map = {}
// Moving the player with the keyboard keys W,A,S,D
onkeydown = onkeyup = function(e){
    map[e.keyCode] = e.type == 'keydown';
    // move up & right (diagonal)
    if (map[W_KEY] && map[D_KEY]) {
      if(player.position.y < 0 || player.position.x > 500 )
      {
        return;
      }
      player.position.y -= 15; 
      player.position.x += 15;
    }
    // move up & left (diagnol)
    else if (map[W_KEY] && map[A_KEY]) {
      if(player.position.y < 0 || player.position.x < 0 )
      {
        return;
      }
      player.position.y -= 15; 
      player.position.x -= 15;
    }
    // move down & left (diagnol)
    else if (map[S_KEY] && map[A_KEY]) {
      if(player.position.y > 730  || player.position.x < 0 )
      {
        return;
      }
      player.position.y += 15; 
      player.position.x -= 15;
    }
    // move down & right (diagnol)
    else if (map[S_KEY] && map[D_KEY]) {
      if(player.position.y > 730 || player.position.x < 730 )
      {
        return;
      }
      player.position.y += 15; 
      player.position.x += 15;
    }
    // move up
    else if (map[W_KEY]) {
      if(player.position.y < 0)
      {
        return;
      }
      player.position.y -= 15; 
    }
    // move down
    else if (map[S_KEY]) {
      if(player.position.y > 730)
      {
        return;
      }
      player.position.y += 15; 
    }
    // move left
    else if (map[A_KEY]) {
      if(player.position.x < 0)
      {
        return;
      }
      player.position.x -= 15;
    }
    // move right
    else if (map[D_KEY]) {
      if(player.position.x > 730)
      {
        return;
      }
      player.position.x += 15;
    }
}

// // Function: findMouseCoords()
// // Desc: calculates the coordinates of the current mouse position
// //       in the available range (behind the walls)
// function findMouseCoords() {
//   mouseCoords = renderer.plugins.interaction.mouse.global;

//   // if mouse is behind the walls, move player to mouse coords
//   if (mouseCoords.x > 30 && mouseCoords.y > 30 && 
//       mouseCoords.x < 470 && mouseCoords.y < 470) {
//         player.position.x = mouseCoords.x;
//         player.position.y = mouseCoords.y;
//       }
// }

// document.getElementById("gameport").onmousemove = findMouseCoords;

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

var enemySpeed = 1.5;

// Function: moveEnemy()
// Desc: Move enemy slightly closer to the player
function moveEnemy() {
  enemy.rotation -= 0.02;

  // move the enemy right
  if(enemy.position.x < player.position.x) {
    enemy.position.x = enemy.position.x + 1 * enemySpeed;
  }
  // move the enemy left
  else if(enemy.position.x > player.position.x) {
    enemy.position.x = enemy.position.x - 1 * enemySpeed;
  }
  // move the enemy down
  if(enemy.position.y < player.position.y) {
    enemy.position.y = enemy.position.y + 1 * enemySpeed;
  }
  // move the enemy up
  else if(enemy.position.y > player.position.y) {
    enemy.position.y = enemy.position.y - 1 * enemySpeed;
  }
}

// Function: checkForCoinHit(first, second)
// Desc: Check for a collision between the player and a coin
function checkForCoinHit(first, second) {
  if(collisionDetection(first, second)) {
    pickupSound.play();
    dropCoin();
    updateScore();
    incrementEnemySpeed();
  }
}

// Function: checkForEnemyHit(first, second)
// Desc: Check for a collision between the player and the enemy
function checkForEnemyHit(first, second) {
  if(collisionDetection(first, second)) {
    stageID = END_SCREEN;
    endGame();
  }
}

// Function: incrementEnemySpeed()
// Desc: Increases the enemy speed by 0.1
function incrementEnemySpeed() {
  if(enemySpeed <= 2) {
    enemySpeed = enemySpeed + 0.1;
  }
}

// Function: dropCoin()
// Desc: Drop coin in random location around canvas
function dropCoin() {
  coin.width = 40;
  coin.height = 40;

  // random x,y coordinates on stage
  coin.position.x = Math.floor(Math.random() * 700) + 25;
  coin.position.y = Math.floor(Math.random() * 700) + 25;

  gameStage.addChild(coin);
}

const endGameStyle = new PIXI.TextStyle({
  fontSize: 130,
  fontWeight: 'bold',
  fill: '#ff0000',
});

// Function: endGame()
// Desc: Game Over for player, allow the player to start a new game
function endGame() {

  bgMusic.stop();

  endGameStage.addChild(backgroundImage);
  
  endGameText = new PIXI.Text("GAME\nOVER", endGameStyle);
  endGameText.position.y = 60;
  endGameText.position.x = 55;
  endGameStage.addChild(endGameText);

  finalScoreText = new PIXI.Text("Score: " + gameScore);
  finalScoreText.position.y = 350;
  finalScoreText.position.x = 195;
  endGameStage.addChild(finalScoreText);

  playAgainText = new PIXI.Text("Click Here to Play Again");
  playAgainText.position.x = 110;
  playAgainText.position.y = 430;

  endGameStage.addChild(playAgainText);

  playAgainText.interactive = true;
  playAgainText.click = function(event) {
    setupGame();
  }
}

function setupInstructions() {

  instrucStage.addChild(backgroundImage);

  instrucTitleText = new PIXI.Text("Instructions");
  instrucTitleText.position.x = 185;
  instrucTitleText.position.y = 60;

  instrucStage.addChild(instrucTitleText);

  instrucText = new PIXI.Text("Catch as many segways as you can!\n\nMovement:\nUse WASD to move.");
  instrucText.position.y = 150;
  instrucText.position.x = 40;
  instrucStage.addChild(instrucText);

  playText = new PIXI.Text("Click Here to Play");
  playText.position.x = 150;
  playText.position.y = 400;

  instrucStage.addChild(playText);

  playText.interactive = true;
  playText.click = function(event) {
    setupGame();
  }
  stageID = INSTRUC_SCREEN;
}

function setupCredits() {

  creditsStage.addChild(backgroundImage);

  creditsTitleText = new PIXI.Text("Credits");
  creditsTitleText.position.x = 200;
  creditsTitleText.position.y = 60;

  creditsStage.addChild(creditsTitleText);

  creditText = new PIXI.Text("Steven Enriquez and Jacob Kaufman");
  creditText.position.y = 180;
  creditText.position.x = 30;

  creditsStage.addChild(creditText);

  playText = new PIXI.Text("Click Here to Play");
  playText.position.x = 150;
  playText.position.y = 400;

  creditsStage.addChild(playText);

  playText.interactive = true;
  playText.click = function(event) {
    setupGame();
  }
  stageID = CREDITS_SCREEN;
}


function ready() {
  var frames = [];
  var index;
  for(index=1; index <=5; index++) {
    frames.push(PIXI.Texture.fromFrame("enemy_0" + index + '.png'));
  }

  enemy = new PIXI.AnimatedSprite(frames);
  gameStage.addChild(enemy);
}

function setupGame() {

	enemySpeed = 1.5;

	gameScore = 0;
	gameScoreText.text = "Score: " + gameScore;

	bgMusic.play();

	gameStage.addChild(backgroundImage2);
	gameStage.addChild(gameScoreText);

	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;
	enemy.width = 50;
	enemy.height = 50;
	enemy.position.x = 50;
	enemy.position.y = 450;
	enemy.animationSpeed = .1;
	enemy.play();

	gameStage.addChild(enemy);

	player.anchor.x = 0.5;
	player.anchor.y = 0.5;
	player.width = 40;
	player.height = 40;
	player.position.x = 250;
	player.position.y = 250;

	gameStage.addChild(player);

	dropCoin();

	stageID = GAME_SCREEN;
}

// window.setInterval(function() {
//     newCoinX = Math.floor(Math.random() * 440) + 25;
//     newCoinY = Math.floor(Math.random() * 440) + 25;
//     createjs.Tween.get(coin.position).to({x: newCoinX, y: newCoinY}, 300, createjs.Ease.bounceOut)
// }, 2000);

// Function: animate()
function animate() {
    requestAnimationFrame(animate);
    if(stageID == START_SCREEN) {
		renderer.render(stage);
    }
    else if(stageID == GAME_SCREEN) {

      renderer.render(gameStage);
      update_camera();

    	checkForCoinHit(player, coin);
        checkForEnemyHit(player, enemy);
        moveEnemy();
    }
    else if(stageID == END_SCREEN) {
    	renderer.render(endGameStage);
    }
    else if(stageID == INSTRUC_SCREEN) {
    	renderer.render(instrucStage);
    }
    else if(stageID == CREDITS_SCREEN) {
    	renderer.render(creditsStage);
    }
}

animate();

function update_camera() {
  gameStage.x = -player.x *2 + 500 - player.width/2;
  gameStage.y = -player.y*2 + 500 + player.height/2;
  gameStage.x = -Math.max(0, Math.min(240, -gameStage.x));
  gameStage.y = -Math.max(0, Math.min(240, -gameStage.y));
}


