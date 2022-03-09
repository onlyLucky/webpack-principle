/*
 * @Author: pink
 * @Date: 2022-03-09 09:57:56
 * @LastEditors: pink
 * @LastEditTime: 2022-03-09 10:03:24
 * @Description: content
 */
export default()=>{
  const element =document.createElement('h2')
  element.textContent = 'Hello webpack'
  element.addEventListener('click',()=>{
    alert('Hello webpack')
  })
  return element
}