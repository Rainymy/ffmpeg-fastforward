"use strict";
const path = require('node:path');
const { spawn } = require('node:child_process');

const ffmpeg = require('ffmpeg-static');

const promptUtil = require('./promptUtil.js');
const util = require('./util.js');

function Fastforward() {
  this.timeoutDuration = 1000 * 60 * 3; /* 3 minute */
  this.skipTo = 0; /* in seconds */

  let outFileName = "-output";
  let fileName = null; /* example "./song.mp3" */
  
  let tempFolder = path.join(process.cwd(), "/temp-fastforward");
  let inputFolder = path.join(process.cwd(), "/media");
  let outputFolder = path.join(process.cwd(), "/media");

  this.config = [];

  this.setSkipTo = (skipTo) => {
    if (skipTo <= 0) {
      return console.log("input b");
    }
    this.skipTo = skipTo;
  }
  this.setTimeoutDuration = (timeoutDuration) => {
    this.timeoutDuration = timeoutDuration;
  }
  this.setInputFolder = (inputFolderPath) => {
    inputFolder = inputFolderPath;
  }
  this.setOutputFolder = (outputFolderPath) => {
    outputFolder = outputFolderPath;
  }
  this.setFileName = (name) => {
    fileName = name;
  }
  this.setOutFileName = (name) => {
    outFileName = name;
  }

  this.getConfig = () => { return [...this.config]; };
  this.setDefaultConfig = () => {
    let inputPath = path.join(inputFolder, `./${fileName}`);
    let outputPath = path.join(outputFolder, `/${outFileName}`);
    
     /*-n (no overwrite exit immediately) */
    this.config = [
      "-n", "-i", inputPath, "-ss", this.skipTo, "-acodec", "copy", outputPath
    ]

    return this;
  }
  this.addConfig = (config) => {
    if (Array.isArray(config)) { this.config.push(...config); }
    else if (config) { this.config.push(config); }

    return this;
  }

  this.createFolder = (folderPath) => util.createFolder(folderPath);
  this.emptyFolder = (folderPath) => util.deleteAllFilesInFolder(folderPath);
  
  this.clean = async (initFolder) => {
    const tempPath = path.resolve(__dirname, initFolder ?? tempFolder);
    
    await this.createFolder(tempPath);
    await this.emptyFolder(tempPath);

    return this;
  }
  
  this.validateSettings = () => {
    if (!this.config.length) {
      return { fail: true, detail: "Require config!" }
    }
    if (this.skipTo === 0) {
      return { fail: true, detail: `Skip more than: ${this.skipTo} seconds` }
    }
    
    return { fail: false, detail: null };
  }
  this.run = async () => {
    const processConfig = { timeout: this.timeoutDuration }

    const { fail, detail } = this.validateSettings();
    if (fail) {
      return { error: fail, comment: detail }
    }
    
    const pc = spawn(ffmpeg, this.config, processConfig);

    return new Promise(function(resolve, reject) {
      pc.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      pc.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);

        if (promptUtil.containsPrompt(data)) {
          pc.stdin.write("\n y");
        }

        if (promptUtil.pathExists(data)) {
          resolve({ error: true, comment: "No such file or directory" })
          return;
        }

        if (promptUtil.alreadyExists(data)) {
          resolve({ error: true, comment: "exists, exiting." });
          return;
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
      });

      pc.on("error", (error) => {
        resolve({ error: true, comment: error });
      });

      return;
    });
  }
}

module.exports = Fastforward;
