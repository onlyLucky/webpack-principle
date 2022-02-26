/*
 * @Author: pink
 * @Date: 2022-02-26 22:24:21
 * @LastEditors: pink
 * @LastEditTime: 2022-02-26 22:56:11
 * @Description: loader webpack config
 */
// import {Configuration} from 'webpack'
module.exports = {
  //样式文件路径
  entry: './src/main.css',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.css$/,//根据打包过程中所遇到的文件路径匹配是否使用该loader
        use: ['style-loader','css-loader'],//指具体的loader
      }
    ]
  }
}