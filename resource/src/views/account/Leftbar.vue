<template>
  <div class="g-leftbar">
    <ul class="m-lmenu">
      <li v-for="(menu, index) in initData.leftbar.menus" v-if="authTempList.indexOf(menu.authId) !== -1 || menu.authId === 'personal'"><a :href="menu.href" :class="{'z-selected': initData.curMenuId == menu.id}"><i class="icon g-mr10" :class="initData.leftbar.clsNameObj[menu.id]"></i>{{menu.name}}</a></li>
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
  methods: {
  },
  mounted: function () { 
    this.$nextTick(function () {

    });
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
  padding-left: 10px;
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
.m-lsubmenu li {

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
