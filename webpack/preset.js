const path = require("path");
const fs = require("fs");

const createWebpackManualMocksPlugins = (mocksDirectoryPath = "__mocks__") => {
  const webpack = require("webpack");
  const EXTENSIONS = [".ts", ".js"];
  const plugins = [];

  plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^\.\//, async (resource) => {
      const mockedPath = path.resolve(
        resource.context,
        mocksDirectoryPath,
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

  plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^\.\.\//, async (resource) => {
      const prs = path.parse(resource.request);
      const mockedPath = path.resolve(
        resource.context,
        prs.dir,
        mocksDirectoryPath,
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

  return plugins;
};

module.exports = {
  webpackFinal: (config, context) => {
    config.plugins.push(
      ...createWebpackManualMocksPlugins(context.mocksFolder || "__mocks__")
    );

    return config;
  },
};
