/*
 * @Author: pink
 * @Date: 2022-03-13 13:08:12
 * @LastEditors: pink
 * @LastEditTime: 2022-03-13 13:42:06
 * @Description: fetch
 */
export default endpoint => {
  return fetch(`https://jsonplaceholder.typicode.com${endpoint}`)
    .then(response => response.json())
}