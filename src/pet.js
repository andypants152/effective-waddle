const pet = document.getElementById("pet");
const body = document.getElementById("body");
const speech = document.getElementById("speech");
const face = document.getElementById("face");
const leftEye = document.querySelector(".eye.left");
const rightEye = document.querySelector(".eye.right");
const mouth = document.querySelector(".mouth");
const contextMenu = document.getElementById("context-menu");
const contextQuit = document.getElementById("context-quit");
const contextPet = document.getElementById("context-pet");
const contextFeed = document.getElementById("context-feed");

// Dialogue based on mood and context
const lines = {
  happy: [
    "what are we coding today?",
    "feed me commits.",
    "this desktop is mine now.",
    "tiny app, big opinions.",
    "let's ship it! 🚀",
    "bugs? never heard of them.",
    "production is my test env.",
  ],
  sleepy: [
    "zzz...",
    "five more minutes...",
    "so comfy...",
    "dreams of infinite loops...",
    "*snores*",
  ],
  annoyed: [
    "you're in my way.",
    "i saw that bug.",
    "seriously?",
    "get back to work!",
    "stop touching me!",
    "leave me alone.",
  ],
  lonely: [
    "hello? anyone there?",
    "am i forgotten?",
    "notice me...",
    "anybody home?",
    "so quiet...",
    "talk to me! 👀",
  ],
  excited: [
    "something's happening!",
    "exciting times ahead!",
    "yes! finally!",
    "let's gooo!",
    "this is the moment!",
  ]
};

let dragging = false;
let lastX = 0;
let lastY = 0;
let speechTimer = null;
let blinkTimer = null;
let wanderTimer = null;
let moodTimer = null;
let autoSpeechTimer = null;
let mood = "happy"; // sleepy / annoyed / happy / lonely / excited
let sleeping = false;
let lastInteractionTime = Date.now();
let timesClickedRecently = 0;
let energyLevel = 100;
let petIsSeekingAttention = false;

function sayRandomLine() {
  const currentMood = sleeping ? "sleepy" : mood;
  const availableLines = lines[currentMood] || lines.happy;
  const line = availableLines[Math.floor(Math.random() * availableLines.length)];
  speech.textContent = line;
  speech.classList.add("visible");

  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    speech.classList.remove("visible");
  }, 2200);
}

function react(interactionType) {
  if (interactionType === "click") {
    timesClickedRecently++;
    if (timesClickedRecently > 4) {
      setMood("annoyed");
    } else if (timesClickedRecently === 1) {
      setMood("excited");
    }
  }
  lastInteractionTime = Date.now();
  energyLevel = Math.min(100, energyLevel + 15);
  petIsSeekingAttention = false;
}

function setMood(next) {
  if (sleeping) return; // don't change mood while sleeping
  mood = next;
  document.documentElement.classList.remove("mood-sleepy", "mood-annoyed", "mood-happy", "mood-lonely", "mood-excited");
  document.documentElement.classList.add(`mood-${mood}`);
  
  // auto-reset from excited mood
  if (next === "excited") {
    setTimeout(() => {
      if (mood === "excited") setMood("happy");
    }, 8000);
  }
}

function blinkOnce() {
  leftEye.classList.add("blink");
  rightEye.classList.add("blink");
  setTimeout(() => {
    leftEye.classList.remove("blink");
    rightEye.classList.remove("blink");
  }, 160);
}

function eyeRoll() {
  // special animation - eyes look around
  body.style.animation = "eye-roll 0.6s ease-in-out";
  setTimeout(() => {
    body.style.animation = "";
  }, 600);
}

function bounce() {
  body.style.animation = "bounce 0.5s ease-in-out";
  setTimeout(() => {
    body.style.animation = "";
  }, 500);
}

function spin() {
  body.style.animation = "spin 0.8s ease-in-out";
  setTimeout(() => {
    body.style.animation = "";
  }, 800);
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
  react("click");
  const clickResponse = Math.random();
  
  if (clickResponse < 0.4) {
    sayRandomLine();
  } else if (clickResponse < 0.6) {
    bounce();
  } else if (clickResponse < 0.8) {
    eyeRoll();
    sayRandomLine();
  } else {
    spin();
  }
});

pet.addEventListener("dblclick", (ev) => {
  toggleSleep();
  bounce();
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

contextPet.addEventListener("click", () => {
  react("pet");
  bounce();
  setMood("happy");
  setTimeout(() => {
    speech.textContent = "nice!";
    speech.classList.add("visible");
    setTimeout(() => {
      speech.classList.remove("visible");
    }, 1500);
  }, 300);
  contextMenu.classList.add("hidden");
});

contextFeed.addEventListener("click", () => {
  react("feed");
  bounce();
  energyLevel = 100;
  setMood("happy");
  setTimeout(() => {
    speech.textContent = "nom nom! 😋";
    speech.classList.add("visible");
    setTimeout(() => {
      speech.classList.remove("visible");
    }, 1500);
  }, 300);
  contextMenu.classList.add("hidden");
});

// hide menu on outside click
document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target)) contextMenu.classList.add("hidden");
});

// wandering behavior: small nudge left/right occasionally
wanderTimer = setInterval(() => {
  if (dragging || sleeping) return;
  
  const timeSinceInteraction = (Date.now() - lastInteractionTime) / 1000;
  
  // if ignored for too long, seek attention
  if (timeSinceInteraction > 20 && !petIsSeekingAttention && Math.random() < 0.6) {
    petIsSeekingAttention = true;
    setMood("lonely");
    bounce();
    sayRandomLine();
    timesClickedRecently = 0;
    return;
  }
  
  if (Math.random() < 0.3) {
    const dx = Math.random() < 0.5 ? -6 : 6;
    window.petAPI.moveWindow(dx, 0);
    setTimeout(() => {
      window.petAPI.moveWindow(-dx, 0);
    }, 700 + Math.random() * 800);
  }
}, 4000);

// random mood changes every so often
moodTimer = setInterval(() => {
  if (sleeping) return;
  
  const timeSinceInteraction = (Date.now() - lastInteractionTime) / 1000;
  
  // weight moods based on interaction
  let weights = { happy: 0.5, sleepy: 0.25, annoyed: 0.15, lonely: 0.1 };
  
  if (timeSinceInteraction > 15) {
    weights.lonely = 0.6;
    weights.happy = 0.2;
  }
  
  const r = Math.random();
  let cumulative = 0;
  for (const [moodName, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (r < cumulative) {
      setMood(moodName);
      break;
    }
  }
}, 15000 + Math.random() * 12000);

startAutoBlink();

// varied speech and activity based on state
autoSpeechTimer = setInterval(() => {
  if (sleeping) return;
  
  const timeSinceInteraction = (Date.now() - lastInteractionTime) / 1000;
  
  // more likely to speak if lonely/ignored
  const speakChance = timeSinceInteraction > 20 ? 0.7 : 0.35;
  
  if (Math.random() < speakChance) {
    sayRandomLine();
  }
  
  // occasionally do animations
  if (Math.random() < 0.2) {
    const animType = Math.random();
    if (animType < 0.5) eyeRoll();
    else if (animType < 0.8) bounce();
  }
}, 12000);

// reset interaction counter periodically
setInterval(() => {
  timesClickedRecently = Math.max(0, timesClickedRecently - 1);
}, 8000);

// energy drain over time
setInterval(() => {
  if (!sleeping) {
    energyLevel = Math.max(0, energyLevel - 5);
    if (energyLevel < 30) {
      setMood("sleepy");
    }
  }
}, 5000);