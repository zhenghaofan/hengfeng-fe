<template>
	<div class="m-list g-list-knw" v-if="list.length > 0">
    <div class="m-list-th">
      <span class="item th-item1">学段</span>
      <span class="item th-item2">学科</span>
      <span class="item th-item3">名称</span>
      <span class="item th-item4">创建日期/人</span>
      <span class="item th-item5">最近整理/人</span>
      <span class="item th-item6">操作</span>
    </div>
    <ul class="m-list-con">
      <li v-for="(item, index) in list">
        <span class="item con-item1">{{item.learnStageName}}</span>
        <span class="item con-item2">{{item.subjectName}}</span>
        <span class="item con-item3">{{item.name}}</span>
        <span class="item con-item4">{{item.createTime|fixTime}}/{{item.creatorName}}</span>
        <span class="item con-item5">{{item.lastUpdateTime|| item.createTime|fixTime}}/{{item.lastUpdateUserName||item.creatorName}}</span>
        <span class="item con-item6">
        <i title="预览知识点树" class="icon i-prew g-ml20" v-if="authList.knowledge && authList.knowledge.view" @click="preview(item, 1)"></i>
        <a :href="'editknwlgtree.html?type=edit&knwId='+item.id" v-if="authList.knowledge && authList.knowledge.edit" title="编辑知识点树"><i class="icon i-edit g-ml20"></i></a>
        </span>
      </li>
    </ul>
    <pages :class="{'f-static': list.length < 5}" :pages="pageInfo" @goto="gotoPage"></pages>

    <popup-box :popup-box-options="popBox" @confirm="close" @close="edit">
      <preview-tmp slot="pop-body" :knwId="knwId"></preview-tmp>
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
//引入预览内容区
import previewTmp from './preview'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
    return {
      list: [],
      pageInfo: {
        totalPage: 1,
        curPage: 1
      },
      knwId: '',
      popBox: {},
      perPageCount: 10
    };
  },
  components: {
    pages,
    popupBox,
    previewTmp
  },
  filters: {
    fixTime: function (str) {
      return str.split(' ')[0];
    }
  },
  props: ['requireInfo', 'learnStageId', 'subjectId'],
  watch: {
    'requireInfo': {
      handler: function () {
        this.gotoPage(1);
      },
      deep: true
    }
  },
  methods: {
    //预览
    preview: function (item, type) {
      //编辑已有知识点
      this.knwId = item.id;
      this.popBox = {
        show: true,
        confirmTxt: '关闭窗口',
        hasCancelBtn: false,
        title: item.name
      };
    },
    //编辑
    edit: function () {
      //TODO去编辑页
      this.close();
    },
    //关闭窗口
    close: function () {
      this.popBox.show = false;
    },
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
          params = self.requireInfo;

      params.pageNo = p;

      apiUrl.getKnwlgtreeList(params)
      .then(function (res) {
        var _result = res.data,
            totalRecordCount = _result.totalRecordCount,
            perPageCount = self.perPageCount,
            totalPage = Math.ceil(totalRecordCount / 10);

        self.list = _result.knowledgePointList;

        self.pageInfo = {
          totalPage: totalPage,
          curPage: p
        };
        
        console.log('gogo:'+ p);

       });

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
.g-filters {
  position: relative;
}
.btn-newknw {
  position: absolute;
  right: 0;
  top: -5px;
}
.g-list-knw .m-list-con .item {
  /*padding-top: 8px;*/
  vertical-align: middle;
}
.g-list-knw .th-item1,
.g-list-knw .con-item1,
.g-list-knw .th-item2,
.g-list-knw .con-item2,
.g-list-knw .th-item6,
.g-list-knw .con-item6 {
  width: 110px;
}
.g-list-knw .th-item6,
.g-list-knw .con-item6 {
  text-align: right;
}
.g-list-knw .th-item3,
.g-list-knw .con-item3,
.g-list-knw .th-item4,
.g-list-knw .con-item4,
.g-list-knw .th-item5,
.g-list-knw .con-item5 {
  width: 180px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>