<template>
  <div>
    <div class="m-labels g-tc">
      <span v-for="label in labels" class="label">{{label}}</span>
    </div>
    <!-- 树,第一级 -->
    <div class="bookcont">
      <div v-if="list.length">
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
                            <!-- <i class="g-mr20" :class="{'i-arr-r': fif.isCollapsed,'i-arr-b-s': !fif.isCollapsed}" v-show="fif.children">
                              <i class="i-arr-ra"></i>
                              <i class="i-arr-rb"></i>
                            </i> -->
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
      <div v-else>
        无数据
      </div>
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
      labels: [],
      list: []
    };
  },
  props: ['bookId'],
  watch: {
    'bookId': {
      handler: function () {
        //console.log(this);
        var self = this,
            params = self.bookId;
        apiUrl.getTextbookPreview(params).then(function (res) {         
          var _result = res.data,
              textbook = _result.textbook,
              labels = [],
              tmpCatalogList = _result.textbookCatalogList,
              catalogList = [];
          console.log(textbook);
          //标签
          for (var i in textbook) {
            if(i == "id" || i == "lastUpdateUserId") {
              continue;
            }
            if(i == "version" && textbook[i] == 0) {
              continue;
            }
            if(textbook[i].name) {
              labels.push(textbook[i].name);
            }
            else if(textbook[i] == "TEACHING_MATERIAL") {
              labels.push("教材");
            }
            else if(textbook[i] == "TEACHING_AUXILIARY") {
              labels.push("教辅");
            }
            else if(textbook[i] == "LAST_TERM") {
              labels.push("上学期");
            }
            else if(textbook[i] == "NEXT_TERM") {
              labels.push("下学期");
            }
            else if(textbook[i] == "LAST_VOLUME") {
              labels.push("上册");
            }
            else if(textbook[i] == "NEXT_VOLUME") {
              labels.push("下册");
            }
            else if(textbook[i] == "WHOLE_VOLUME") {
              labels.push("全册");
            }
            else if(textbook[i] == "ELECTIVE") {
              labels.push("选修");
            }
            else {
              labels.push(textbook[i]);
            }
          }
          self.labels = labels;

          //章节树
          self.list = tmpCatalogList;

          var list = self.list;

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
};
</script>

<style>
.m-labels span {
  margin: 2px 5px;
}
.bookcont {
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
.bookcont .tit-h2 {
  margin: 20px 0;
  font-size: .8rem;
  cursor: pointer;
}
.bookcont .tit-h3 {
  margin: 20px 0;
  font-size: .7rem;
  cursor: pointer;
}
.bookcont .tit-h4 {
  margin: 20px 0;
  font-size: .7rem;
  cursor: pointer;
}
.bookcont .con-h2 {
  padding-left: 32px;
}

.iconHolder {
  display:inline-block;
  width:27px;
}
</style>
