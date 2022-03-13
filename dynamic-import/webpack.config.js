/*
 * @Author: pink
 * @Date: 2022-03-13 13:10:05
 * @LastEditors: pink
 * @LastEditTime: 2022-03-13 14:06:23
 * @Description: webpack.config
 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',//name 为入口文件
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic Import',
      year: new Date().getFullYear(),
      template: './src/index.html',
      filename: 'index.html',
    })
  ]
}