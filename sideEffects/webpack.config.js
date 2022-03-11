/*
 * @Author: pink
 * @Date: 2022-03-11 23:25:51
 * @LastEditors: pink
 * @LastEditTime: 2022-03-11 23:35:36
 * @Description: webpack.config
 */

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  optimization: {
    sideEffects: true
  }
}