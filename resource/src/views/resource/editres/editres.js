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
import edit from './editres.vue'
//引入工具类
import util from '@/utils/index.js'

new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
  	edit,
  	gFooter,
  },
  data: {
    headerSel: 'nav-resource',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.resource,
      curMenuId: 'lb-myunaudited',
    },
    //默认返回"正在候审"列表
    backUrl: 'myunaudited.html',
    //二级返回地址
    backSubTabUrl: '',
    //默认一级名
    tabName: '正在候审',
    //二级
    subTabName: '资源编辑',
    //三级
    thirTabName: '',
  },
  methods: {
    resetRenderData: function () {
      //重新配置左边栏选中
      var status = util.getUrlParams('status');

      if (status === 'myrejected') {
      //我的资源－需要复核
        this.leftbarData.curMenuId = 'lb-myrejected';
        this.backUrl = 'myrejected.html';
        this.tabName = '需要复核';
      } else if (status === 'myunaudited') {
      //我的资源－正在候审
        this.leftbarData.curMenuId = 'lb-myunaudited';
        this.backUrl = 'myunaudited.html';
        this.tabName = '正在候审';
      } else if (status === 'unauited') {
      //资源审核-待审资源
        this.leftbarData.curMenuId = 'lb-auditres';
        this.backUrl = 'auditres.html';
        this.backSubTabUrl = 'auditres.html';
        this.tabName = '资源审核';
        this.subTabName = '待审资源';
        this.thirTabName = '资源编辑';
      } else if (status === 'rejected') {
      //资源审核-我退回的
        this.leftbarData.curMenuId = 'lb-auditres';
        this.backUrl = 'auditres.html';
        this.backSubTabUrl = 'auditres.html?waitEnabled=false';
        this.tabName = '资源审核';
        this.subTabName = '我退回的';
        this.thirTabName = '资源编辑';
      } else if (status === 'temp') {
      //暂存资源
        this.leftbarData.curMenuId = 'lb-tempres';
        this.backUrl = 'tempres.html';
        this.tabName = '暂存资源';
      }/* else {
      //默认为"正在候审"
        this.leftbarData.curMenuId = 'lb-myunaudited';
        this.backUrl = 'myunaudited.html';
        this.tabName = '正在候审';
      }*/
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.resetRenderData();
    });   
  }
});