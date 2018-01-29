<template>
<div>
  <div class="m-tips" v-if="authList.authority && authList.authority.person && authList.authority.role">
    温馨提醒：本表用于帮助管理者快速定位个管理权限的责任人；如需进行管理权限调整或赋予，请去往
    <span><a href="accountlist.html">账号权限配置</a></span>页面操作。（暂只支持三级）
  </div>
	<div class="m-list" v-if="true">
    <div class="authList">
      <div v-for="(first, fIndex) in list" :key="first.id">
        <!-- 第一级 -->
        <h2 class="tit-h2">
          <!-- 左边的折叠icon -->
          <span :class="{'hovering' : !first.isCollapsed}" @click.prevent.stop="toggleCollapse(list, fIndex)">
            <i v-if="first.isCollapsed && first.children" class="el-icon-arrow-right"></i><!-- 折叠的 -->
            <i v-if="!first.isCollapsed && first.children" class="el-icon-arrow-down"></i><!-- 展开的 -->
          </span>
          <span class="mouseBox" @mouseover="showStaff(first)" @mouseout="hideStaff(first)">
            {{first.name}}
            <div class="staffBox staffBox-f" v-if="first.isShowStaff">
            <!-- <div class="staffBox staffBox-f" v-if="true"> -->
              <span class="staffItem" v-for="fItem in first.staff">{{fItem}}</span>
            </div>
          </span>
        </h2>
        <!-- 第二级 -->
        <div v-show="!first.isCollapsed">
          <div class="con-h2" v-if="first.children.length > 0" v-for="(sec, sIndex) in first.children" :key="sec.id">
            <!-- 第二级的树 -->
            <h3 class="tit-h3">
              <!-- 左边的折叠icon -->
              <span :class="{'hovering' : !sec.isCollapsed}" @click.prevent.stop="toggleCollapse(first.children, sIndex)" v-if="sec.children">
                <i v-if="sec.isCollapsed && sec.children" class="el-icon-arrow-right"></i>
                <i v-if="!sec.isCollapsed && sec.children" class="el-icon-arrow-down"></i>
              </span>
              <span class="mouseBox" @mouseover="showStaff(sec)" @mouseout="hideStaff(sec)">
                <div class="iconHolder" v-if="!sec.children"></div>
                {{sec.name}}
                <div class="staffBox staffBox-s" v-if="sec.isShowStaff">
                <!-- <div class="staffBox staffBox-s" v-if="true"> -->
                  <span class="staffItem" v-for="sItem in sec.staff">{{sItem}}</span>
                </div>
              </span>
            </h3>
            <!-- 第三级 -->
            <div v-show="!sec.isCollapsed">
              <div class="con-h3" v-if="sec.children.length > 0" v-for="(thr, tIndex) in sec.children" :key="thr.id">
                <!-- 第三级的树 -->
                <h4 class="tit-h4" :class="{'hovering' : thr.isShowStaff}">
                  <!-- 左边的折叠icon -->
                  <span @click.prevent.stop="toggleCollapse(sec.children, tIndex)">
                    <i v-if="thr.isCollapsed && thr.children" class="el-icon-arrow-right"></i>
                    <i v-if="!thr.isCollapsed && thr.children" class="el-icon-arrow-down"></i>
                  </span>
                  <span class="mouseBox" @mouseover="showStaff(thr)" @mouseout="hideStaff(thr)">
                    <i class="iconf i-duoren"></i>
                    {{thr.name}}
                    <div class="staffBox staffBox-t" v-if="thr.isShowStaff">
                    <!-- <div class="staffBox staffBox-t" v-if="true"> -->
                      <span class="staffItem" v-for="tItem in thr.staff">{{tItem}}</span>
                    </div>
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="m-norecord" v-else>
  	无记录~~~
  </div>
</div>
</template>
<script>
import Vue from 'vue'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
    return {
      list: [],
      userNameList:'',
    };
  },
  methods: {
    init: function() {
      var self = this,
          params = {};
      apiUrl.getAuthoritylist(params).then(function (res) {
        var list = res.data;
        self.list = list;
        // console.log("权限列表数据：");
        // console.log(list);

        for(var i in list) {
          Vue.set(self.list[i], 'isCollapsed', true);
          setStatus(self.list[i], 'isCollapsed', true);
          Vue.set(self.list[i], 'isShowStaff', false);
          setStatus(self.list[i], 'isShowStaff', false);
        }
        //设置初始数据状态，包括折叠状态，编辑名称状态
        function setStatus (list, attr, status) {
          if (!list.children) {
            return;
          }
          for (var j in list.children) {
            Vue.set(list.children[j], attr, status);
            //递归子节点
            setStatus(list.children[j], attr, status);
          }
        }
      }).catch(function (res) {
        self.$message.error("拿取权限列表数据失败：" + res.message);
      })
    },
    getStaff: function(item) {
      var self = this,
          params = {
            "authorityId": item.id
          };
      apiUrl.getAuthorityUserList(params).then(function (res) {
        // console.log(item.name);       //输出请求的权限的名称，id，和返回数据
        // console.log(item.id);         //要是说数据没拿到就输出这个看看
        // console.log(res.data);        //输出看看有没数据
        var staff = res.data;
        Vue.set(item, 'staff', staff);
      }).catch(function (res) {
        self.$message.error("拿取用户数据失败：" + res.message);
      });
    },
    showStaff: function(item) {
      this.getStaff(item);
      item.isShowStaff = true;
    },
    hideStaff: function(item) {
      item.isShowStaff = false;
    },
    //点击“展开/折叠”事件
    toggleCollapse: function (list, index) {
      for (var i = 0; i < list.length; i++) {
        if (i === index) {
        //当前是收起，则展开
          if (list[i].isCollapsed) {
            list[i].isCollapsed = false;
          } else {
          //当前是展开，则收起
            list[i].isCollapsed = true;
            this.changeStatus(list[i], true);
          }
        } else {
          list[i].isCollapsed = true;
          this.changeStatus(list[i], true);
        }
      }
    },
    //改变折叠状态
    changeStatus: function (list, status) {
      if (list.children === 0) {
        return;
      }
      for (var j in list.children) {
        list.children[j].isCollapsed = status;
        //递归子节点
        this.changeStatus(list.children[j], status);
      }
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      this.init();
    });
  }
}
</script>
<style>
  /*提示*/
  .m-tips {
    color: #999;
  }
  .m-tips span a {
    color: #00d478;
    font-size: 16px;
  }
  
  .authList {
    width: 100%;
    height: 220px;
    padding-bottom: 300px;
    padding-left: 100px;
    overflow-y: scroll;
    color: #232323;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .title {
    text-align: center;
  }
  .tit-h2,.tit-h3,.tit-h4 {
    position: relative;
  }
  .tit-h2:hover,
  .tit-h3:hover,
  .tit-h4:hover {
    color: #00d487;
  }
  
  .hovering {
    color: #00d487;
  }
  .authList .tit-h2 {
    margin: 20px 0;
    font-size: .8rem;
    cursor: pointer;
  }
  .authList .tit-h3 {
    margin: 10px 0;
    font-size: .75rem;
    cursor: pointer;
  }
  .authList .tit-h4 {
    display: inline-block;
    margin: 5px 0;
    font-size: .75rem;
    cursor: pointer;
  }
  .authList .con-h2 {
    padding-left: 25px;
  }
  .authList .con-h3 {
    position: relative;
    padding-left: 30px;
  }
  .iconHolder {
    display: inline-block;
    width: 18px;
  }

  /*staff盒子*/
  .staffBox {
    position: absolute;
    display:inline-block;
    vertical-align: middle;
    width: 670px;
    min-height: 60px;
    padding: 10px;
    border: 1px solid #f3ecec;
    border-radius: 5px;
    background: white;
    font-size: .8rem;
    color: black;
    font-size: 16px;
  }
  .staffBox-f {
    top: -18px;
    left: 19%;
  }
  .staffBox-s {
    top: -18px;
    left: 18%;
  }
  .staffBox-t {
    top: -18px;
    left: 130px;
  }
  /*每个人名*/
  .staffItem {
    display: inline-block;
    margin: 10px;
  }
  .mouseBox {
    display: inline-block;
    width: 170px;
  }

</style>