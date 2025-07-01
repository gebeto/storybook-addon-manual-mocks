const path = require("path");
const fs = require("fs");

const createManualMocksPlugin = (mocksDirectoryPath) => {
  return function parcelManualMocksPlugin() {
    return {
      name: "manual-mocks-plugin",
      load(_importPath) {
        const importPath = _importPath.replace(/\0/g, "");
        const basePath = path.parse(importPath);
        const mockPath = path.join(
          basePath.dir,
          mocksDirectoryPath,
          basePath.base
        );
        const isReplacementPathExists = fs.existsSync(mockPath);
        if (isReplacementPathExists) {
          return fs.readFileSync(mockPath, { encoding: "utf8" });
        }
      },
    };
  };
};

module.exports = {
  async viteFinal(config, context) {
    const { mergeConfig } = await import("vite");
    const parcelManualMocksPlugin = createManualMocksPlugin(
      context.mocksFolder || "__mocks__"
    );

    return mergeConfig(config, {
      plugins: [parcelManualMocksPlugin()],
    });
  },
};
