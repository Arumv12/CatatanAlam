const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/scripts/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/", // penting supaya server tahu root public
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
    historyApiFallback: true,
    headers: {
      // Boleh tambahkan header ini untuk melonggarkan CSP jika perlu
      // "Content-Security-Policy": "default-src 'self' 'unsafe-inline' data: blob: *",
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
};
