const fs = require('fs');
const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Process a loaded file
 */
function processFile(content, cpu, onComplete) {
  // Pointer to the memory address in the CPU that we're
  // loading a value into:
  let currVal = 0;
  // Split the lines of the content up by newline
  const lines = content.split('\n');

  // Iterate through the lines of content
  while (lines.length > 0) {
    // Strip comments and remove whitespace
    const line = lines.shift().replace(/#(.*)|\s/g, '');
    // Ignore empty lines
    if (line.length !== 0) {
      // Convert from binary string to numeric value
      const val = parseInt(line, 2);
      // Store in the CPU with the .poke() function
      cpu.poke(currVal, val);
      // next position
      currVal += 1;
    }
  }
  onComplete(cpu);
}

/**
 * Load the instructions into the CPU from stdin
 */
function loadFileFromStdin(cpu, onComplete) {
  let content = '';

  // Read everything from standard input, stolen from:
  // https://stackoverflow.com/questions/13410960/how-to-read-an-entire-text-stream-in-node-js
  process.stdin.resume();
  process.stdin.on('data', (buf) => { content += buf.toString(); });
  process.stdin.on('end', () => { processFile(content, cpu, onComplete); });
}

/**
 * Load the instructions into the CPU from a file
 */
function loadFile(filename, cpu, onComplete) {
  const content = fs.readFileSync(filename, 'utf-8');
  processFile(content, cpu, onComplete);
}

/**
 * On File Loaded
 *
 * CPU is set up, start it running
 */
function onFileLoaded(cpu) {
  cpu.startClock();
}

/**
 * Main
 */
const ram = new RAM(256);
const cpu = new CPU(ram);
// Get remaining command line arguments
const argv = process.argv.slice(2);
// Check arguments
if (argv.length === 0) {
  // Read from stdin
  loadFileFromStdin(cpu, onFileLoaded);
} else if (argv.length === 1) {
  // Read from file
  loadFile(argv[0], cpu, onFileLoaded);
} else {
  console.error('usage: ls8 [machinecodefile]');
  process.exit(1);
}
