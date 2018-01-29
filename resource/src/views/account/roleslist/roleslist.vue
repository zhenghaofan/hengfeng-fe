<template>
  <div class="m-list g-list-roles" v-if="list.length > 0">
    <div class="m-list-th">
      <span class="item th-item1">创建时间</span>
      <span class="item th-item2">创建者</span>
      <span class="item th-item3">创建者角色</span>
      <span class="item th-item4">所建角色</span>
      <!-- <span class="item th-item5">所属部门</span> -->
      <span class="item th-item5">人数</span>
      <span class="item th-item6">职员名称</span>
      <span class="item th-item7">操作</span>
    </div>
    <ul class="m-list-con">
      <li v-for="(item, index) in list">
        <span class="item con-item1">{{item.createTime}}</span>
        <span class="item con-item2" :title="item.creatorName">{{item.creatorName}}</span>
        <span class="item con-item3" :title="item.creatorRoleName">{{item.creatorRoleName}}</span>
        <span class="item con-item4" :title="item.name">{{item.name}}</span>
        <span class="item con-item5">{{item.oweUserCount}}</span>
        <span class="item con-item6" :title="item.oweUserNameList"><span class="g-mr10" v-for="person in item.oweUserNameList">{{person}}</span></span>
        <span class="item con-item7">
          <a v-if="authList.authority && authList.authority.role && hasConfigAuth && hasEditAuth" title="角色权限配置" :href=" 'editrole.html?roleId=' + item.id" class="g-mr10"><i class="icon i-key"></i></a>
        </span>
      </li>
    </ul>
    <pages :class="{'f-static': list.length < 5}" :pages="pageInfo" @goto="gotoPage"></pages>
  </div>
  <div class="m-norecord" v-else>
    无记录~~~
  </div>
</template>
<script>
//引入翻页
import pages from '@/components/GPages'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
    return {
      list: [],
      perPageCount: 10,
      pageInfo: {
        totalPage: 1,
        curPage: 1
      },
      hasEditAuth: '',
    };
  },
  components: {
    pages
  },
  methods: {
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
          params = {
            pageNo: p
          };

      apiUrl.getRolesList(params).then(function (res) {
        var _result = res.data,
            totalRecordCount = _result.totalRecordCount,//总记录数
            perPageCount = self.perPageCount,
            totalPage = Math.ceil(totalRecordCount / perPageCount);

        self.list = _result.roleList;

        self.pageInfo = {
          totalPage: totalPage,
          curPage: p
        };
        
        self.$emit('set-roles-count', totalRecordCount);
        console.log('gogo:'+ p);

      }, function (res) {
        self.$message.error(res);
        console.log('getRolesList error:' + res.message);
      });
    }
  },
  mounted: function () {
    //是否有编辑权限
    this.hasEditAuth = this.authTempList.indexOf('ACCOUNT_ROLE_EDIT') !== -1;
    //是否有配置权限
    this.hasConfigAuth = this.authTempList.indexOf('ACCOUNT_AUTHORITY_ROLE') !== -1;
    var self = this;
    this.$nextTick(function () {
      self.gotoPage(1);
    });
  }
}
</script>
<style>
.txt-roles {
  margin-right: 20px;
  font-size: .7rem;
  color: #999;
}
.g-list-roles .m-list-th .item,
.g-list-roles .m-list-con .item {
  text-align: left;
}
.g-list-roles .th-item1,
.g-list-roles .con-item1 {
  width: 90px;
  padding-left: 30px;
  text-overflow: inherit;
  white-space: pre-wrap;
  line-height: 16px;
}
.g-list-roles .th-item2,
.g-list-roles .con-item2 {
  width: 160px;
}
.g-list-roles .th-item3,
.g-list-roles .con-item3,
.g-list-roles .th-item4,
.g-list-roles .con-item4 {
  width: 105px;
}
.g-list-roles .th-item5,
.g-list-roles .con-item5 {
  width: 60px;
}
.g-list-roles .th-item6,
.g-list-roles .con-item6 {
  width: 270px;
}
.g-list-roles .con-item7 {
  /*text-align: right;*/
}
</style>