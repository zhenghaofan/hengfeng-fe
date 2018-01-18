<template>
  <div class="g-hd">
    <div class="g-wrap">
      <h1 class="m-logo"><a href="/views/home.html">恒峰</a></h1>
      <div class="g-topbar">
        <ul class="m-menu f-clearfix">
          <li :class="{'z-selected': selClass == 'nav-home'}"><a href="/views/home.html">首页</a></li>
          <!-- 若有 资源管理 -->
          <template v-if="authTempList.indexOf('RESOURCE_MANAGE') !== -1">
            <!-- 若有 可用资源 权限 -->
            <template v-if="authTempList.indexOf('RESOURCE_AVAILABLE') !== -1">
              <li :class="{'z-selected': selClass == 'nav-resource'}"><a :href="baseUrl + '/views/resource/avairesource.html' ">资源管理</a></li>
            </template>
            <!-- 若无可用资源 权限 -->
            <template v-else>
              <li :class="{'z-selected': selClass == 'nav-resource'}"><a :href="baseUrl + '/views/resource/myresin.html' ">资源管理</a></li>
            </template>
          </template>
          <!-- 若有 建设管理-->
          <template v-if="authTempList.indexOf('RESOURCE_PROPERTY_BUILD_MANAGE') !== -1">
            <!-- 若有知识点 -->
            <li :class="{'z-selected': selClass == 'nav-build'}" v-if="authList.knowledge"><a :href="baseUrl + '/views/build/knwlgtreelist.html' ">建设管理</a></li>
            <!-- 若有课本 -->
            <li :class="{'z-selected': selClass == 'nav-build'}" v-else-if="authList.textbook"><a :href="baseUrl + '/views/build/classeslist.html' ">建设管理</a></li>
            <!-- 若有资源类型 -->
            <li :class="{'z-selected': selClass == 'nav-build'}" v-else-if="authList.category"><a :href="baseUrl + '/views/build/categorylist.html' ">建设管理</a></li>
          </template>
          <!-- 若有 账号查看 权限 -->
          <template v-if="authList.account && authList.account.view">
            <li :class="{'z-selected': selClass == 'nav-account'}"><a :href="baseUrl + '/views/account/accountlist.html' ">账号管理</a></li>
          </template>
          <!-- 若无 账号查看 权限 -->
          <template v-else>
            <li :class="{'z-selected': selClass == 'nav-account'}"><a :href="baseUrl + '/views/account/personaldata.html' ">账号管理</a></li>
          </template>
          <!-- <li :class="{'z-selected': selClass == 3}"><a href="#">教务管理</a></li> -->
        </ul>
        <div class="txt-welcome"><i class="icon i-user g-mr10"></i>欢迎回来，{{userName}}({{roleName}})<a @click.prevent="logout" href="#" class="g-ml10">退出</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
//请求集成
import apiUrl from '@/api/url.js'
//引入弹窗
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);

//引入element组件 start (整体引入会出错　后面再解决)
import ElementUI from 'element-ui'
import '../../static/css/elem-theme-diy/index.css'
Vue.use(ElementUI)

//设置全局baseUrl
Vue.prototype.baseUrl = '';//http://192.168.13.238:8080
//个人信息
Vue.prototype._userInfo = {
  id: localStorage.getItem('userId'),
  userName: localStorage.getItem('userName'),
  roleName: localStorage.getItem('roleName')
};
//权限列表
Vue.prototype.authTempList = JSON.parse(localStorage.getItem('authorityIds'));
Vue.prototype.authList = {
  /* 账号 */
  account: null,
  role: null,
  authority: null,
  /* 资源属性 */
  textbook: null,
  category: null,
  knowledge: null
};
export default {
  data: function () {
    return {
      userName: '',
      roleName: '',
      baseUrl: this.baseUrl
    }
  },
  props: ['selClass'], //选中效果 0为第一个，1为第二个，依次类推
  methods: {
    //检测是否登录
    checkLogin: function () {
      var self = this;
      //获取个人信息
      apiUrl.getPersonalInfo().then(function (res) {
        var _result = res.data;
        if (_result && _result.user) {
          self._userInfo = _result.user;
          self.userName = self._userInfo.name;
          self.roleName = self._userInfo.roleName;

          sessionStorage.setItem('userId', self._userInfo.id);
          sessionStorage.setItem('userName', self.userName);
          sessionStorage.setItem('roleName',self.roleName);

          //设置导航权限
          self.setAuthorityList();
        } else {
          self.$MyMsgBox({
            message: '您尚未登录或登录已过期，请重新登录',
            confirmTxt: '去登录页重新登录',
            hasCloseBtn: false,
            callback: function () {
              //登录页
              window.location.href = '/views/login.html';
            }
          });
        }
      }, function (res) {
        console.log('获取登录信息出错');
        self.$MyMsgBox({
          message: '您尚未登录或登录已过期，请重新登录',
          confirmTxt: '去登录页重新登录',
          hasCloseBtn: false,
          callback: function () {
            //登录页
            window.location.href = '/views/login.html';
          }
        });
      });
    },
    //设置权限
    setAuthorityList: function () {
      var list = this.authTempList,
          authIds = {
            /* 课本 */
            textbookAuthId: 'RESOURCE_BUILD_TEXTBOOK',
            textbook: {
              //查看
              view: 'RESOURCE_BUILD_TEXTBOOK_VIEW'
            },
            /* 资源类别 */
            categoryAuthId: 'RESOURCE_BUILD_CATEGORY',
            category: {
              //查看
              view: 'RESOURCE_BUILD_CATEGORY_VIEW',
              //编辑
              edit: 'RESOURCE_BUILD_CATEGORY_EDIT'
            },
            /* 知识点 */
            knowledgeAuthId: 'RESOURCE_BUILD_KNOWLEDGE_POINT',
            knowledge: {
              //添加
              add: 'RESOURCE_BUILD_KNOWLEDGE_POINT_ADD',
              //查看
              view: 'RESOURCE_BUILD_KNOWLEDGE_POINT_VIEW',
              //编辑
              edit: 'RESOURCE_BUILD_KNOWLEDGE_POINT_EDIT'
            },
            /* 账号 */
            accountAuthId: 'ACCOUNT',
            account: {
              //查看
              view: 'ACCOUNT_VIEW',
              //添加
              add: 'ACCOUNT_ADD',
              //编辑
              edit: 'ACCOUNT_EDIT',
              //启用
              active: 'ACCOUNT_ACTIVE',
              //禁用
              disable: 'ACCOUNT_DISABLE'
            },
            /* 角色 */
            roleAuthId: 'ACCOUNT_ROLE',
            role: {
              //查看
              view: 'ACCOUNT_ROLE_VIEW',
              //添加
              add: 'ACCOUNT_ROLE_ADD',
              //编辑
              edit: 'ACCOUNT_ROLE_EDIT'
            },
            /* 权限 */
            authorityAuthId: 'ACCOUNT_AUTHORITY',
            authority: {
              //查看
              view: 'ACCOUNT_AUTHORITY_VIEW',
              //用户授权
              person: 'ACCOUNT_AUTHORITY_PERSON',
              //角色授权
              role: 'ACCOUNT_AUTHORITY_ROLE'
            }
          };

      var labels = ['textbook', 'category', 'knowledge',
                    'account', 'role', 'authority'],
          label, childAuthList;

      for (var i = 0, len = labels.length; i < len; i++) {
        label = labels[i];
        if (list.indexOf(authIds[label + 'AuthId']) !== -1) {
          this.authList[label] = {};
          childAuthList = authIds[label];

          for (var item in childAuthList) {
            this.authList[label][item] = true;
          }
        }
      }

      //权限设置完成
      this.$emit('setauthdone');
    },
    //退出
    logout: function () {
      var self = this;
      apiUrl.logout().then(function (res) {
        self.clearUserInfo();
        window.location.href = self.baseUrl + '/views/login.html';
      }, function (res) {
        console.log('退出出错！');
      })
    },
    //清理用户信息
    clearUserInfo: function () {
      sessionStorage.clear();
      localStorage.clear();
      this._userInfo = {};
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      //已有信息
      if (localStorage.getItem('userId')) {//this._userInfo.id
        //显示名称
        this.roleName = this._userInfo.roleName;
        this.userName = this._userInfo.userName;

        //设置权限
        this.setAuthorityList();
      } else {
      //检测是否登录
        //this.checkLogin();
        //清理用户信息
        this.clearUserInfo();
        //返回登录页
        window.location.href = this.baseUrl + '/views/login.html';
      }
    });
  }
}
</script>

<style>
.g-hd {
  height: 70px;
  background-color: #fff;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
  overflow: hidden;
}
.g-wrap {
  width: 60rem;
  margin-left: auto;
  margin-right: auto;
}
/* logo */
.m-logo {
  width: 154px;
  height: 36px;
  padding: 17px 0;
  text-indent: -9999px;
  direction: ltr;
}
.m-logo a {
  display: block;
  width: 100%;
  height: 100%;
  background: url('../../static/images/logo.gif') 0 0 no-repeat;
}
.g-topbar {
  margin: -70px 0 0 200px;
  padding: 0 0 70px 0;
}
.m-menu {
  margin-left: 112px;
}
.m-menu li {
  float: left;
  display: inline;
  height: 3.5rem;
  border-top: 3px solid #fff;
  line-height: 3.5rem;
  font-size: .7rem;
}
.m-menu li a {
  display: block;
  padding: 0 1.3rem;
}
.m-menu li.z-selected {
  border-top: 3px solid #00d487;
  box-shadow: -1px 0 10px rgba(0, 0, 0, .1);
}
.m-menu li.z-selected a {
  box-shadow: 1px 0 10px rgba(0, 0, 0, .1);
}
.z-selected {
  color: #00d487;
}
.txt-welcome {
  margin-top: -70px;
  padding-top: 28px;
  text-align: right;
  font-size: .7rem;
  color: #00d487;
}
</style>
