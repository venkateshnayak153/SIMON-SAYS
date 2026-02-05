// ================= USER DATA =================
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let users = JSON.parse(localStorage.getItem("users")) || [];

// Safety check
if (!currentUser) {
  window.location.href = "home.html";
}

// Show player name (top-right)
document.getElementById("player-name").innerText = currentUser.name;

// ================= GAME DATA =================
var colors = ["green", "red", "yellow", "blue", "purple", "orange", "pink", "cyan", "lime"];
var gamePattern = [];
var userPattern = [];
var level = 0;
var started = false;

var levelText = document.getElementById("level-title");
var highScoreText = document.getElementById("high-score");
var wrongSound = new Audio("sounds/wrong.mp3");

// Load user high score
let highScore = currentUser.easyScore || 0;
highScoreText.textContent = "High Score: " + highScore;

// ================= START GAME =================
document.addEventListener("keydown", function () {
  if (!started) {
    started = true;
    level = 0;
    gamePattern = [];
    nextStep();
  }
});

// ================= BUTTON CLICKS =================
colors.forEach(color => {
  document.getElementById(color).addEventListener("click", function () {
    handleClick(color);
  });
});

function handleClick(color) {
  if (!started) return;

  userPattern.push(color);
  playSound(color);
  clickEffect(color);
  checkAnswer(userPattern.length - 1);
}

// ================= GAME LOGIC =================
function nextStep() {
  userPattern = [];
  level++;
  levelText.textContent = "Level " + level;

  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  gamePattern.push(randomColor);

  setTimeout(() => {
    flashEffect(randomColor);
  }, 500);
}

function checkAnswer(index) {
  if (gamePattern[index] === userPattern[index]) {

    if (userPattern.length === gamePattern.length) {
      setTimeout(nextStep, 600);
    }

  } else {
    wrongSound.play();
    saveHighScore();

    levelText.textContent = "Game Over! Press Any Key to Restart";
    document.body.classList.add("game-over");

    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 300);

    started = false;
  }
}

// ================= SAVE HIGH SCORE =================
function saveHighScore() {
  let finalScore = level - 1;

  if (finalScore > highScore) {
    highScore = finalScore;
    currentUser.easyScore = highScore;

    // Update users list
    users = users.map(u =>
      u.name === currentUser.name ? currentUser : u
    );

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    highScoreText.textContent = "High Score: " + highScore;

    // Redirect to High Score page
    setTimeout(() => {
      window.location.href = "highScore.html";
    }, 1000);
  }
}

// ================= EFFECTS =================
function flashEffect(color) {
  let btn = document.getElementById(color);
  playSound(color);
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 200);
}

function clickEffect(color) {
  let btn = document.getElementById(color);
  btn.style.transform = "scale(0.9)";
  setTimeout(() => btn.style.transform = "scale(1)", 150);
}

function playSound(color) {
  new Audio("sounds/" + color + ".mp3").play();
}
