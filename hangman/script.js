const words = [
    { word: 'CAT', hint: 'Furry pet that meows' },
    { word: 'DOG', hint: 'Loyal pet that barks' },
    { word: 'BIRD', hint: 'Animal that flies and chirps' },
    { word: 'FISH', hint: 'Swims in water' },
    { word: 'TREE', hint: 'Tall plant with branches' },
    { word: 'HOUSE', hint: 'Place where people live' },
    { word: 'BOOK', hint: 'You read this for knowledge' },
    { word: 'PHONE', hint: 'Device for calling people' },
    { word: 'WATER', hint: 'Clear liquid you drink' },
    { word: 'MUSIC', hint: 'Sounds that make melodies' },
    { word: 'HAPPY', hint: 'Feeling of joy and pleasure' },
    { word: 'SMILE', hint: 'Expression of happiness' },
    { word: 'DANCE', hint: 'Moving to rhythm' },
    { word: 'BEACH', hint: 'Sandy place by the ocean' },
    { word: 'PIZZA', hint: 'Italian food with cheese' },
    { word: 'STAR', hint: 'Bright object in night sky' },
    { word: 'MOON', hint: 'Earth\'s natural satellite' },
    { word: 'FLOWER', hint: 'Beautiful plant that blooms' },
    { word: 'CLOUD', hint: 'White fluffy thing in sky' },
    { word: 'OCEAN', hint: 'Large body of salt water' }
];

let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrongGuesses = 6;
let gameWon = false;
let gameLost = false;
let currentWordIndex = 0;
let score = 0;
let gameWords = [];

const hangmanParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

function goHome() {
    showScreen('startScreen');
    resetFullGame();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Hide win popup when changing screens
    document.getElementById('winPopup').classList.remove('show');
}

function startGame() {
    resetFullGame();
    selectGameWords();
    startNewWord();
    showScreen('gameScreen');
}

function resetFullGame() {
    currentWordIndex = 0;
    score = 0;
    gameWords = [];
    resetCurrentWord();
}

function resetCurrentWord() {
    guessedLetters = [];
    wrongGuesses = 0;
    gameWon = false;
    gameLost = false;

    // Hide all hangman parts
    hangmanParts.forEach(part => {
        document.getElementById(part).style.display = 'none';
    });
}

function selectGameWords() {
    // Shuffle words and select 5 for the game
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    gameWords = shuffled.slice(0, 5);
}

function startNewWord() {
    if (currentWordIndex < gameWords.length) {
        currentWord = gameWords[currentWordIndex].word;
        currentHint = gameWords[currentWordIndex].hint;
        resetCurrentWord();
        createKeyboard();
        updateWordDisplay();
        updateLivesCounter();
        updateHint();
        updateWordProgress();
        updateScore();
    }
}

function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].word;
    currentHint = words[randomIndex].hint;
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let letter of letters) {
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.onclick = () => guessLetter(letter);
        keyboard.appendChild(key);
    }
}

function updateWordProgress() {
    document.getElementById('wordProgress').textContent = `${currentWordIndex + 1}/${gameWords.length}`;
}

function updateScore() {
    document.getElementById('scoreCount').textContent = score;
}

function updateWordDisplay() {
    const wordDisplay = document.getElementById('wordDisplay');
    let display = '';

    for (let letter of currentWord) {
        if (guessedLetters.includes(letter)) {
            display += letter + ' ';
        } else {
            display += '_ ';
        }
    }

    wordDisplay.textContent = display.trim();
}

function updateLivesCounter() {
    document.getElementById('livesCount').textContent = maxWrongGuesses - wrongGuesses;
}

function updateHint() {
    document.getElementById('hintText').textContent = currentHint;
}

function guessLetter(letter) {
    if (guessedLetters.includes(letter) || gameWon || gameLost) {
        return;
    }

    guessedLetters.push(letter);

    const keyButton = Array.from(document.querySelectorAll('.key')).find(btn => btn.textContent === letter);

    if (currentWord.includes(letter)) {
        keyButton.classList.add('correct');
        keyButton.disabled = true;
        updateWordDisplay();
        checkWin();
    } else {
        keyButton.classList.add('incorrect');
        keyButton.disabled = true;
        wrongGuesses++;
        drawHangmanPart();
        updateLivesCounter();
        checkLose();
    }
}

function drawHangmanPart() {
    if (wrongGuesses <= hangmanParts.length) {
        document.getElementById(hangmanParts[wrongGuesses - 1]).style.display = 'block';
    }
}

function checkWin() {
    const allLettersGuessed = currentWord.split('').every(letter => guessedLetters.includes(letter));

    if (allLettersGuessed) {
        gameWon = true;
        score += 100; // Add points for correct word
        updateScore();

        setTimeout(() => {
            showWinPopup();
        }, 500);
    }
}

function showWinPopup() {
    document.getElementById('winPopup').classList.add('show');
}

function nextWord() {
    document.getElementById('winPopup').classList.remove('show');
    currentWordIndex++;

    if (currentWordIndex >= gameWords.length) {
        // All words completed
        showGameCompleteScreen();
    } else {
        // Move to next word
        startNewWord();
    }
}

function showLoseScreen() {
    const endScreen = document.getElementById('endScreen');
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const wordReveal = document.getElementById('wordReveal');

    // First show the end screen
    showScreen('endScreen');

    // Then add the lose style
    endScreen.classList.add('lose');

    endTitle.textContent = '💀 GAME OVER 💀';
    endMessage.textContent = 'The hangman is complete! Better luck next time!';
    wordReveal.innerHTML = `The word was: <strong>${currentWord}</strong><br>Final Score: ${score} points`;
    wordReveal.style.color = '#e74c3c';
}


function showGameCompleteScreen() {
    const endScreen = document.getElementById('endScreen');
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const wordReveal = document.getElementById('wordReveal');

    showScreen('endScreen');
    endScreen.classList.add('win');

    endTitle.textContent = '🎉 CONGRATULATIONS! 🎉';
    endMessage.textContent = 'You completed all the words!';
    wordReveal.textContent = `Final Score: ${score} points`;
    wordReveal.style.color = '#27ae60';
}



function checkLose() {
    if (wrongGuesses >= maxWrongGuesses) {
        gameLost = true;
        showLoseScreen();
    }
}


function showLoseScreen() {
    const endScreen = document.getElementById('endScreen');
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const wordReveal = document.getElementById('wordReveal');

    endScreen.className = 'screen end-screen lose active';
    endTitle.textContent = '💀 GAME OVER 💀';
    endMessage.textContent = 'The hangman is complete! Better luck next time!';
    wordReveal.innerHTML = `The word was: <strong>${currentWord}</strong><br>Final Score: ${score} points`;
    wordReveal.style.color = '#e74c3c';
}


// function showLoseScreen() {
//     const endScreen = document.getElementById('endScreen');
//     const endTitle = document.getElementById('endTitle');
//     const endMessage = document.getElementById('endMessage');
//     const wordReveal = document.getElementById('wordReveal');

//     endScreen.className = 'screen end-screen lose active';
//     endTitle.textContent = '💀 GAME OVER 💀';
//     endMessage.textContent = 'The hangman is complete! Better luck next time!';
//     wordReveal.innerHTML = `The word was: <strong>${currentWord}</strong><br>Final Score: ${score} points`;
//     wordReveal.style.color = '#e74c3c';
// }

function showEndScreen(won) {
    const endScreen = document.getElementById('endScreen');
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const wordReveal = document.getElementById('wordReveal');

    if (won) {
        endScreen.className = 'screen end-screen win active';
        endTitle.textContent = '🎉 YOU WON! 🎉';
        endMessage.textContent = 'Congratulations! You guessed the word correctly!';
        wordReveal.textContent = `The word was: ${currentWord}`;
        wordReveal.style.color = '#27ae60';
    } else {
        endScreen.className = 'screen end-screen lose active';
        endTitle.textContent = '💀 GAME OVER 💀';
        endMessage.textContent = 'The hangman is complete! Better luck next time!';
        wordReveal.textContent = `The word was: ${currentWord}`;
        wordReveal.style.color = '#e74c3c';
    }
}

// Keyboard event listener for physical keyboard
document.addEventListener('keydown', (event) => {
    if (document.getElementById('gameScreen').classList.contains('active')) {
        const letter = event.key.toUpperCase();
        if (letter >= 'A' && letter <= 'Z') {
            guessLetter(letter);
        }
    }
});

// Initialize the game
window.onload = function () {
    showScreen('startScreen');
};