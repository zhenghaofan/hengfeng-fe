import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'

//引入内容区
import list from './list.vue'

import util from '@/utils/index.js'
new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
  	list,
  	gFooter
  },
  data: {
    headerSel: 'nav-resource',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.resource,
      curMenuId: 'lb-auditres',
    },
    waitEnabled: true,
    needget: false,
    typeList: []
  },
  methods: {
    //tab切换
    toggleList: function (status) {
      this.waitEnabled = status;
      this.needget = true;
    }
  },
  mounted: function () {
    if (util.getUrlParams('waitEnabled') === 'false') {
      this.waitEnabled = false;
    }
    this.needget = true;
  }
});