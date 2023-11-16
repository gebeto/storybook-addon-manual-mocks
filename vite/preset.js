const path = require("path");
const fs = require("fs");

const MOCKS_DIRECTORY = "__mocks__";

module.exports = {
  async viteFinal(config, ...args) {
    const { mergeConfig } = await import("vite");
    function parcelMocksPlugin() {
      return {
        name: "mocks-plugin",
        load(_importPath) {
          const importPath = _importPath.replace(/\0/g, "");
          const basePath = path.parse(importPath);
          const mockPath = path.join(
            basePath.dir,
            MOCKS_DIRECTORY,
            basePath.base
          );
          const isReplacementPathExists = fs.existsSync(mockPath);
          if (isReplacementPathExists) {
            return fs.readFileSync(mockPath, { encoding: "utf8" });
          }
        },
      };
    }

    return mergeConfig(config, {
      plugins: [parcelMocksPlugin()],
    });
  },
};
