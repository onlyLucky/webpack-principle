/*
 * @Author: pink
 * @Date: 2022-03-10 22:49:10
 * @LastEditors: pink
 * @LastEditTime: 2022-03-10 23:25:24
 * @Description: content
 */

const path = require('path')
module.exports = {
  entry: './src/main.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'dist')
  },
}