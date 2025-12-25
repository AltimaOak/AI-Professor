// avatar.js
// Handles loading avatar assets (SVG data-uris), gesture playback, persona mapping.

const AVATAR_CANVAS_ID = "professorAvatar";
const PIXI_RESIZE_TARGET = document.getElementById(AVATAR_CANVAS_ID);

const app = new PIXI.Application({
  view: PIXI_RESIZE_TARGET,
  transparent: true,
  resizeTo: PIXI_RESIZE_TARGET,
  antialias: true
});

let avatarSprites = {};     // { idle: Sprite, point: Sprite, nod: Sprite, ... }
let currentAvatar = "funny"; // default
let currentPersonality = "cool";
let idleTicker = null;

// --- simple SVG data URIs for demo avatars ---
// These are intentionally minimal vector graphics. Replace with sprite sheets or frame sequences later.
const SVGS = {
  funny: {
    idle: svgCircle("#90caf9", ":)"),
    point: svgCircle("#ffd54f", "👉"),
    nod: svgCircle("#a5d6a7", "🙂"),
    confused: svgCircle("#ef9a9a", "??"),
    write: svgCircle("#b39ddb", "✍️")
  },
  serious: {
    idle: svgCircle("#90a4ae", ":-|"),
    point: svgCircle("#78909c", "👉"),
    nod: svgCircle("#78909c", "👌"),
    confused: svgCircle("#b0bec5", "…"),
    write: svgCircle("#8c9eff", "✍️")
  },
  mentor: {
    idle: svgCircle("#c5e1a5", "🙂"),
    point: svgCircle("#ffe082", "👉"),
    nod: svgCircle("#81d4fa", "👍"),
    confused: svgCircle("#ce93d8", "hmm"),
    write: svgCircle("#ffcc80", "✍️")
  }
};

// helper function to generate an SVG data URI (circle with text)
function svgCircle(bg, label){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='440' viewBox='0 0 400 440'>
    <rect width='100%' height='100%' rx='18' fill='transparent'/>
    <circle cx='200' cy='180' r='120' fill='${bg}' opacity='0.18' stroke='${bg}' stroke-width='6'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='60' fill='${bg}' font-family='Arial' dy='20'>${label}</text>
    </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// create textured sprites from the SVG data URIs
async function loadAvatar(type){
  currentAvatar = type;
  const set = SVGS[type];
  const keys = Object.keys(set);
  // Clear existing
  avatarSprites = {};
  app.stage.removeChildren();

  // Load textures
  const promises = keys.map(k => PIXI.Texture.fromURL(set[k]).then(tex => ({k, tex})));
  const results = await Promise.all(promises);
  results.forEach(r => {
    const sprite = new PIXI.Sprite(r.tex);
    // scale to fit canvas
    sprite.anchor.set(0.5);
    sprite.x = app.renderer.width / 2;
    sprite.y = app.renderer.height / 2 - 10;
    const scale = Math.min(app.renderer.width / 380, app.renderer.height / 420);
    sprite.scale.set(scale, scale);
    avatarSprites[r.k] = sprite;
  });

  // start with idle
  app.stage.addChild(avatarSprites.idle);
  startIdleAnimation();
}

// simple idle subtle animation
function startIdleAnimation(){
  if(idleTicker) idleTicker.destroy();
  idleTicker = new PIXI.Ticker();
  let t = 0;
  idleTicker.add(() => {
    t += 0.04;
    const s = 1 + Math.sin(t) * 0.008;
    if(avatarSprites.idle) avatarSprites.idle.scale.set(s);
  });
  idleTicker.start();
}

function stopIdleAnimation(){
  if(idleTicker) {
    idleTicker.stop();
    idleTicker.destroy();
    idleTicker = null;
  }
}

// play a gesture (one of: point, nod, confused, write) and auto-return to idle
function playGesture(gesture, duration = 1500){
  if(!avatarSprites[gesture]) {
    // fallback to idle
    return;
  }
  stopIdleAnimation();
  app.stage.removeChildren();
  app.stage.addChild(avatarSprites[gesture]);

  setTimeout(() => {
    app.stage.removeChildren();
    app.stage.addChild(avatarSprites.idle);
    startIdleAnimation();
  }, duration);
}

// map personality -> allowed gestures / style (frontend hint)
const personalities = {
  strict: { tone: "formal", humor: 0, gestures: ["point","write"] },
  cool:   { tone: "friendly", humor: 1, gestures: ["nod","point"] },
  gloomy: { tone: "monotone", humor: -1, gestures: ["confused","idle"] }
};

// external calls
window.AvatarAPI = {
  loadAvatar,
  playGesture,
  setPersonality: (p) => { currentPersonality = p; console.log("personality set", p); },
  getPersona: () => personalities[currentPersonality]
};

// initialize with default
loadAvatar(currentAvatar).catch(console.error);
