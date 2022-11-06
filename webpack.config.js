const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: [
    path.resolve(__dirname, 'src', 'scripts/ice_cream.js'),
    path.resolve(__dirname, 'src', 'styles/index.css'),
  ],
  output: {
    path: path.join(__dirname, 'src'), // bundled file in dist/
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'], // transpiles js
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/, // css/scss/sass files
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // resolves @import
            options: { url: false }
          },
          'sass-loader', // compile sass to css
        ]
      }
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  return config;
}