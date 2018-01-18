<template>
<div class="g-account-cont">
  <!-- 表单 -->
  <div class="g-form">
    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">角色名称</label>
        <div class="txts">
          <input type="text" class="ipt" @focus="clearErrorTips" placeholder="请输入角色名称" maxlength="10" v-model="userinfo.name" />
          <span class="imptat">*</span>
        </div>
      </div>
      <div class="control">
        <label class="label">上级角色</label>
        <div class="txts">
          <el-select class="select" @change="patternRoleAuth" v-model="parentRoleName" placeholder="请选择上级角色">
            <el-option
              v-for="item in higherRolesList"
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
    <a href="#" @click.prevent="create" class="btn btn-green" :class="{'btn-disabled': isCreating}">{{btnText}}</a>
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
      userinfo: {        
        id: '',
        name: '',
        parentId: '',
        authorityIdList: []
      },
      name: '',
      parentId: '',
      authorityIdList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      parentRoleName: '',
      //上级角色列表
      higherRolesList: [],
      //权限列表
      authorityList: [],
      //已选中的权限集合
      authoritySelectedIdList: [],
      isFirstTime: true,
      hasError: false,
      isCreating: false,
      errorTips: '必填项请填写完整',
      btnText: '确认创建'
    };
  },
  methods: {
    //清除错误提示
    clearErrorTips: function () {
      this.hasError = false;
      this.errorTips = '';
    },
  	//获取角色列表
    getRoles: function () {
      var self = this;

      apiUrl.getRoles().then(function (res) {
        var _result = res.data;

        if (_result && _result.roleList.length > 0) {
          //获取上级
          self.higherRolesList = _result.roleList; 
        }
      }, function (res) {
        console.log('err:' + res);
      });
    },
    //区配角色权限
    patternRoleAuth: function (selectedId) {
      this.clearErrorTips();
      
      var self = this,
          params = {
            //roleId: self.id,//新增时还没有roleId，不需要传
            parentId: selectedId
          };

      apiUrl.patternRoleAuth(params).then(function (res) {
        var _result = res.data,
            authorityList;

        if (_result) {
          self.authorityList = _result.authorityList;
          self.authoritySelectedIdList = _result.authoritySelectedIdList;
          self.userinfo.parentId = selectedId;
        }
      }, function (res) {
       console.log('patternRoleAuth err:' + res.message);
      });
    },
    //创建账号
    create: function () {
      var self = this,
          params = {
            parentId: this.userinfo.parentId,
            name: this.userinfo.name,
            authorityIdList: self.$refs.tree.getCheckedKeys(true)
          },
          checkMap = {
            name: ['requried,roleName', '角色名不能为空'],
            parentId: ['requried', '请选择上级角色'],           
            authorityIdList: ['notEptArr', '权限不能为空']
          };

      this.name = params.name;
      this.parentId = params.parentId;
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

      this.isCreating = true;
      this.btnText = '创建中...';
      this.hasError = false;

      apiUrl.createRole(params).then(function (res) {
        self.isCreating = false;
        self.btnText = '确认创建';

        self.$myMsgBox({
          message: '<p><i class="icon-pop-roleadd"></i></p>\
                    <p class="g-mt20">恭喜，角色添加成功。</p>',
          confirmTxt: '返回列表',
          callback: function () {
            //返回列表
            window.location.href = 'roleslist.html';
          }
        });

      }, function (res) {
        console.log('createRole err:' + res.message);
        self.hasError = true;
        self.errorTips = res.message;
        self.isCreating = false;
        self.btnText = '确认创建';
      });
      
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
    var self = this;

    this.$nextTick(function () {
      self.id = self._userInfo.id;
      self.getRoles();
    });
  }
}
</script>

<style>
</style>