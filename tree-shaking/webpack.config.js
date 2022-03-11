/*
 * @Author: pink
 * @Date: 2022-03-10 22:49:10
 * @LastEditors: pink
 * @LastEditTime: 2022-03-11 22:45:25
 * @Description: content
 */

const path = require('path')
module.exports = {
  entry: './src/main.js', //注意这里的./不能省略
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'dist')
  },
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    //尽可能合并每一个模块到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    minimize: false
  }
}