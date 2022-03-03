/*
 * @Author: pink
 * @Date: 2022-03-02 21:21:27
 * @LastEditors: pink
 * @LastEditTime: 2022-03-02 23:01:21
 * @Description: 移除注解插件
 */

class RemoveCommentsPlugin{
  apply(compiler){
    console.log('RemoveCommentsPlugin')
    // compile 包含了这次构建的所有配置
    compiler.hooks.emit.tap('RemoveCommentsPlugin',compilation=>{
      // compilation 可以理解为此次打包的上下文
      for(const name in compilation.assets){
        // console.log(name)//输出文件名称
        const contents = compilation.assets[name].source()
        const noComments = contents.replace(/\/\*{2,}\/\s?/g,'')
        compilation.assets[name] = {
          source: ()=>noComments,
          size: ()=>noComments.length
        }
      }
    })
  }
}
module.exports = RemoveCommentsPlugin;