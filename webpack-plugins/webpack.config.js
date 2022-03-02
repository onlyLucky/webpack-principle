/*
 * @Author: pink
 * @Date: 2022-03-02 21:30:01
 * @LastEditors: pink
 * @LastEditTime: 2022-03-02 22:34:03
 * @Description: webpack配置
 */

module.exports = {
  //样式文件路径
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  mode: 'none',
  module: {
    rules:[
      {
        test: /\.css$/,//根据打包过程中所遇到的文件路径匹配是否使用该loader
        use: ['style-loader','css-loader'],//指具体的loader
      }
    ]
  }
}