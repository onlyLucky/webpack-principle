/*
 * @Author: pink
 * @Date: 2022-02-25 10:31:29
 * @LastEditors: pink
 * @LastEditTime: 2022-02-25 10:34:19
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
