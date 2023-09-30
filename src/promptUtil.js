"use strict";

function containsPrompt(data) {
  let lowCaseText = data?.toString()?.toLowerCase() ?? "";

  return lowCaseText.includes("[y/n]");
}

function pathExists(data) {
  let lowCaseText = data?.toString()?.toLowerCase() ?? "";
  
  return lowCaseText.includes("No such file or directory");
}

function alreadyExists(data) {
  let lowCaseText = data?.toString()?.toLowerCase() ?? "";

  return lowCaseText.includes("already exists.");
}

module.exports = {
  containsPrompt: containsPrompt,
  pathExists: pathExists,
  alreadyExists: alreadyExists
}