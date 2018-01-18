<template>
	<div class="m-list g-list-acct" v-if="list.length > 0">
    <div class="m-list-th">
      <span class="item th-item1">创建时间</span>
      <span class="item th-item2">创建者</span>
      <span class="item th-item3">账号名称</span>
      <span class="item th-item4">账号角色</span>
      <!-- <span class="item th-item5">所属部门</span> -->
      <span class="item th-item5">所属职员</span>
      <span class="item th-item6">工号</span>
      <span class="item th-item7">联系电话</span>
      <span class="item th-item8">操作</span>
    </div>
    <ul class="m-list-con">
      <li v-for="(item, index) in list">
        <span class="item con-item1">{{item.createTime}}</span>
        <span class="item con-item2" :title="item.creatorName">{{item.creatorName}}</span>
        <span class="item con-item3">{{item.username}}</span>
        <span class="item con-item4">{{item.roleName}}</span>
        <span class="item con-item5">{{item.name}}</span>
        <span class="item con-item6">{{item.jobNumber}}</span>
        <span class="item con-item7">{{item.telephone}}</span>
        <span class="item con-item8">
        	<a :href=" 'editaccount.html?userId=' + item.id" title="账号编辑" v-if="authList.account && authList.account.edit" class="g-mr20"><i class="icon i-edit"></i></a>
        	<a :href=" 'configauthority.html?userId=' + item.id" title="权限配置" v-if="authList.authority && authList.authority.person" class="g-mr20"><i class="icon i-key"></i></a>
          <a title="冻结账号" @click.prevent="disableAccount(item.id)" v-if="accountEnabled && authList.account && authList.account.disable"><i class="icon i-lock"></i></a>
          <a title="解冻账号" @click.prevent="enableAccount(item.id)" v-if="!accountEnabled && authList.account && authList.account.active"><i class="icon i-locked"></i></a>
          </span>
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
//引入弹窗
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);

export default {
  data: function () {
    return {
      list: [],
      perPageCount: 10,
      pageInfo: {
        totalPage: 1,
        curPage: 1
      }
    };
  },
  props: ['accountEnabled'],
  components: {
    pages
  },
  watch: {
  	accountEnabled: {
  		handler: function () {
  			this.gotoPage(1);
  		}
  	}
  },
  methods: {
    //冻结账号
    disableAccount: function (id) {
      var self = this,
          params = id;

      apiUrl.disableAccount(params).then(function (res) {
        self.$myMsgBox({
          message: '<p><i class="icon-pop-succ"></i></p>\
                    <p>冻结成功，不再允许该账号登录平台。</p>',
          confirmTxt: '关闭窗口',
          callback: function () {
            //重新获取列表
            self.gotoPage(1);
          }
        });
      }, function (res) {
        console.log('disableAccount err:' + res.message);
      });
    },
    //解冻账号
    enableAccount: function (id) {
      var self = this,
          params = id;

      apiUrl.enableAccount(params).then(function (res) {
        self.$myMsgBox({
          message: '<p><i class="icon-pop-succ"></i></p>\
                    <p>启用成功，允许该账号登录平台。</p>',
          confirmTxt: '关闭窗口',
          callback: function () {
            //重新获取列表
            self.gotoPage(1);
          }
        });
      }, function (res) {
        console.log('enableAccount err:' + res.message);
      });
    },
    gotoPage: function (p) {
    	p = p || this.pageInfo.curPage;

      var self = this,
          params = {
            pageNo: p,
            pageSize: this.perPageCount
          };

      console.log('gotoPage:' + this.pageInfo.curPage);

      apiUrl.getAccountList({
	    	enabled: self.accountEnabled,
	    	pageNo: self.pageInfo.curPage
	    }).then(function (res) {
	    	var _result = res.data,
	    			totalRecordCount = _result.totalRecordCount,
            perPageCount = self.perPageCount,
            totalPage = Math.ceil(totalRecordCount / perPageCount);

	    	self.list = _result.userList;

        //更新有效账号/无效账号的个数
        self.$emit('list-updated', totalRecordCount);
  
	    	self.pageInfo = {
          totalPage: totalPage,
          curPage: p
        };

	    });
    }
  },
  mounted: function () {
    this.$nextTick(function () {
    	this.gotoPage(1);
  	});
  }
}
</script>

<style>
.g-list-acct .th-item1, .g-list-acct .con-item1 {
  width: 80px;
  padding-left: 25px;
  line-height: 16px;
  text-overflow: inherit;
  white-space: pre-wrap;
}
.g-list-acct .con-item1 {
  vertical-align: top;
}
.g-list-acct .th-item2,
.g-list-acct .con-item2 {
  /*line-height: 16px;*/
}
.g-list-acct .th-item2, .g-list-acct .con-item2,
.g-list-acct .th-item4, .g-list-acct .con-item4 {
  width: 105px;
}
.g-list-acct .th-item5, .g-list-acct .con-item5,
.g-list-acct .th-item6, .g-list-acct .con-item6,
.g-list-acct .th-item7, .g-list-acct .con-item7 {
  width: 120px;
}
.g-list-acct .th-item8, .g-list-acct .con-item8 {
  width: 120px;
}
</style>