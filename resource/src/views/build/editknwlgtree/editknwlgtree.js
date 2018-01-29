import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'
//引入树
import editTree from './tree.vue'
//集成api
import apiUrl from '@/api/url.js'

import utils from '@/utils/'

new Vue({
  el: '.g-app',
  components: {
    gHeader,
    gLeftbar,
    editTree,
    gFooter
  },
  data: {
    headerSel: 'nav-build',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.build,
      curMenuId: 'lb-knwlgtree',
    },
    //页面权限
    hasPageAuth: false,
    //面包屑二级名称
    tabName: '新建知识点树',

    //类型
    type: 'add',
    //知识点树ID
    knwId: '',

    //所有学科学段
    learnStageList: [],
    subjectList: [],
    //type=edit的时候用到
    editLearnStageName: '',
    editSubjectName: '',

    //type=add的时候用到
    addSubjectList: [], //这个是副本，用来保存原始的subjectList
    addLearnStageName: '',
    addSubjectName: '',
    addLearnStageId: '',
    addSubjectId: '',
   
    //用来接收子组件的树
    content: {
      knowledgePointCatalogList: []
    },
    hasError: false,
    errorTips: '必填项不能为空!'
  },
  computed: {
    tree_json: function(){
      return JSON.stringify(this.rootNode);
    }
  },
  methods: {
    //检测权限
    checkAuth: function () {
      if(this.type === 'add'){
        //新增知识点
        if (this.authList.knowledge.add) {
          this.hasPageAuth = true;
          //获取学段信息
          this.getLearnStageList();
        } else {
          //无权限，返回首页
          window.location.href = this.baseUrl + '/views/home.html';
        }
      }
      if(this.type === 'edit'){
        //编辑知识点
        if (this.authList.knowledge.edit) {
          this.hasPageAuth = true;
          //获取学段信息
          this.getLearnStageList();
        } else {
          //无权限，返回首页
          window.location.href = this.baseUrl + '/views/home.html';
        }
      }
    },

    //初始化，获取学段信息
    getLearnStageList: function (index) {
      var self = this,
          params = {
            function: 'ADD'
          };
      apiUrl.getKnwlgSubjectOptions(params).then(function (res) {
        var _data = res.data;
        self.learnStageList = _data.learnStageList;
        self.subjectList = _data.subjectList;
        self.addSubjectList = _data.subjectList;

        //知识树为编辑的时候
        if(self.type === "edit") {
          var params = self.knwId;
          apiUrl.getKnwlgtreePreview(params).then(function (res) {
            var _data = res.data; 
            self.editLearnStageName = _data.knowledgePoint.learnStageName;
            self.editSubjectName = _data.knowledgePoint.subjectName;
          });
        }
      });
    },
    //type=="add"：点击下拉框获取学科信息
    getSubjectList: function (val1, val2) {
      //因为重选的话subjectList已经被覆盖了，要重新赋原始值
      this.subjectList = this.addSubjectList;

      var learnStageList = this.learnStageList;
      for (var j = 0; j < learnStageList.length; j++) {
        if (learnStageList[j].id === this.addLearnStageId) {
          this.addLearnStageName = learnStageList[j].name;
          break;
        }
      }

      var list = this.subjectList;
      this.subjectList = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].learnStageId === this.addLearnStageId) {
          this.subjectList.push(list[i]);
        }
      }
      this.addSubjectId = '';
      this.addSubjectName = '';
    },
    //type=="add"：点击下拉框获取学科名字
    getSubjectName: function () {
      if (this.addLearnStageId && this.addSubjectId) {
        var list = this.subjectList;
        for (var i = 0; i < list.length; i++) {
          if (list[i].id === this.addSubjectId) {
            this.addSubjectName = list[i].name;
            break;
          }
        }
      }
    },
    
    //接收从子组件传来的树
    getChildTree: function (treeList) {
      this.content.knowledgePointCatalogList = treeList;
      console.log("拿到了:");
      console.log(treeList);
      this.save();
    },
    //保存
    save: function () {
      var self = this,
          treeList = self.content.knowledgePointCatalogList;
      //新建知识点树保存
      if(this.type === 'add') {
        var self = this,
          params = {
            learnStageId: self.addLearnStageId,
            subjectId: self.addSubjectId,
            name: "",
            knowledgePointCatalogList: treeList,
          };
        if (!self.addLearnStageId || !self.addSubjectId) {
          self.errorTips = '请选择对应的学段/学科';
          self.hasError = true;
          return;
        }
        self.errorTips = '';
        self.hasError = false;
        apiUrl.addKnwlgtree(params).then(function (res) {
          self.$message({
            message: '新建知识点树成功',
            type: 'success'
          });
          setTimeout("window.location.href = 'knwlgtreelist.html';", 3000);
        }).catch(function (res) {
          self.errorTips = res.message;
          self.hasError = true;
          self.$message.error('新建知识点树失败:' + res.message);
          self.getLearnStageList();
        });
      }
      //编辑知识点树保存
      if(this.type === 'edit') {
        var self = this,
          params = {
            id: self.knwId,
            knowledgePointCatalogList: treeList
          };
        apiUrl.updateKnwlgtree(params).then(function (res) {
          self.$message({
            message: '编辑知识点树成功',
            type: 'success'
          });
          setTimeout("window.location.href = 'knwlgtreelist.html';", 3000);
        }).catch(function (res) {
          self.errorTips = res.message;
          self.hasError = true;
          self.$message.error('编辑知识点树失败:' + res.message);

          setTimeout("window.location.href = 'editknwlgtree.html?type=edit&knwId=' + " + self.knwId + ";", 2000);
        })
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.type = utils.getUrlParams('type') || this.type;
      this.knwId = utils.getUrlParams('knwId');
      if (this.type !== 'add') {
        this.tabName = '编辑知识点树';
      }
    });
  }
})