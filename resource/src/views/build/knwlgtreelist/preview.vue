<template>
  <div>
    <div class="m-labels g-tc">
      <span>{{point.learnStageName}}</span>
      <span>{{point.subjectName}}</span>
      <span>{{point.name}}</span>
    </div>
    <p class="subtit-knwlgcont">（当前共用一级知识点{{firstLevelCount || 0}}个、二级知识点{{secondLevelCount || 0}}个、三级知识点{{thirdLevelCount || 0}}个、四级知识点{{fourthLevelCount || 0}}个、五级知识点{{fifthLevelCount || 0}}个）</p>
    <!-- 树,第一级 -->
    <div class="knwlgcont">
      <div v-for="(first, fIndex) in list" @click.prevent.stop="toggleCollapse(list, fIndex)">
        <h2 class="tit-h2">
          <i :class="{'i-arr-r': first.isCollapsed,'i-arr-b-s': !first.isCollapsed}" class="g-mr20" v-show="first.children">
            <i class="i-arr-ra"></i>
            <i class="i-arr-rb"></i>
          </i>
          <div class="iconHolder" v-show="!first.children"></div>
          {{first.name}}
        </h2>
        <!-- 第二级 -->
        <div v-show="!first.isCollapsed">
          <div class="con-h2" v-if="first.children.length > 0" v-for="(sec, sIndex) in first.children" @click.prevent.stop="toggleCollapse(first.children, sIndex)">
            <h3 class="tit-h3">
              <i class="g-mr20" :class="{'i-arr-r': sec.isCollapsed,'i-arr-b-s': !sec.isCollapsed}" v-show="sec.children">
                <i class="i-arr-ra"></i>
                <i class="i-arr-rb"></i>
              </i>
              <div class="iconHolder" v-show="!sec.children"></div>
              {{sec.name}}
            </h3>
            <!-- 第三级 -->
            <div v-show="!sec.isCollapsed">
              <div class="con-h2" v-if="sec.children.length > 0" v-for="(thr, tIndex) in sec.children" @click.prevent.stop="toggleCollapse(sec.children, tIndex)">
                <h4 class="tit-h4">
                  <i class="g-mr20" :class="{'i-arr-r': thr.isCollapsed,'i-arr-b-s': !thr.isCollapsed}" v-show="thr.children">
                    <i class="i-arr-ra"></i>
                    <i class="i-arr-rb"></i>
                  </i>
                  <div class="iconHolder" v-show="!thr.children"></div>
                  {{thr.name}}
                </h4>
                <!-- 第四级 -->
                <div v-show="!thr.isCollapsed">
                  <div class="con-h2" v-if="thr.children.length > 0" v-for="(four, fourIndex) in thr.children" @click.prevent.stop="toggleCollapse(thr.children, fourIndex)">
                    <h4 class="tit-h4">
                      <i class="g-mr20" :class="{'i-arr-r': four.isCollapsed,'i-arr-b-s': !four.isCollapsed}" v-show="four.children">
                        <i class="i-arr-ra"></i>
                        <i class="i-arr-rb"></i>
                      </i>
                      <div class="iconHolder" v-show="!four.children"></div>
                      {{four.name}}
                    </h4>
                    <!-- 第五级 -->
                    <div v-show="!four.isCollapsed">
                      <div class="con-h2" v-if="four.children.length > 0" v-for="(fif, fifIndex) in four.children" @click.prevent.stop="toggleCollapse(four.children, fifIndex)">
                        <h4 class="tit-h4">
                          <div class="iconHolder" v-show="!fif.children"></div>
                          {{fif.name}}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//集成api
import apiUrl from '@/api/url.js'
import Vue from 'vue'
export default {
  data: function () {
    return {
      point: {},
      list: [],
      firstLevelCount: "",
      secondLevelCount: "",
      thirdLevelCount: "",
      fourthLevelCount: "",
      fifthLevelCount: "",
    };
  },
  props: ['knwId'],
  methods: {
    toggleCollapse: function (list, index) {
      for (var i = 0, len = list.length; i < len; i++) {
        if (i === index) {
        //当前是收起，则展开
          if (list[i].isCollapsed) {
            list[i].isCollapsed = false;
          } else {
          //当前是展开，则收起
            list[i].isCollapsed = true;
            changeStatus(list[i], true);
          }
          
        } else {
          list[i].isCollapsed = true;
          changeStatus(list[i], true);
        }
      }
      //改变折叠状态
      function changeStatus (list, status) {
        if (list.children === 0) {
          return;
        }

        for (var j in list.children) {
          list.children[j].isCollapsed = status;
          //递归子节点
          changeStatus(list.children[j], status);
        }

      }
    }
  },
  watch: {
    'knwId': {
      handler: function () {
        //console.log(this);
        var self = this,
            params = self.knwId;

        apiUrl.getKnwlgtreePreview(params)
         .then(function (res) {

          var _result = res.data,
            knowledgePoint = _result.knowledgePoint,
            labels = [],
            list = [],
            catalogList = [];
          //标签
          self.point = knowledgePoint;
          self.firstLevelCount = self.point.levelCounts[0];
          self.secondLevelCount = self.point.levelCounts[1];
          self.thirdLevelCount = self.point.levelCounts[2];
          self.fourthLevelCount = self.point.levelCounts[3];
          self.fifthLevelCount = self.point.levelCounts[4];

          self.list = _result.knowledgePointCatalogList;

          list = self.list;

          //树形显示
          for (var i in list) {
            Vue.set(self.list[i], 'isCollapsed', true);
            setStatus(self.list[i], 'isCollapsed', true);
          }
          
          //设置初始折叠状态
          function setStatus (list, attr, status) {
            if (list.children === 0) {
              return;
            }
            for (var j in list.children) {
              Vue.set(list.children[j], attr, status);
              //递归子节点
              setStatus(list.children[j], attr, status);
            }
          }
        });
      },
      deep: true
    }
  },
  mounted: function () {
  }
}
</script>

<style>
.subtit-knwlgcont {
  margin-top: 10px;
  text-align: center;
  font-size: .6rem;
  color: #999;
}
.knwlgcont {
  margin-top: 40px;
  padding-left: 100px;
  height: 380px;
  overflow-y: scroll;
  color: #232323;
}
.tit-h2:hover,
.tit-h3:hover,
.tit-h4:hover {
  color: #00d487;
}
.knwlgcont .tit-h2 {
  margin: 20px 0;
  font-size: .8rem;
  cursor: pointer;
}
.knwlgcont .tit-h3 {
  margin: 20px 0;
  font-size: .7rem;
  cursor: pointer;
}
.knwlgcont .tit-h4 {
  margin: 10px 0;
  font-size: .7rem;
  cursor: pointer;
}
.knwlgcont .con-h2 {
  padding-left: 32px;
}

.iconHolder {
  display:inline-block;
  width:27px;
}
</style>
