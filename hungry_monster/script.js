const questionEl = document.getElementById('question');
const Monster = document.getElementById('Monster');
const itemsContainer = document.getElementById('items');
const modeButtons = document.querySelectorAll('.mode-btn');
const levelDisplay = document.getElementById('level');

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'gray'];

let currentMode = 'letter';
let currentLevel = 1;
let correctAnswer = null;

function startGame(mode) {
  currentMode = mode;
  currentLevel = 1;
  updateModeButtons();
  askQuestion();
}

function updateModeButtons() {
  modeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === currentMode);
  });
}

function askQuestion() {
  levelDisplay.textContent = `Level ${currentLevel} / 10`;

  let pool = [];
  if (currentMode === 'letter') {
    correctAnswer = getRandomItem(letters);
    pool = [...letters];
    questionEl.textContent = `Feed me the letter ${correctAnswer}!`;
  } else if (currentMode === 'number') {
    correctAnswer = getRandomItem(numbers);
    pool = [...numbers];
    questionEl.textContent = `Feed me the number ${correctAnswer}!`;
  } else {
    correctAnswer = getRandomItem(colors);
    pool = [...colors];
    questionEl.textContent = `Feed me the color ${capitalize(correctAnswer)}!`;
  }

  renderItems(pool);
}



function renderItems(pool) {
  itemsContainer.innerHTML = '';
  shuffleArray(pool);

  pool.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('draggable');
    div.textContent = currentMode === 'color' ? '' : item;
    div.dataset.value = item;

    if (currentMode === 'color') {
      div.classList.add(`color-${item}`);
    }

    // ---- DESKTOP ----
    div.setAttribute('draggable', true);
    div.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item);
    });

    // ---- MOBILE TOUCH SUPPORT ----
    let touchItem = null;

    div.addEventListener('touchstart', e => {
      e.preventDefault(); // stop scrolling
      touchItem = item;
      div.classList.add('dragging');
    });

    div.addEventListener('touchmove', e => {
      e.preventDefault(); // stop scrolling while moving
      const touch = e.touches[0];
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      if (elem && elem.id === 'Monster') {
        Monster.style.borderColor = 'orange'; // visual "hover"
      } else {
        Monster.style.borderColor = '#333';
      }
    });

    div.addEventListener('touchend', e => {
      e.preventDefault();
      div.classList.remove('dragging');
      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      if (dropTarget && dropTarget.id === 'Monster') {
        handleDrop(touchItem);
      }
      Monster.style.borderColor = '#333';
    });

    itemsContainer.appendChild(div);
  });
}

// ---- DESKTOP DROP ----
Monster.addEventListener('dragover', e => e.preventDefault());
Monster.addEventListener('drop', e => {
  e.preventDefault();
  const droppedValue = e.dataTransfer.getData('text/plain');
  handleDrop(droppedValue);
});

// ---- UNIFIED DROP LOGIC ----
function handleDrop(droppedValue) {
  if (droppedValue === correctAnswer) {
    Monster.style.borderColor = 'green';
    MonsterImg.src = 'images/monster.gif';
    if (navigator.vibrate) navigator.vibrate(150);

    setTimeout(() => {
      MonsterImg.src = 'images/monster.png';
      Monster.style.borderColor = '#333';

      if (currentLevel < 10) {
        currentLevel++;
        askQuestion();
      } else {
        questionEl.textContent = `You finished all 10 levels of ${capitalize(currentMode)}s! 🎉`;
        itemsContainer.innerHTML = `
          <button id="replayBtn" style="
            padding: 10px 20px;
            font-size: 18px;
            border-radius: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
          ">Replay</button>
        `;
        document.getElementById('replayBtn').addEventListener('click', () => {
          startGame(currentMode);
        });
      }
    }, 2000);
  } else {
    Monster.style.borderColor = 'red';
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setTimeout(() => {
      Monster.style.borderColor = '#333';
    }, 2000);
  }
}




function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Mode change handler
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.mode !== currentMode) {
      startGame(btn.dataset.mode);
    }
  });
});

// Start default
startGame('letter');


function scaleGame() {
  const game = document.getElementById('maincontainer');
  const wrapper = document.getElementById('wrapper');

  const scaleX = wrapper.clientWidth / 780;
  const scaleY = wrapper.clientHeight / 750;

  let scale;

  // Mobile portrait (taller than wide) → fit width exactly
  if (wrapper.clientHeight > wrapper.clientWidth) {
    scale = scaleX; // match width, no horizontal gap
  } else {
    // Landscape / desktop → fit to smaller dimension
    scale = Math.min(scaleX, scaleY, 1);
  }

  game.style.transform = `scale(${scale})`;
  game.style.transformOrigin = 'top left';

  // On portrait, stick to top-left
  if (wrapper.clientHeight > wrapper.clientWidth) {
    game.style.left = '0px';
  } else {
    // On desktop, center horizontally
    const left = (wrapper.clientWidth - 780 * scale) / 2;
    game.style.left = `${Math.max(0, left)}px`;
  }
  game.style.top = '0px';
}




// Initialize game
window.addEventListener('resize', scaleGame);
window.addEventListener('load', () => {
  scaleGame();
  // loadLevel(currentLevel);
});

