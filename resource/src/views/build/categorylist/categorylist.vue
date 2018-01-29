<template>
  <div class="m-list g-list-cls g-list-categ" v-if="list.length > 0">
    <div class="m-list-th">
      <span class="item th-item1">创建时间/人</span>
      <span class="item th-item2">资源类别</span>
      <span class="item th-item3">类别释义</span>
      <span class="item th-item4">资源二级属性标签</span>
      <span class="item th-item5">操作</span>
    </div>
    <ul class="m-list-con">
      <li v-for="(item, index) in list">
        <span class="item con-item1">{{item.createTime}}</span>
        <span class="item con-item2">{{item.name}}</span>
        <span class="item con-item3">{{item.remark}}</span>
        <span class="item con-item4 m-labels g-tc">
          <span v-for="label in item.childDictList">{{label.name}}</span>
        </span>
        <span class="item con-item5"><i class="icon i-edit1 g-ml20" v-if="authList.category && authList.category.edit && (item.name !== '习题' && hasEditAuth)" @click="edit(item)"></i></span>
      </li>
    </ul>

    <pages :class="{'f-static': list.length > 5}" :pages="pageInfo" @goto="gotoPage"></pages>

    <popup-box :popup-box-options="popBox" @confirm="save" @close="close">
      <edit-tmp slot="pop-body" :item-info="selectItem" @childEdited="childEdited"></edit-tmp>
    </popup-box>

  </div>
  <div class="m-norecord" v-else>
    无记录~~~
  </div>
</template>

<script>
//引入弹窗
import popupBox from '@/components/PopupBox'
//引入弹窗提示
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox)
//引入翻页
import pages from '@/components/GPages'
//引入编辑内容区
import editTmp from './categoryedit'

//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
    return {
      list: [],
      perPageCount: 10,
      pageInfo: '',
      popBox: {
        show: false
      },
      selectItem: '',
      editItem: '',
      changedData: {}, //编辑时需提交的数据
      hasEditAuth: this.authTempList.indexOf('RESOURCE_BUILD_CATEGORY_EDIT') !== -1
    };
  },
  components: {
    pages,
    popupBox,
    editTmp
  },
  methods: {
    //点“编辑”按钮进入编辑 弹窗
    edit: function (item) {
      var self = this;

      //若标签为空
      if (!item.childDictList) {
        item.childDictList = [];
      }
      this.selectItem = item;

      this.popBox = {
        show: true,
        hasCancelBtn: false,
        confirmTxt: '保存并关闭',
        title: '编辑资源类别'
      };
    },
    childEdited: function (item) {
      this.changedData = item;
    },
    //保存弹窗编辑内容
    save: function () {
      var self = this,
          item = self.changedData,
          childDictList = item.delLabels ? item.childDictList.concat(item.delLabels) : item.childDictList,
          params = {
            id: item.id,
            remark: item.remark,
            childDictList: childDictList
          };

      apiUrl.eidtResourceCategory(params).then(function (res) {
        console.log('ins:'+res);
        self.close();

        self.$myMsgBox({
          message: '<p><i class="icon-pop-succ"></i></p>\
                    <p class="g-mt20">资源类别信息已更新保存。</p>',
          confirmTxt: '关闭'
        });

        //TODO 更新列表中的项
        self.gotoPage(1);
        //self.selectItem.remark = item.remark;
        //self.selectItem.childDictList = item.childDictList;
      }, function (res) {
        self.$message.error(res.message);
        // setTimeout("window.location.href = 'categorylist.html';", 3000);
      });
    },
    close: function () {
      this.popBox.show = false;
      //关闭时 清除数据 
      this.selectItem = {
        name: '',
        remark: '',
        childDictList: []
      };
    },
    //
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
          params = {
            pageNo: p
          };

        apiUrl.getResourceCategoryList(params)
        .then(function (res) {
          var _result = res.data,
              totalRecordCount = _result.totalRecordCount,
              perPageCount = self.perPageCount,
              totalPage = Math.ceil(totalRecordCount / perPageCount);

          self.list = _result.dictList;

          self.pageInfo = {
            totalPage: totalPage,
            curPage: p
          };

          console.log('gogo:'+ p);
       }, function (res) {
          self.$message.error(res.message);
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
.g-list-categ .th-item1, .g-list-categ .con-item1 {
  width: 90px;
}
.g-list-categ .con-item1 {
  height: 32px;
  line-height: 16px;
  text-overflow: initial;
  white-space: inherit;
}
.g-list-categ .con-item1 {
  vertical-align: top;
}
.g-list-categ .th-item2, .g-list-categ .con-item2 {
  width: 110px;
}
.g-list-categ .th-item3, .g-list-categ .con-item3,
.g-list-categ .th-item4, .g-list-categ .con-item4 {
  width: 300px;
}
.g-list-categ .con-item2,
.g-list-categ .con-item3,
.g-list-categ .con-item4,
.g-list-categ .con-item5, {
  line-height: 32px;
}
</style>