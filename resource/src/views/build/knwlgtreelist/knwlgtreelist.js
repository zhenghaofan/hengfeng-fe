import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'
//引入列表
import list from './knwlgtreelist.vue'
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
    headerSel: 'nav-build',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.build,
      curMenuId: 'lb-knwlgtree',
    },
    requireInfo: {
      learnStageId: '',
      subjectId: ''
    },
    //学段
    learnStageList: [],
    //学科
    subjectList: [],
    tmpSubjectList: [],
    //权限
    hasPageAuth: '',
    hasAddAuth: '',
  },
  methods: {
    //检测权限
    checkAuth: function () {
      //知识点
      if (this.authList.knowledge) {
        this.hasPageAuth = true;
        //获取学段信息
        this.getLearnStageList();
      } else {
        //无权限，返回首页
        window.location.href = this.baseUrl + '/views/home.html';
      }
      this.hasPageAuth = this.authTempList.indexOf('RESOURCE_BUILD_KNOWLEDGE_POINT_VIEW') !== -1;
      if(!this.hasPageAuth) {
        this.$message.error("对不起，你没有查看该资源的权限");
      }
      this.hasAddAuth = this.authTempList.indexOf('RESOURCE_BUILD_KNOWLEDGE_POINT_ADD') !== -1;

      // console.log("查看：" + this.hasPageAuth);
      // console.log("新增：" + this.hasAddAuth);
      // this.hasEditAuth = this.authTempList.indexOf('RESOURCE_BUILD_KNOWLEDGE_POINT_EDIT') !== -1;
      // console.log("编辑：" + this.hasEditAuth);
    },
    //获取学段信息
    getLearnStageList: function (index) {
      var self = this,
          params = {
            function: 'SELECT'
          };

      apiUrl.getKnwlgSubjectOptions(params).then(function (res) {
        var _data = res.data,
            learnStageList = _data.learnStageList,//学段
            subjectList = _data.subjectList;//学科

        self.learnStageList = learnStageList;
        self.learnStageList.push({
          id: '',
          name: '不限'
        });
        //self.subjectList = subjectList;
        self.tmpSubjectList = subjectList;
        self.requireInfo.learnStageId = '';
        self.requireInfo.subjectId = '';
      });
    },
    //获取学科信息
    getSubjectList: function () {
      var list = this.tmpSubjectList;
      this.subjectList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].learnStageId === this.requireInfo.learnStageId) {
          this.subjectList.push(list[i]);
        }
      }
      this.subjectList.push({
        id: '',
        name: '不限'
      });
      this.requireInfo.subjectId = '';
    },
  },
  mounted: function () {
  	this.$nextTick(function () {

  	});
  }
})