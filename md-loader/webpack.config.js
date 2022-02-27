/*
 * @Author: pink
 * @Date: 2022-02-27 20:09:43
 * @LastEditors: pink
 * @LastEditTime: 2022-02-27 20:12:29
 * @Description: md-loader webpack config
 */

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /.md$/,
        // 直接使用相对路径
        use: './markdown-loader.js'
      }
    ]
  }
}