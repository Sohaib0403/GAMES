let gameState = {
            isPlaying: false,
            lives: 6,
            score: 0,
            currentBalloon: null,
            currentEquation: null,
            currentAnswer: null,
            balloonSpeed: 2,
            gameTime: 0,
            lastSpeedIncrease: 0
        };

        let gameTimer;
        let balloonTimer;

        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFA07A', '#98D8C8'];

        function startGame() {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('homeButton').style.display = 'block';
            document.getElementById('gameUI').style.display = 'block';
            document.getElementById('answerBox').style.display = 'flex';
            document.getElementById('nails').style.display = 'block';

            gameState.isPlaying = true;
            gameState.lives = 6;
            gameState.score = 0;
            gameState.gameTime = 0;
            gameState.balloonSpeed = 2;
            gameState.lastSpeedIncrease = 0;

            updateUI();
            createNails();
            createClouds();
            startGameTimer();
            spawnBalloon();
        }

        function goHome() {
            gameState.isPlaying = false;
            clearInterval(gameTimer);
            clearTimeout(balloonTimer);
            
            // Clear all balloons
            const balloons = document.querySelectorAll('.balloon');
            balloons.forEach(balloon => balloon.remove());
            
            // Clear all effects
            const effects = document.querySelectorAll('.pop-effect');
            effects.forEach(effect => effect.remove());

            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('homeButton').style.display = 'none';
            document.getElementById('gameUI').style.display = 'none';
            document.getElementById('answerBox').style.display = 'none';
            document.getElementById('nails').style.display = 'none';
            
            // Clear game over screen if exists
            const gameOver = document.querySelector('.game-over');
            if (gameOver) gameOver.remove();
        }

        function createNails() {
            const nailsContainer = document.getElementById('nails');
            nailsContainer.innerHTML = '';
            
            for (let i = 0; i < 39; i++) {
                const nail = document.createElement('div');
                nail.className = 'nail';
                nail.style.left = (i * 20) + 'px';
                nailsContainer.appendChild(nail);
            }
        }

        function createClouds() {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const cloud = document.createElement('div');
                    cloud.className = 'clouds';
                    cloud.style.top = Math.random() * 200 + 50 + 'px';
                    cloud.style.animationDelay = Math.random() * 10 + 's';
                    document.getElementById('gameContainer').appendChild(cloud);
                    
                    setTimeout(() => cloud.remove(), 20000);
                }, i * 7000);
            }
        }

        function generateEquation() {
            const operations = ['+', '-', '*'];
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let num1, num2, answer;

            switch(operation) {
                case '+':
                    num1 = Math.floor(Math.random() * 50) + 1;
                    num2 = Math.floor(Math.random() * 50) + 1;
                    answer = num1 + num2;
                    break;
                case '-':
                    num1 = Math.floor(Math.random() * 50) + 25;
                    num2 = Math.floor(Math.random() * 25) + 1;
                    answer = num1 - num2;
                    break;
                case '*':
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                    answer = num1 * num2;
                    break;
            }

            return {
                equation: `${num1} ${operation} ${num2}`,
                answer: answer
            };
        }

        function spawnBalloon() {
            if (!gameState.isPlaying) return;

            const equation = generateEquation();
            gameState.currentEquation = equation;
            gameState.currentAnswer = equation.answer;

            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = Math.random() * (780 - 80) + 'px';
            balloon.style.top = '-100px';
            balloon.textContent = equation.equation;

            document.getElementById('gameContainer').appendChild(balloon);
            gameState.currentBalloon = balloon;

            animateBalloon(balloon);
            document.getElementById('answerInput').focus();
        }

        function animateBalloon(balloon) {
            let position = -100;
            const animation = setInterval(() => {
                if (!gameState.isPlaying || !balloon.parentNode) {
                    clearInterval(animation);
                    return;
                }

                position += gameState.balloonSpeed;
                balloon.style.top = position + 'px';

                if (position >= 620) { // Hit the nails
                    clearInterval(animation);
                    hitNails();
                }
            }, 16);
        }

        function hitNails() {
            if (!gameState.currentBalloon) return;

            const balloon = gameState.currentBalloon;
            const rect = balloon.getBoundingClientRect();
            
            showPopEffect(rect.left + 40, rect.top, 'WRONG!', 'wrong');
            
            balloon.remove();
            gameState.currentBalloon = null;
            gameState.lives--;
            
            updateUI();
            
            if (gameState.lives <= 0) {
                endGame();
            } else {
                setTimeout(spawnBalloon, 1000);
            }
        }

        function submitAnswer() {
            if (!gameState.currentBalloon) return;

            const userAnswer = parseInt(document.getElementById('answerInput').value);
            const balloon = gameState.currentBalloon;
            const rect = balloon.getBoundingClientRect();

            if (userAnswer === gameState.currentAnswer) {
                showPopEffect(rect.left + 40, rect.top, 'CORRECT! +10', 'correct');
                gameState.score += 10;
                balloon.remove();
                gameState.currentBalloon = null;
                setTimeout(spawnBalloon, 500);
            } else {
                showPopEffect(rect.left + 40, rect.top, 'TRY AGAIN!', 'wrong');
            }

            document.getElementById('answerInput').value = '';
            updateUI();
        }

        function showPopEffect(x, y, text, className) {
            const effect = document.createElement('div');
            effect.className = `pop-effect ${className}`;
            effect.textContent = text;
            effect.style.left = x + 'px';
            effect.style.top = y + 'px';
            
            document.getElementById('gameContainer').appendChild(effect);
            
            setTimeout(() => effect.remove(), 1000);
        }

        function startGameTimer() {
            gameTimer = setInterval(() => {
                gameState.gameTime++;
                
                // Increase speed every 2 minutes (120 seconds)
                if (gameState.gameTime % 120 === 0 && gameState.gameTime > gameState.lastSpeedIncrease) {
                    gameState.balloonSpeed *= 1.1; // Increase by 10%
                    gameState.lastSpeedIncrease = gameState.gameTime;
                    
                    // Show speed increase notification
                    showPopEffect(400, 300, 'SPEED UP!', 'correct');
                }
                
                updateUI();
            }, 1000);
        }

        function updateUI() {
            // Update lives display with hearts
            let heartsDisplay = '';
            for (let i = 0; i < gameState.lives; i++) {
                heartsDisplay += '❤️';
            }
            document.getElementById('livesCount').textContent = heartsDisplay;
            
            document.getElementById('scoreCount').textContent = gameState.score;
            document.getElementById('timeCount').textContent = gameState.gameTime;
        }

        function endGame() {
            gameState.isPlaying = false;
            clearInterval(gameTimer);
            
            const gameOver = document.createElement('div');
            gameOver.className = 'game-over';
            gameOver.innerHTML = `
                <h2>Game Over!</h2>
                <p>Final Score: ${gameState.score}</p>
                <p>Time Survived: ${gameState.gameTime}s</p>
                <button class="start-button" onclick="goHome()" style="margin-top: 20px;">Play Again</button>
            `;
            
            document.getElementById('gameContainer').appendChild(gameOver);
        }

        // Handle Enter key for submit
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && gameState.isPlaying) {
                submitAnswer();
            }
        });

        // Start cloud animation loop
        setInterval(createClouds, 20000);