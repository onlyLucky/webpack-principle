/*
 * @Author: pink
 * @Date: 2022-03-12 23:52:23
 * @LastEditors: pink
 * @LastEditTime: 2022-03-13 12:53:24
 * @Description: webpack.config
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'none',
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
  optimization: {
    splitChunks: {
      chunks: 'all'//自动提取所有公共模块到单独的bundle
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      year: new Date().getFullYear(),
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'] //指定使用index.bundle.js
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      year: new Date().getFullYear(),
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album'] //指定使用album.bundle.js
    })
  ]
}