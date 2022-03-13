/*
 * @Author: pink
 * @Date: 2022-03-12 23:52:23
 * @LastEditors: pink
 * @LastEditTime: 2022-03-13 12:32:42
 * @Description: webpack.config
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    index: './src/index.js',
    album: './src/album.js'
  },
  output: {
    filename: '[name].bundle.js',//name 为入口文件
  },
  module: {
    rules:[
      {
        test: /\.css$/,//根据打包过程中所遇到的文件路径匹配是否使用该loader
        use: ['style-loader','css-loader'],//指具体的loader
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}