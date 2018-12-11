var path = require('path')

module.exports = {
  mode:"development",
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins:['babel-plugin-transform-react-jsx']
          }
        }
      }
    ]
  },
  devServer:{
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  }
}