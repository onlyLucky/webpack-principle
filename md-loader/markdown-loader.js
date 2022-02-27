/*
 * @Author: pink
 * @Date: 2022-02-27 19:59:03
 * @LastEditors: pink
 * @LastEditTime: 2022-02-27 20:44:18
 * @Description: md-loader
 */

module.exports = source => {
  // 加载到的模块内容 => '#About\n\nthis is a makedown file.'
  console.log(source)
  // 返回值就是最终被打包内容
  return 'console.log("hello loader~")'
}
