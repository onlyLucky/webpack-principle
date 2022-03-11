/*
 * @Author: pink
 * @Date: 2022-03-11 23:54:19
 * @LastEditors: pink
 * @LastEditTime: 2022-03-11 23:56:37
 * @Description: extend
 */

Number.prototype.pad = function(size){
  const leadingZeros = Array(size + 1).join(0)
  return leadingZeros + this
}