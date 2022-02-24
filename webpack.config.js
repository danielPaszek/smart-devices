var path = require("path");

module.exports = {
  entry: "./dist/client/app.js",
  output: {
    path: path.join(__dirname, "./static"),
    filename: "_bundle.js",
  },
  node: false,
};
