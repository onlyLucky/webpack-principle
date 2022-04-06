/*
 * @Author: fg
 * @Date: 2022-04-06 10:52:00
 * @LastEditors: fg
 * @LastEditTime: 2022-04-06 12:46:18
 * @Description: less plugin
 */

/* module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add('pi', function () {
      return Math.PI
    })
  }
} */

// eslint-disable-next-line no-undef
registerPlugin({
  install: function (less, pluginManager, functions) {
    functions.add('pi', function () {
      return Math.PI
    })
    functions.add('bg', function () {
      return 'pink'
    })
    functions.add('foo', function () {
      return 'foo'
    })
  },
  use: function (context) {
    console.log(context, 'context')
  },
  eval: function (context) {
    console.log('eval', context)
  }
})
