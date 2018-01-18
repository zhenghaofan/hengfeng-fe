<template>
  <div class="g-leftbar">
    <ul class="m-lmenu">
      <li v-for="(menu, mIndex) in menus" v-if="authTempList.indexOf(menu.authId) !== -1">
        <div class="m-lmenu-name" @click="toggleCollapse(mIndex, menus)">
          <span class="g-lm"><i :class="{'i-arr-r': menu.isCollapsed,'i-arr-b': !menu.isCollapsed}"><i class="i-arr-ra"></i><i class="i-arr-rb"></i></i></span>
          <a>{{menu.name}}</a>
        </div>
        <ul class="m-lsubmenu" v-if="menu.children" v-show="!menu.isCollapsed">
          <li v-for="(submenu, sIndex) in menu.children"
             v-if="authTempList.indexOf(submenu.authId) !== -1 || submenu.name === '我的资源'" v-show="submenu.name !== '建设统计'">           
            <div class="m-lmenu-name" @click="toggleCollapse(sIndex, menu.children)">
              <span class="g-lm" v-if="submenu.children"><i :class="{'i-arr-r': submenu.isCollapsed,'i-arr-b': !submenu.isCollapsed}"><i class="i-arr-ra"></i><i class="i-arr-rb"></i></i></span>
              <a :href="submenu.href" :class="{'z-selected': submenu.isCurr}"><i class="icon g-mr10" :class="[submenu.isCurr ? 'i-' + clsNameObj[mIndex+'-'+sIndex] + '-s' : 'i-' + clsNameObj[mIndex+'-'+sIndex]]"></i>{{submenu.name}}</a>
            </div>
            <ul class="m-lthimenu" v-if="submenu.children" v-show="!submenu.isCollapsed">
              <li v-for="item in submenu.children">
                <a :href="item.href" :class="{'z-selected': item.isCurr}">{{item.name}}</a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
var baseUrl = Vue.prototype.baseUrl;
var leftbar = [{ 
  href: '#',
  name: '资源管理',
  id: '0',
  authId: 'RESOURCE_MANAGE',
  children: [{
    href: baseUrl + '/views/resourcelibs/resourcemanage/avairesource.html',
    name: '可用资源',
    id: '0-0',
    authId: 'RESOURCE_AVAILABLE'
  }, {
    href: baseUrl + '/views/resourcelibs/resourcemanage/upload.html',
    name: '上传资源',
    id: '0-1',
    authId: 'RESOURCE_UPLOAD'
  }, {
    href: '#',
    name: '我的资源',
    authId: '',
    id: '0-2',
    children: [{
      href: baseUrl + '/views/resourcelibs/resourcemanage/myresin.html',
      name: '已经入库',
      id: '0-2-0'
    }, {
      href: baseUrl + '/views/resourcelibs/resourcemanage/myunaudited.html',
      name: '正在候审',
      id: '0-2-1'
    }, {
      href: baseUrl + '/views/resourcelibs/resourcemanage/myrejected.html',
      name: '需要复核',
      id: '0-2-2'
    }, {
      href: baseUrl + '/views/resourcelibs/resourcemanage/myresoff.html',
      name: '已下架的',
      id: '0-2-3'
    }]
  }, {
    href: baseUrl + '/views/resourcelibs/resourcemanage/auditres.html',
    name: '资源审核',
    id: '0-3',
    authId: 'RESOURCE_AUDIT'
  }, {
    href: baseUrl + '/views/resourcelibs/resourcemanage/errorres.html',
    name: '报错处理',
    id: '0-4',
    authId: 'RESOURCE_ERROR_HANDLE'
  }, {
    href: baseUrl + '/views/resourcelibs/resourcemanage/offres.html',
    name: '下架资源',
    id: '0-5',
    authId: 'RESOURCE_CLOSED'
  }]
}, { 
  href: 'contmanage',
  name: '建设管理',
  id: '1',
  authId: 'RESOURCE_PROPERTY_BUILD_MANAGE',
  children: [{
    href: '#',
    name: '建设统计',
    id: '1-0',
    authId: 'RESOURCE_PROPERTY_BUILD_MANAGE'
  }, {
    href: baseUrl + '/views/resourcelibs/contmanage/classeslist.html',
    name: '资源属性',
    id: '1-1',
    authId: 'RESOURCE_PROPERTY_BUILD_MANAGE'
  }]
}];

//集成api
//import api from '@/api/index.js'

export default {
  data: function () {
    return {
      menus: [],
      clsNameObj: {
        '0-0': 'avai',
        '0-1': 'upload',
        '0-2': 'mine',
        '0-3': 'mang',
        '0-4': 'wait',
        '0-5': 'down',
        '1-0': 'book',
        '1-1': 'conf'
      }
    };
  },
  props: ['selIndex'],
  mounted: function () {
    var cur = this.selIndex.split('-');
    this.menus = leftbar;

    var j = 0;
    initMenu(this.menus, cur[j]);

    function initMenu (menus, curIdx) {
      for (var i = 0, len = menus.length; i < len; i++) {   
        //是当前节点
        if (i == curIdx) {
          //有子菜单
          if (menus[i].children) {
            //不折叠
            Vue.set(menus[i], 'isCollapsed', false);
            j++;
            initMenu(menus[i].children, cur[j]);
          } else {
          //无子菜单，说明是最后的叶子节点，设置isCurr属性
            //折叠
            Vue.set(menus[i], 'isCurr', true);
          }
        } else {
        //不是当前节点
          //有子菜单
          if (menus[i].children) {
            //折叠
            Vue.set(menus[i], 'isCollapsed', true);
          }
          //不是当前选中节点
          Vue.set(menus[i], 'isCurr', false);
        }
      }
    }

  },
  methods: {
    toggleCollapse: function (index, menus) {
      if (!menus[index].isCollapsed) {       
        menus[index].isCollapsed =  true;
        if (menus[index].children) {
          collapseChild(menus[index].children);
        }
        return;
      }
      for (var i = 0, len = menus.length; i < len; i++) {
        if (i === index) {
          menus[i].isCollapsed = false;
        } else {
          menus[i].isCollapsed = true;
          if (menus[i].children) {
            collapseChild(menus[i].children);
          }
        }
      }

      function collapseChild (list) {
        for (var i = 0, len = list.length; i < len; i++) {
          list[i].isCollapsed = true;
        }
      }
    }
  }
}
</script>

<style>
.g-leftbar {
  float: left;
  display: inline;
  width: 10rem;
  padding: 6px 10px 5px;
  border: 1px solid #e5e5e5;
  background-color: #fff;
  box-sizing: border-box;
  font-size: .7rem;
  color: #999;
}
.m-lmenu {
  line-height: 40px;
}
.g-lm {
  display: inline-block;
  width: 22px;
  /*padding-left: 10px;*/
  position: absolute;
  left: 10px;
}
.m-lmenu li {
  /*margin: 5px 0;*/
  cursor: pointer;
}
.m-lmenu li a {
  display: inline-block;
  padding-left: 40px;
  border-radius: 5px;
  color: #999;
  width: 100%;
  box-sizing: border-box;
}
.m-lmenu-name {
  position: relative;
  margin-bottom: 5px;
  border-radius: 5px;
}
.m-lmenu li a:hover, .m-lmenu-name:hover {
  background-color: #f5f5f5;
}
.m-lmenu-name:hover .i-arr-r .i-arr-rb {
  border-left-color: #f5f5f5;
}
.m-lmenu-name:hover .i-arr-b .i-arr-rb {
  border-top-color: #f5f5f5;
}
.m-lmenu li .m-lmenu-name a {
  display: inline-block;
  /*padding-left: 4px;
  margin-top: -20px;*/
}
.m-lsubmenu li {

}
.m-lmenu .z-selected {
  background-color: #f5f5f5;
  color: #232323;
}
.m-lsubmenu .g-lm {
  left: 20px;
}
.m-lthimenu li a {
  padding-left: 64px;
}
</style>
