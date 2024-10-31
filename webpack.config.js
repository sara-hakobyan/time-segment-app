const path = require("path");
const express = require("express");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx", // Entry point for your app
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Clean the output directory on each build
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolve TypeScript and JS files
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true, // Speeds up compilation and avoids certain errors
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"], // Loaders for SASS
      },
      {
        test: /\.css$/, // Add this rule to handle CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Template file for HTML
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000, // The same port as in `react-scripts` for consistency
    open: true, // Opens the browser automatically
    historyApiFallback: true, // Add this line
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      devServer.app.use(
        express.static(path.join(__dirname, "public"), { index: false })
      );
      return middlewares;
    },
  },
  mode: "development",
};
