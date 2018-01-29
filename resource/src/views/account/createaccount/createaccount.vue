<template>
<div class="g-account-cont">
  <!-- 表单 -->
  <div class="g-form">
    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">账号角色</label>
        <div class="txts">
          <el-select class="select" :class="{'select-newrole': hasAddAuth}" v-model="roleId" placeholder="请选择新增账号角色"  @change="clearErrorTips">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <a href="createrole.html" v-if="hasAddAuth" class="btn btn-green btn-m g-ml15">新增</a>
          <span class="imptat">*</span>
        </div>
      </div>
      <div class="control">
        <label class="label">登录账号</label>
        <div class="txts">
          <input type="text" disabled="disabled" class="ipt ipt-disabled" placeholder="输入员工姓名系统自动生成" v-model="accountname" />
          <span class="imptat">*</span>
        </div>
      </div>
    </div>

    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">姓名</label>
        <div class="txts">
          <input type="text" class="ipt" @focus="clearErrorTips" @blur="changeToPinyin" placeholder="请输入员工姓名" maxlength="4" v-model.trim.lazy="name" />
          <span class="imptat">*</span>
        </div>
      </div>
      <div class="control">
        <label class="label">账号密码</label>
        <div class="txts">
          <input type="text" class="ipt ipt-disabled" disabled="disabled" placeholder="123456" />
        </div>
      </div>
    </div>

    <div class="col2 f-clearfix">
      <div class="control">
        <label class="label">工号</label>
        <div class="txts">
          <input type="text" maxlength="10" @focus="clearErrorTips" @blur="nameRepeat" class="ipt" placeholder="请输入工号" v-model.trim="jobNumber" />
          <span class="imptat">*</span>
        </div>
      </div>
      <div class="control">
        <label class="label">直接上级</label>
        <div class="txts">
          <el-select class="select" v-model="parentId" @change="getHignRoleName" placeholder="请选择直接上级">
            <el-option
              v-for="item in highRoleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="imptat">*</span>
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
          <input type="text" class="ipt ipt-disabled" disabled="disabled" placeholder="选择直接上级系统生成" v-model="highRoleName" />
        </div>
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
//引入弹窗
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);
//表单校验
import validator from '@/components/Validator.js'
Vue.use(validator);
//拼音转换
//import pinyin from 'pinyin'
import Pinyin from '@/components/Pinyin.js'
Vue.use(Pinyin)
//集成api
import apiUrl from '@/api/url.js'


export default {
  data: function () {
    return {
      name: '',
      accountname: '',
      jobNumber: '',
      telephone: '',
      roleId: '',
      roleList: [],
      parentId: '',
      highRoleList: [],
      highRoleName: '',
      hasError: false,
      isCreating: false,
      btnText: '确认创建',
      errorTips: '必填项请填写完整', 
      //查重要用
      flag: false,
    	tmpAccountname: '',
    	hasAddAuth: this.authTempList.indexOf('ACCOUNT_ROLE_ADD') !== -1,       
    };
  },
  methods: {
    //清除错误提示
    clearErrorTips: function () {
      this.hasError = false;
      this.errorTips = '';
    },
    //获取角色，账号管理员之类的
    getRoles: function () {
      var self = this;

      apiUrl.getRoles().then(function (res) {
        var _result = res.data;

        if (_result && _result.roleList.length > 0) {
          self.roleList = _result.roleList;
        }
      }, function (res) {
        console.log('getRoles err:' + res);
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
        console.log('getHighRoleList err:' + res);
      });
    },
    //汉字转拼音
    changeToPinyin: function () {
      // var accountname = pinyin(this.name, {
      //   style: pinyin.STYLE_NORMAL
      // });
      // this.accountname = accountname.join('');
      this.accountname = this.$pinyin(this.name);
      this.tmpAccountname = this.accountname;
      //如果改名字的时候已经输入过工号了，那还是要查一查重，看要不要加
      if(this.jobNumber) {
        this.nameRepeat();
      }
    },
    //名字查重
    nameRepeat: function () {
      var self = this,
          params = { enabled: true };
      self.flag = false;
      self.accountname = self.tmpAccountname;
      apiUrl.getAccountList(params).then(function(res) {
        //查重的时候要遍历所有用户，但用户列表在后台是分好页的，只能通过返回所有记录再计算有多少页,暂时后台是十页 
        var totalRecord = res.data.totalRecordCount,
            totalPage = 0,
            perPage = 10;
        totalPage = Math.round(totalRecord / perPage);
        if(totalRecord % perPage !== 0) {
          totalPage++;
        }
        for(var i = 1; i <= totalPage; i++) {
          self.getAllUserList(i);
        }
      });
    },
    //获取单页的用户列表用户列表
    getAllUserList: function(i) {
      var self = this,
          params = {
            enabled: true,
            pageNo: i
          };
      apiUrl.getAccountList(params).then(function(res) {
        var userList = res.data.userList,
            j = 0;
        for(j in userList) {
          if(userList[j].name === self.name && !self.flag) {
            self.flag = true;
            var jobNumberStr = self.jobNumber + "";
            self.accountname += jobNumberStr;
            break;
          }
        }
      });
    },
    //获取上级角色名
    getHignRoleName: function () {
      var list = this.highRoleList,
          id = this.parentId;
      for (var i in list) {
        if (list[i].id === id) {
          this.highRoleName = list[i].roleName;
        }
      }
    },
    //创建账号
    create: function () {
      var self = this,
          params = {
            roleId: this.roleId,
            name: this.name,
            jobNumber: this.jobNumber,
            telephone: this.telephone,
            parentId: this.parentId,
          },
          checkMap = {
            roleId: ['requried', '请选择角色'],
            name: ['requried,name', '姓名不能为空'],
            jobNumber: ['requried,jobNumber', '工号不能为空'],
            parentId: ['requried', '请选择直接上级'],
            telephone: ['requried,phone', '联系电话不能为空']
          };

      //校验不通过
      if (!this.$validator(checkMap, this).test) {
      //if (!this.checkForm(params)) {
        //提示
        this.hasError = true;
        this.errorTips = this.$validator(checkMap, this).tips || '必填项请填写完整';
        return false;
      }

      this.isCreating = true;
      this.btnText = '创建中...';
      this.hasError = false;

      apiUrl.createAccount(params).then(function (res) {
        self.isCreating = false;
        self.btnText = '确认创建';

        self.$myMsgBox({
          message: '<p><i class="icon-pop-acctcrt"></i></p>\
                    <p class="g-mt20">恭喜，账号创建成功。</p>\
                    <p class="g-mt10 g-tl">如果需要进行账号个体权限调整，可去往权限配置。</p>',
          confirmTxt: '返回列表',
          cancelTxt: '权限配置',
          hasCancelBtn: true,
          cancelCallback: function () {
            //权限配置
            window.location.href = 'configauthority.html?userId=' + res.data;
          },
          callback: function () {
            //返回列表
            window.location.href = 'accountlist.html';
          }
        });

      }, function (res) {
        console.log('createAccount err:' + res.message);
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
        if (checkObj[item] === '') {
          return false;
        }
      }

      return true;
    }
  },
  mounted: function () {
    var self = this;

    this.$nextTick(function () {
      //获取角色列表
      self.getRoles();

      //获取上级用户
      self.getHighUsers();
    });
  }
}
</script>

<style>
.g-form .select-newrole,
.g-form .select-newrole .u-select-name,
.g-form .select-newrole .u-select-list {
  width: 200px;
}
</style>