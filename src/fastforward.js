const path = require('node:path');
const { spawn } = require('node:child_process');

const ffmpeg = require('ffmpeg-static');

const {
  containsPrompt,
  alreadyExists
} = require('./util.js');

function Fastforward() {
  this.timeoutDuration = 1000 * 60 * 3; /* 3 minute */
  this.skipTo = 0; /* in seconds */

  let fileName = null; /* example "./song.mp3" */

  let inputFolder = "./src/songs";
  let outputFolder = "./src/songs";

  this.config = [];

  this.setSkipTo = (skipTo) => {
    if (skipTo <= 0) {
      console.log("input b");
      return;
    }
    this.skipTo = skipTo;
  }
  this.setTimeoutDuration = (timeoutDuration) => {
    timeoutDuration = timeoutDuration;
  }
  this.setInputFolder = (inputFolderPath) => {
    inputFolder = inputFolderPath;
  }
  this.setOutputFolder = (outputFolder) => {
    outputFolder = outputFolder;
  }
  this.setFileName = (name) => {
    fileName = name;
  }

  this.getConfig = () => { return [...this.config]; };
  this.setDefaultConfig = () => {
    let inputPath = path.join(inputFolder, `./${fileName}`);
    let outputPath = path.join(outputFolder, `/${this.skipTo}-output.mp3`);

    this.config = [
      "-n", /* no overwrite exit immediately */
      "-i",
      inputPath,
      "-ss",
      this.skipTo,
      "-acodec",
      "copy",
      outputPath,
    ]

    return this;
  }
  this.addConfig = (config) => {
    if (Array.isArray(config)) { this.config.push(...config); }
    else if (config) { this.config.push(config); }

    return this;
  }

  this.run = async () => {
    const processConfig = {
      timeout: this.timeoutDuration
    }

    const pc = spawn(ffmpeg, this.config, processConfig);

    return new Promise(function(resolve, reject) {
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
          resolve({ error: true, comment: "exists, exiting." })
        }
      });

      pc.on("close", (code) => {
        if (code === 0) {
          return resolve({ error: false, comment: "success" });
        }

        resolve({
          error: true,
          comment: `child process exited with code ${code}`
        });

        console.log(`child process exited with code ${code}`);
      });

      pc.on("error", (error) => {
        resolve({ error: true, comment: error });
      });

      return;
    });
  }
}

module.exports = Fastforward;
