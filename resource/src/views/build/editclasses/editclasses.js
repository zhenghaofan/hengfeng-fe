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
//引入系统常量数据
import GL_CONST from '@/confdata/constant.js'

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
    //最开始本书的课本基本数据
    textbook: {},
    //修改后保存的
    tmpTextbook: {
      tmpTermDictId: "",
      tmpVolumeDictId: "",
      learnStageChoice: [],
      tmpVersion: -1,
      tmpPublisher: "",
    },
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
    termOption: [{ label: '不限', value: '' },{ label: '上学期', value: 'LAST_TERM' },{ label: '下学期', value: 'NEXT_TERM' }],
    //册数所有选项
    VolumeOption: [{ label: '上册', value: 'LAST_VOLUME' },{ label: '下册', value: 'NEXT_VOLUME' },{ label: '全册', value: 'WHOLE_VOLUME' },{ label: '必修', value: 'REQUIRED' },{ label: '选修', value: 'ELECTIVE' }],
  //学期出版社所有选项
    publishers: [],
    versions: [],

    content: {},
    //常量
    GL_CONST: GL_CONST,
  },
  watch: {
    'bookId': {
      handler: function () {
        var self = this,
            params = self.bookId;
        self.bId = self.bookId;
        apiUrl.getTextbookPreview(params).then(function (res) {  
          console.log(res.data);       
          var _result = res.data;
          self.content = res.data;
          self.textbook = _result.textbook;
          self.init();
        });
      },
      deep: true
    },
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
      this.tmpTextbook.tmpTermDictId = this.textbook.termDictId || '';
      //册数
      this.tmpTextbook.tmpVolumeDictId = this.textbook.volumeDictId;
      //出版社版本
      this.tmpTextbook.tmpPublisher = this.textbook.publisher;
      this.tmpTextbook.tmpVersion = this.textbook.version;
      var self = this,
          params = { function: "PV" };
      apiUrl.getTextbookTypes(params).then(function(res) {
        console.log(res.data);
        self.publishers = res.data.publishers;
        self.versions = res.data.versions;
      }).catch(function(res) {
        self.$message.error("获取出版社及版本数据失败");
      });
    },
    //处理学段年级学科改变
    // handleChange: function () {
      // this.textbook.learnStage.name = this.tmpTextbook.learnStageChoice[0];
      // this.textbook.grade.name = this.tmpTextbook.learnStageChoice[1];
      // this.textbook.subject.name = this.tmpTextbook.learnStageChoice[2];
      // console.log(this.textbook.learnStage.name,this.textbook.grade.name,this.textbook.subject.name);
    // },
    // 判断输入是不是超过长度
    choicePublisher: function () {
      if(this.tmpTextbook.tmpPublisher.length > 32) {
        this.$message.error("出版社长度不能大于32");
        this.tmpTextbook.tmpPublisher = this.textbook.publisher;
      }
    },
    // 判断输入的是否是数字,以及输入是不是超过长度
    choiceVersion: function () {
      //是否超长
      if(this.tmpTextbook.tmpVersion < 1000 || this.tmpTextbook.tmpVersion > 3000) {
        this.$message.error("版本号只能输入数字且范围在1000到3000");
        this.tmpTextbook.tmpVersion = this.textbook.version;
      }
      //是否数字
      var re = /^\d+$/;
      if(!re.test(this.tmpTextbook.tmpVersion)) {
        this.$message.error("版本只能输入数字");
        this.tmpTextbook.tmpVersion = this.textbook.version;
      }
    },
    //判断教材命名是否为空
    isDisplayNameNone: function () {
      if(this.textbook.displayName === "") {
        return true;
      }
      return false;
    },
    //接收从子组件传来的树,再整合displayName传到后台
    getChildTree: function (treeList) {
      var self = this;
      if(self.isDisplayNameNone()) {
        self.$message.error("教材命名不能为空");
        return;
      }
      console.log(treeList);
      var termId = this.tmpTextbook.tmpTermDictId;
      // if(termId === '') {
      //   termId = "NULL";
      // }
      var params = {
        id: this.textbook.id,
        displayName: this.textbook.displayName,
        termDictId: termId,
        volumeDictId: this.tmpTextbook.tmpVolumeDictId,
        version: this.tmpTextbook.tmpVersion,
        publisher: this.tmpTextbook.tmpPublisher,
        textbookCatalogs: treeList,
      };
      console.log("传给后台的参数：");
      console.log(params);
      // return;
      apiUrl.getTextbookUpdate(params).then(function (res) {
        self.$message({
          message: '保存成功',
          type: 'success'
        });
        setTimeout("window.location.href = 'classeslist.html';", 3000);
      }).catch(function (res) {
        self.$message.error('编辑课本信息失败:' + res.message);
      });
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.bookId = utils.getUrlParams('bookId');
    });
  }
})