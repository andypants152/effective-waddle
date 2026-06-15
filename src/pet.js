const pet = document.getElementById("pet");
const body = document.getElementById("body");
const speech = document.getElementById("speech");

const lines = [
  "what are we coding today?",
  "i saw that bug.",
  "feed me commits.",
  "electronically alive, unfortunately.",
  "this desktop is mine now.",
  "tiny app, big opinions."
];

let dragging = false;
let lastX = 0;
let lastY = 0;
let speechTimer = null;

function sayRandomLine() {
  const line = lines[Math.floor(Math.random() * lines.length)];
  speech.textContent = line;
  speech.classList.add("visible");

  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    speech.classList.remove("visible");
  }, 2200);
}

pet.addEventListener("pointerdown", (event) => {
  dragging = true;
  lastX = event.screenX;
  lastY = event.screenY;
  pet.setPointerCapture(event.pointerId);
});

pet.addEventListener("pointermove", (event) => {
  if (!dragging) return;

  const dx = event.screenX - lastX;
  const dy = event.screenY - lastY;

  lastX = event.screenX;
  lastY = event.screenY;

  window.petAPI.moveWindow(dx, dy);
});

pet.addEventListener("pointerup", (event) => {
  dragging = false;
  pet.releasePointerCapture(event.pointerId);
});

body.addEventListener("click", () => {
  sayRandomLine();
});

body.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  window.petAPI.quit();
});

setInterval(() => {
  if (Math.random() < 0.35) {
    sayRandomLine();
  }
}, 12000);