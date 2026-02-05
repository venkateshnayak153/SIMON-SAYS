// ================= USER DATA =================
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let users = JSON.parse(localStorage.getItem("users")) || [];

// If user not logged in, send back
if (!currentUser) {
  window.location.href = "home.html";
}

// Show player name (top right)
document.getElementById("player-name").innerText = currentUser.name;

// Load high score for this user
let highScore = currentUser.easyScore || 0;
document.getElementById("high-score").innerText = "High Score: " + highScore;

// ================= GAME VARIABLES =================
let buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;

// ================= START GAME =================
document.addEventListener("keydown", function () {
  if (!started) {
    document.getElementById("level-title").innerText = "Level " + level;
    nextSequence();
    started = true;
  }
});

// ================= BUTTON CLICKS =================
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function () {
    let userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
  });
});

// ================= CHECK ANSWER =================
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }

  } else {

    playSound("wrong");
    document.body.classList.add("game-over");
    document.getElementById("level-title").innerText =
      "Game Over! Press Any Key to Restart";

    setTimeout(function () {
      document.body.classList.remove("game-over");
    }, 200);

    saveHighScore();
    startOver();
  }
}

// ================= NEXT SEQUENCE =================
function nextSequence() {
  userClickedPattern = [];
  level++;
  document.getElementById("level-title").innerText = "Level " + level;

  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  document.getElementById(randomChosenColour)
    .classList.add("pressed");

  setTimeout(() => {
    document.getElementById(randomChosenColour)
      .classList.remove("pressed");
  }, 200);

  playSound(randomChosenColour);
}

// ================= SAVE HIGH SCORE =================
function saveHighScore() {
  if (level - 1 > highScore) {
    highScore = level - 1;
    currentUser.easyScore = highScore;

    users = users.map(user =>
      user.name === currentUser.name ? currentUser : user
    );

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    document.getElementById("high-score").innerText =
      "High Score: " + highScore;

    // 👉 Redirect to leaderboard / high score page
    setTimeout(() => {
      window.location.href = "highScore.html";
    }, 1000);
  }
}

// ================= START OVER =================
function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

// ================= SOUND =================
function playSound(name) {
  let audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// ================= ANIMATION =================
function animatePress(currentColour) {
  let activeButton = document.getElementById(currentColour);
  activeButton.classList.add("pressed");

  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}
