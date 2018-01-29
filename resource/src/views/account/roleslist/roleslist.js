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
import list from './roleslist.vue'
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
      curMenuId: 'lb-role',
    },
    hasPageAuth: false,
    rolescount: 0,
    //是否有查看权限
    hasViewAuth: '',
    //是否有编辑权限
    hasEditAuth: '',
    //是否有新建权限
    hasAddAuth: '',
  },
  methods: {
    //检测权限
    checkAuth: function () {
      //是否有查看权限
      this.hasViewAuth = this.authTempList.indexOf('ACCOUNT_ROLE_VIEW') !== -1;
      //是否有编辑权限
      this.hasEditAuth = this.authTempList.indexOf('ACCOUNT_ROLE_EDIT') !== -1;
      //是否有新建权限
      this.hasAddAuth = this.authTempList.indexOf('ACCOUNT_ROLE_ADD') !== -1;
      //角色
      if (this.authList.role) {
        this.hasPageAuth = true;
      } else {
        //无权限，返回首页
        window.location.href = this.baseUrl + '/views/home.html';
      }
    },
    getRolesCount: function (num) {
      this.rolescount = num;
    }
  },
  mounted: function () {
  }
})