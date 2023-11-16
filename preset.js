const webpackPreset = require("./webpack/preset");
const vitePreset = require("./vite/preset");

module.exports = {
  ...webpackPreset,
  ...vitePreset,
};
