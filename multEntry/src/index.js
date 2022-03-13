/*
 * @Author: pink
 * @Date: 2022-03-12 23:52:04
 * @LastEditors: pink
 * @LastEditTime: 2022-03-13 12:18:27
 * @Description: content
 */
import fetchApi from './common/fetch'
import './common/global.css'
import './index.css'

const mainElement = document.querySelector('.main')

fetchApi('/posts').then(data => {
  data.forEach(item => {
    const article = document.createElement('article')
    article.className = 'post'

    const h2 = document.createElement('h2')
    h2.textContent = item.title
    article.appendChild(h2)

    const paragraph = document.createElement('p')
    paragraph.textContent = item.body
    article.appendChild(paragraph)

    mainElement.appendChild(article)
  })
})