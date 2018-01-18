import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入尾部
import gFooter from '@/components/GFooter'
//引入内容块
import center from './home.vue'
new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	center,
  	gFooter
  },
  data: {
    headerSel: 'nav-home'
  }
});
