var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var ImageminPlugin = require('imagemin-webpack-plugin').default
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),*/
    new FriendlyErrorsPlugin(),
    //图片压缩
    // Make sure that the plugin is after any plugins that add images
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', 
      pngquant: {
        quality: '80-100'
      }
    })
  ]
})


var pages =  utils.getMultiEntry('./src/'+config.moduleName+'/**/**/**/*.html');
for (var pathname in pages) {
  //登录页不做处理 因为要兼容IE9以下 采用另外的压缩方式
  /*if (pathname.indexOf('login') !== -1) {
    continue;
  }*/
  
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    //chunks: [pathname, 'vendors', 'manifest'], // 每个html引用的js模块
    chunks: [pathname, 'vendors'], // 每个html引用的js模块
    inject: true,              // js插入位置
    keywords: '云资源中心',
    description: '云资源中心',
    viewport: 'width=device-width, user-scalable=no, initial-scale=.8',
    version: '1.0'
  };
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}