document.addEventListener("DOMContentLoaded", function () {
  const ball = document.getElementById('ball');
  const hole = document.getElementById('hole');
  const game = document.getElementById('game');
  const message = document.getElementById('message');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const endScreen = document.getElementById('endScreen');
  const finalScore = document.getElementById('finalScore');

  if (!game || !ball || !hole || !message || !scoreDisplay || !timerDisplay || !endScreen || !finalScore) {
    console.error('One or more game elements are missing');
    return;
  }

  let velocity = { x: 0, y: 0 };
  let score = 0;
  let isDragging = false;
  let startX, startY;
  let timeLeft = 120; // seconds

  const playBtn = document.getElementById("playBtn");
  const startScreen = document.getElementById("startScreen");
  const replayBtn = document.getElementById("replay");



  let timerInterval; // define globally so you can clear it if needed


  // Initial random positions
  resetPositions();


  playBtn.addEventListener("click", () => {
    startScreen.style.display = "none";

    score = 0;
    timeLeft = 120;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    game.style.display = 'block';
    endScreen.classList.add('hidden');

    // Start game loop
    update();

    // Start the timer loop
    timerInterval = setInterval(updateTimer, 1000);
  });


  replayBtn.addEventListener("click", () => {
    // Reset values
    score = 0;
    timeLeft = 120;
    velocity = { x: 0, y: 0 };

    // Update UI
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    finalScore.textContent = ''; // optional: clear final score
    endScreen.style.display = 'none';
    game.style.display = 'block';

    resetPositions(); // reposition ball and hole

    // Restart game loop and timer
    update(); // animation loop
    clearInterval(timerInterval); // clear previous interval if any
    timerInterval = setInterval(updateTimer, 1000);
  });



  ball.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    ball.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = startX - e.clientX;
    const dy = startY - e.clientY;
    velocity.x = dx / 10;
    velocity.y = dy / 10;
    ball.style.cursor = 'grab';
  });

  function checkHoleCollision() {
    const ballRect = ball.getBoundingClientRect();
    const holeRect = hole.getBoundingClientRect();
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;
    const holeCenterX = holeRect.left + holeRect.width / 2;
    const holeCenterY = holeRect.top + holeRect.height / 2;
    const dist = Math.hypot(ballCenterX - holeCenterX, ballCenterY - holeCenterY);

    if (dist < 15) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      message.style.display = 'block';
      setTimeout(() => message.style.display = 'none', 1000);
      velocity = { x: 0, y: 0 };
      resetPositions();
    }
  }

  function resetPositions() {
    const gameWidth = game.clientWidth;
    const gameHeight = game.clientHeight;

    const randPos = (size, margin = 50) => Math.floor(Math.random() * (size - 2 * margin)) + margin;

    let ballX = randPos(gameWidth);
    let ballY = randPos(gameHeight);
    let holeX = randPos(gameWidth);
    let holeY = randPos(gameHeight);

    // Ensure the ball and hole have a minimum distance between them (100px - 80px)
    const minDistance = 80; // Minimum distance between ball and hole
    let distance = Math.hypot(ballX - holeX, ballY - holeY);
    while (distance < minDistance) {
      holeX = randPos(gameWidth);
      holeY = randPos(gameHeight);
      distance = Math.hypot(ballX - holeX, ballY - holeY); // Recalculate distance
    }

    // Set the ball and hole positions
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    hole.style.left = holeX + 'px';
    hole.style.top = holeY + 'px';
  }

  function update() {
    if (timeLeft <= 0) return;

    let x = ball.offsetLeft;
    let y = ball.offsetTop;

    x += velocity.x;
    y += velocity.y;

    velocity.x *= 0.98;
    velocity.y *= 0.98;

    if (Math.abs(velocity.x) < 0.1) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.1) velocity.y = 0;

    const maxX = game.clientWidth - ball.clientWidth;
    const maxY = game.clientHeight - ball.clientHeight;

    x = Math.max(0, Math.min(maxX, x));
    y = Math.max(0, Math.min(maxY, y));

    ball.style.left = x + 'px';
    ball.style.top = y + 'px';

    checkHoleCollision();
    requestAnimationFrame(update);
  }

  function updateTimer() {
    if (timeLeft <= 0) {
      clearInterval(timerInterval); // stop timer
      finalScore.textContent = score;
      endScreen.style.display = 'block'; // Show end screen
      game.style.display = 'none'; // Hide the game
      return;
    }
    

    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
  }

  





let resizeTimeout;

function resizeHandler() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const stageWidth = 780;
    const stageHeight = 750;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const xRatio = viewportWidth / stageWidth;
    const yRatio = viewportHeight / stageHeight;
    const scale = Math.min(xRatio, yRatio);

    const newLeft = (viewportWidth - scale * stageWidth) / 2;

    const scaleStyle = `
      transform: scale(${scale});
      transform-origin: left top;
      position: fixed;
      top: 0;
      left: ${newLeft}px;
    `;

    document.getElementById("ground").setAttribute("style", scaleStyle);

    // Optional: Adjust ball and hole if needed
    adjustBallAndHolePosition(scale);
  }, 100);
}

window.addEventListener("resize", resizeHandler);
window.addEventListener("orientationchange", resizeHandler); // for mobile orientation changes
window.addEventListener("load", resizeHandler);


  function adjustBallAndHolePosition(scale) {
    const ballRect = ball.getBoundingClientRect();
    const holeRect = hole.getBoundingClientRect();

    const ballX = ballRect.left + ballRect.width / 2;
    const ballY = ballRect.top + ballRect.height / 2;
    const holeX = holeRect.left + holeRect.width / 2;
    const holeY = holeRect.top + holeRect.height / 2;

    const distance = Math.hypot(ballX - holeX, ballY - holeY);
    const minDistance = 80; // Minimum distance between ball and hole

    // If they are too close, adjust the hole position
    if (distance < minDistance) {
      let newHoleX, newHoleY;
      do {
        newHoleX = Math.floor(Math.random() * (game.clientWidth - 40)) + 20;
        newHoleY = Math.floor(Math.random() * (game.clientHeight - 40)) + 20;
      } while (Math.hypot(ballX - newHoleX, ballY - newHoleY) < minDistance);

      hole.style.left = newHoleX + 'px';
      hole.style.top = newHoleY + 'px';
    }

    // Ensure ball and hole are not near corners
    const margin = 100; // Avoiding corners
    if (ballX < margin) ball.style.left = margin + 'px';
    if (ballX > game.clientWidth - margin) ball.style.left = (game.clientWidth - margin) + 'px';
    if (ballY < margin) ball.style.top = margin + 'px';
    if (ballY > game.clientHeight - margin) ball.style.top = (game.clientHeight - margin) + 'px';

    if (holeX < margin) hole.style.left = margin + 'px';
    if (holeX > game.clientWidth - margin) hole.style.left = (game.clientWidth - margin) + 'px';
    if (holeY < margin) hole.style.top = margin + 'px';
    if (holeY > game.clientHeight - margin) hole.style.top = (game.clientHeight - margin) + 'px';
  }



  // Call resizeHandler for scaling
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("load", resizeHandler);
});
