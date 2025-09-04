// Game data
const gameData = {
    fruits: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'pineapple', 'watermelon', 'mango', 'cherry', 'peach'],
    vegetables: ['carrot', 'broccoli', 'tomato', 'potato', 'onion', 'pepper', 'cucumber', 'lettuce', 'spinach', 'corn'],
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    seasons: ['spring', 'summer', 'autumn', 'winter']
};

// Game state
let currentMode = '';
let currentWords = [];
let currentWordIndex = 0;
let currentWord = '';
let score = 0;
let lives = 5;
let attempts = 3;
let isListening = false;
let recognition = null;
let microphonePermissionGranted = false;

// Initialize speech recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    }

    if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            isListening = true;
            microphonePermissionGranted = true;
            const micButton = document.getElementById('micButton');
            if (micButton) {
                micButton.classList.add('listening');
            }
        };

        recognition.onresult = function (event) {
            const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
            checkPronunciation(spokenWord);
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone permission is required to play this game. Please allow microphone access and refresh the page.');
            }
            stopListening();
        };

        recognition.onend = function () {
            stopListening();
        };
    }
}

// Request microphone permission on first interaction
async function requestMicrophonePermission() {
    if (!microphonePermissionGranted && recognition) {
        try {
            // Start recognition briefly to trigger permission request
            recognition.start();
            // It will automatically stop and trigger onend, but permission will be granted
        } catch (error) {
            console.error('Error requesting microphone permission:', error);
        }
    }
}

// Start the game
function startGame(mode) {
    currentMode = mode;
    currentWords = [...gameData[mode]];
    currentWordIndex = 0;
    score = 0;
    lives = 5;
    attempts = 3;

    // Shuffle words
    currentWords = currentWords.sort(() => Math.random() - 0.5);

    updateDisplay();
    showScreen('gameScreen');

    // Request microphone permission if not already granted
    if (!microphonePermissionGranted) {
        requestMicrophonePermission();
    }

    loadCurrentWord();
}

// Load current word
function loadCurrentWord() {
    if (currentWordIndex >= currentWords.length) {
        endGame('Congratulations!');
        return;
    }

    currentWord = currentWords[currentWordIndex];
    attempts = 3;

    document.getElementById('wordText').textContent = currentWord.charAt(0).toUpperCase() + currentWord.slice(1);
    document.getElementById('wordImage').style.backgroundImage = `url('images/${currentWord}.png')`;
    updateDisplay();
    updateProgress();
}

// Request microphone permission immediately on load
async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        microphonePermissionGranted = true;
        console.log("Microphone permission granted");
    } catch (error) {
        console.error("Microphone permission denied:", error);
        alert("Microphone permission is required to play this game.");
    }
}

// Start listening
function startListening() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    if (!isListening && attempts > 0 && microphonePermissionGranted) {
        try {
            recognition.start();
        } catch (error) {
            if (error.name === 'InvalidStateError') {
                // Recognition is already active
                return;
            }
            console.error('Error starting recognition:', error);
        }
    }
}




// Stop listening
function stopListening() {
    isListening = false;
    document.getElementById('micButton').classList.remove('listening');
}


// Check pronunciation
function checkPronunciation(spokenWord) {
    if (spokenWord === currentWord.toLowerCase()) {
        // ✅ Correct pronunciation
        let points = 0;
        if (attempts === 3) points = 10;   // First try
        else if (attempts === 2) points = 6; // Second try
        else if (attempts === 1) points = 3; // Third try

        score += points;

        showFeedback('correct');
        createStars();

        setTimeout(() => {
            currentWordIndex++;
            loadCurrentWord();
        }, 2000);

    } else {
        // ❌ Wrong pronunciation
        attempts--; // only decrease on wrong

        if (attempts <= 0) {
            lives--;
            showFeedback('wrong');
            if (lives <= 0) {
                setTimeout(() => endGame('Game Over!'), 2000);
            } else {
                setTimeout(() => {
                    currentWordIndex++;
                    loadCurrentWord();
                }, 2000);
            }
        } else {
            showFeedback('try-again');
        }
    }

    updateDisplay();
}


// Show feedback
function showFeedback(type) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback';

    switch (type) {
        case 'correct':
            feedback.textContent = '🎉✨';
            break;
        case 'wrong':
            feedback.textContent = '❌💔';
            break;
        case 'try-again':
            feedback.textContent = '🔄';
            break;
    }

    document.body.appendChild(feedback);
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 2000);
}

// Create stars effect
function createStars() {
    const container = document.querySelector('.game-container');
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '⭐';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(star);

        setTimeout(() => {
            container.removeChild(star);
        }, 2000);
    }
}

// Update display
function updateDisplay() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('attempts').textContent = `Attempts: ${attempts}/3`;

    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('lost', index >= lives);
    });
}

// Update progress bar
function updateProgress() {
    const progress = (currentWordIndex / currentWords.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// End game
function endGame(title) {
    document.getElementById('endTitle').textContent = title;
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;
    showScreen('endScreen');
}

// Show screen
function showScreen(screenId) {
    const screens = ['menuScreen', 'gameScreen', 'endScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = screen === screenId ? 'flex' : 'none';
    });
}

// Show menu
function showMenu() {
    showScreen('menuScreen');
    stopListening();
}

// Initialize the game
function init() {
    initSpeechRecognition();

    // Ask mic permission on window load (only once)
    requestMicrophonePermission();

    showScreen('menuScreen');
}

// Start the game when page loads
window.addEventListener('load', init);