const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const MOCKS_DIRECTORY = "__mocks__";
const EXTENSIONS = [".ts", ".js"];

module.exports = {
  webpackFinal: (config) => {
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
};
