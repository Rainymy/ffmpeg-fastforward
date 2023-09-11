function containsPrompt(data) {
  let lowCaseText = data?.toString()?.toLowerCase() ?? "";

  return lowCaseText.includes("[y/n]");
}

function alreadyExists(data) {
  let lowCaseText = data?.toString()?.toLowerCase() ?? "";

  return lowCaseText.includes("already exists.");
}

module.exports = {
  containsPrompt: containsPrompt,
  alreadyExists: alreadyExists
}
