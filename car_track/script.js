const gameContainer = document.getElementById("game-container");
const startScreen = document.querySelector(".start-screen");

const GAME_WIDTH = 780;
const GAME_HEIGHT = 750;
const playerWidth = 60;
const laneWidth = 100;
let player;
let playerX = 360;
let keys = {};
let gameInterval;
let spawnInterval;
let obstacles = [];
let isGameOver = false;


const obstacleImages = [
  { name: "bus1.png", width: 80, height: 220 },
  { name: "bus2.png", width: 80, height: 210 },
  { name: "car1.png", width: 55, height: 110 },
  { name: "car2.png", width: 50, height: 80 },
  { name: "car3.png", width: 55, height: 110  }
];


document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  startScreen.style.display = "none";
  isGameOver = false;
  playerX = 360;
  player = document.createElement("div");
  player.className = "player";
  player.style.left = `${playerX}px`;
  gameContainer.appendChild(player);
  gameLoop();
  spawnInterval = setInterval(spawnObstacle, 1500);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  isGameOver = true;

  const over = document.createElement("div");
  over.className = "game-over";
  over.innerHTML = `
    <div style="text-align:center;">
      <p>Game Over</p>
      <button id="replay-btn" style="padding:10px 20px; font-size:18px; margin-top:10px;">Replay</button>
    </div>
  `;
  gameContainer.appendChild(over);

  document.getElementById("replay-btn").addEventListener("click", resetGame);
}

function resetGame() {
  // Remove player and obstacles
  if (player) gameContainer.removeChild(player);
  obstacles.forEach(obs => {
    if (obs && obs.parentNode) gameContainer.removeChild(obs);
  });
  obstacles = [];

  // Remove game over screen
  const overScreen = document.querySelector(".game-over");
  if (overScreen) gameContainer.removeChild(overScreen);

  // Start new game
  startGame();
}


function spawnObstacle() {
  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";

  // Choose a random image and size
  const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
  obstacle.style.backgroundImage = `url('images/${randomImage.name}')`;
  obstacle.style.backgroundSize = "contain";
  obstacle.style.backgroundRepeat = "no-repeat";
  obstacle.style.width = `${randomImage.width}px`;
  obstacle.style.height = `${randomImage.height}px`;
  obstacle.style.position = "absolute";

  // Set to a random lane
  const lanes = [160, 260, 360, 460];
  const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
  obstacle.style.left = `${randomLane}px`;
  obstacle.style.top = `-100px`;

  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);
}


function gameLoop() {
  gameInterval = setInterval(() => {
    if (keys["ArrowLeft"] && playerX > 160) {
      playerX -= 100;
      keys["ArrowLeft"] = false;
    }
    if (keys["ArrowRight"] && playerX < 560) {
      playerX += 100;
      keys["ArrowRight"] = false;
    }
    player.style.left = `${playerX}px`;

    obstacles.forEach((obs, index) => {
      const currentTop = parseInt(obs.style.top.replace("px", ""));
      obs.style.top = `${currentTop + 10}px`;

      if (checkCollision(obs, player)) {
        endGame();
      }

      if (currentTop > GAME_HEIGHT) {
        gameContainer.removeChild(obs);
        obstacles.splice(index, 1);
      }
    });
  }, 60);
}

function checkCollision(rect1, rect2) {
  const r1 = rect1.getBoundingClientRect();
  const r2 = rect2.getBoundingClientRect();
  return !(
    r1.bottom < r2.top ||
    r1.top > r2.bottom ||
    r1.right < r2.left ||
    r1.left > r2.right
  );
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});