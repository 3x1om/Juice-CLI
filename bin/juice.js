#!/usr/bin/env node

const FRAMES = [
  String.raw`
      \  /      
       \/       
    .--------.  
   /  JUICE   \ 
  |   BOX :)   |
  |            |
   \__________/ 
      /  \      
     / /\ \     
`,
  String.raw`
    \      /    
     \____/     
    .--------.  
   /  JUICE   \ 
  |   BOX :)   |
  |            |
   \__________/ 
      /\        
     /  \       
`,
  String.raw`
      /  \      
     /____\     
    .--------.  
   /  JUICE   \ 
  |   BOX :)   |
  |            |
   \__________/ 
       /\       
      /  \      
`,
  String.raw`
    /      \    
    \______/    
    .--------.  
   /  JUICE   \ 
  |   BOX :)   |
  |            |
   \__________/ 
      / \       
     /   \      
`
];

const TEST_MODE = process.argv.includes("--test");
const FRAME_MS = 170;
const LOOPS = TEST_MODE ? 1 : 6;

let frame = 0;
let loop = 0;
let interval;

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function hideCursor() {
  process.stdout.write("\x1b[?25l");
}

function showCursor() {
  process.stdout.write("\x1b[?25h");
}

function render() {
  clearScreen();
  process.stdout.write(FRAMES[frame] + "\n");
  process.stdout.write("Fresh moves. Fresh juice.\n");
  frame += 1;
  if (frame >= FRAMES.length) {
    frame = 0;
    loop += 1;
  }
  if (loop >= LOOPS) {
    stop();
  }
}

function stop() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  showCursor();
  if (!TEST_MODE) {
    process.stdout.write("\nDone. Run `juice` anytime for the dance.\n");
  }
}

function start() {
  hideCursor();
  render();
  interval = setInterval(render, FRAME_MS);
}

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});

process.on("exit", showCursor);

start();
