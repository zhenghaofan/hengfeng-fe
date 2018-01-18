<template>
<div class="g-account-cont">
  <!-- 表单 -->
  <div class="g-form">
    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">角色名称</label>
        <div class="txts">
          <input type="text" class="ipt" @focus="clearErrorTips" placeholder="请输入角色名称" maxlength="10" v-model="name" />
          <span class="imptat">*</span>
        </div>
      </div>
      <div class="control">
        <label class="label">上级角色</label>
        <div class="txts">
          <el-select class="select" @change="patternRoleAuth" v-model="parentId" placeholder="请选择上级角色">
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
    <a href="#" @click.prevent="save" class="btn btn-green" :class="{'btn-disabled': isSaving}">{{btnText}}</a>
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
      id: '',
      name: '',
      roleId: '',
      parentId: '',
      parentRoleName: '',
      authorityIdList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },     
      //上级角色列表
      higherRolesList: [],
      //权限列表
      authorityList: [],
      //已选中的权限集合
      authoritySelectedIdList: [],
      tmpSelectedIdList: [],
      errorTips: '必填项请填写完整',
      isFirstTime: true,
      hasError: false,
      isSaving: false,
      btnText: '更新保存'
    };
  },
  components: {
    //singleSelect
  },
  methods: {
    //清除错误提示
    clearErrorTips: function () {
      this.hasError = false;
      this.errorTips = '';
    },
  	//获取角色信息
  	getRoleInfo: function () {
  		var self = this,
  				params = self.roleId;

  		apiUrl.getRoleInfo(params).then(function (res) {
  			var _result = res.data,
            _userInfo = res.data.role;

        self.id = _userInfo.id;
        self.name = _userInfo.name;

        //初始化上级角色下拉列表
        self.parentId = _userInfo.parentId;
        self.parentRoleName = _userInfo.parentRoleName;
        //获取上级角色
        self.getHighRoles();

        //初始化权限设定
        self.authorityList = _result.authorityList;
        self.authoritySelectedIdList = _result.authoritySelectedIdList;
        self.tmpSelectedIdList = self.authoritySelectedIdList;
        self.$refs.tree.setCheckedNodes(self.authoritySelectedIdList);
	      //获取权限列表
	      //self.getRoleAuth();
  		}, function (res) {
  			console.log('getRoleInfo err:' + res.message);
  		});
  	},
    //获取上级角色
    getHighRoles: function () {
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
    //匹配角色权限
    patternRoleAuth: function (selectedId) {
      this.clearErrorTips();
      
      //已选中的上级角色id 第一次载入时不修改
      if (this.isFirstTime) {            
        this.isFirstTime = false;
        return;
      }

      var self = this,
          params = {
            roleId: self.roleId,
            parentId: selectedId
          };

      apiUrl.patternRoleAuth(params).then(function (res) {
        var _result = res.data,
            authorityList;

        if (_result && _result.authorityList) {
          self.authorityList = _result.authorityList;
          self.authoritySelectedIdList = _result.authoritySelectedIdList;
          self.$refs.tree.setCheckedNodes(self.authoritySelectedIdList);
          self.tmpSelectedIdList = self.authoritySelectedIdList;
          self.parentId = selectedId;
        }
      }, function (res) {
       console.log('getRoleAuth err:' + res.message);
      });
    },
    //提交编辑
    save: function () {
      var self = this,
          params = {
            parentId: this.parentId,
            id: this.roleId,
            name: this.name,
            authorityIdList: self.$refs.tree.getCheckedKeys()
          },
          checkMap = {
            name: ['requried,roleName', '请选择角色名称'],
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

      //权限设定值有变
      if (!this.isArrayQue(this.authorityIdList, this.tmpSelectedIdList)) {
        this.showMessageBox();
      } else {
        this.submitEdit();
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
    //
    submitEdit: function () {
      var self = this,
          params = {
            parentId: this.parentId,
            id: this.roleId,
            name: this.name,
            authorityIdList: self.$refs.tree.getCheckedKeys()
          };

      this.isSaving = true;
      this.btnText = '更新保存中...';
      this.hasError = false;

      apiUrl.editRole(params).then(function (res) {
        self.isSaving = false;
        self.btnText = '更新保存';

        self.$myMsgBox({
          message: '<p><i class="icon-pop-roleupt"></i></p>\
                    <p class="g-mt20">恭喜，角色修改成功。</p>',
          confirmTxt: '返回列表',
          callback: function () {
            //返回列表
            window.location.href = 'roleslist.html';
          }
        });
        
      }, function (res) {
        console.log('editAccount err:' + res.message);
        self.hasError = true;
        self.errorTips = res.message;
        self.isSaving = false;
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
        if (checkObj[item] == '') {
          return false;
        }
      }

      return true;
    },
    //显示提示窗
    showMessageBox: function () {
      var self = this;

      self.$myMsgBox({
        title: '系统提示',
        message: '<p><i class="icon-pop-impt"></i></p>\
                  <p>系统检测到了角色权限修改，将影响该角色下的全部用户配置，您确认吗？</p>',
        confirmTxt: '确认变更',
        cancelTxt: '我再想想',
        hasCancelBtn: true,
        callback: function () {
          //返回列表
          self.submitEdit();
        }
      });
    }
  },
  mounted: function () {
    var self = this,
        roleId = util.getUrlParams('roleId');

    this.$nextTick(function () {
    	if (roleId) {
        self.roleId = roleId;

        //获取角色信息
  			self.getRoleInfo();
      } else {
        console.log('未拿到用户ID');
      }

    });
  }
}
</script>

<style>
</style>