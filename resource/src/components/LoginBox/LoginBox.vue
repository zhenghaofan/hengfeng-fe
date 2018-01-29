<template>
	<popup-box :popup-box-options="messageBox">
    <div slot="pop-body">
      <div class="g-form">
        <div class="control">
          <input class="ipt" type="text" @keyup="filterUserName" @keyup.enter="login" v-model="username" maxLength="16" placeholder="请输入您的账号" autocomplete="off">
        </div>
        <div class="control">
          <input class="ipt" type="password" @keyup="filterPwd" @keyup.enter="login" v-model="password" maxLength="8" placeholder="请输入您的密码" autocomplete="off">
        </div>
        <div class="control">
          <div class="tips"><div class="t-error" v-show="hasError">{{errorTips}}</div></div>
          <a href="#" @click.prevent="login" class="btn btn-green">{{loginText}}</a>
        </div>
      </div>
    </div>
  </popup-box>
</template>
<script>
import Vue from 'vue';
//集成api
import apiUrl from '@/api/url.js'

//引入弹窗
import PopupBox from '../PopupBox.vue'

export default {
    name: 'LoginBox',
    data: function () {
      return {
        //登录框的参数配置
        messageBox: {
          show: true,
          hasBtns: false,
          title: '重新登录',
          addCls: 'm-login'
        },
        //登录form
        username: '',
        password: '',
        hasError: false,
        errorTips: '',
        loginText: '登录',
        isLogining: false,
      };
    },
    props: ['show', 'returnPrevPage'],
    components: {
      PopupBox
    },
    methods: {
      //过滤用户名输入
      filterUserName() {
        this.hasError = false
        this.errorTips = '';

        //输入框只能输入字母和数字
        this.username = this.username.replace(/[^\w\.\/]/ig, '');
      },
      //过滤密码输入
      filterPwd() {
        //过滤空格
        this.password = this.password.replace(/\s+/g, '');

        this.hasError = false
        this.errorTips = '';
      },
      //清空数据
      clearData() {
        this.username = '';
        this.password = '';
        this.isLogining = false;
        this.errorTips = '';
        this.loginText = '登录';
        this.hasError = '';
      },
      //校验
      checkForm() {
        var username = this.username,
            password = this.password;

        if (!username || !password) {
          this.hasError = true;
          this.errorTips = '账号/密码不能为空';
          return false;
        }

        return true;
      },
      //登录
      login() {
        var self = this,
            params = {
              username: this.username,
              password: this.password,
            };

        if (this.isLogining) {
          return;
        }

        //先校验
        if (!this.checkForm()) {
          return;
        }

        this.isLogining = true;
        this.loginText = '登录中...';

        apiUrl.login(params).then(function (res) {
          self.isLogining = false;
          self.loginText = '登录';

          if (res && res.data) {
            var result = res.data,
                userInfo = result.user,
                passwordUpdated = userInfo.passwordUpdated;

            //储存用户名和密码
            localStorage.setItem('userId', userInfo.id);
            localStorage.setItem('userName', userInfo.name);
            localStorage.setItem('roleName', userInfo.roleName);
            //标记密码是否更新过
            localStorage.setItem('passwordUpdated', passwordUpdated);
            localStorage.setItem('authorityIds', JSON.stringify(result.authorityIds));
            //学段学科信息
            localStorage.setItem('subjectId', result.subjectId || '');
            localStorage.setItem('learnStageId', result.learnStageId || '');
          
            //如果是首次登录就需要修改密码
            if(!passwordUpdated){
              window.location.href = '/views/account/editpwd.html';
            } else if (self.returnPrevPage) {
            //返回
              self.messageBox.show = false;
              window.location.reload();
            } else {
              //关闭当前窗口，并清空登录框数据
              self.clearData();
              self.messageBox.show = false;
              window.location.reload();
            }
          }
        }, function (res) {
          self.isLogining = false;
          self.loginText = '登录';
          self.hasError = true;
          self.errorTips = res.message;
       });
      },
    }
  };
</script>
<style lang="less">
.m-login {
  .g-form {
    margin-top: 10px;
    .btn {
      width: 100%;
    }
    .tips {
      height: 14px;
      line-height: 14px;
    }
  }
  .ipt {
    width: 100%;
  }
}
</style>