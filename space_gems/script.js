const container = document.getElementById("game-container");
const background = document.getElementById("background");
const playerEl = document.getElementById("player");
const crystalsContainer = document.getElementById("crystals");
const asteroidsContainer = document.getElementById("asteroids");
const scoreEl = document.getElementById("score");

const GAME_WIDTH = 780;
const GAME_HEIGHT = 750;

let gameStarted = false;
let gameOver = false;
let animationId = null;
let isPaused = false;
let difficultyLevel = 1;
let difficultyIntervalId = null;




let scale = 1;
let keys = {};
let score = 0;


// Player state
const player = { x: GAME_WIDTH / 2 - 20, y: GAME_HEIGHT - 80, speed: 5, size: 40 };

// Crystals
let crystals = [];
function spawnCrystals() {
  crystalsContainer.innerHTML = "";
  crystals = [];
  for (let i = 0; i < 5; i++) {
    const c = { x: Math.random() * (GAME_WIDTH - 20), y: Math.random() * (GAME_HEIGHT / 2), size: 20 };
    crystals.push(c);
    const el = document.createElement("div");
    el.className = "crystal";
    el.style.left = c.x + "px";
    el.style.top = c.y + "px";
    crystalsContainer.appendChild(el);
  }
}
spawnCrystals();

// Asteroids
let asteroids = [];
function spawnAsteroids() {
  asteroidsContainer.innerHTML = "";
  asteroids = [];
  for (let i = 0; i < 4; i++) {
    const a = {
      x: Math.random() * (GAME_WIDTH - 50),
      y: Math.random() * (GAME_HEIGHT / 2),
      size: 50,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2
    };
    asteroids.push(a);
    const el = document.createElement("div");
    el.className = "asteroid";
    el.style.left = a.x + "px";
    el.style.top = a.y + "px";
    asteroidsContainer.appendChild(el);
  }
}
spawnAsteroids();

// Stars background
function createStars() {
  background.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * GAME_WIDTH + "px";
    star.style.top = Math.random() * GAME_HEIGHT + "px";
    background.appendChild(star);
  }
}
createStars();




// Controls
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.size < GAME_WIDTH) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.size < GAME_HEIGHT) player.y += player.speed;

  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";
}

function updateAsteroids() {
  const els = asteroidsContainer.querySelectorAll(".asteroid");
  asteroids.forEach((a, i) => {
    a.x += a.dx;
    a.y += a.dy;
    if (a.x < 0 || a.x + a.size > GAME_WIDTH) a.dx *= -1;
    if (a.y < 0 || a.y + a.size > GAME_HEIGHT) a.dy *= -1;
    els[i].style.left = a.x + "px";
    els[i].style.top = a.y + "px";
  });
}

function checkCollisions() {
  const crystalEls = crystalsContainer.querySelectorAll(".crystal");
  crystals = crystals.filter((c, i) => {
    if (isColliding(player, c)) {
      score += 10;
      crystalEls[i].remove();
      return false;
    }
    return true;
  });

  const asteroidEls = asteroidsContainer.querySelectorAll(".asteroid");
  for (let i = 0; i < asteroids.length; i++) {
    if (isColliding(player, asteroids[i])) {
      endGame();
      return;
    }
  }

  scoreEl.textContent = `Score: ${score}`;

  if (crystals.length === 0) {
    spawnCrystals();
  }
}

function isColliding(obj1, obj2) {
  const dx = (obj1.x + obj1.size / 2) - (obj2.x + obj2.size / 2);
  const dy = (obj1.y + obj1.size / 2) - (obj2.y + obj2.size / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (obj1.size / 2 + obj2.size / 2);
}

function gameLoop() {
  if (gameOver || isPaused) return;

  movePlayer();
  updateAsteroids();
  checkCollisions();

  animationId = requestAnimationFrame(gameLoop);
}


function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  const startScreen = document.querySelector(".start");
  startScreen.classList.add("popup-hide");

  setTimeout(() => {
    startScreen.style.display = "none";
  }, 500);

  // Start game loop
  gameLoop();

  // Start difficulty increase every 20 seconds
  difficultyIntervalId = setInterval(increaseDifficulty, 20000);

  console.log("Game started!");
}


// Attach click event to the button
document.querySelector(".button-4").addEventListener("click", startGame);


function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(difficultyIntervalId); // stop difficulty timer

  document.getElementById("finalScore").textContent = `Score: ${score}`;
  document.getElementById("gameOverPopup").classList.remove("hide");
}


function replayGame() {
  for (let key in keys) keys[key] = false;

  score = 0;
  player.x = GAME_WIDTH / 2 - 20;
  player.y = GAME_HEIGHT - 80;
  player.rotation = 0;
  crystals = [];
  asteroids = [];
  gameOver = false;
  difficultyLevel = 1;
  clearInterval(difficultyIntervalId);

  playerEl.style.transform = `rotate(0deg)`;
  spawnCrystals();
  spawnAsteroids();
  scoreEl.textContent = `Score: ${score}`;

  document.getElementById("gameOverPopup").classList.add("hide");

  // Restart difficulty and game loop
  difficultyIntervalId = setInterval(increaseDifficulty, 20000);
  gameLoop();
}




function movePlayer() {
  // Rotation based on arrow keys
  if (keys["ArrowLeft"]) player.rotation = -90;
  else if (keys["ArrowRight"]) player.rotation = 90;
  else if (keys["ArrowUp"]) player.rotation = 0;
  else if (keys["ArrowDown"]) player.rotation = 180;

  // Movement
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.size < GAME_WIDTH) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.size < GAME_HEIGHT) player.y += player.speed;

  // Apply position and rotation
  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";
  playerEl.style.transform = `rotate(${player.rotation}deg)`;
}


document.querySelectorAll(".ctrl-btn").forEach(btn => {
  btn.addEventListener("mousedown", () => {
    keys[getKeyFromDirection(btn.dataset.dir)] = true;
  });

  btn.addEventListener("mouseup", () => {
    keys[getKeyFromDirection(btn.dataset.dir)] = false;
  });

  // For mobile (touch support)
  btn.addEventListener("touchstart", e => {
    e.preventDefault(); // avoid double input
    keys[getKeyFromDirection(btn.dataset.dir)] = true;
  });

  btn.addEventListener("touchend", e => {
    e.preventDefault();
    keys[getKeyFromDirection(btn.dataset.dir)] = false;
  });
});

function getKeyFromDirection(dir) {
  switch (dir) {
    case "up": return "ArrowUp";
    case "down": return "ArrowDown";
    case "left": return "ArrowLeft";
    case "right": return "ArrowRight";
  }
}


document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;

  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.textContent = isPaused ? "▶" : "⏸";

  if (!isPaused) {
    gameLoop();
  }
});


function spawnAsteroids() {
  asteroidsContainer.innerHTML = "";
  asteroids = [];

  const count = 4 + difficultyLevel; // more asteroids as difficulty increases
  const baseSpeed = 1 + difficultyLevel * 0.3; // faster movement

  for (let i = 0; i < count; i++) {
    const speedFactor = baseSpeed + Math.random(); // randomness
    const a = {
      x: Math.random() * (GAME_WIDTH - 50),
      y: Math.random() * (GAME_HEIGHT / 2),
      size: 50,
      dx: (Math.random() - 0.5) * speedFactor,
      dy: (Math.random() - 0.5) * speedFactor
    };
    asteroids.push(a);
    const el = document.createElement("div");
    el.className = "asteroid";
    el.style.left = a.x + "px";
    el.style.top = a.y + "px";
    asteroidsContainer.appendChild(el);
  }

  // Reset player (rocket) position
  player.x = GAME_WIDTH / 2 - 20;
  player.y = GAME_HEIGHT - 80;
  player.rotation = 0;

  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";
  playerEl.style.transform = `rotate(${player.rotation}deg)`;
}



function increaseDifficulty() {
  difficultyLevel++;
  console.log(`Difficulty increased to ${difficultyLevel}`);

  spawnAsteroids(); // re-spawn with new difficulty
}
