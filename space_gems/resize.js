// --- Preload Images ---
function preloadImages(imageNames, callback) {
  let loaded = 0;
  const total = imageNames.length;

  function imageLoaded() {
    loaded++;
    if (loaded === total && typeof callback === "function") {
      callback();
    }
  }

  imageNames.forEach(name => {
    const img = new Image();
    img.src = `assets/${name}.png`; // change path if images are elsewhere
    img.onload = imageLoaded;
    img.onerror = imageLoaded; // proceed even if image fails
  });
}

// --- List of images to preload ---
const imageList = [
  "asteroid",
  "bg2",
  "bg3",
  "bg4",
  "diamond",
  "download",
  "logo",
  "rocket"
];

// --- Start the game only after all images are preloaded ---
preloadImages(imageList, () => {
  console.log("All images preloaded.");

  // Show start screen or call game init
  document.querySelector(".start").style.display = "block";
});




function resizeGame() {
  const GAME_WIDTH = 780;
  const GAME_HEIGHT = 750;

  // Calculate aspect ratios
  const windowRatio = window.innerWidth / window.innerHeight;
  const gameRatio = GAME_WIDTH / GAME_HEIGHT;

  let scale;
  if (windowRatio > gameRatio) {
    // Screen is wider than the game
    scale = window.innerHeight / GAME_HEIGHT;
  } else {
    // Screen is taller than the game
    scale = window.innerWidth / GAME_WIDTH;
  }

  const container = document.getElementById("game-container");
  container.style.transform = `scale(${scale})`;

  // Center it
  container.style.position = "absolute";
  container.style.left = `${(window.innerWidth - GAME_WIDTH * scale) / 2}px`;
container.style.top = `${(window.innerHeight - GAME_HEIGHT * scale) / 2}px`;

}

// Call on load and on resize
window.addEventListener("resize", resizeGame);
window.addEventListener("load", resizeGame);