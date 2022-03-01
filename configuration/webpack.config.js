/*
 * @Author: pink
 * @Date: 2022-02-25 11:23:42
 * @LastEditors: pink
 * @LastEditTime: 2022-03-01 21:53:55
 * @Description: webpack.config
 */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 一定记得运行webpack前记得注释掉这里
// import {Configuration} from 'webpack'

/** 
*@type {Configuration} 
*/

// 这里处于node环境遵循的是CommonJS规范
const config = {
  entry: './src/index.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'dist')
  },
  mode: 'none',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack plugins add',
      meta: {
        viewport: 'width=device-width'
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html'
    })
  ]
}

module.exports = config