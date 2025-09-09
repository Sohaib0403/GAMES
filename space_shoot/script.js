const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;
let score = 0;
let playerHealth = 100;
let playerLives = 6;
let enemyWaveSize = 1;
let enemiesDestroyed = 0;

// Game objects
let player = {
    x: 390,
    y: 650,
    width: 80,
    height: 60,
    speed: 6
};

let bullets = [];
let enemyBullets = [];
let enemies = [];
let explosions = [];

// Input handling
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;

    if (e.key === ' ' && gameRunning) {
        e.preventDefault();
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    gameRunning = true;
    resetGame();
    spawnEnemyWave();
    gameLoop();
}

function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    gameRunning = true;
    resetGame();
    spawnEnemyWave();
    gameLoop();
}

function resetGame() {
    score = 0;
    playerHealth = 100;
    playerLives = 6;
    enemyWaveSize = 1;
    enemiesDestroyed = 0;
    player.x = 390;
    player.y = 650;
    bullets = [];
    enemyBullets = [];
    enemies = [];
    explosions = [];
    updateUI();
}

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 8
    });
}

function spawnEnemyWave() {
    for (let i = 0; i < enemyWaveSize; i++) {
        setTimeout(() => {
            enemies.push({
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 70,
                height: 40,
                speed: 2,
                direction: Math.random() < 0.5 ? 1 : -1, // random left/right
                health: 6,
                lastShot: Date.now()
            });
        }, i * 1000);
    }
}

function updatePlayer() {
    if (keys['a'] || keys['arrowleft']) {
        player.x -= player.speed;
    }
    if (keys['d'] || keys['arrowright']) {
        player.x += player.speed;
    }

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

function updateBullets() {
    // Update player bullets
    bullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y > -bullet.height;
    });

    // Update enemy bullets
    enemyBullets = enemyBullets.filter(bullet => {
        bullet.y += bullet.speed;
        return bullet.y < canvas.height;
    });
}

function updateEnemies() {
    enemies.forEach(enemy => {
        // Move down until y = 200, then only move left/right
        if (enemy.y < 200) {
            enemy.y += enemy.speed;
        } else {
            // Move left/right
            enemy.x += enemy.speed * (enemy.direction || 1);

            // Bounce off edges
            if (enemy.x < 0) {
                enemy.x = 0;
                enemy.direction = 1;
            } else if (enemy.x + enemy.width > canvas.width) {
                enemy.x = canvas.width - enemy.width;
                enemy.direction = -1;
            }
        }

        // Enemy shooting
        if (Date.now() - enemy.lastShot > 2000 + Math.random() * 3000) {
            enemyBullets.push({
                x: enemy.x + enemy.width / 2 - 2,
                y: enemy.y + enemy.height,
                width: 4,
                height: 8,
                speed: 3
            });
            enemy.lastShot = Date.now();
        }
    });

    // Remove enemies that went off screen (no longer needed, but keep for cleanup)
    enemies = enemies.filter(enemy => enemy.y < canvas.height + 50);
}

function checkCollisions() {
    // Player bullets vs enemies
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemy.health--;

                if (enemy.health <= 0) {
                    // Show 💥 for 1 second
                    enemy.blastStage = 'boom';
                    setTimeout(() => {
                        // Then show 🔥 for 1 second
                        enemy.blastStage = 'fire';
                        setTimeout(() => {
                            // Remove enemy after 🔥
                            enemies.splice(enemyIndex, 1);
                            score += 10;
                            enemiesDestroyed++;
                            // Check if wave is complete
                            if (enemies.length === 0) {
                                if (enemyWaveSize < 12) {
                                    enemyWaveSize++;
                                }
                                setTimeout(spawnEnemyWave, 2000);
                            }
                        }, 1000);
                    }, 1000);

                    // Full blast effect: multiple explosions
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 * i) / 8;
                        explosions.push({
                            x: enemy.x + enemy.width / 2 + Math.cos(angle) * 30,
                            y: enemy.y + enemy.height / 2 + Math.sin(angle) * 30,
                            timer: 40
                        });
                    }
                    // Central big explosion
                    explosions.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        timer: 60
                    });
                }
            }
        });
    });

    // Enemy bullets vs player
    enemyBullets.forEach((bullet, bulletIndex) => {
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {

            enemyBullets.splice(bulletIndex, 1);
            playerHealth -= 20;

            if (playerHealth <= 0) {
                playerLives--;
                playerHealth = 100;

                if (playerLives <= 0) {
                    gameOver();
                } else {
                    // Create player explosion effect
                    explosions.push({
                        x: player.x + player.width / 2,
                        y: player.y + player.height / 2,
                        timer: 20
                    });
                }
            }
        }
    });
}

function updateExplosions() {
    explosions = explosions.filter(explosion => {
        explosion.timer--;
        return explosion.timer > 0;
    });
}

function drawPlayer() {
    ctx.drawImage(rocketImg, player.x, player.y, player.width, player.height);
}

function drawBullets() {
    // Player bullets
    ctx.fillStyle = '#00ffff';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Add glow effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });

    // Enemy bullets
    ctx.fillStyle = '#ff4444';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = 8;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.blastStage === 'boom') {
            ctx.font = '35px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💥', enemy.x + enemy.width / 2, enemy.y + 30);
        } else if (enemy.blastStage === 'fire') {
            ctx.font = '35px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🔥', enemy.x + enemy.width / 2, enemy.y + 30);
        } else {
            ctx.drawImage(enemyShipImg, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

function drawExplosions() {
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    explosions.forEach(explosion => {
        if (explosion.timer > 15) {
            ctx.fillText('💥', explosion.x, explosion.y);
        } else if (explosion.timer > 5) {
            ctx.fillText('🔥', explosion.x, explosion.y);
        } else {
            ctx.fillText('💨', explosion.x, explosion.y);
        }
    });
}

function drawStars() {
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
        const x = (i * 123) % canvas.width;
        const y = (i * 456 + Date.now() * 0.1) % canvas.height;
        const size = (i % 3) + 1;
        ctx.fillRect(x, y, size, size);
    }
}

function updateUI() {
    // Update hearts
    const heartsElement = document.getElementById('hearts');
    heartsElement.textContent = '❤️'.repeat(playerLives);

    // Update health bar
    const healthFill = document.getElementById('healthFill');
    healthFill.style.width = playerHealth + '%';

    // Update score
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = 'Score: ' + score;
}

function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = 'Final Score: ' + score;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background stars
    drawStars();

    // Update game objects
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateExplosions();
    checkCollisions();

    // Draw everything
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawExplosions();

    // Update UI
    updateUI();

    requestAnimationFrame(gameLoop);
}

// Initial UI update
updateUI();

// Example Enemy class update method
class Enemy {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        // ...other properties...
    }

    update() {
        // Move down until y = 200, then only move left/right
        if (this.y < 200) {
            this.y += this.speedY;
        } else {
            this.x += this.speedX;
            // Bounce off left/right edges
            if (this.x < 0 || this.x + this.width > canvas.width) {
                this.speedX *= -1;
            }
        }
        // ...other update logic...
    }

    // ...other methods...
}
const rocketImg = new Image();
rocketImg.src = 'images/rocket.png';

const enemyShipImg = new Image();
enemyShipImg.src = 'images/enemyship.png';