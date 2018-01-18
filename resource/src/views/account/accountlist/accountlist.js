import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'

import list from './accountlist.vue'

//集成api
import apiUrl from '@/api/url.js'

new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
    list,
  	gFooter
  },
  data: {
    headerSel: 'nav-account',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.account,
      curMenuId: 'lb-account',
    },
    hasPageAuth: false,
    accountEnabled: true,
    curTab: 0,
    count: 0,
    disabledCount: 0,
    availableCount: 0
  },
  methods: {
    toggleList: function (enabled) {
      this.accountEnabled = enabled;
    },
    changeCount: function (count) {
      this.count = count;
    },
    //检测权限
    checkAuth: function () {
      //账号
      if (this.authList.account) {
        this.hasPageAuth = true;
      } else {
        //无权限，返回首页
        window.location.href = this.baseUrl + '/views/home.html';
      }

    }
  },
  mounted: function () {
  	this.$nextTick(function () {
      
    });
  }
})