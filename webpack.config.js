const path = require('path')

module.exports = {
  entry: './src/index.ts',
  // entry: {
  //   'cryptoForage': './src/cryptoForage.ts',
  //   'cryptoPrimitives': './src/cryptoPrimitives.ts',
  //   'curriedForage': './src/curriedForage.ts',
  //   'handler': './src/handler.ts',
  //   'index': './src/index.ts',
  // },
  devtool: 'source-map',
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
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'curriedForage',
    libraryTarget: 'umd'
  },
  target: 'node'
}