var colors = ["green", "red", "yellow", "blue"];
var gamePattern = [];
var userPattern = [];
var level = 0;
var started = false;

var levelText = document.getElementById("level-title");
var wrongSound = new Audio("sounds/wrong.mp3");
var highScore = localStorage.getItem("highScore") || 0;

document.getElementById("high-score").textContent =
  "High Score: " + highScore;

document.addEventListener("keydown", function () {
  if (!started) {
    started = true;
    level = 0;
    gamePattern = [];
    nextStep();
  }
});

colors.forEach(function (color) {
  document.getElementById(color).addEventListener("click", handleClick);
});

function handleClick() {
  if (!started) return;

  var color = this.id;
  userPattern.push(color);

  new Audio("sounds/" + color + ".mp3").play();

  clickEffect(color);
  checkAnswer(userPattern.length - 1);
}

function nextStep() {
  userPattern = [];
  level++;
  levelText.textContent = "Level " + level;

  var randomColor = colors[Math.floor(Math.random() * colors.length)];
  gamePattern.push(randomColor);

  setTimeout(() => {
    showSequence();
  }, 500);
}

function showSequence() {
  var lastColor = gamePattern[gamePattern.length - 1];
  flashEffect(lastColor);
}

function flashEffect(color) {
  var btn = document.getElementById(color);

  new Audio("sounds/" + color + ".mp3").play();

  btn.classList.add("pressed");
  setTimeout(function () {
    btn.classList.remove("pressed");
  }, 200);
}

function clickEffect(color) {
  var btn = document.getElementById(color);
  btn.style.transform = "scale(0.9)";
  setTimeout(function () {
    btn.style.transform = "scale(1)";
  }, 150);
}

function checkAnswer(index) {
  if (gamePattern[index] === userPattern[index]) {
    if (userPattern.length === gamePattern.length) {
      setTimeout(nextStep, 600);
    }
  } else {
    wrongSound.play();
     if (level > highScore) {
    highScore = level;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high-score").textContent =
    "High Score: " + highScore;
    setTimeout(() => {
                window.location.href = "highScore.html";
            }, 1000);

  }
    levelText.textContent = "Game Over! Press Any Key to Restart";

    document.body.classList.add("game-over");
    setTimeout(function () {
      document.body.classList.remove("game-over");
    }, 200);

    started = false;
  }
}
localStorage.clear();