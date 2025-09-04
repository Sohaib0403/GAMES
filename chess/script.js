const board = document.getElementById('chessboard');
const game = new Chess();

let selectedSquare = null;
let legalMoves = [];
let playerColor = null;
let score = 0;
let timerInterval = null;
let startTime = null;

const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0  // King no score but used for game over
};

const PIECE_NAMES = {
  p: 'Pawn',
  r: 'Rook',
  n: 'Knight',
  b: 'Bishop',
  q: 'Queen',
  k: 'King'
};

const PIECE_IMAGES = {
  w: {
    p: 'images/whitepawn.png',
    r: 'images/whiterook.png',
    n: 'images/whiteKnight.png',
    b: 'images/whiteBishop.png',
    q: 'images/whitequeen.png',
    k: 'images/whiteking.png'
  },
  b: {
    p: 'images/blackpawn.png',
    r: 'images/blackrook.png',
    n: 'images/blackKnight.png',
    b: 'images/blackBishop.png',
    q: 'images/blackqueen.png',
    k: 'images/blackKing.png'
  }
};

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const colorRadios = document.querySelectorAll('input[name="color"]');
const gameUI = document.getElementById('gameUI');
const endScreen = document.getElementById('endScreen');
const endMessage = document.getElementById('endMessage');
const finalScoreEl = document.getElementById('finalScore');
const timeTakenEl = document.getElementById('timeTaken');
const replayButton = document.getElementById('replayButton');
const homeButton = document.getElementById('homeButton');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const whiteBtn = document.getElementById('whiteBtn');
const blackBtn = document.getElementById('blackBtn');


whiteBtn.addEventListener('click', () => {
  playerColor = 'w';
  whiteBtn.classList.add('selected');
  blackBtn.classList.remove('selected');
  startButton.disabled = false;
});

blackBtn.addEventListener('click', () => {
  playerColor = 'b';
  blackBtn.classList.add('selected');
  whiteBtn.classList.remove('selected');
  startButton.disabled = false;
});

startButton.addEventListener('click', () => {
  if (!playerColor) return;
  startGame();
});

homeButton.addEventListener('click', () => {
  resetGame();
  showStartScreen();
});

function showStartScreen() {
  startScreen.style.display = 'flex';
  gameUI.style.display = 'none';
  endScreen.style.display = 'none';
  startButton.disabled = true;
  playerColor = null;
  whiteBtn.classList.remove('selected');
  blackBtn.classList.remove('selected');
}


colorRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    startButton.disabled = false;
  });
});

startButton.addEventListener('click', () => {
  const selected = document.querySelector('input[name="color"]:checked');
  if (!selected) return;
  playerColor = selected.value;
  startGame();
});

replayButton.addEventListener('click', () => {
  resetGame();
  startGame();
});

homeButton.addEventListener('click', () => {
  resetGame();
  showStartScreen();
});

function showStartScreen() {
  startScreen.style.display = 'flex';
  gameUI.style.display = 'none';
  endScreen.style.display = 'none';
  startButton.disabled = true;
  colorRadios.forEach(r => r.checked = false);
}

function startGame() {
  startScreen.style.display = 'none';
  gameUI.style.display = 'block';
  endScreen.style.display = 'none';

  game.reset();
  selectedSquare = null;
  legalMoves = [];
  score = 0;
  updateScore();
  renderBoard();

  startTimer();

  // If player chose black, robot moves first
  if (playerColor === 'b') {
    setTimeout(robotMove, 500);
  }
}

function resetGame() {
  clearInterval(timerInterval);
  timerEl.textContent = 'Time: 00:00';
  score = 0;
  updateScore();
  selectedSquare = null;
  legalMoves = [];
  game.reset();
  renderBoard();
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timerEl.textContent = `Time: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function getSquareColor(row, col) {
  return (row + col) % 2 === 0 ? 'white' : 'black';
}

function renderBoard() {
  board.innerHTML = '';
  const position = game.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      const squareId = 'abcdefgh'[col] + (8 - row);
      square.classList.add('square', getSquareColor(row, col));
      square.dataset.square = squareId;

      const piece = position[row][col];
      if (piece) {
        const img = document.createElement('img');
        img.src = PIECE_IMAGES[piece.color][piece.type];
        img.alt = `${piece.color}-${piece.type}`;
        img.classList.add('piece');
        square.appendChild(img);

        const label = PIECE_NAMES[piece.type];
        const colorName = piece.color === 'w' ? 'White' : 'Black';
        square.id = `${colorName}-${label}-${squareId}`;
      } else {
        square.id = `empty-${squareId}`;
      }

      if (legalMoves.includes(squareId)) {
        square.style.backgroundColor = '#4caf50';
      }

      if (squareId === selectedSquare) {
        square.classList.add('selected');
      }

      // Only allow player to click if it's their turn
      square.onclick = () => {
        if (game.turn() === playerColor) {
          handleClick(squareId);
        }
      };

      board.appendChild(square);
    }
  }
}

function handleClick(square) {
  if (game.game_over()) return;

  const moves = game.moves({ square, verbose: true });

  if (!selectedSquare && moves.length > 0) {
    selectedSquare = square;
    legalMoves = moves.map(m => m.to);
    renderBoard();
  } else if (selectedSquare) {
    // Try move from selectedSquare to clicked square
    const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
    if (move) {
      // Calculate score for captured piece
      if (move.captured) {
        score += PIECE_VALUES[move.captured];
        updateScore();
      }

      selectedSquare = null;
      legalMoves = [];
      renderBoard();

      if (game.game_over()) {
        endGame();
        return;
      }

      // Robot's turn after short delay
      setTimeout(robotMove, 500);
    } else {
      // Invalid move, deselect
      selectedSquare = null;
      legalMoves = [];
      renderBoard();
    }
  }
}

function robotMove() {
  if (game.game_over()) {
    endGame();
    return;
  }
  if (game.turn() !== (playerColor === 'w' ? 'b' : 'w')) return;

  const moves = game.moves();
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  const move = game.move(randomMove);

  // Robot capturing player's piece increases player's score (optional, you can skip)
  if (move.captured) {
    // Don't add score for robot captures (optional)
    // score -= PIECE_VALUES[move.captured]; // Uncomment to penalize
  }

  renderBoard();

  if (game.game_over()) {
    endGame();
  }
}

function endGame() {
  stopTimer();

  gameUI.style.display = 'none';
  endScreen.style.display = 'flex';

  let message = '';
  if (game.in_checkmate()) {
    if (game.turn() === playerColor) {
      // Player is checkmated (lost)
      message = 'You Lose!';
    } else {
      message = 'You Win!';
    }
  } else if (game.in_stalemate()) {
    message = 'Draw by Stalemate!';
  } else if (game.in_threefold_repetition()) {
    message = 'Draw by Threefold Repetition!';
  } else if (game.insufficient_material()) {
    message = 'Draw by Insufficient Material!';
  } else {
    message = 'Game Over!';
  }

  endMessage.textContent = message;
  finalScoreEl.textContent = `Score: ${score}`;

  // Show total time taken
  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  timeTakenEl.textContent = `Time: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Initial state
showStartScreen();
