/*
 * @Author: pink
 * @Date: 2022-02-25 11:23:42
 * @LastEditors: pink
 * @LastEditTime: 2022-02-25 11:43:01
 * @Description: webpack.config
 */
const path = require('path')
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
    path: path.join(__dirname,'output')
  }
}

module.exports = config