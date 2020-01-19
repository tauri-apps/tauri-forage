const path = require('path')

module.exports = {
  entry: {
    'cryptoForage': './src/cryptoForage.ts',
    'cryptoPrimitives': './src/cryptoPrimitives.ts',
    'curriedForage': './src/curriedForage.ts',
    'handler': './src/handler.ts',
    'index': './src/index.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
}