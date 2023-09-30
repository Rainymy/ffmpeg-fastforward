"use strict";
const fs = require('node:fs');
const path = require('node:path');

// TODO: Make it async function
async function createFolder(folderPath) {
  const tempPath = path.join(__dirname, folderPath);
  fs.mkdirSync(folderPath, { recursive: true });
}

// TODO: Make it async function
async function emptyFolder(folderPath) {
  const dirs = fs.readdirSync(folderPath);
  for (let dir of dirs) {
    const dirPath = path.join(folderPath, dir);
    fs.unlinkSync(dirPath);
  }
}

module.exports = {
  deleteAllFilesInFolder: emptyFolder,
  createFolder: createFolder
};
