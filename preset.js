const path = require("path");
const fs = require("fs");

const MOCKS_DIRECTORY = "__mocks__";

module.exports = {
  webpackFinal: (config) => {
    const webpack = require("webpack");
    const EXTENSIONS = [".ts", ".js"];

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^\.\//, async (resource) => {
        const mockedPath = path.resolve(
          resource.context,
          MOCKS_DIRECTORY,
          resource.request
        );
        for (let ext of EXTENSIONS) {
          const isReplacementPathExists = fs.existsSync(mockedPath + ext);
          if (isReplacementPathExists) {
            const newImportPath =
              "./" + path.join(MOCKS_DIRECTORY, resource.request);
            resource.request = newImportPath;
            break;
          }
        }
      })
    );

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^\.\.\//, async (resource) => {
        const prs = path.parse(resource.request);
        const mockedPath = path.resolve(
          resource.context,
          prs.dir,
          MOCKS_DIRECTORY,
          prs.base
        );
        for (let ext of EXTENSIONS) {
          const isReplacementPathExists = fs.existsSync(mockedPath + ext);
          if (isReplacementPathExists) {
            const newImportPath =
              prs.dir + "/" + path.join(MOCKS_DIRECTORY, prs.base);
            resource.request = newImportPath;
            break;
          }
        }
      })
    );

    return config;
  },

  async viteFinal(config) {
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
