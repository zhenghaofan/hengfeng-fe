var gulp = require('gulp'),
    less= require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),//js压缩
    cssmin = require('gulp-minify-css'),//css压缩
    htmlmin = require('gulp-htmlmin');//html压缩

/** 压缩JS **/
//login.js文件的额外压缩
gulp.task('uglifyLogin', function() {
  // 1. 找到文件
  gulp.src('src/views/login/*.js')
  // 2. 压缩文件
      .pipe(uglify({
        mangle: true,//类型：Boolean 默认：true 是否修改变量名
        compress: true,//类型：Boolean 默认：true 是否完全压缩
        output: {
          comments: false
        },
      }))
  // 3. 另存压缩后的文件
      .pipe(gulp.dest('dist/static/js/views'));
});
gulp.task('auto',function(){
  gulp.watch('src/views/login/*.js',['uglifyLogin']);
});

/** 压缩css **/
gulp.task('loginCssmin', function () {
  gulp.src('static/css/*.css')
    .pipe(cssmin({
      advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
      keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
      keepSpecialComments: '*'
      //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }))
    .pipe(gulp.dest('dist/static/css/'));
});

/** 压缩html **/
gulp.task('loginHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/views/login/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/views/'));
});



//部署动作-less
gulp.task('testLess', function () {
    gulp.src(['static/less/*.less']) 
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('static/css'));
});
//监听文件
gulp.task('autoLess',function(){
    return gulp.watch('static/less/*.less',['testLess']);
});

gulp.task('default',['uglifyLogin', 'loginCssmin', 'loginHtmlmin']);

//只打包login.js
gulp.task('js',['uglifyLogin']);
//只压缩css
gulp.task('css',['loginCssmin']);
//只压缩login.html
gulp.task('html',['loginHtmlmin']);

gulp.task('auto',['auto']);

gulp.task('less',['testLess']);

gulp.task('watch',['autoLess']);