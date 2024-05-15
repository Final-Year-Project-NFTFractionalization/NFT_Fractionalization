const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Adjust this to the correct path of your main JS file
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'], // Adjust extensions based on your project
  },
};
