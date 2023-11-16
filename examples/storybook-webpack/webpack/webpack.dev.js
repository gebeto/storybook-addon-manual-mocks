const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    open: true,
    port: 1111,
  },
};
