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
import list from './authoritylist.vue'
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
      curMenuId: 'lb-authority',
    },
    hasPageAuth: false,
    //authorityListCount: 0
  },
  methods: {
    //检测权限
    checkAuth: function () {
      //权限
      if (this.authList.authority) {
        this.hasPageAuth = true;
      } else {
        //无权限，返回首页
        window.location.href = this.baseUrl + '/views/home.html';
      }

    },
//  getAuthorityListCount: function (num) {
//    this.authorityListCount = num;
//  }
  },
  mounted: function () {
    this.$nextTick(function () {
    });
  }
})