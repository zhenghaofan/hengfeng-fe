<template>
<div class="g-account-cont">
  <!-- 表单 -->
  <div class="g-form">
    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">角色名称</label>
        <div class="txts">
          <input type="text" class="ipt ipt-disabled" disabled="disabled" v-model="roleName" />
        </div>
      </div>
      <div class="control">
        <label class="label">上级名称</label>
        <div class="txts">
          <el-select class="select" v-model="parentId" placeholder="请选择上级角色">
            <el-option
              v-for="item in higherUesersList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="imptat">*</span>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="control">
        <label class="label g-vertop">账号持有</label>
        <div class="txts">
          <input type="text" class="ipt ipt-disabled" disabled="disabled" v-model="name" />
        </div>
      </div>
    </div>

    <div class="col">
      <div class="control">
        <label class="label g-vertop">权限设定</label>
        <div class="g-form-tree">
          <el-tree
            :data="authorityList"
            show-checkbox
            node-key="id"
            :default-checked-keys="authoritySelectedIdList"
            :props="defaultProps" ref="tree">
          </el-tree>
        </div>
        <span class="imptat">*</span>

      </div>
    </div>

  </div>
  <!-- 表单/ -->

  <!-- 提交及错误提示 -->
  <div class="g-account-submit">
    <p class="g-mb10 t-error" v-show="hasError">*{{errorTips}}</p>
    <a href="#" @click.prevent="edit" class="btn btn-green" :class="{'btn-disabled': isSaving}">{{btnText}}</a>
  </div>
</div>
</template>

<script>
//引入弹窗提示
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox)
//表单校验
import validator from '@/components/Validator.js'
Vue.use(validator)
import util from '@/utils/index.js'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      id: '',
      roleId: '',
      name: '',
      roleName: '',
      parentId: '',
      tmpParentId: '',
      //上级用户列表
      higherUesersList: [],
      //权限列表
      authorityList: [],
      //已选中的权限集合
      authoritySelectedIdList: [],
      authorityIdList: [],
      tmpSelList: [],
      isFirstTime: true,
      hasError: false,
      errorTips: '必填项请填写完整',
      isSaving: false,
      btnText: '更新保存'
    };
  },
  methods: {
    //获取当前用户角色
    getCurUserInfo: function () {
      var self = this,
          params = self.id;

      apiUrl.getAuthorityInfo(params).then(function (res) {
        var _result = res.data,
            user = _result.user;
        self.name = user.name;
        self.roleName = user.roleName;
        self.roleId = user.roleId;
        self.parentId = user.parentId;
        self.tmpParentId = user.parentId;

        self.authorityList = _result.authorityList;
        self.authoritySelectedIdList = _result.authoritySelectedIdList;
        self.tmpSelList = _result.authoritySelectedIdList;
        //获取上级用户信息
        self.getUsers();
      });
      
    },
    //获取上级用户信息
    getUsers: function () {
      var self = this;

      apiUrl.getUsers().then(function (res) {
        var _result = res.data;

        if (_result && _result.userList.length > 0) {
          //获取上级
          self.higherUesersList = _result.userList; 
        }
      }, function (res) {
        console.log('err:' + res);
      });
    },
    //匹配角色权限
    getRoleAuth: function (selectedId) {
      var self = this,
          params = {
            roleId: self.roleId,
            parentId: self.parentId
          };

      apiUrl.patternRoleAuth(params).then(function (res) {
        var _result = res.data,
            authorityList;
        if (_result && _result.authorityList) {
          self.authorityList = _result.authorityList;

          //已选中的上级角色id 第一次载入时不修改
          if (!self.isFirstTime) {            
            self.parentId = selectedId;
          }

          self.isFirstTime = false;
           
        }
      }, function (res) {
       console.log('getRoleAuth err:' + res.message);
      });
    },
    //修改配置
    edit: function () {
      var self = this,
          params = {
            parentId: this.parentId,
            id: this.id,
            authorityIdList: self.$refs.tree.getCheckedKeys()
          },
          checkMap = {
            parentId: ['requried', '请选择上级角色'],           
            authorityIdList: ['notEptArr', '请选择权限设定']
          };

      this.authorityIdList = params.authorityIdList;

      //校验不通过
      if (!this.$validator(checkMap, this).test) {
      //if (!this.checkForm(params)) {
        //提示
        this.hasError = true;
        this.errorTips = this.$validator(checkMap, this).tips || '必填项请填写完整';
        //this.errorTips = '必填项请填写完整';
        return false;
      }

      _callBack();
      
      function _callBack() {
        self.isSaving = true;
        self.btnText = '更新中...';
        self.hasError = false;

        apiUrl.configauth(params).then(function (res) {
          self.isSaving = false;
          self.btnText = '更新保存';
          
          self.$myMsgBox({
            confirmTxt: '返回列表',
            message: '<p><i class="icon-pop-auth"></i></p><p class="g-mt20">权限更新保存成功！</p>',
            callback: function () {
              window.location.href = 'accountlist.html';
            }
          });

        }, function (res) {
          console.log('configAuth err:' + res.message);
          self.hasError = true;
          self.errorTips = res.message;
          self.isSaving = false;
          self.btnText = '更新保存';
        });
      }
      
      
    },
    //数组相等
    isArrayQue: function (a1, a2) {
      if (a1.length !== a2.length) {
        return false;
      }
      for (var i = 0, len = a1.length; i < len; i++) {
        if (a2.indexOf(a1[i]) === -1) {
          return false;
        }
      }
      return true;
    },
    //校验
    checkForm: function (checkObj) {
      if (!checkObj) {
        return false;
      }

      //简单校验不为空
      for (var item in checkObj) {
        if (checkObj[item] == '') {
          return false;
        }
      }

      return true;
    }
  },
  mounted: function () {
    var self = this,
        userId = util.getUrlParams('userId');

    this.$nextTick(function () {
      if (userId) {
        self.id = userId;
        //获取当前用户信息
        self.getCurUserInfo();
        
      } else {
        console.log('未拿到用户ID');
      }

    });
  }
}
</script>

<style>
</style>