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
import list from './classeslist.vue'
//集成api
import apiUrl from '@/api/url.js'

//引入系统常量数据
import GL_CONST from '@/confdata/constant'

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
      curMenuId: 'lb-classes',
    },
    hasPageAuth: false,
    //筛选字段名
    requireInfo: {
      textbookDictId: '',
      learnStageId: '',
      gradeId: '',
      subjectId: '',
      termDictId: '',
      publisher: ''
    },
    //类别
    textbookDictList: [],
    //学段
    learnStageList: [],
    //年级
    gradeList: [],
    tmpGradeList: [],
    //学科
    subjectList: [],
    tmpSubjectList: [],
    //学期
    termList: [],
    //出版社
    publisherList: [],
    tmpPublisherList: [],
    IsPopupShow: false,
    info: ''
  },
  methods: {
    //检测权限
    checkAuth: function () {
      //课本
      if (this.authList.textbook) {
        this.hasPageAuth = true;
        //获取类别下拉信息
        this.getTextbook();
      } else {
        //无权限，返回首页
        window.location.href = this.baseUrl + '/views/home.html';
      }

    },
    //获取类别下拉信息
    getTextbook: function () {
      var self = this;

      self.textbookDictList = [];

      apiUrl.getTextbookTypes({
        function: 'CATEGORY'
      }).then(function (res) {
        var list;
        if (res && res.data) {
          list = res.data;
          for (var i = 0, len = list.length; i < len; i++) {
            self.textbookDictList.push({
              id: list[i],
              name: GL_CONST.TEXTBOOKTYPE[list[i]],
            });
          }
          self.textbookDictList.push({
            id: '',
            name: '不限'
          });
        }
        //self.textbookDictList = res.data.textbookDictList;//
        
      });
    },

    //获取学段信息
    getLearnStageList: function (index) {
      var self = this,
          params = {
            function: 'K12',
            textbookDictId: this.requireInfo.textbookDictId
          };

      apiUrl.getTextbookTypes(params).then(function (res) {
        var _data = res.data,
            learnStageList = _data.learnStageList,//学段
            gradeList = _data.gradeList,//年级
            subjectList = _data.subjectList;//学科

        self.learnStageList = learnStageList;
        self.learnStageList.push({
          id: '',
          name: '不限'
        });
        self.tmpGradeList = gradeList;
        self.tmpSubjectList = subjectList;
        //重置学段信息
        self.resetLearnStageInfo();
        //重置学期出版社信息
        self.resetTermInfo();
      });
    },
    //重置学段信息
    resetLearnStageInfo: function () {
      this.requireInfo.learnStageId = '';
      this.gradeList = [];
      this.requireInfo.gradeId = '';
      this.subjectList = [];
      this.requireInfo.subjectId = '';
    },
    //获取年级信息
    getGradeList: function () {
      var list = this.tmpGradeList;
      this.gradeList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].learnStageId === this.requireInfo.learnStageId) {
          this.gradeList.push(list[i]);
        }
      }
      this.gradeList.push({
        id: '',
        name: '不限'
      });
      this.requireInfo.gradeId = '';
      this.requireInfo.subjectId = '';
      //重置学期出版社信息
      this.resetTermInfo(); 
    },
    //获取学科信息
    getSubjectList: function () {
      var list = this.tmpSubjectList;
      this.subjectList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].gradeId === this.requireInfo.gradeId) {
          this.subjectList.push(list[i]);
        }
      }
      this.subjectList.push({
        id: '',
        name: '不限'
      });
      this.requireInfo.subjectId = '';
      //重置学期出版社信息
      this.resetTermInfo();    
    },





    //获取学期
    getTermList: function () {
      if (!this.requireInfo.textbookDictId || !this.requireInfo.gradeId || !this.requireInfo.subjectId) {
        return;
      }

      var self = this,
          params = {
            function: 'TERM_PUBLISHER',
            textbookDictId: this.requireInfo.textbookDictId,
            gradeId: this.requireInfo.gradeId,
            subjectId: this.requireInfo.subjectId
          };

      self.termList = [];

      //获取学期出版社
      apiUrl.getTextbookTypes(params).then(function (res) {
        /*self.termList = res.data.termList;
        self.termList.push({
          id: '',
          name: '不限',
          publisherList: []
        });*/
        var list, item;
        if (res && res.data) {
          list = res.data;
          for (var i = 0, len = list.length; i < len; i++) {
            item = list[i];
            self.termList.push({
              id: item.id,
              name: GL_CONST.TERMOBJ[item.id],
              publisherList: item.publisherList,
            });
            self.tmpPublisherList.push({
              id: item.id,
              name: GL_CONST.TERMOBJ[item.id],
              publisherList: item.publisherList,
            });
          }
          self.termList.push({
            id: '',
            name: '不限',
            publisherList: [],
          });
        }
        //self.tmpPublisherList = self.termList;

        self.requireInfo.termDictId = '';
        //重置出版社信息
        self.requireInfo.publisher = '';
        self.publisherList = [];
      });
        
    },
    //获取出版社
    getPublisherList: function () {
      var list = this.tmpPublisherList;
      this.publisherList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === this.requireInfo.termDictId) {
          this.publisherList = list[i].publisherList;
        }
      }
      if (this.publisherList.indexOf('不限') === -1) {
        this.publisherList.push('不限');
      }
      //重置出版社信息
      this.requireInfo.publisher = '';
    },
    //重置学期出版社信息
    resetTermInfo: function () {
      this.requireInfo.termDictId = '';
      this.termList = [];
      this.requireInfo.publisher = '';
      this.publisherList = [];
    }
  }
})