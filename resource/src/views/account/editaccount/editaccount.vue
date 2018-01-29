<template>
<div class="g-account-cont">
  <!-- 表单 -->
  <div class="g-form">
    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">账号角色</label>
        <div class="txts">
          <el-select class="select" v-model="roleId" @change="clearErrorTips" placeholder="请选择账号角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="control">
        <label class="label">登录账号</label>
        <div class="txts">
          <input type="text" disabled="disabled" class="ipt ipt-disabled" v-model="username" />
        </div>
      </div>
    </div>

    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">姓名</label>
        <div class="txts">
          <input type="text" class="ipt ipt-disabled" disabled="disabled" v-model="name" />
        </div>
      </div>
      <div class="control">
        <label class="label">账号密码</label>
        <div class="txts">
          <input type="password" disabled="disabled" class="ipt ipt-disabled ipt-eidt" value="123456" />
          <a href="#" @click.prevent="resetPwd" class="btn btn-green btn-m g-ml15">重置密码</a>
        </div>
      </div>
    </div>

    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">工号</label>
        <div class="txts">
          <input type="text" disabled="disabled" class="ipt ipt-disabled" v-model="jobNumber" />
        </div>
      </div>
      <div class="control">
        <label class="label">直接上级</label>
        <div class="txts">
          <el-select class="select" v-model="parentId" @change="getParentRoleName" placeholder="请选择直接上级">
            <el-option
              v-for="item in highRoleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">联系电话</label>
        <div class="txts">
          <input type="text" class="ipt" @focus="clearErrorTips" placeholder="请输入联系电话" v-model.trim="telephone" maxlength="13" />
          <span class="imptat">*</span>
        </div>
      </div>
      <div class="control">
        <label class="label">上级角色</label>
        <div class="txts">
          <input type="text" class="ipt ipt-disabled" disabled="disabled" placeholder="选择直接上级系统生成" v-model="parentRoleName" />
        </div>
      </div>
    </div>
  </div>
  <!-- 表单/ -->

  <!-- 提交及错误提示 -->
  <div class="g-account-submit">
    <p class="g-mb10 t-error" v-show="hasError">*{{errorTips}}</p>
    <a href="#" @click.prevent="updateAccount" class="btn btn-green" :class="{'btn-disabled': isCreating}">{{btnText}}</a>
  </div>
</div>
</template>

<script>
//引入下拉框组件
import singleSelect from '@/components/SingleSelect.vue'
//引入弹窗提示
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);
//表单校验
import validator from '@/components/Validator.js'
Vue.use(validator)
import util from '@/utils/index.js'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
    return {
      id: '',
      name: '',
      username: '',
      jobNumber: '',
      telephone: '',
      roleId: '',
      tmpRoleId: '',
      parentId: '',
      parentRoleName: '',
      hasError: false,
      isCreating: false,
      btnText: '更新保存',
      pwdUpdated: false,
      errorTips: '必填项请填写完整',
      roleList: [],
      highRoleList: [],
    };
  },
  components: {
    singleSelect
  },
  methods:{
    //获取上级角色名
    getParentRoleName() {
      var list = this.highRoleList;
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === this.parentId) {
          this.parentRoleName = list[i].roleName;
          break;
        }
      }
      
    },
    //清除错误提示
    clearErrorTips: function () {
      this.hasError = false;
      this.errorTips = '';
    },
    //获取角色
    getRoles: function () {
      var self = this;

      apiUrl.getRoles().then(function (res) {
        var _result = res.data;

        if (_result && _result.roleList.length > 0) {
          self.roleList = _result.roleList;
        }
      }, function (res) {
        console.log('err:' + res);
      });
    },
    //获取上级用户
    getHighUsers: function () {
      var self = this;

      apiUrl.getUsers().then(function (res) {
        var _result = res.data;

        if (_result && _result.userList.length > 0) {
          self.highRoleList = _result.userList;
        }
      }, function (res) {
        console.log('err:' + res);
      });
    },
    //获取当前用户信息
    getUserInfo (userId) {
      var self = this,
          params = userId;

      apiUrl.getUserInfo(params).then(function (res) {
        var _result = res.data,
            _user;
        if (_result && _result.user) {
          _user = _result.user;

          for (var item in _user) {
            if (self[item] !== undefined) {
              self[item] = _user[item];
            }
          }
          //保存原有值
          self.tmpRoleId = _user.roleId;

          //获取角色列表
          self.getRoles();

          //获取上级
          self.getHighUsers();
        }
      }, function (res) {
        console.log('err: ---getUserId----' + res);
      });
    },
    //重置密码
    resetPwd: function () {
      var self = this;
      this.pwdUpdated = false;
      
      this.$myMsgBox({
        hasCancelBtn: true,
        message: '<p><i class="icon-pop-pwd"></i></p><p class="g-mt20">是否要更改账号密码为初始密码？</p>',
        callback: function () {
          self.pwdUpdated = true;
          self.updateAccount(1);
        }
      });
    },
    //更新
    updateAccount (resetPwd) {
      var self = this,
          params = {
            id: self.id,
            roleId: self.roleId,
            telephone: self.telephone,
            parentId: self.parentId,
            passwordUpdated: self.pwdUpdated
          },
          checkMap = {
            roleId: ['requried', '请选择账号角色'],
            parentId: ['requried', '请选择直接上级'],           
            telephone: ['requried,phone', '请输入联系电话']
          };

      if (!this.$validator(checkMap, this).test) {
      //if (!self.checkForm(params)) {
        self.hasError = true;
        this.errorTips = this.$validator(checkMap, this).tips || '必填项请填写完整';
        //this.errorTips = '必填项请填写完整';
        return false;
      }

      self.isCreating = true;
      self.btnText = '提交中...';
      self.hasError = false;

      apiUrl.updateAccount(params).then(function (res) {
        self.isCreating = false;
        self.btnText = '更新保存';

        //单独重置密码时
        if (resetPwd === 1) {
          self.$myMsgBox({
            message: '<p><i class="icon-pop-pwdreset"></i></p><p class="g-mt20">账号密码已恢复初始状态。</p>',
            confirmTxt: '关闭窗口'
          });
        } else {
          //有修改过用户角色
          if (self.tmpRoleId !== self.roleId) {
            self.$myMsgBox({
              message: '<p><i class="icon-pop-uptsuc"></i></p><p class="g-mt20">用户角色已更新，建议重新核对权限配置。</p>',
              hasCancelBtn: true,
              cancelTxt: '返回列表',
              cancelCallback: function () {
                window.location.href = 'accountlist.html';
              },
              confirmTxt: '查看权限',
              callback: function () {
                //权限配置
                window.location.href = 'configauthority.html?userId=' + self.id;
              }
            });
          } else {
            self.$myMsgBox({
              message: '<p><i class="icon-pop-uptsuc"></i></p><p class="g-mt20">账号信息修改成功。</p>',
              callback: function () {
                window.location.href = 'accountlist.html';
              }
            });
          }
        }
      }, function (res) {
        console.log('updateAccount err:' + res.message);
        self.hasError = true;
        self.errorTips = res.message;
        self.isCreating = false;
        self.btnText = '更新保存';
      });

    },
    //校验
    checkForm: function (checkObj) {
      if (!checkObj) {
        return false;
      }

      //简单校验不为空
      for (var item in checkObj) {
        if (checkObj[item] === '') {
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
        self.getUserInfo(userId);
      } else {
        console.log('未拿到用户ID');
      }
    });
  }
}
</script>

<style>
.g-form .ipt-eidt {
  width: 172px;
}
</style>