const totalTime = 15 * 60;
localStorage.setItem("isRunning", "false");
localStorage.setItem("timer", totalTime);
let isRunning = localStorage.getItem("isRunning");
let timer = parseInt(localStorage.getItem("timer"));
const display = document.getElementById("timer");

window.onload = function () {
  const startButton = document.getElementById("resetTimerButton");
  startButton.addEventListener("click", startTimer);
};

function startTimer() {
  isRunning = true;
  localStorage.setItem("isRunning", "true");

  // Move the timer starting code here
  if (isRunning) {
    setInterval(function () {
      timer--;
      localStorage.setItem("timer", timer);
      updateTimer(timer, display);
      if (timer <= 0) {
        clearInterval(); // Stop the timer when it reaches 0
        alert("Countdown finished");
      }
    }, 1000);
  }
}

function updateTimer(timer, display) {
  let minutes = parseInt(timer / 60, 10);
  let seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  display.textContent = minutes + ":" + seconds;
}

function resetTimer() {
  localStorage.setItem("isRunning", "false");
  localStorage.setItem("timer", totalTime);
  updateTimer(timer, display);
}
