/*
 * @Author: fg
 * @Date: 2022-04-06 11:26:07
 * @LastEditors: fg
 * @LastEditTime: 2022-04-06 11:27:14
 * @Description: plugin
 */

module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add('foo', function () {
      return 'bar'
    })
  }
}
