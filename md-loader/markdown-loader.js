/*
 * @Author: pink
 * @Date: 2022-02-27 19:59:03
 * @LastEditors: pink
 * @LastEditTime: 2022-02-27 21:17:15
 * @Description: md-loader
 */

const marked = require('marked')

module.exports = source => {
  // 转换markdown语法为html
  const html = marked(source)
  // const code = `module.exports = ${JSON.stringify(html)}`
  // const code = `export default ${JSON.stringify(html)}`
  // return code
  return html
}
