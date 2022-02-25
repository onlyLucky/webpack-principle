/*
 * @Author: pink
 * @Date: 2022-02-25 11:23:42
 * @LastEditors: pink
 * @LastEditTime: 2022-02-25 11:37:03
 * @Description: webpack.config
 */
const path = require('path')
// 这里处于node环境遵循的是CommonJS规范
module.exports = {
  entry: './src/index.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'output')
  }
}