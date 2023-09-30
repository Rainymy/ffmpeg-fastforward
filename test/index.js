"use strict";
const path = require('node:path');
const Fastforward = require('../src/fastforward.js');

const tempInput = path.join(process.cwd(), "./test/src/songs");

async function main() {
  const fast = new Fastforward();
  
  const tempPath = path.join(__dirname, "temp-fastforward");
  fast.clean(tempPath);
  
  fast.setFileName("song.m4a");
  fast.setSkipTo(50);
  
  fast.setInputFolder(tempInput);
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
