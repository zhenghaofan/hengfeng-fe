<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
    border: none;
}

html {
    font-size: 20px;
    height: 100%;
}

body {
  height: 100%;
}

i {
  font-style: normal;
}

a:hover, a:visited, a:link, a:active { text-decoration:none; color:#232323 }

@font-face {
  font-family: 'iconfont';
  src: url('../static/fonts/iconfont.eot');
  src: url('../static/fonts/iconfont.eot?#iefix') format('embedded-opentype'),
  url('../static/fonts/iconfont.woff') format('woff'),
  url('../static/fonts/iconfont.ttf') format('truetype'),
  url('../static/fonts/iconfont.svg#iconfont') format('svg');
}

.iconf {
  display: inline-block;
  font-family: 'iconfont';/*'FontAwesome'*/
  font-size: 14px;
  width: 16px;
  text-align: right;
  vertical-align: middle;
  position: relative;
  color: #999;
}

.i-stop:before {
  content: '\e66a';
}

.i-delete:before{
  content: '\e614';
}

.i-modify:before {
  content: '\e615';
}

.i-play:before {
  content: '\e65d';
  color: #64aad5;
  font-size: 12px;
  vertical-align: middle;
}
</style>
