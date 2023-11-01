function forwardsPlay() {
  var audio = document.getElementById("audio");
  audio.addEventListener("ended", function() {
    window.location.href = "/P3-cameras-on/";
  });

  audio.play();
}
function backwardsPlay() {
  var audio = document.getElementById("audio");
  audio.addEventListener("ended", function() {
    window.location.href = "/P1-outside/";
  });

  audio.play();
}