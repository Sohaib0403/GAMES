 let score = 0;
        let lives = 3;
        let currentFoods = [];
        let gameActive = true;
        let timeLeft = 180; // 3 minutes in seconds
        let timerInterval;

        const foods = [
            // Healthy foods
            { name: '🍎 Apple', healthy: true },
            { name: '🥕 Carrot', healthy: true },
            { name: '🥬 Broccoli', healthy: true },
            { name: '🍌 Banana', healthy: true },
            { name: '🍊 Orange', healthy: true },
            { name: '🥒 Cucumber', healthy: true },
            { name: '🍇 Grapes', healthy: true },
            { name: '🥑 Avocado', healthy: true },
            { name: '🍓 Strawberry', healthy: true },
            { name: '🥦 Broccoli', healthy: true },
            { name: '🥗 Salad', healthy: true },
            { name: '🍅 Tomato', healthy: true },
            
            // Unhealthy foods
            { name: '🍔 Burger', healthy: false },
            { name: '🍟 French Fries', healthy: false },
            { name: '🍕 Pizza', healthy: false },
            { name: '🍭 Lollipop', healthy: false },
            { name: '🍰 Cake', healthy: false },
            { name: '🍪 Cookie', healthy: false },
            { name: '🥤 Soda', healthy: false },
            { name: '🍩 Donut', healthy: false },
            { name: '🍫 Chocolate', healthy: false },
            { name: '🧁 Cupcake', healthy: false },
            { name: '🍬 Candy', healthy: false },
            { name: '🥨 Pretzel', healthy: false }
        ];

        function startTimer() {
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 30) {
                    document.getElementById('timer').classList.add('warning');
                }
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    gameActive = false;
                    showGameOver();
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('timer').textContent = timerDisplay;
        }

        function stopTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        }

        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function generateFoods() {
            const shuffled = shuffleArray(foods);
            currentFoods = shuffled.slice(0, 8); // Show 8 foods at a time
            
            const container = document.getElementById('foods-container');
            container.innerHTML = '';
            
            currentFoods.forEach((food, index) => {
                const foodElement = document.createElement('div');
                foodElement.className = 'food-item';
                foodElement.textContent = food.name;
                foodElement.draggable = true;
                foodElement.dataset.healthy = food.healthy;
                foodElement.dataset.index = index;
                foodElement.id = `food-${Date.now()}-${index}`; // Unique ID
                
                foodElement.addEventListener('dragstart', handleDragStart);
                foodElement.addEventListener('dragend', handleDragEnd);
                
                container.appendChild(foodElement);
            });
        }

        function handleDragStart(e) {
            if (!gameActive) return;
            e.dataTransfer.setData('text/plain', e.target.id); // Use unique ID instead of index
            e.target.classList.add('dragging');
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function setupBaskets() {
            const healthyBasket = document.getElementById('healthy-basket');
            const unhealthyBasket = document.getElementById('unhealthy-basket');
            
            [healthyBasket, unhealthyBasket].forEach(basket => {
                basket.addEventListener('dragover', handleDragOver);
                basket.addEventListener('drop', handleDrop);
                basket.addEventListener('dragenter', handleDragEnter);
                basket.addEventListener('dragleave', handleDragLeave);
            });
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDragEnter(e) {
            e.preventDefault();
            e.target.closest('.basket').classList.add('drag-over');
        }

        function handleDragLeave(e) {
            if (!e.target.closest('.basket').contains(e.relatedTarget)) {
                e.target.closest('.basket').classList.remove('drag-over');
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            const basket = e.target.closest('.basket');
            basket.classList.remove('drag-over');
            
            if (!gameActive) return;
            
            const foodId = e.dataTransfer.getData('text/plain');
            const foodElement = document.getElementById(foodId);
            
            if (!foodElement) return; // Safety check
            
            const foodIndex = parseInt(foodElement.dataset.index);
            const food = currentFoods[foodIndex];
            const isHealthyBasket = basket.id === 'healthy-basket';
            
            const correct = (food.healthy && isHealthyBasket) || (!food.healthy && !isHealthyBasket);
            
            // Always remove the specific item after drop
            removeFoodItem(foodElement);
            
            if (correct) {
                score += 10;
                updateScore();
                showFeedback('✓ Correct!', '#00b894');
            } else {
                lives--;
                updateLives();
                showFeedback('✗ Wrong!', '#e74c3c');
                
                if (lives === 0) {
                    gameActive = false;
                    stopTimer();
                    setTimeout(() => {
                        showGameOver();
                    }, 1500);
                }
            }
            
            // Check if all foods are sorted
            setTimeout(() => {
                if (document.querySelectorAll('.food-item').length === 0) {
                    if (gameActive) {
                        generateFoods(); // Generate new set of foods
                    }
                }
            }, 400);
        }

        function removeFoodItem(foodElement) {
            if (foodElement) {
                foodElement.style.opacity = '0';
                foodElement.style.transform = 'scale(0)';
                foodElement.style.pointerEvents = 'none';
                setTimeout(() => {
                    foodElement.remove();
                }, 300);
            }
        }

        function updateScore() {
            document.getElementById('score').textContent = score;
        }

        function updateLives() {
            const livesDisplay = document.getElementById('lives-display');
            livesDisplay.innerHTML = '';
            
            for (let i = 0; i < lives; i++) {
                const heart = document.createElement('span');
                heart.className = 'life-heart';
                heart.textContent = '♥';
                livesDisplay.appendChild(heart);
            }
        }

        function showFeedback(message, color) {
            const feedback = document.getElementById('feedback');
            feedback.textContent = message;
            feedback.style.color = color;
            feedback.classList.add('show');
            
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 1500);
        }

        function showGameOver() {
            const gameOverScreen = document.getElementById('game-over-screen');
            const healthStatus = document.getElementById('health-status');
            
            let message = '';
            let healthPercentage = 0;
            
            // Check if time ran out
            if (timeLeft <= 0) {
                message = '⏰ Time\'s up! ';
            }
            
            // Determine health status based on lives and score
            if (lives === 0) {
                message += '😷 You are an unhealthy person!';
                healthPercentage = 0;
                healthStatus.style.background = 'rgba(231, 76, 60, 0.3)';
            } else if (lives === 1) {
                message += '😐 You are 50% healthy!';
                healthPercentage = 50;
                healthStatus.style.background = 'rgba(241, 196, 15, 0.3)';
            } else if (lives === 2) {
                message += '😊 You are 80% healthy!';
                healthPercentage = 80;
                healthStatus.style.background = 'rgba(52, 152, 219, 0.3)';
            } else if (lives === 3) {
                if (score >= 100) {
                    message += '🌟 You are 100% healthy person!';
                    healthPercentage = 100;
                    healthStatus.style.background = 'rgba(0, 184, 148, 0.3)';
                } else {
                    message += '😊 You are 80% healthy!';
                    healthPercentage = 80;
                    healthStatus.style.background = 'rgba(52, 152, 219, 0.3)';
                }
            }
            
            // Add score to the message
            message += `\nFinal Score: ${score}`;
            
            healthStatus.textContent = message;
            gameOverScreen.style.display = 'flex';
        }

        function startGame() {
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-content').style.display = 'block';
            gameActive = true;
            setupBaskets();
            generateFoods();
            updateScore();
            updateLives();
            updateTimerDisplay();
            startTimer();
        }

        function restartGame() {
            score = 0;
            lives = 3;
            timeLeft = 180; // Reset to 3 minutes
            gameActive = true;
            
            stopTimer();
            document.getElementById('timer').classList.remove('warning');
            
            updateScore();
            updateLives();
            updateTimerDisplay();
            
            document.getElementById('game-over-screen').style.display = 'none';
            generateFoods();
            startTimer();
        }

        function goHome() {
            if (confirm('Are you sure you want to go home? Your progress will be lost!')) {
                stopTimer();
                gameActive = false;
                document.getElementById('start-screen').style.display = 'flex';
                document.getElementById('game-content').style.display = 'none';
                document.getElementById('game-over-screen').style.display = 'none';
                
                // Reset game state
                score = 0;
                lives = 3;
                timeLeft = 180;
                document.getElementById('timer').classList.remove('warning');
            }
        }

        function startGame() {
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-content').style.display = 'block';
            gameActive = true;
            setupBaskets();
            generateFoods();
            updateScore();
            updateLives();
            updateTimerDisplay();
            startTimer();
        }

        // Initialize game - show start screen
        function initGame() {
            document.getElementById('start-screen').style.display = 'flex';
            document.getElementById('game-content').style.display = 'none';
        }

        // Start the game when page loads
        window.addEventListener('load', initGame);