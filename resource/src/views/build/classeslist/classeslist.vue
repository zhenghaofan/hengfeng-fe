<template>
	<div class="m-list g-list-cls" v-if="list.length > 0">
    <div class="m-list-th">
      <span class="item th-item1">类别</span>
      <span class="item th-item2">学段</span>
      <span class="item th-item3">年级</span>
      <span class="item th-item4">学科</span>
      <span class="item th-item5">学期</span>
      <span class="item th-item6">出版社</span>
      <span class="item th-item7">版本</span>
      <span class="item th-item8">书册</span>
      <span class="item th-item9">课本题名</span>
      <span class="item th-item10">教材命名</span>
      <span class="item th-item11">操作</span>
    </div>
    <ul class="m-list-con">
      <li v-for="(item, index) in list">
        <span class="item con-item1">{{GL_CONST.TEXTBOOKTYPE[item.textbookDictId]}}</span>
        <span class="item con-item2">{{item.learnStageName}}</span>
        <span class="item con-item3">{{item.gradeName}}</span>
        <span class="item con-item4">{{item.subjectName}}</span>
        <span class="item con-item5">{{GL_CONST.TERMOBJ[item.termDictId] || '-'}}</span>
        <span class="item con-item6">{{item.publisher}}</span>
        <span class="item con-item7">{{item.version || '-'}}</span>
        <span class="item con-item8">{{GL_CONST.VOLUMETYPE[item.volumeDictId]|| '-'}}</span>
        <span class="item con-item9">{{item.name}} {{item.subtitle}}</span>
        <span class="item con-item10">{{item.displayName}}</span>
        <span class="item con-item11" v-if="authList.textbook && authList.textbook.view">
          <i title="预览课本" class="icon i-prew" v-show="hasViewAuth" @click="preview(item)" v-bind:data-id="item.id"></i>
          <a :href="'editclasses.html?bookId='+item.id" v-show="hasEditAuth" title="编辑课本信息"><i class="icon i-edit1 g-ml20"></i></a>
        </span>
        </span>
      </li>
    </ul>
    <pages :class="{'f-static': list.length > 5}" :pages="pageInfo" @goto="gotoPage"></pages>

    <popup-box :popup-box-options="popBox" @close="close">
      <preview-tmp slot="pop-body" :book-id="bookId"></preview-tmp>
    </popup-box>
  </div>
  <div class="m-norecord" v-else>
    无记录~~~
  </div>
</template>

<script>
//引入弹窗
import popupBox from '@/components/PopupBox'
//引入翻页
import pages from '@/components/GPages'
//引入编辑内容区
import previewTmp from './preview'
//集成api
import apiUrl from '@/api/url.js'
//引入系统常量数据
import GL_CONST from '@/confdata/constant'

export default {
  data: function () {
    return {
      list: [],
      perPageCount: 10,
      pageInfo: '',
      popBox: {
        show: false
      },
      bookId: '',
      GL_CONST: GL_CONST,
      hasViewAuth: '',
      hasEditAuth: '',
    };
  },
  components: {
    pages,
    popupBox,
    previewTmp
  },
  props: ['requireInfo'],
  watch: {
    'requireInfo': {
      handler: function (val, oldVal) { 
        this.gotoPage(1);
      },
      deep: true
    }
  },
  methods: {
    //点“预览”按钮进入预览 弹窗
    preview: function (item) {
      var self = this;

      this.bookId = item.id;
      this.popBox = {
        show: true,
        hasConfirmBtn: false,
        cancelTxt: '关闭窗口',
        title: item.name
      };
    },
    //点“编辑”按钮进入编辑界面
    
    //关闭弹窗
    close: function () {
      this.popBox.show = false;
    },
    //跳至某一页
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
          params = this.requireInfo;

      if (params.publisher === '不限') {
        params.publisher = '';
      }
      
      params.pageNo = p;

      apiUrl.getTextbookList(params).then(function (res) {
        var _result = res.data,
            totalRecordCount = _result.totalRecordCount,//总记录数
            perPageCount = self.perPageCount,
            totalPage = Math.ceil(totalRecordCount / perPageCount);

        self.list = _result.textbookList;

        self.pageInfo = {
          totalPage: totalPage,
          curPage: p
        };
        
        console.log('gogo:'+ p);
      });
      self.hasViewAuth = self.authTempList.indexOf('RESOURCE_BUILD_TEXTBOOK_VIEW') !== -1;
      if(!self.hasViewAuth) {
        self.$message.error("对不起，你没有查看该资源的权限");
      }
      self.hasEditAuth = self.authTempList.indexOf('RESOURCE_BUILD_TEXTBOOK_EDIT') !== -1;
    }
  },
  mounted: function () {
    var self = this;
    this.$nextTick(function () {
      self.gotoPage(1);
    });
  }
}
</script>

<style>
.g-list-cls .m-list-con li {
  line-height: 32px;
}
</style>