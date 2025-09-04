let gameState = {
    score: 0,
    lives: 5,
    level: 1,
    currentQuestion: null,
    shapes: ['square', 'rectangle', 'circle', 'triangle']
};

const questions = {
    1: { // Easy level
        square: { params: [3, 4, 5], questions: ['area', 'perimeter'] },
        rectangle: { params: [[3, 4], [2, 5], [4, 6]], questions: ['area', 'perimeter'] },
        circle: { params: [2, 3, 4], questions: ['area', 'circumference'] }
    },
    2: { // Medium level
        square: { params: [6, 7, 8], questions: ['area', 'perimeter'] },
        rectangle: { params: [[5, 7], [4, 8], [6, 9]], questions: ['area', 'perimeter'] },
        circle: { params: [3, 4, 5], questions: ['area', 'circumference'] },
        triangle: { params: [[4, 5], [5, 6], [6, 8]], questions: ['area', 'perimeter'] }
    },
    3: { // Hard level
        square: { params: [9, 10, 12], questions: ['area', 'perimeter'] },
        rectangle: { params: [[7, 10], [8, 12], [9, 15]], questions: ['area', 'perimeter'] },
        circle: { params: [5, 6, 7], questions: ['area', 'circumference'] },
        triangle: { params: [[7, 9], [8, 10], [10, 12]], questions: ['area', 'perimeter'] }
    }
};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    gameState = {
        score: 0,
        lives: 5,
        level: 1,
        currentQuestion: null
    };
    updateUI();
    generateQuestion();
    showScreen('gameScreen');
}

function updateUI() {
    document.getElementById('scoreValue').textContent = gameState.score;
    document.getElementById('livesValue').textContent = gameState.lives;
    document.getElementById('levelValue').textContent = gameState.level;
}

function generateQuestion() {
    const levelQuestions = questions[Math.min(gameState.level, 3)];
    const shapeTypes = Object.keys(levelQuestions);
    const randomShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const shapeData = levelQuestions[randomShape];
    const randomParam = shapeData.params[Math.floor(Math.random() * shapeData.params.length)];
    const randomQuestionType = shapeData.questions[Math.floor(Math.random() * shapeData.questions.length)];

    gameState.currentQuestion = {
        shape: randomShape,
        parameter: randomParam,
        questionType: randomQuestionType
    };

    displayQuestion();
}

function displayQuestion() {
    const { shape, parameter, questionType } = gameState.currentQuestion;
    let correctAnswer, questionText, formula, solveText;

    // Calculate correct answer based on shape and question type
    switch (shape) {
        case 'square':
            if (questionType === 'area') {
                correctAnswer = Math.pow(parameter, 2);
                questionText = `What is the area of this square?`;
                formula = 'Area = side²';
                solveText = `Area = ${parameter}²<br>Area = ${parameter} × ${parameter}<br>Area = ${correctAnswer}`;
            } else {
                correctAnswer = 4 * parameter;
                questionText = `What is the perimeter of this square?`;
                formula = 'Perimeter = 4 × side';
                solveText = `Perimeter = 4 × ${parameter}<br>Perimeter = ${correctAnswer}`;
            }
            break;
        case 'rectangle':
            const [width, height] = parameter;
            if (questionType === 'area') {
                correctAnswer = width * height;
                questionText = `What is the area of this rectangle?`;
                formula = 'Area = length × width';
                solveText = `Area = ${width} × ${height}<br>Area = ${correctAnswer}`;
            } else {
                correctAnswer = 2 * (width + height);
                questionText = `What is the perimeter of this rectangle?`;
                formula = 'Perimeter = 2(l + w)';
                solveText = `Perimeter = 2(${width} + ${height})<br>Perimeter = 2 × ${width + height}<br>Perimeter = ${correctAnswer}`;
            }
            break;
        case 'circle':
            if (questionType === 'area') {
                correctAnswer = Math.round(Math.PI * Math.pow(parameter, 2));
                questionText = `What is the area of this circle?`;
                formula = 'Area = π × r²';
                solveText = `Area = π × ${parameter}²<br>Area = π × ${Math.pow(parameter, 2)}<br>Area ≈ ${correctAnswer}`;
            } else {
                correctAnswer = Math.round(2 * Math.PI * parameter);
                questionText = `What is the circumference of this circle?`;
                formula = 'Circumference = 2πr';
                solveText = `Circumference = 2π × ${parameter}<br>Circumference ≈ ${correctAnswer}`;
            }
            break;
        case 'triangle':
            const [base, triangleHeight] = parameter;
            if (questionType === 'area') {
                correctAnswer = Math.round(0.5 * base * triangleHeight);
                questionText = `What is the area of this triangle?`;
                formula = 'Area = ½ × base × height';
                solveText = `Area = ½ × ${base} × ${triangleHeight}<br>Area = ${correctAnswer}`;
            } else {
                // Using Pythagorean theorem for the sides
                const side = Math.round(Math.sqrt(Math.pow(base / 2, 2) + Math.pow(triangleHeight, 2)));
                correctAnswer = base + 2 * side;
                questionText = `What is the perimeter of this triangle?`;
                formula = 'Perimeter = a + b + c';
                solveText = `Base = ${base}<br>Each side ≈ ${side}<br>Perimeter = ${base} + ${side} + ${side}<br>Perimeter = ${correctAnswer}`;
            }
            break;
    }

    gameState.currentQuestion.correctAnswer = correctAnswer;

    document.getElementById('questionText').innerHTML = questionText;

    // Generate shape HTML with formula and solve sections
    generateShapeWithFormula(shape, parameter, formula, solveText);

    // Generate answer options
    generateAnswers(correctAnswer);
}

function generateShapeWithFormula(shape, parameter, formula, solveText) {
    const container = document.getElementById('shapeContainer');
    let shapeHTML = '';

    switch (shape) {
        case 'square':
            shapeHTML = `
                <div class="formula-section">
                    <div class="formula-title">Formula:</div>
                    <div class="formula">${formula}</div>
                </div>
                <div class="shape">
                    <div class="square" data-side="${parameter}"></div>
                </div>
                <button class="show-answer-btn" onclick="showAnswer()">Show Answer</button>
                <div class="solve-section">
                    <div class="solve-title">Solution:</div>
                    <div class="solve-area">${solveText}</div>
                </div>
            `;
            break;

        case 'rectangle':
            const [width, height] = parameter;
            shapeHTML = `
                <div class="formula-section">
                    <div class="formula-title">Formula:</div>
                    <div class="formula">${formula}</div>
                </div>
                <div class="shape">
                    <div class="rectangle" data-dimensions="${width}×${height}"></div>
                </div>
                <button class="show-answer-btn" onclick="showAnswer()">Show Answer</button>
                <div class="solve-section">
                    <div class="solve-title">Solution:</div>
                    <div class="solve-area">${solveText}</div>
                </div>
            `;
            break;

        case 'circle':
            if (questionType === 'area') {
                correctAnswer = Math.round(Math.PI * Math.pow(parameter, 2));
                questionText = `What is the area of this circle?`;
                formula = 'Area = π × r²';
                solveText = `
            π ≈ 3.14<br>
            Area = π × ${parameter}²<br>
            Area = π × ${Math.pow(parameter, 2)}<br>
            Area ≈ 3.14 × ${Math.pow(parameter, 2)}<br>
            Area ≈ ${correctAnswer}
        `;
            } else {
                correctAnswer = Math.round(2 * Math.PI * parameter);
                questionText = `What is the circumference of this circle?`;
                formula = 'Circumference = 2πr';
                solveText = `
            π ≈ 3.14<br>
            Circumference = 2π × ${parameter}<br>
            Circumference ≈ 2 × 3.14 × ${parameter}<br>
            Circumference ≈ ${correctAnswer}
        `;
            }
            break;

        case 'triangle':
            const [base, triangleHeight] = parameter;
            shapeHTML = `
                <div class="formula-section">
                    <div class="formula-title">Formula:</div>
                    <div class="formula">${formula}</div>
                </div>
                <div class="shape">
                    <div class="triangle" data-dimensions="b=${base}, h=${triangleHeight}"></div>
                </div>
                <button class="show-answer-btn" onclick="showAnswer()">Show Answer</button>
                <div class="solve-section">
                    <div class="solve-title">Solution:</div>
                    <div class="solve-area">${solveText}</div>
                </div>
            `;
            break;
    }

    container.innerHTML = shapeHTML;
}


function generateAnswers(correctAnswer) {
    const answers = [correctAnswer];

    // Generate 3 wrong answers
    for (let i = 0; i < 3; i++) {
        let wrongAnswer;
        do {
            const variation = 0.2 + Math.random() * 0.6; // 20% to 80% variation
            wrongAnswer = Math.round(correctAnswer * variation);
        } while (answers.includes(wrongAnswer) || wrongAnswer === correctAnswer);
        answers.push(wrongAnswer);
    }

    // Shuffle answers
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    const answerArea = document.getElementById('answerArea');
    answerArea.innerHTML = answers.map(answer =>
        `<button class="answer-btn" onclick="checkAnswer(${answer})">${answer}</button>`
    ).join('');
}

function checkAnswer(selectedAnswer) {
    if (selectedAnswer === gameState.currentQuestion.correctAnswer) {
        gameState.score += 5;
        showCorrectFeedback();
    } else {
        gameState.lives--;
        showWrongFeedback();
    }
    updateUI();
}

function showCorrectFeedback() {
    createStars();
    showScreen('correctScreen');
}

function showWrongFeedback() {
    showScreen('wrongScreen');
}

function createStars() {
    const container = document.getElementById('starsContainer');
    container.innerHTML = '';

    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '⭐';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(star);
    }
}

function nextQuestion() {
    if (gameState.lives <= 0) {
        endGame();
        return;
    }

    // Increase level every 5 questions
    if (gameState.score > 0 && gameState.score % 25 === 0) {
        gameState.level = Math.min(3, gameState.level + 1);
    }

    generateQuestion();
    showScreen('gameScreen');
}

function endGame() {
    document.getElementById('finalScore').textContent = gameState.score;
    showScreen('endScreen');
}

function restartGame() {
    startGame();
}

function goHome() {
    showScreen('startScreen');
}

function showAnswer() {
    const solveSection = document.querySelector('.solve-section');
    const showBtn = document.querySelector('.show-answer-btn');

    if (solveSection && showBtn) {
        solveSection.style.display = 'block'; // show solution
        showBtn.style.display = 'none';       // hide button

        // Deduct 1 life
        gameState.lives = Math.max(0, gameState.lives - 1);
        updateUI();

        // End game if lives run out
        if (gameState.lives <= 0) {
            endGame();
        }
    }
}
