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
import resdetail from './resdetail.vue'
//引入工具类
import util from '@/utils/index.js' 
new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
  	resdetail,
  	gFooter
  },
  data: {
    headerSel: 'nav-resource',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.resource,
      //默认选中"可用资源"
      curMenuId: 'lb-avaire',
    },
    //默认返回可用列表
    backUrl: 'auditres.html',
    //默认一级名
    tabName: '可用资源',
    //二级
    subTabName: '资源查看'
  },
  methods: {
    resetRenderData: function () {
      //重新配置左边栏选中
      var status = util.getUrlParams('status');

      if (status === 'myin') {
      //我的资源－已经入库
        this.leftbarData.curMenuId = 'lb-myresin';
        this.backUrl = 'myresin.html';
        this.tabName = '已经入库';
      } else if (status === 'myoff') {
      //我的资源－已下架的
        this.leftbarData.curMenuId = 'lb-myresoff';
        this.backUrl = 'myresoff.html';
        this.tabName = '已下架的';
      } else if (status === 'myunaudited') {
      //我的资源－正在候审
        this.leftbarData.curMenuId = 'lb-myunaudited';
        this.backUrl = 'myunaudited.html';
        this.tabName = '正在候审';
      } else if (status === 'myrejected') {
      //我的资源－需要复核
        this.leftbarData.curMenuId = 'lb-myrejected';
        this.backUrl = 'myrejected.html';
        this.tabName = '需要复核';
      } else if (status === 'off') {
      //下架资源
        this.leftbarData.curMenuId = 'lb-offres';
        this.backUrl = 'offres.html';
        this.tabName = '下架资源';
      } else if (status ==='unauited'|| status ==='rejected') {
      //审核资源
      	this.leftbarData.curMenuId = 'lb-auditres';
      	this.backUrl = 'auditres.html';
        //我退回的
        if (status ==='rejected') {
          this.backUrl = 'auditres.html?waitEnabled=false';
        }
      	this.tabName = '资源审核';
      } else if (status ==='waithandler'|| status ==='errorlog') {
      //报错处理
        this.leftbarData.curMenuId = 'lb-errorres';
        this.backUrl = 'errorres.html';
        //处理记录
        if (status ==='errorlog') {
          this.backUrl = 'errorres.html?waitEnabled=false';
          this.tabName = '处理记录';
          this.subTabName = '处理详情';
        } else {
          this.tabName = '等待处理';
          this.subTabName = '资源详情';
        }
        
      } else if (status === 'temp') {
      //暂存资源
        this.leftbarData.curMenuId = 'lb-tempres';
        this.backUrl = 'tempres.html';
        this.tabName = '暂存资源';
      }  else {
      //默认为"可用资源"
        this.leftbarData.curMenuId = 'lb-avaire';
        this.backUrl = 'avairesource.html';
        this.tabName = '可用资源';
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.resetRenderData();
    });   
  }
});