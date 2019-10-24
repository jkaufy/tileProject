// Project 3 - Tiles - CS413
// Authors: Steven Enriquez & Jacob Kaufman

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({ width: 500, height: 500, 
                                         backgroundColor: 0xd6d6d6});

gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var goldTotal = 0;

goldText = new PIXI.Text("Gold: " + goldTotal);
goldText.position.x = 30;
goldText.position.y = 30;
goldText.style.fill = 0xfc9700;
goldText.style.fontSize = 26;
goldText.style.fontWeight = 'bold';

stage.addChild(goldText);

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
}

animate();