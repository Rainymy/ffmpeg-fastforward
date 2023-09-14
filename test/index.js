const Fastforward = require('ffmpeg-fastforward');

async function main() {
  const fast = new Fastforward();

  fast.setFileName("song.mp3");
  fast.setSkipTo(50);
  fast.setDefaultConfig();

  console.log(fast);
  console.log("-------------------------".repeat(2));
  const res = await fast.run();
  console.log("-------------------------".repeat(2));
  console.log(res);
  console.log("-------------------------".repeat(2));

  return;
}

main();
