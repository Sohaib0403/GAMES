const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');
const gameUI = document.getElementById('gameUI');

// Game state
let gameRunning = false;
let score = 0;
let lives = 3;
let gameMode = 'easy';
let roadOffset = 0;
let spawnTimer = 0;

// Game settings for different modes (15% slower speeds)
const gameModes = {
    easy: {
        name: '🐌 Easy',
        playerSpeed: 5.1,
        obstacleSpeed: 2.55,
        spawnRate: 120, // frames between spawns
        maxObstacles: 3
    },
    medium: {
        name: '🐰 Medium',
        playerSpeed: 5.95,
        obstacleSpeed: 4.25,
        spawnRate: 80,
        maxObstacles: 4
    },
    hard: {
        name: '🚀 Hard',
        playerSpeed: 6.8,
        obstacleSpeed: 5.95,
        spawnRate: 50,
        maxObstacles: 6
    }
};

// Player car image
const playerImage = new Image();
playerImage.src = 'images/car.png';

// Player object
let player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 80,
    height: 150,
    image: playerImage
};

// Obstacles array
let obstacles = [];

// Vehicle emojis for obstacles
const vehicleEmojis = [
    '🚧', // construction barrier
    '⚠️', // warning sign
    '🛑', // stop sign
    '📦', // box
    '🗑️', // trash bin
    '🪨', // rock
    '🌲', // tree
    '🪵', // log
    '🛢️', // oil barrel
    '🧱', // brick block
    '🔥', // fire
    '💣', // bomb
    '❄️', // ice patch
    '🌵', // cactus
    '💼', // suitcase
    '🪑', // chair
    '🛒'  // shopping cart
];
const obstacleEmojis = [
    '🚧', // construction barrier
    '⚠️', // warning sign
    '🛑', // stop sign
    '📦', // box
    '🗑️', // trash bin
    '🪨', // rock
    '🌲', // tree
    '🪵', // log
    '🛢️', // oil barrel
    '🧱', // brick block
    '🔥', // fire
    '💣', // bomb
    '❄️', // ice patch
    '🌵', // cactus
    '💼', // suitcase
    '🪑', // chair
    '🛒'  // shopping cart
];

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Event listeners
document.getElementById('easyMode').addEventListener('click', () => startGame('easy'));
document.getElementById('mediumMode').addEventListener('click', () => startGame('medium'));
document.getElementById('hardMode').addEventListener('click', () => startGame('hard'));
document.getElementById('restartButton').addEventListener('click', restartGame);

function startGame(mode) {
    gameMode = mode;
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameUI.style.display = 'block';
    gameRunning = true;
    score = 0;
    lives = 3;
    obstacles = [];
    spawnTimer = 0;
    roadOffset = 0;

    player.x = canvas.width / 2;
    player.y = canvas.height - 150;

    updateUI();
    gameLoop();
}

function restartGame() {
    endScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
    gameUI.style.display = 'none';
    gameRunning = false;
}

function updatePlayer() {
    const currentMode = gameModes[gameMode];

    // Handle input
    if (keys['arrowleft'] || keys['a']) {
        player.x -= currentMode.playerSpeed;
    }
    if (keys['arrowright'] || keys['d']) {
        player.x += currentMode.playerSpeed;
    }

    // Keep player in bounds (with road margins) - adjusted for larger size
    player.x = Math.max(70, Math.min(canvas.width - 70, player.x));
}

function spawnObstacle() {
    const currentMode = gameModes[gameMode];

    if (obstacles.length < currentMode.maxObstacles) {
        const isVehicle = Math.random() < 0.7; // 70% chance for vehicle, 30% for obstacle
        const emoji = isVehicle ?
            vehicleEmojis[Math.floor(Math.random() * vehicleEmojis.length)] :
            obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];

        obstacles.push({
            x: Math.random() * (canvas.width - 140) + 70,
            y: -70,
            width: 70,
            height: 70,
            emoji: emoji,
            speed: currentMode.obstacleSpeed + Math.random() * 2
        });
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        // Remove obstacles that are off screen and award points
        if (obstacle.y > canvas.height + 50) {
            obstacles.splice(i, 1);

            // Award points based on obstacle type
            const isVehicle = vehicleEmojis.includes(obstacle.emoji);
            if (isVehicle) {
                score += 5; // 5 points for avoiding vehicles
            } else {
                score += 10; // 10 points for avoiding obstacles
            }
        }

        // Check collision with player
        if (checkCollision(player, obstacle)) {
            obstacles.splice(i, 1);
            lives--;

            // Flash effect
            canvas.style.filter = 'brightness(200%)';
            setTimeout(() => {
                canvas.style.filter = 'brightness(100%)';
            }, 100);

            if (lives <= 0) {
                endGame();
                return;
            }
        }
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width - 15 &&
        rect1.x + rect1.width - 15 > rect2.x &&
        rect1.y < rect2.y + rect2.height - 15 &&
        rect1.y + rect1.height - 15 > rect2.y;
}

function drawRoad() {
    // Moving road effect
    roadOffset += gameModes[gameMode].obstacleSpeed;
    if (roadOffset > 60) roadOffset = 0;

    // Road background
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road lines
    ctx.fillStyle = '#FFFF00';
    const lineWidth = 8;
    const lineHeight = 30;
    const lineSpacing = 60;

    for (let y = -lineHeight + roadOffset; y < canvas.height; y += lineSpacing) {
        ctx.fillRect(canvas.width / 2 - lineWidth / 2, y, lineWidth, lineHeight);
    }

    // Road edges
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(30, 0, 8, canvas.height); // Left edge
    ctx.fillRect(canvas.width - 38, 0, 8, canvas.height); // Right edge

    // Grass on sides
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, 30, canvas.height); // Left grass
    ctx.fillRect(canvas.width - 30, 0, 30, canvas.height); // Right grass
}

function drawEmoji(emoji, x, y, size = 40, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    if (rotation !== 0) {
        ctx.rotate(rotation);
    }
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add shadow for better visibility
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText(emoji, 2, 2);

    // Draw emoji
    ctx.fillStyle = '#fff';
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
}

function drawPlayer() {
    if (player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        // fallback in case image is still loading
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Cars show from top view, obstacles show normally - bigger size
        const isCarEmoji = vehicleEmojis.includes(obstacle.emoji);
        if (isCarEmoji) {
            drawEmoji(obstacle.emoji, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 55, 0);
        } else {
            drawEmoji(obstacle.emoji, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 55);
        }
    });
}

function updateUI() {
    document.getElementById('score').textContent = `🏆 Score: ${score}`;
    document.getElementById('lives').textContent = `❤️ Lives: ${lives}`;
    document.getElementById('mode').textContent = `🎯 Mode: ${gameModes[gameMode].name}`;
}

function endGame() {
    gameRunning = false;

    let resultText = '';
    let resultEmoji = '';

    if (score >= 500) {
        resultText = 'Amazing Driver!';
        resultEmoji = '🏆';
    } else if (score >= 300) {
        resultText = 'Great Job!';
        resultEmoji = '🥇';
    } else if (score >= 150) {
        resultText = 'Good Driving!';
        resultEmoji = '🥉';
    } else {
        resultText = 'Keep Practicing!';
        resultEmoji = '🎯';
    }

    document.getElementById('endTitle').textContent = `${resultEmoji} ${resultText}`;
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;

    canvas.style.display = 'none';
    gameUI.style.display = 'none';
    endScreen.style.display = 'flex';
}

function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw road
    drawRoad();

    // Update game objects
    updatePlayer();

    // Spawn obstacles
    spawnTimer++;
    if (spawnTimer >= gameModes[gameMode].spawnRate) {
        spawnObstacle();
        spawnTimer = 0;
    }

    updateObstacles();

    // Draw everything
    drawObstacles();
    drawPlayer();

    // Update score over time
    // score += 1;
    updateUI();

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {
    canvas.style.display = 'none';
    gameUI.style.display = 'none';
    endScreen.style.display = 'none';
}

init()