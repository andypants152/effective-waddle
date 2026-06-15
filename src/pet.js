const pet = document.getElementById("pet");
const body = document.getElementById("body");
const speech = document.getElementById("speech");
const face = document.getElementById("face");
const leftEye = document.querySelector(".eye.left");
const rightEye = document.querySelector(".eye.right");
const contextMenu = document.getElementById("context-menu");
const contextQuit = document.getElementById("context-quit");

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
let blinkTimer = null;
let mood = "happy"; // sleepy / annoyed / happy
let sleeping = false;

function sayRandomLine() {
  const line = lines[Math.floor(Math.random() * lines.length)];
  speech.textContent = line;
  speech.classList.add("visible");

  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    speech.classList.remove("visible");
  }, 2200);
}

function setMood(next) {
  mood = next;
  document.documentElement.classList.remove("mood-sleepy", "mood-annoyed", "mood-happy");
  document.documentElement.classList.add(`mood-${mood}`);
}

function blinkOnce() {
  leftEye.classList.add("blink");
  rightEye.classList.add("blink");
  setTimeout(() => {
    leftEye.classList.remove("blink");
    rightEye.classList.remove("blink");
  }, 160);
}

function startAutoBlink() {
  if (blinkTimer) clearInterval(blinkTimer);
  blinkTimer = setInterval(() => {
    if (sleeping) return; // eyes already closed
    if (Math.random() < 0.6) blinkOnce();
  }, 3000 + Math.random() * 3000);
}

function toggleSleep() {
  sleeping = !sleeping;
  if (sleeping) {
    document.documentElement.classList.add("sleeping");
    setMood("sleepy");
  } else {
    document.documentElement.classList.remove("sleeping");
    setMood("happy");
  }
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

body.addEventListener("click", (ev) => {
  sayRandomLine();
});

pet.addEventListener("dblclick", (ev) => {
  toggleSleep();
});

body.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  // show custom menu
  const x = event.clientX;
  const y = event.clientY;
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.classList.remove("hidden");
});

contextQuit.addEventListener("click", () => {
  window.petAPI.quit();
});

// hide menu on outside click
document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target)) contextMenu.classList.add("hidden");
});

// wandering behavior: small nudge left/right occasionally
setInterval(() => {
  if (dragging || sleeping) return;
  if (Math.random() < 0.25) {
    const dx = Math.random() < 0.5 ? -6 : 6;
    window.petAPI.moveWindow(dx, 0);
    // small pause then return
    setTimeout(() => {
      window.petAPI.moveWindow(-dx, 0);
    }, 700 + Math.random() * 800);
  }
}, 4000);

// random mood changes every so often
setInterval(() => {
  const r = Math.random();
  if (r < 0.12) setMood("annoyed");
  else if (r < 0.36) setMood("happy");
  else setMood("sleepy");
}, 15000 + Math.random() * 12000);

startAutoBlink();

setInterval(() => {
  if (Math.random() < 0.35) {
    sayRandomLine();
  }
}, 12000);