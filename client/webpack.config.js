const path = require("path");
const babelEnvPreset = [
  "env",
  {
    targets: {
      browsers: ["last 2 versions"]
    }
  }
];

const babelLoader = {
  loader: "babel-loader",
  options: {
    presets: [babelEnvPreset, "react"],
    plugins: [
      "babel-root-slash-import"
    ]
  }
};

const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "/../public/js")
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      constants: path.resolve(__dirname, "src/constants"),
      state: path.resolve(__dirname, "src/state"),
      utils: path.resolve(__dirname, "src/utils"),
      components: path.resolve(__dirname, "src/components")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: [babelLoader, "ts-loader"],
        include: path.resolve("src")
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [babelLoader]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[local]_[hash:base64:5]" // Add naming scheme
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        exclude: [path.resolve(__dirname, "src/__test__")],
        context: __dirname
      }
    })
  ]
};
