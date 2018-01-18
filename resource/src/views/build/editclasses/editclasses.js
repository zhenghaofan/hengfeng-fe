import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'
//集成api
import apiUrl from '@/api/url.js'
//引入树
import editTree from './tree.vue'

//引入弹窗
import popupBox from '@/components/PopupBox'
//引入弹窗提示
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox)

//能解析域名的东西？
import utils from '@/utils/'

new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
    editTree,
  	gFooter,
    popupBox,
    MyMsgBox
  },
  data: {
    //头部高亮设置
    headerSel: 'nav-build',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.build,
      curMenuId: 'lb-classes',
    },
    //页面权限
    hasPageAuth: false,

    //从域名抓出来的id
    bookId: "",
    //给树提供的id
    bId: "",
    //本书的课本基本数据，修改后的也都存在这里面了
    textbook: {},
    //用来中途统计的，修改好后都会存进textbook
    tmpTextbook: {
      tmpTermDictId: "",
      tmpVolumeDictId: "",
      learnStageChoice: []
    },
  //所有选项
    //学段/年级/学科所有选项
    learnStageOption: [
      {
        label: '小学',
        value: '小学',
        children: [{
          value: '一年级',
          label: '一年级',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' }]
        },{
          value: '二年级',
          label: '二年级',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' }]
        },{
          value: '三年级',
          label: '三年级',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' }]
        },{
          value: '四年级',
          label: '四年级',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' }]
        },{
          value: '五年级',
          label: '五年级',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' }]
        },{
          value: '六年级',
          label: '六年级',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' }]
        }]
      },
      {
        label:'初中',value: '初中',
        children: [{
          label:'初一',value: '初一',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' },{ label:'政治',value: '政治' },{ label:'历史',value: '历史' },{ label:'地理',value: '地理' },{ label:'物理',value: '物理' },{ label:'化学',value: '化学' },{ label:'生物',value: '生物' }]
        },{
          label:'初二',value: '初二',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' },{ label:'政治',value: '政治' },{ label:'历史',value: '历史' },{ label:'地理',value: '地理' },{ label:'物理',value: '物理' },{ label:'化学',value: '化学' },{ label:'生物',value: '生物' }]
        },{
          label:'初三',value: '初三',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' },{ label:'政治',value: '政治' },{ label:'历史',value: '历史' },{ label:'地理',value: '地理' },{ label:'物理',value: '物理' },{ label:'化学',value: '化学' },{ label:'生物',value: '生物' }]
        }]
      },
      {  
        label:'高中',value: '高中',
        children: [{
          label:'高一',value: '高一',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' },{ label:'政治',value: '政治' },{ label:'历史',value: '历史' },{ label:'地理',value: '地理' },{ label:'物理',value: '物理' },{ label:'化学',value: '化学' },{ label:'生物',value: '生物' }]
        },{
          label:'高二',value: '高二',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' },{ label:'政治',value: '政治' },{ label:'历史',value: '历史' },{ label:'地理',value: '地理' },{ label:'物理',value: '物理' },{ label:'化学',value: '化学' },{ label:'生物',value: '生物' }]
        },{
          label:'高三',value: '高三',
          children: [{ label:'语文',value: '语文' },{ label:'数学',value: '数学' },{ label:'英语',value: '英语' },{ label:'政治',value: '政治' },{ label:'历史',value: '历史' },{ label:'地理',value: '地理' },{ label:'物理',value: '物理' },{ label:'化学',value: '化学' },{ label:'生物',value: '生物' }]
        }]
      }
    ],
    //学期所有选项
    termOption: [{ value: '上学期' },{ value: '下学期' }],
    //册数所有选项
    VolumeOption: [{ value: '上册' },{ value: '下册' },{ value: '全册' },{ value: '必修' },{ value: '选修' }],
  //
    popBox: {},
    content: {},
  },
  watch: {
    'bookId': {
      handler: function () {
        var self = this,
            params = self.bookId;
        self.bId = self.bookId;
        apiUrl.getTextbookPreview(params).then(function (res) {         
          var _result = res.data;
          self.content = res.data;
          self.textbook = _result.textbook;
          self.init();
        });
      },
      deep: true
    },
    // 'tmpTextbook.tmpTermDictId': function(val) {
    //   if(val == "上学期") {
    //     this.textbook.termDictId = "LAST_TERM";
    //   }
    //   if(val == "下学期") {
    //     this.textbook.termDictId = "NEXT_TERM";
    //   }
    //   console.log(this.textbook.termDictId);
    // },
    // 'tmpTextbook.tmpVolumeDictId': function(val) {
    //   if(val == "上册") {
    //     this.textbook.VolumeDictId = "LAST_VOLUME";
    //   }
    //   if(val == "下册") {
    //     this.textbook.VolumeDictId = "NEXT_VOLUME";
    //   }
    //   if(val == "全册") {
    //     this.textbook.VolumeDictId = "WHOLE_VOLUME";
    //   }
    //   if(val == "必修") {
    //     this.textbook.VolumeDictId = "REQUIRED";
    //   }
    //   if(val == "选修") {
    //     this.textbook.VolumeDictId = "ELECTIVE";
    //   }
    //   console.log(this.textbook.VolumeDictId);
    // },
  },
  methods: {
    //检测权限
    checkAuth: function () {
      //课本
      if (this.authList.textbook) {
        this.hasPageAuth = true;
      } else {
        //无权限，返回首页
        window.location.href = this.baseUrl + '/views/home.html';
      }
    },
    //初始化数据
    init: function () {
      //学段年级学科
      this.tmpTextbook.learnStageChoice.push(this.textbook.learnStage.name);
      this.tmpTextbook.learnStageChoice.push(this.textbook.grade.name);
      this.tmpTextbook.learnStageChoice.push(this.textbook.subject.name);
      //学期
      if(this.textbook.termDictId == "LAST_TERM") {
        this.tmpTextbook.tmpTermDictId = "上学期";
      }
      if(this.textbook.termDictId == "NEXT_TERM") {
        this.tmpTextbook.tmpTermDictId = "下学期";
      }
      //册数
      if(this.textbook.volumeDictId == "LAST_VOLUME") {
        this.tmpTextbook.tmpVolumeDictId = "上册";
      }
      if(this.textbook.volumeDictId == "NEXT_VOLUME") {
        this.tmpTextbook.tmpVolumeDictId = "下册";
      }
      if(this.textbook.volumeDictId == "WHOLE_VOLUME") {
        this.tmpTextbook.tmpVolumeDictId = "全册";
      }
      if(this.textbook.volumeDictId == "REQUIRED") {
        this.tmpTextbook.tmpVolumeDictId = "必修";
      }
      if(this.textbook.volumeDictId == "ELECTIVE") {
        this.tmpTextbook.tmpVolumeDictId = "选修";
      }
    },
    //处理学段年级学科改变
    handleChange: function () {
      // this.textbook.learnStage.name = this.tmpTextbook.learnStageChoice[0];
      // this.textbook.grade.name = this.tmpTextbook.learnStageChoice[1];
      // this.textbook.subject.name = this.tmpTextbook.learnStageChoice[2];
      // console.log(this.textbook.learnStage.name,this.textbook.grade.name,this.textbook.subject.name);
    },
    //预览
    preview: function () {
      var list = this.rootNode.children;
      this.content.knowledgePointCatalogList = list;
      this.content.point = {
        learnStageName: this.requireInfo.learnStageId,
        subjectName: this.requireInfo.learnStageId,
        name: this.rootNode.name,
        firstLevelCount: this.rootNode.children.length,
        secondLevelCount: this.rootNode.children.length,
        thirdLevelCount: this.rootNode.children.length
      };
      this.popBox = {
        show: true,
        confirmTxt: '保存知识点',
        cancelTxt: '返回编辑',
        title: '知识树预览'
      };
    },
    //接收从子组件传来的树,再整合displayName传到后台
    getChildTree: function (treeList) {
      var self = this;
      console.log(treeList);
      var params = {
        id: this.textbook.id,
        displayName: this.textbook.displayName,
        textbookCatalogs: treeList
      };
      apiUrl.getTextbookUpdate(params).then(function (res) {
        self.$message({
          message: '保存成功',
          type: 'success'
        });
        setTimeout("window.location.href = 'classeslist.html';", 3000);
      }).catch(function (res) {
        self.$message.error('editclasses err:' + res.message);
      });
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.bookId = utils.getUrlParams('bookId');
    });
  }
})