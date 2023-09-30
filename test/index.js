"use strict";

const fs = require('node:fs');
const path = require('node:path');
const Fastforward = require('../src/fastforward.js');

const folderPath = path.join(__dirname, "./src/songs");
fs.mkdirSync(folderPath, { recursive: true });

async function main() {
  const fast = new Fastforward();
  
  const tempPath = path.join(__dirname, "temp-fastforward");
  
  fast.clean(tempPath);
  
  fast.setFileName("song.m4a");
  fast.setSkipTo(50);
  
  fast.setInputFolder(folderPath);
  fast.setOutputFolder(tempPath);
  
  fast.setDefaultConfig();
  
  // console.log(fast);
  console.log("-------------------------".repeat(2));
  const res = await fast.run();
  console.log("-------------------------".repeat(2));
  console.log(res);
  console.log("-------------------------".repeat(2));
  
  return;
}

main();
