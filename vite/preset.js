const path = require("path");
const fs = require("fs");

const createViteManualMocksDirectoryPlugin = (mocksFolderPath) => {
  return function parcelManualMocksPlugin() {
    return {
      name: "manual-mocks-directory-plugin",
      load(_importPath) {
        const importPath = _importPath.replace(/\0/g, "");
        const basePath = path.parse(importPath);
        const mockPath = path.join(
          basePath.dir,
          mocksFolderPath,
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

const createViteManualMocksPostfixPlugin = () => {
  function parcelMocksPlugin() {
    return {
      name: "manual-mocks-postfix-plugin",
      load(_importPath) {
        const importPath = _importPath.replace(/\0/g, "");
        const basePath = path.parse(importPath);
        const mockPath = path.join(
          basePath.dir,
          basePath.base
            .replace(/\.js$/, ".mock.js")
            .replace(/\.ts$/, ".mock.ts")
            .replace(/\.jsx$/, ".mock.jsx")
            .replace(/\.tsx$/, ".mock.tsx")
        );

        const isReplacementPathExists = fs.existsSync(mockPath);
        if (isReplacementPathExists) {
          return fs.readFileSync(mockPath, { encoding: "utf8" });
        }
      },
    };
  }
};

const createViteManualMocksPlugin = (config) => {
  if (config.approach === "directory") {
    return createViteManualMocksDirectoryPlugin(config.mocksFolder);
  } else if (config.approach === "postfix") {
    return createViteManualMocksPostfixPlugin();
  }
};

module.exports = {
  async viteFinal(config, context) {
    const { mergeConfig } = await import("vite");
    const parcelManualMocksPlugin = createViteManualMocksPlugin({
      approach: context.approach || "directory",
      mocksFolder: context.mocksFolder || "__mocks__",
    });

    return mergeConfig(config, {
      plugins: [parcelManualMocksPlugin()],
    });
  },
};
