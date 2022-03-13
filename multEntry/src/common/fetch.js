/*
 * @Author: pink
 * @Date: 2022-03-12 23:49:53
 * @LastEditors: pink
 * @LastEditTime: 2022-03-13 12:11:27
 * @Description: fetch
 */
export default endpoint => {
  return fetch(`https://jsonplaceholder.typicode.com${endpoint}`)
    .then(response => response.json())
}