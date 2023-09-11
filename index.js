const ffmpeg = require('ffmpeg-static');
const { spawn } = require('node:child_process');

const {
  containsPrompt,
  alreadyExists
} = require('./src/util.js');

let timeoutDuration = 1000 * 60 * 3 /* 3 minute */
let skipTo = 45; /* in seconds */
let inputFilePath = "./src/songs/song.mp3";
let outputFilePath = `./src/songs/${skipTo}-output.mp3`

const config = [
  "-n", /* no overwrite exit immediately */
  "-i",
  inputFilePath,
  "-ss",
  skipTo,
  "-acodec",
  "copy",
  outputFilePath,
]
const pc = spawn(ffmpeg, config, { timeout: timeoutDuration });

pc.stdout.setEncoding("utf-8");
pc.stderr.setEncoding("utf-8");
pc.stdin.setEncoding("utf-8");

pc.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

pc.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);

  if (containsPrompt(data)) {
    pc.stdin.write("\n y");
  }

  if (alreadyExists(data)) {
    console.log("exists, exiting.");
  }
});

pc.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

module.exports = { config };
