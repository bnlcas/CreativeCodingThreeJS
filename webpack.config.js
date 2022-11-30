// webpack maps original_source_code.js into smaller, faster main.js
// we use webpack for scalability

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: [
    path.resolve(__dirname, 'src', 'scripts/ice_cream.js'),
    path.resolve(__dirname, 'src', 'styles/index.css'),
  ],
  output: {
    path: path.join(__dirname, '/api/dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          'sass-loader',
        ]
      }
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = 'source-map';    // keep track of where bundled code came from + what original source files looked like
  } else {
    config.devtool = 'eval-source-map';
  }

  return config;
}