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
import waitlist from './waitlist.vue'
import recordlist from './recordlist.vue'
import util from '@/utils/index.js'

new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
	  waitlist,
  	recordlist,
  	gFooter
  },
  data: {
    headerSel: 'nav-resource',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.resource,
      curMenuId: 'lb-errorres',
    },
    waitEnabled: true,
    needget: false,
    totalRecordCount: 0
  },
  methods: {
    //tab切换
    toggleList: function (status) {
      this.waitEnabled = status;
    },
    //获取总条数
    getCount: function (count) {
      this.totalRecordCount = count;
    }
  },
  mounted: function () {
    if (util.getUrlParams('waitEnabled') === 'false') {
      this.waitEnabled = false;
    }
    this.needget = true;
  }
});