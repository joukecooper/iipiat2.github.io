document.addEventListener("DOMContentLoaded", function () {
  let isRunning = localStorage.getItem("isRunning");
  let timer = parseInt(localStorage.getItem("timer"));
  const display = document.getElementById("timer");

  if (isRunning) {
    // Start the timer immediately if isRunning is true
    startTimer();
  }

  function startTimer() {
    isRunning = true;
    localStorage.setItem("isRunning", "true");

    // Start the timer with setInterval
    const timerInterval = setInterval(function () {
      timer--;

      if (timer <= 0) {
        clearInterval(timerInterval); // Stop the timer when it reaches 0
        localStorage.setItem("isRunning", "false");
        alert("Countdown finished");
      } else {
        localStorage.setItem("timer", timer);
        updateTimer(timer);
      }
    }, 1000);

    // Call updateTimer immediately to update the timer display
    updateTimer(timer);
  }

  function updateTimer(timer) {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (display) {
      display.textContent = minutes + ":" + seconds;
    }
  }
});