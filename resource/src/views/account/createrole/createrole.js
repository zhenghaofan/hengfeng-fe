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
import createrole from './createrole.vue'
//集成api
import apiUrl from '@/api/url.js'

new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
  	createrole,
  	gFooter,
  },
  data: {
    headerSel: 'nav-account',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.account,
      curMenuId: 'lb-role',
    },
  	personalInfo: {}
  },
  methods: {
    //获取个人信息
    getPersonalInfo (obj) {
      var self = this;
      for (var i in obj) {
        self.personalInfo[i] = obj[i];
      }
    }
  },
  mounted: function () {
  	var self = this;
    
    this.$nextTick(function () {
      self.getPersonalInfo();
    });
  }
})