  let currentMode = '';
        let currentAnswer = 0;
        let score = 0;
        let level = 1;
        let lives = 5;
        let questionsAnswered = 0;

        function showModeSelection() {
            document.getElementById('modeSelection').style.display = 'block';
            document.getElementById('gameArea').style.display = 'none';
            document.getElementById('gameOver').style.display = 'none';
        }

        function startGame(mode) {
            currentMode = mode;
            resetGameStats();
            document.getElementById('modeSelection').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            document.getElementById('gameOver').style.display = 'none';
            generateQuestion();
        }

        function resetGameStats() {
            score = 0;
            level = 1;
            lives = 5;
            questionsAnswered = 0;
            updateDisplay();
        }

        function resetGame() {
            showModeSelection();
            resetGameStats();
        }

        function updateDisplay() {
            document.getElementById('scoreValue').textContent = score;
            document.getElementById('levelValue').textContent = level;
            
            const heartsContainer = document.getElementById('hearts');
            heartsContainer.innerHTML = '';
            for (let i = 0; i < lives; i++) {
                heartsContainer.innerHTML += '<span class="heart">❤️</span>';
            }
        }

        function generateQuestion() {
            let num1, num2, operator, equation;
            
            // Adjust difficulty based on level
            const maxNum = Math.min(5 + (level * 3), 50);
            const minNum = Math.max(1, level);
            
            if (currentMode === 'random') {
                const operations = ['addition', 'subtraction', 'multiplication', 'division'];
                const randomOp = operations[Math.floor(Math.random() * operations.length)];
                generateSpecificQuestion(randomOp, minNum, maxNum);
            } else {
                generateSpecificQuestion(currentMode, minNum, maxNum);
            }
        }

        function generateSpecificQuestion(operation, minNum, maxNum) {
            let num1, num2, operator, equation;
            
            switch (operation) {
                case 'addition':
                    num1 = Math.floor(Math.random() * maxNum) + minNum;
                    num2 = Math.floor(Math.random() * maxNum) + minNum;
                    currentAnswer = num1 + num2;
                    equation = `${num1} + ${num2} = `;
                    break;
                    
                case 'subtraction':
                    num1 = Math.floor(Math.random() * maxNum) + minNum + 5;
                    num2 = Math.floor(Math.random() * (num1 - minNum)) + minNum;
                    currentAnswer = num1 - num2;
                    equation = `${num1} - ${num2} = `;
                    break;
                    
                case 'multiplication':
                    num1 = Math.floor(Math.random() * Math.min(12, maxNum)) + 1;
                    num2 = Math.floor(Math.random() * Math.min(12, maxNum)) + 1;
                    currentAnswer = num1 * num2;
                    equation = `${num1} × ${num2} = `;
                    break;
                    
                case 'division':
                    num2 = Math.floor(Math.random() * Math.min(12, maxNum)) + 1;
                    currentAnswer = Math.floor(Math.random() * Math.min(12, maxNum)) + 1;
                    num1 = num2 * currentAnswer;
                    equation = `${num1} ÷ ${num2} = `;
                    break;
            }
            
            document.getElementById('equation').textContent = equation;
            document.getElementById('answerInput').value = '';
            document.getElementById('answerInput').focus();
        }

        function checkAnswer() {
            const userAnswer = parseInt(document.getElementById('answerInput').value);
            
            if (isNaN(userAnswer)) {
                return;
            }
            
            if (userAnswer === currentAnswer) {
                showCorrectAnimation();
                score += 10 * level;
                questionsAnswered++;
                
                // Level up every 5 correct answers
                if (questionsAnswered % 5 === 0) {
                    level++;
                }
                
                setTimeout(() => {
                    generateQuestion();
                    updateDisplay();
                }, 1500);
            } else {
                showWrongAnimation();
                lives--;
                updateDisplay();
                
                if (lives <= 0) {
                    setTimeout(() => {
                        showGameOver();
                    }, 1500);
                } else {
                    setTimeout(() => {
                        generateQuestion();
                    }, 1500);
                }
            }
        }

        function showCorrectAnimation() {
            const overlay = document.getElementById('animationOverlay');
            const content = document.getElementById('animationContent');
            
            content.innerHTML = '🎉<br>Correct!';
            content.style.color = '#32CD32';
            overlay.style.display = 'flex';
            
            createStars();
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1500);
        }

        function showWrongAnimation() {
            const overlay = document.getElementById('animationOverlay');
            const content = document.getElementById('animationContent');
            
            content.innerHTML = '❌<br>Try Again!';
            content.style.color = '#FF6347';
            overlay.style.display = 'flex';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1500);
        }

        function createStars() {
            const starsContainer = document.getElementById('stars');
            starsContainer.innerHTML = '';
            
            for (let i = 0; i < 15; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.textContent = '⭐';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 0.5 + 's';
                starsContainer.appendChild(star);
            }
            
            setTimeout(() => {
                starsContainer.innerHTML = '';
            }, 1500);
        }

        function showGameOver() {
            document.getElementById('gameArea').style.display = 'none';
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('finalScore').textContent = score;
        }

        // Allow Enter key to submit answer
        document.getElementById('answerInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        // Initialize the game
        updateDisplay();