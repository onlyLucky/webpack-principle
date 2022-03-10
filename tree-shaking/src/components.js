/*
 * @Author: pink
 * @Date: 2022-03-10 22:25:58
 * @LastEditors: pink
 * @LastEditTime: 2022-03-10 23:17:43
 * @Description: content
 */

export const Button = () => {
  return document.createElement('button')
  console.log('dead-code')
}

export const Link = () => {
  return document.createElement('a')
}

export const Heading = level => {
  return document.createElement('h'+level)
}