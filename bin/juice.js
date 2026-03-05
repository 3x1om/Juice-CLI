#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const ANIMATIONS = {
  dancing: [
    String.raw`
      \  /       
       \/        
      __         
    _/  \_       
   /_/\__\       
   | JUICE|      
   | (o o)|      
   |  \_/ |      
   |MANGO!|      
   |______|      
     /  \        
    /_/\_\       
`,
    String.raw`
    \      /     
     \____/      
      __         
    _/  \_       
   /_/\__\       
   | JUICE|      
   | (o o)|      
   |  \_/ |      
   |MANGO!|      
   |______|      
      /\         
     /  \        
`,
    String.raw`
      /  \       
     /____\      
      __         
    _/  \_       
   /_/\__\       
   | JUICE|      
   | (o o)|      
   |  \_/ |      
   |MANGO!|      
   |______|      
       /\        
      /  \       
`,
    String.raw`
    /      \     
    \______/     
      __         
    _/  \_       
   /_/\__\       
   | JUICE|      
   | (o o)|      
   |  \_/ |      
   |MANGO!|      
   |______|      
      / \        
     /   \       
`
  ],
  pouring: [
    String.raw`
       \  o       
        \|        
      __          
    _/  \_        
   /_/\__\___     
   | JUICE|  \    
   | (^_^)   |__  
   | ORANGE! |  \ 
   |______|   | ) 
     /  \     |/  
    /_/\_\   ~~   
`,
    String.raw`
        o\        
       /| \       
      __          
    _/  \_        
   /_/\__\___     
   | JUICE|  \    
   | (^_^)   |__  
   | ORANGE! |  \ 
   |______|   | ) 
      /\      |/  
     /  \    ~~   
`,
    String.raw`
     o  /         
      \|          
      __          
    _/  \_        
   /_/\__\___     
   | JUICE|  \    
   | (^_^)   |__  
   | ORANGE! |  \ 
   |______|   | ) 
     /  \     |/  
    /____\   ~~   
`,
    String.raw`
       \ o        
        |\        
      __          
    _/  \_        
   /_/\__\___     
   | JUICE|  \    
   | (^_^)   |__  
   | ORANGE! |  \ 
   |______|   | ) 
      /\      |/  
     /  \    ~~   
`
  ],
  punching: [
    String.raw`
      \    __    
       \  /  \   
      __         
    _/  \_       
   /_/\__\       
   | JUICE|      
   | (>_<)|      
   | BERRY|==>   
   | BLAST|      
   |______|      
     /  \        
    /_/\_\       
`,
    String.raw`
    \      ==>  
     \____/     
      __        
    _/  \_      
   /_/\__\      
   | JUICE|==>  
<==| (>_<)|     
   | BERRY|     
   | BLAST|     
   |______|     
      /\        
     /  \       
`,
    String.raw`
  <==       \    
   \___    /     
      __         
    _/  \_       
   /_/\__\       
<==| JUICE|      
   | (>_<)|==>   
   | BERRY|      
   | BLAST|      
   |______|      
      /\         
     /  \        
`,
    String.raw`
    /      \==> 
    \______/    
      __        
    _/  \_      
   /_/\__\      
==>| JUICE|     
   | (>_<)|==>  
   | BERRY|     
   | BLAST|     
   |______|     
      / \       
     /   \      
`
  ]
};

const COLORS = {
  "classic-orange": "\x1b[38;5;208m",
  "fruit-punch-red": "\x1b[31m",
  "berry-blue": "\x1b[34m",
  "lemon-yellow": "\x1b[33m",
  "apple-green": "\x1b[32m",
  "grape-purple": "\x1b[35m",
  "peach": "\x1b[38;5;216m",
  "watermelon-pink": "\x1b[38;5;205m"
};

const TEST_MODE = process.argv.includes("--test");
const FRAME_MS = 170;
const LOOP_LIMIT = TEST_MODE ? 1 : Number.POSITIVE_INFINITY;
const SETTINGS_PATH = path.join(os.homedir(), ".juice-cli-settings.json");
const DEFAULT_SETTINGS = {
  animation: "dancing",
  color: "classic-orange"
};

let frame = 0;
let loop = 0;
let interval;
let inputAttached = false;
let settings = loadSettings();

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function hideCursor() {
  process.stdout.write("\x1b[?25l");
}

function showCursor() {
  process.stdout.write("\x1b[?25h");
}

function getAnimationNames() {
  return Object.keys(ANIMATIONS);
}

function getColorNames() {
  return Object.keys(COLORS);
}

function normalizeSettings(candidate) {
  const animationNames = getAnimationNames();
  const colorNames = getColorNames();
  const normalized = { ...DEFAULT_SETTINGS };

  if (candidate && animationNames.includes(candidate.animation)) {
    normalized.animation = candidate.animation;
  }
  if (candidate && colorNames.includes(candidate.color)) {
    normalized.color = candidate.color;
  }

  return normalized;
}

function loadSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, "utf8");
    return normalizeSettings(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
  } catch {
    // Ignore write errors so animation still runs in restricted environments.
  }
}

function cycle(list, current) {
  const index = list.indexOf(current);
  if (index === -1) {
    return list[0];
  }
  return list[(index + 1) % list.length];
}

function colorize(frameText) {
  const colorCode = COLORS[settings.color] || "";
  const reset = "\x1b[0m";
  return frameText
    .split("\n")
    .map((line) => (line ? `${colorCode}${line}${reset}` : line))
    .join("\n");
}

function renderSettingsFooter() {
  process.stdout.write("\n");
  process.stdout.write(
    `animation: ${settings.animation} (A to change)    color: ${settings.color} (C to change)\n`
  );
  process.stdout.write("Controls: A/C switch settings, Q quits, Ctrl+C exits.\n");
}

function render() {
  const frames = ANIMATIONS[settings.animation] || ANIMATIONS.dancing;
  clearScreen();
  process.stdout.write(colorize(frames[frame]) + "\n");
  process.stdout.write("Fresh moves. Fresh juice.\n");
  if (!TEST_MODE) {
    renderSettingsFooter();
  }

  frame += 1;
  if (frame >= frames.length) {
    frame = 0;
    loop += 1;
  }
  if (loop >= LOOP_LIMIT) {
    stop();
  }
}

function stop() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  if (inputAttached && process.stdin.isTTY) {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdin.removeListener("data", onKeypress);
    inputAttached = false;
  }
  showCursor();
  process.stdout.write("\n");
}

function onKeypress(rawKey) {
  const key = String(rawKey);

  if (key === "\u0003") {
    stop();
    process.exit(0);
  }

  const normalized = key.toLowerCase();
  if (normalized === "q") {
    stop();
    process.exit(0);
  }
  if (normalized === "a") {
    settings.animation = cycle(getAnimationNames(), settings.animation);
    frame = 0;
    saveSettings();
    render();
  }
  if (normalized === "c") {
    settings.color = cycle(getColorNames(), settings.color);
    saveSettings();
    render();
  }
}

function attachInput() {
  if (!process.stdin.isTTY || TEST_MODE) {
    return;
  }
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", onKeypress);
  inputAttached = true;
}

function start() {
  hideCursor();
  attachInput();
  render();
  if (TEST_MODE) {
    stop();
    return;
  }
  if (LOOP_LIMIT > 1) {
    interval = setInterval(render, FRAME_MS);
  }
}

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});

process.on("exit", showCursor);

start();
