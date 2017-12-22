import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//引入尾部
import gFooter from '@/components/GFooter'
//引入内容区
import grouptypelist from './grouptypelist.vue'
import groupcreate from './groupcreate.vue'
import groupedit from './groupedit.vue'
//集成api
import apiUrl from '@/api/url.js'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
import store from '@/store/'

import utils from '@/utils/'

new Vue({
  el: '.g-app',
  store,
  components: {
  	gHeader,
  	gLeftbar,
  	grouptypelist,
    groupcreate,
    groupedit,
  	gFooter,
  },
  data: {
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.account,
      curMenuIndex: 1
    },
    headerSel: 'nav-account',
    currentView: 'grouptypelist',
    editViewData: ''
  },
  methods: {
    toggleList(templateName) {
      this.currentView = templateName;
    },
    showGroupEdit(data) {
      this.currentView = 'groupedit';
      this.editViewData = data;
    },
    showGroupList() {
      this.currentView = 'grouptypelist';
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      if (utils.getUrlParams('type') === 'create') {
        this.currentView = 'groupcreate';
      }
    });
  },
})
