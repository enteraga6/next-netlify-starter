// game.js
// Create the canvas and set its width and height
const canvas = document.getElementById("game-canvas");
canvas.width = 500;
canvas.height = 500;

// Get the 2D drawing context for the canvas
const ctx = canvas.getContext("2d");

// Set the initial values for the game
let player = { x: 250, y: 250, radius: 10, color: "blue" };
let squares = [];
let gems = [];
let score = 0;
let isGameOver = false;
let powerups = [];

// Define a function to generate random numbers within a certain range
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Define a function to generate random colors
function randomColor() {
  const r = randomNumber(0, 255);
  const g = randomNumber(0, 255);
  const b = randomNumber(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// Define a function to handle player movement
function movePlayer(e) {
  // Check if the game is over
  if (isGameOver) return;

  // Get the x and y coordinates of the player's position
  const x = player.x;
  const y = player.y;

  // Calculate the new x and y coordinates of the player based on the key that was pressed
  if (e.key === "ArrowUp") player.y = y - 5;
  else if (e.key === "ArrowDown") player.y = y + 5;
  else if (e.key === "ArrowLeft") player.x = x - 5;
  else if (e.key === "ArrowRight") player.x = x + 5;

  // Check if the player has moved outside the boundaries of the canvas
  if (player.x < player.radius) player.x = player.radius;
  if (player.x > canvas.width - player.radius)
    player.x = canvas.width - player.radius;
  if (player.y < player.radius) player.y = player.radius;
  if (player.y > canvas.height - player.radius)
    player.y = canvas.height - player.radius;
}

// Add an event listener to listen for keydown events
document.addEventListener("keydown", movePlayer);

// Define a function to generate a new square
function generateSquare() {
  // Generate a random size, speed, and color for the square
  const size = randomNumber(10, 50);
  const speed = randomNumber(1, 5);
  const color = randomColor();

  // Generate a random starting position for the square
  const x = randomNumber(0, canvas.width - size);
  const y = randomNumber(0, canvas.height - size);

  // Add the new square to the array of squares
  squares.push({ x, y, size, speed, color });
}

// Define a function to generate a new gem
function generateGem() {
  // Generate a random size, color, and value for the gem
  const size = randomNumber(10, 20);
  const color = randomColor();
  const value = randomNumber(1, 5);

  // Generate a random starting position for the gem
  const x = randomNumber(0, canvas.width - size);
  const y = randomNumber(0, canvas.height - size);

  // Add the new gem to the array of gems
  gems.push({ x, y, size, color, value });
}

// Define a function to generate a new powerup
function generatePowerup() {
  // Generate a random type, size, and color for the powerup
  const types = ["shield", "speed", "score"];
  const type = types[randomNumber(0, types.length - 1)];
  const size = randomNumber(10, 20);
  const color = randomColor();

  // Generate a random starting position for the powerup
  const x = randomNumber(0, canvas.width - size);
  const y = randomNumber(0, canvas.height - size);

  // Add the new powerup to the array of powerups
  powerups.push({ x, y, size, color, type });
}

// Define a function to update the game state
function update() {
  // Generate a new square every second
  if (frames % 60 === 0) generateSquare();

  // Generate a new gem every 10 seconds
  if (frames % 600 === 0) generateGem();

  // Generate a new powerup every 15 seconds
  if (frames % 900 === 0) generatePowerup();

  // Update the position of each square
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    square.y += square.speed;

    // Check if the square has moved outside the boundaries of the canvas
    if (square.y > canvas.height) {
      squares.splice(i, 1);
      i--;
    }
  }

  // Update the position of each gem
  for (let i = 0; i < gems.length; i++) {
    const gem = gems[i];
    gem.y += 1;

    // Check if the gem has moved outside the boundaries of the canvas
    if (gem.y > canvas.height) {
      gems.splice(i, 1);
      i--;
    }
  }

  // Update the position of each powerup
  for (let i = 0; i < powerups.length; i++) {
    const powerup = powerups[i];
    powerup.y += 1;

    // Check if the powerup has moved outside the boundaries of the canvas
    if (powerup.y > canvas.height) {
      powerups.splice(i, 1);
      i--;
    }
  }

  // Check if the player has collided with any squares
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    const dx = player.x - square.x;
    const dy = player.y - square.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the player and square are colliding
    if (distance < player.radius + square.size / 2) {
      // Game over
      isGameOver = true;

      // Show the game over screen
      const gameOverScreen = document.getElementById("game-over");
      gameOverScreen.style.display = "block";

      // Stop the game loop
      cancelAnimationFrame(requestId);

      // Remove the event listener for player movement
      document.removeEventListener("keydown", movePlayer);
    }
  }

  // Check if the player has collected any gems
  for (let i = 0; i < gems.length; i++) {
    const gem = gems[i];
    const dx = player.x - gem.x;
    const dy = player.y - gem.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the player and gem are colliding
    if (distance < player.radius + gem.size / 2) {
      // Increment the player's score
      score += gem.value;

      // Remove the gem from the array of gems
      gems.splice(i, 1);
      i--;
    }
  }
  
  // Check if the player has collected any powerups
for (let i = 0; i < powerups.length; i++) {
  const powerup = powerups[i];
  const dx = player.x - powerup.x;
  const dy = player.y - powerup.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Check if the player and powerup are colliding
  if (distance < player.radius + powerup.size / 2) {
    // Handle the powerup based on its type
    if (powerup.type === "shield") {
      // Give the player a shield for 5 seconds
      player.color = "yellow";
      setTimeout(() => (player.color = "blue"), 5000);
    } else if (powerup.type === "speed") {
      // Increase the player's speed for 5 seconds
      player.radius = 15;
      setTimeout(() => (player.radius = 10), 5000);
    } else if (powerup.type === "score") {
      // Increase the player's score by 10
      score += 10;
    }

    // Remove the powerup from the array of powerups
    powerups.splice(i, 1);
    i--;
  }
}

// Update the frame count
frames++;
}

// Define a function to render the game
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // Draw each square
  for (const square of squares) {
    ctx.beginPath();
    ctx.rect(square.x, square.y, square.size, square.size);
    ctx.fillStyle = square.color;
    ctx.fill();
    ctx.closePath();
  }

  // Draw each gem
  for (const gem of gems) {
    ctx.beginPath();
    ctx.arc(gem.x, gem.y, gem.size, 0, 2 * Math.PI);
    ctx.fillStyle = gem.color;
    ctx.fill();
    ctx.closePath();
  }

  // Draw each powerup
  for (const powerup of powerups) {
    ctx.beginPath();
    ctx.arc(powerup.x, powerup.y, powerup.size, 0, 2 * Math.PI);
    ctx.fillStyle = power
    // Draw the score
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 8, 20);
    }

// Define a function to run the game
function run() {
  update();
  render();

  // Continue the game loop
  requestId = requestAnimationFrame(run);
}

// Start the game loop
let frames = 0;
let requestId = requestAnimationFrame(run);

// Add an event listener to the restart button to restart the game
const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", () => {
  // Hide the game over screen
  const gameOverScreen = document.getElementById("game-over");
  gameOverScreen.style.display = "none";

  // Reset the game state
  player = { x: 250, y: 250, radius: 10, color: "blue" };
  squares = [];
  gems = [];
  score = 0;
  isGameOver = false;
  powerups = [];

  // Restart the game loop
  frames = 0;
  requestId = requestAnimationFrame(run);

  // Add the event listener for player movement
  document.addEventListener("keydown", movePlayer);
});





