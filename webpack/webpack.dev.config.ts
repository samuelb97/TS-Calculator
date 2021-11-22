import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from 'eslint-webpack-plugin';

const config: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      { 
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({   // Create base html file for build
      template: "index.html",
    }),
    new HotModuleReplacementPlugin(), // Allows for hot reload
    new ForkTsCheckerWebpackPlugin({    // Enables webpack to type check any typescript code 
      async: false    // Wait for type checking to finish before emitting new code
    }),
    new ESLintPlugin({  // Enables webpack to inform us of linting errors
      extensions: ["js", "jsx", "ts", "tsx"]
    })
  ],
  devtool: "inline-source-map", 
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true
  },
};

export default config;