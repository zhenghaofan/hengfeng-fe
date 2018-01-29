<template>
  <div class="g-leftbar">
    <ul class="m-lmenu">
      <li v-for="(menu, mIndex) in initData.leftbar.menus" v-if="authTempList.indexOf(menu.authId) !== -1 || menu.isNeccesary">
        <template v-if="menu.menus">
          <div
            class="m-lmenu-name"
            @click="toggleCollapse(initData.leftbar.menus[mIndex])">
            <span class="g-lm"><i :class="{'i-arr-r': menu.isCollapsed,'i-arr-b': !menu.isCollapsed}"><i class="i-arr-ra"></i><i class="i-arr-rb"></i></i></span>
            <a><i class="icon i-mine g-mr10"></i>{{menu.name}}</a>
          </div>
          <ul class="m-lsubmenu" v-show="!menu.isCollapsed">
            <li v-for="(submenu, sIndex) in menu.menus"
               v-if="authTempList.indexOf(submenu.authId) !== -1 || menu.isNeccesary">
              <a :href="submenu.href" :class="{'z-selected': initData.curMenuId === submenu.id}">{{submenu.name}}</a>
            </li>
          </ul>
        </template>

        <a v-else :href="menu.href" :class="{'z-selected': initData.curMenuId == menu.id}"><i class="icon g-mr10" :class="initData.leftbar.clsNameObj[menu.id]"></i>{{menu.name}}</a>

      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
var baseUrl = Vue.prototype.baseUrl;
//集成api
import apiUrl from '@/api/url.js'
export default {
  data: function () {
    return {
    };
  },
  props: ['initData'],
  watch: {
    'initData.curMenuId'() {
      this.init();
    },
  },
  methods: {
    toggleCollapse: function (item) {
      item.isCollapsed = !item.isCollapsed;
    },
    //初始化
    init() {
      this.menus = this.initData.leftbar.menus;

      initMenu(this.menus, this.initData.curMenuId);

      function initMenu(menus, curMenu) {
        var list = menus;

        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].menus) {
            Vue.set(list[i], 'isCollapsed', true);
            var submenu = list[i].menus;
            for (var j = 0, len2 = submenu.length; j < len2; j++) {
              if (submenu[j].id === curMenu) {
                list[i].isCollapsed = false;
              }
            }
          }
        }
      }
    },
  },
  mounted: function () {
    this.init();
  },
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
  width: 12px;
}
.m-lmenu li {
  margin: 5px 0;
  cursor: pointer;
}
.m-lmenu li a {
  display: block;
  padding-left: 40px;
  border-radius: 5px;
  color: #999;
}
.m-lmenu-name {
  margin-bottom: 5px;
  border-radius: 5px;
  padding-left: 20px;
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
  padding-left: 4px;
  margin-top: -20px;
}
.m-lmenu li .m-lsubmenu a {
  padding-left: 60px;
}
.m-lmenu .z-selected {
  background-color: #f5f5f5;
  color: #232323;
}
.z-selected .i-acct {
  background-position: -20px -120px;
}
.z-selected .i-role {
  background-position: -20px -140px;
}

.z-selected .i-permission {
  background-position: -20px -160px;
}
.z-selected .i-acct2 {
  background-position: -20px -180px;
}
.z-selected .i-edit {
  background-position: -20px -80px;
}
</style>
