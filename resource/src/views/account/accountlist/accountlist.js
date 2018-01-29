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
    hasPageAuth: '',
    hasAddAuth: '',
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
      this.hasPageAuth = this.authTempList.indexOf('ACCOUNT_VIEW') !== -1;
      this.hasAddAuth = this.authTempList.indexOf('ACCOUNT_ADD') !== -1;
      //账号
      if (!this.hasPageAuth) {
        this.hasPageAuth = true;
        this.$message.error("对不起，您无查看该页面的权限");
        console.log(this.hasAddAuth);
        // 不能返回首页，因为用户可能只是没有查看accountlist页面的权限，但他可能有新增或其他页面的权限
        // setTimeout("window.location.href = '" + this.baseUrl + "' + '/views/home.html';", 4000);
      }
    }
  },
  mounted: function () {
  	this.$nextTick(function () {
      
    });
  }
})