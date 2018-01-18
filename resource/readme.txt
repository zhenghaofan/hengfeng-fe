本系统采用的框架
MV*框架：Vue 2.0
UI框架：element-ui 1.4.8 （有自定义主题，主题包安装指南见本文最后或官网http://element-cn.eleme.io/#/zh-CN/component/custom-theme）
HTTP请求：axios 0.16.2
login页：jquery-1.10.1(内页里未使用)

打包工具(因要兼容IE9以下，以及部分文件没必要放在webpack里打包，所以采用组合方式)
webpack 2.6.1
gulp 3.9.1


打包方法：
1.npm run build
2.(删掉dist/css/login.css及dist/css/global.css文件[压缩单项：gulp css]
  删掉dist/views/login.html文件[压缩单项：gulp html]
  删掉dist/static/js/views/login.js文件[压缩单项：gulp js])可删除也不的删除，最后gulp操作会覆盖
 运行 gulp （如需单项生成上面的某文件，可个别操作，具体指令见gulpfile.js）
3.提交时记得无需提交另外一个login.xxx.js的由webpack生成的文件。



饿了么主题包安装指南

1.安装工具
首先安装「主题生成工具」，可以全局安装或者安装在当前项目下，推荐安装在项目里，方便别人 clone 项目时能直接安装依赖并启动，这里以全局安装做演示。

npm i element-theme -g

2.安装默认主题，可以从 npm 安装或者从 GitHub 拉取最新代码。

# 从 npm
npm i element-theme-default -D

# 从 GitHub
npm i https://github.com/ElementUI/theme-default -D

3.生成主题文件夹
et

4.在当前目录将theme文件夹改成theme-diy文件夹放到front\node_modules\element-ui\lib目录下

（当前的element-variables.css是本系统自定义过生成的文件，如需修改自定义内容，请务必在此文件基础上做修改！！！切记！！！）