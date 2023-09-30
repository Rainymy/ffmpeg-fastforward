# 🚧 Currently under construction 🚧
Kimchord Fast Forward is a simple npm package that allows you to manipulate audio  and video files by skipping a specified number of seconds. It's a wrapper for  `ffmpeg-static` with a simpler interface.

### Example Usage
```js
async function fast() {
  const ff = new fastForward();

  ff.setFileName("example.mp3"); // File name with extension
  ff.setSkipTo(50); // Set the number of seconds to skip

  const tempPath = path.join(__dirname, "./temp"); // Path example
  ff.setInputFolder(tempPath); // Absolute path
  ff.setOutputFolder(tempPath); // Absolute path

  ff.setDefaultConfig(); // ff.addConfig(option: <array>|<string>)
  
  const res = await ff.run(); // Run the Fast Forward process
  console.log(res);
}
```
