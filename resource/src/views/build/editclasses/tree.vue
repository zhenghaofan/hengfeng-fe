<template>
  <div class="tree">
    <!-- 树 -->
    <div class="bookcont bookcont-main">
      <div v-for="(first, fIndex) in list" :key="first.id">
        <!-- 第一级 -->
        <h2 class="tit-h2">
          <!-- 左边的折叠icon -->
          <span @click.prevent.stop="toggleCollapse(list, fIndex)">
            <i v-if="first.isCollapsed && first.children" class="el-icon-arrow-right"></i><!-- 折叠的 -->
            <i v-if="!first.isCollapsed && first.children" class="el-icon-arrow-down"></i><!-- 展开的 -->
          </span>
          <!-- 右边的名称及icon们 -->
          <span v-show="!first.isEditName" @mouseover="showIcon(first)" @mouseout="hideIcon(first)">
            <!-- 名称 -->
            <span class="nodeName" @click.prevent.stop="NameEdit(first)">{{first.name}}</span>
            <!-- icon -->
            <span class="iconBox" v-show="first.hovering">
              <i class="iconf i-addnode" @click.prevent.stop="AddNode(first)"></i>
              <i class="iconf i-addchildnode" @click.prevent.stop="AddChildNode(first)"></i>
              <i v-if="fIndex != list.length-1" class="iconf i-todown" @click.prevent.stop="toDown(fIndex, list)"></i>
              <i v-if="fIndex != 0" class="iconf i-toup" @click.prevent.stop="toUp(fIndex, list)"></i>
            </span>
          </span>
          <!-- 右边的修改名称用的输入框 -->
          <span v-show="first.isEditName">
            <el-input v-model="first.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
            <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(first)"></i>
            <span v-if="!first.isProtogenic">
              <i class="el-icon-close" @click.prevent.stop="deleteNode0(fIndex, list)"></i>
            </span>
          </span>
        </h2>
        <!-- 底下弹出的添加框 -->
        <div v-if="first.isAddNode">
          <el-input v-model="first.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
          <i class="el-icon-check" @click.prevent.stop="confirmAddNode(fIndex, list)"></i>
          <i class="el-icon-close" @click.prevent.stop="cancelAddNode(first)"></i>
        </div>
        <!-- 第一级添加子节点的框 -->
        <div v-if="first.isAddChildNode">
          <el-input v-model="first.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="128"></el-input>
          <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(fIndex, list)"></i>
          <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(first)"></i>
        </div>
        
        <!-- 第二级 -->
        <div v-show="!first.isCollapsed">
          <div class="con-h2" v-if="first.children.length > 0" v-for="(sec, sIndex) in first.children" :key="sec.id">
            <!-- 第二级的树 -->
            <h3 class="tit-h3">
              <!-- 左边的折叠icon -->
              <span @click.prevent.stop="toggleCollapse(first.children, sIndex)">
                <i v-if="sec.isCollapsed && sec.children" class="el-icon-arrow-right"></i>
                <i v-if="!sec.isCollapsed && sec.children" class="el-icon-arrow-down"></i>
              </span>
              <!-- 右边的名称及icon们 -->
              <span v-show="!sec.isEditName"  @mouseover="showIcon(sec)" @mouseout="hideIcon(sec)">
                <!-- 名称 -->
                <span class="nodeName" @click.prevent.stop="NameEdit(sec)">{{sec.name}}</span>
                <!-- icon -->
                <span class="iconBox" v-show="sec.hovering">
                  <i class="iconf i-addnode" @click.prevent.stop="AddNode(sec)"></i>
                  <i class="iconf i-addchildnode" @click.prevent.stop="AddChildNode(sec)"></i>
                  <i v-if="sIndex != first.children.length-1" class="iconf i-todown" @click.prevent.stop="toDown(sIndex, first.children)"></i>
                  <i v-if="sIndex != 0" class="iconf i-toup" @click.prevent.stop="toUp(sIndex, first.children)"></i>
                </span>
              </span>
              <!-- 右边的修改名称用的输入框 -->
              <span v-show="sec.isEditName">
                <el-input v-model="sec.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(sec)"></i>
                <span v-if="!sec.isProtogenic">
                  <i class="el-icon-close" @click.prevent.stop="deleteNode(sIndex, first)"></i>
                </span>
              </span>
            </h3>
            <!-- 底下弹出的添加框 -->
            <div v-if="sec.isAddNode">
              <el-input v-model="sec.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
              <i class="el-icon-check" @click.prevent.stop="confirmAddNode(sIndex, first.children)"></i>
              <i class="el-icon-close" @click.prevent.stop="cancelAddNode(sec)"></i>
            </div>
            <!-- 第二级添加子节点的框 -->
            <div v-if="sec.isAddChildNode">
              <el-input v-model="sec.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="128"></el-input>
              <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(sIndex, first.children)"></i>
              <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(sec)"></i>
            </div>

            <!-- 第三级 -->
            <div v-show="!sec.isCollapsed">
              <div class="con-h2" v-if="sec.children.length > 0" v-for="(thr, tIndex) in sec.children" :key="thr.id">
                <!-- 第三级的树 -->
                <h4 class="tit-h4">
                  <!-- 左边的折叠icon -->
                  <span @click.prevent.stop="toggleCollapse(sec.children, tIndex)">
                    <i v-if="thr.isCollapsed && thr.children" class="el-icon-arrow-right"></i>
                    <i v-if="!thr.isCollapsed && thr.children" class="el-icon-arrow-down"></i>
                  </span>
                  <!-- 右边的名称及icon们 -->
                  <span v-show="!thr.isEditName" @mouseover="showIcon(thr)" @mouseout="hideIcon(thr)">
                    <!-- 名称 -->
                    <span class="nodeName" @click.prevent.stop="NameEdit(thr)">{{thr.name}}</span>
                    <!-- icon -->
                    <span class="iconBox" v-show="thr.hovering">
                      <i class="iconf i-addnode" @click.prevent.stop="AddNode(thr)"></i>
                      <i class="iconf i-addchildnode" @click.prevent.stop="AddChildNode(thr)"></i>
                      <i v-if="tIndex != sec.children.length-1" class="iconf i-todown" @click.prevent.stop="toDown(tIndex, sec.children)"></i>
                      <i v-if="tIndex != 0" class="iconf i-toup" @click.prevent.stop="toUp(tIndex, sec.children)"></i>
                    </span>
                  </span>
                  <!-- 右边的修改名称用的输入框 -->
                  <span v-show="thr.isEditName">
                    <el-input v-model="thr.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                    <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(thr)"></i>
                    <span v-if="!thr.isProtogenic">
                      <i class="el-icon-close" @click.prevent.stop="deleteNode(tIndex, sec)"></i>
                    </span>
                  </span>
                </h4>
                <!-- 底下弹出的添加框 -->
                <div v-if="thr.isAddNode">
                  <el-input v-model="thr.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                  <i class="el-icon-check" @click.prevent.stop="confirmAddNode(tIndex, sec.children)"></i>
                  <i class="el-icon-close" @click.prevent.stop="cancelAddNode(thr)"></i>
                </div>
                <!-- 第三级添加子节点的框 -->
                <div v-if="thr.isAddChildNode">
                  <el-input v-model="thr.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="128"></el-input>
                  <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(tIndex, sec.children)"></i>
                  <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(thr)"></i>
                </div>

                <!-- 第四级 -->
                <div v-show="!thr.isCollapsed">
                  <div class="con-h2" v-if="thr.children.length > 0" v-for="(four, fourIndex) in thr.children" :key="four.id">
                    <!-- 第四级的树 -->
                    <h4 class="tit-h4">
                      <!-- 左边的折叠icon -->
                      <span @click.prevent.stop="toggleCollapse(thr.children, fourIndex)">
                        <i v-if="four.isCollapsed && four.children" class="el-icon-arrow-right"></i>
                        <i v-if="!four.isCollapsed && four.children" class="el-icon-arrow-down"></i>
                      </span>
                      <!-- 右边的名称及icon们 -->
                      <span v-show="!four.isEditName" @mouseover="showIcon(four)" @mouseout="hideIcon(four)">
                        <!-- 名称 -->
                        <span class="nodeName" @click.prevent.stop="NameEdit(four)">{{four.name}}</span>
                        <!-- icon -->
                        <span class="iconBox" v-show="four.hovering">
                          <i class="iconf i-addnode" @click.prevent.stop="AddNode(four)"></i>
                          <i class="iconf i-addchildnode" @click.prevent.stop="AddChildNode(four)"></i>
                          <i v-if="fourIndex != thr.children.length-1" class="iconf i-todown" @click.prevent.stop="toDown(fourIndex, thr.children)"></i>
                          <i v-if="fourIndex != 0" class="iconf i-toup" @click.prevent.stop="toUp(fourIndex, thr.children)"></i>
                        </span>
                      </span>
                      <!-- 右边的修改名称用的输入框 -->
                      <span v-show="four.isEditName">
                        <el-input v-model="four.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                        <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(four)"></i>
                        <span v-if="!four.isProtogenic">
                          <i class="el-icon-close" @click.prevent.stop="deleteNode(fourIndex, thr)"></i>
                        </span>
                      </span>
                    </h4>
                    <!-- 底下弹出的添加框 -->
                    <div v-if="four.isAddNode">
                      <el-input v-model="four.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                      <i class="el-icon-check" @click.prevent.stop="confirmAddNode(fourIndex, thr.children)"></i>
                      <i class="el-icon-close" @click.prevent.stop="cancelAddNode(four)"></i>
                    </div>
                    <!-- 第四级添加子节点的框 -->
                    <div v-if="four.isAddChildNode">
                      <el-input v-model="four.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="128"></el-input>
                      <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(fourIndex, thr.children)"></i>
                      <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(four)"></i>
                    </div>

                    <!-- 第五级 -->
                    <div v-show="!four.isCollapsed">
                      <div class="con-h2" v-if="four.children.length > 0" v-for="(fif, fifIndex) in four.children" :key="fif.id">
                        <!-- 第五级的树 -->
                        <h4 class="tit-h4">
                          <!-- 左边的折叠icon -->
                          <span @click.prevent.stop="toggleCollapse(four.children, fifIndex)">
                            <i v-if="fif.isCollapsed && fif.children" class="el-icon-arrow-right"></i>
                            <i v-if="!fif.isCollapsed && fif.children" class="el-icon-arrow-down"></i>
                          </span>
                          <!-- 右边的名称及icon们 -->
                          <span v-show="!fif.isEditName" @mouseover="showIcon(fif)" @mouseout="hideIcon(fif)">
                            <!-- 名称 -->
                            <span class="nodeName" @click.prevent.stop="NameEdit(fif)">{{fif.name}}</span>
                            <!-- icon -->
                            <span class="iconBox" v-show="fif.hovering">
                              <i class="iconf i-addnode" @click.prevent.stop="AddNode(fif)"></i>
                              <i v-if="fifIndex != four.children.length-1" class="iconf i-todown" @click.prevent.stop="toDown(fifIndex, four.children)"></i>
                          <i v-if="fifIndex != 0" class="iconf i-toup" @click.prevent.stop="toUp(fifIndex, four.children)"></i>
                            </span>
                          </span>
                          <!-- 右边的修改名称用的输入框 -->
                          <span v-show="fif.isEditName">
                            <el-input v-model="fif.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                            <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(fif)"></i>
                            <span v-if="!fif.isProtogenic">
                              <i class="el-icon-close" @click.prevent.stop="deleteNode(fifIndex, four)"></i>
                            </span>
                          </span>
                        </h4>
                        <!-- 底下弹出的添加框 -->
                        <div v-if="fif.isAddNode">
                          <el-input v-model="fif.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="128"></el-input>
                          <i class="el-icon-check" @click.prevent.stop="confirmAddNode(fifIndex, four.children)"></i>
                          <i class="el-icon-close" @click.prevent.stop="cancelAddNode(fif)"></i>
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
    <!-- 按钮 -->
    <div class="el_botton">
      <el-button type="primary" @click="previewTree">预览</el-button>
      <a href="#" @click.prevent="save">
        <el-button type="primary" :disabled="!isAllDone">保存课本信息</el-button>
      </a>
    </div>
    <!-- 预览区 -->
    <el-dialog :title="point.name" center :visible.sync="isPreview" width="1000px">
      <div class="m-labels g-tc">
        <span v-for="label in labels" class="label">{{label}}</span>
      </div>
      <!-- 树,第一级 -->
      <div class="bookcont">
        <div v-for="(first, fIndex) in list" @click.prevent.stop="toggleCollapse(list, fIndex)">
          <h2 class="tit-h2">
            <i :class="{'i-arr-r': first.isCollapsed,'i-arr-b-s': !first.isCollapsed}" class="g-mr20" v-show="first.children">
              <i class="i-arr-ra"></i>
              <i class="i-arr-rb"></i>
            </i>
            <div class="iconHolder" v-show="!first.children"></div>
            <span class="nodeName">{{first.name}}</span>
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
                <span class="nodeName">{{sec.name}}</span>
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
                    <span class="nodeName">{{thr.name}}</span>
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
                        <span class="nodeName">{{four.name}}</span>
                      </h4>
                      <!-- 第五级 -->
                      <div v-show="!four.isCollapsed">
                        <div class="con-h2" v-if="four.children.length > 0" v-for="(fif, fifIndex) in four.children" @click.prevent.stop="toggleCollapse(four.children, fifIndex)">
                          <h4 class="tit-h4">
                            <div class="iconHolder" v-show="!fif.children"></div>
                            <span class="nodeName">{{fif.name}}</span>
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
    </el-dialog>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import Vue from 'vue'
//因为用了Vue.set()和Vue.delete()

export default {
  name: 'tree',
  data () {
    return {
      content: {},  //拿到的所有内容，包含下面俩
      point: {},    //树之前的知识点统计
      list: [],     //树的数据
      isPreview: false,
      labels: [],       // 预览要用
      isAllDone: true,  //用于判断是否能够保存了
      editNum: 0,
    }
  },
  props: ['bId','termName','valumeName','version','publisher','displayName'],
  watch: {
    editNum: function() {
      if(this.editNum > 0) {
        this.isAllDone = false;
      }else {
        this.isAllDone = true;
      }
    }
  },
  methods: {
    //页面载入时拿数据
    getData: function() {
      var self = this,
        params = this.bId; //id来的
      apiUrl.getTextbookPreview(params).then(function (res) { 
        console.log("初始化时的树结构：");
        console.log(res);
        self.content = res.data;
        self.initialize();
      }).catch(function (res) {
        console.log("拿取数据失败");
      });
    },
    //拿数据后初始化数据
    initialize: function () {
      var self = this,
        _content = self.content,
        list = [],
        catalogList = [];
      self.point = _content.textbook;
      self.list = _content.textbookCatalogList;
      list = self.list;

      //树形循环,加上下面的递归，给每个节点添加属性，6的一批
      for (var i in list) {
        Vue.set(self.list[i], 'isCollapsed', true);
        setStatus(self.list[i], 'isCollapsed', true);
        Vue.set(self.list[i], 'isEditName', false);
        setStatus(self.list[i], 'isEditName', false);
        Vue.set(self.list[i], 'isAddNode', false);
        setStatus(self.list[i], 'isAddNode', false);
        Vue.set(self.list[i], 'isAddChildNode', false);
        setStatus(self.list[i], 'isAddChildNode', false);
        //判断是否原生节点，原生的不支持删除
        Vue.set(self.list[i], 'isProtogenic', true);
        setStatus(self.list[i], 'isProtogenic', true);
        Vue.set(self.list[i], 'hovering', false);
        setStatus(self.list[i], 'hovering', false);
        Vue.set(self.list[i], 'newEditName', "");
        setStatus(self.list[i], 'newEditName', "");
        Vue.set(self.list[i], 'newNodeName', "");
        setStatus(self.list[i], 'newNodeName', "");
        Vue.set(self.list[i], 'newChildNodeName', "");
        setStatus(self.list[i], 'newChildNodeName', "");
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
    },

    //onmouseover时显示图标
    showIcon: function(list) {
      list.hovering = true;
    },
    //onmouseout时隐藏图标
    hideIcon: function(list) {
      list.hovering = false;
    },

    //整棵树范围的检查重名
    nameRepeat: function(name) {
      var checkRepeat = false,
          list = this.list;
      for(var i = list.length - 1; i >= 0; i--) {
        var fChildList = list[i].children;
        if(fChildList) {
          for(var j = fChildList.length - 1; j >= 0; j--) {
            var sChildList = fChildList[j].children;
            if(sChildList) {
              for(var k = sChildList.length - 1; k >= 0; k--) {
                var tChildList = sChildList[k].children;
                if(tChildList) {
                  for(var m = tChildList.length - 1; m >= 0; m--) {
                    var fourChildList = tChildList[m].children;
                    if(fourChildList) {
                      for(var n = fourChildList.length - 1; n >= 0; n--) {
                        fourChildList[n].serialNumber++;
                        if(fourChildList[n].name == name) {
                          checkRepeat = true;
                        }
                      }
                    }
                    if(tChildList[m].name == name) {
                      checkRepeat = true;
                    }
                  }
                }
                if(sChildList[k].name == name) {
                  checkRepeat = true;
                }
              }
            }
            if(fChildList[j].name == name) {
              checkRepeat = true;
            }
          }
        }
        if(list[i].name == name) {
          checkRepeat = true;
        }
      }
      return checkRepeat;
    },
    //修改名称
    NameEdit: function(list) {
      list.newEditName = list.name;
      list.isEditName = !list.isEditName;
      if(list.isEditName) {
        this.editNum++;
      }else {
        this.editNum--;
      }
    },
    //确认修改名称
    confirmNameEdit: function(list) {
      if(list.newEditName) {
        if(this.pNameRepeat(list.newEditName)) {
          this.$message({
            message: '本树中该节点名称已存在，请重新输入',
            type: 'warning'
          });
          return;
        }
        list.name = list.newEditName;
        list.newEditName = "";
        list.isEditName = !list.isEditName;

        this.editNum--;
      }else {
        this.$message.error("节点名称不能为空");
      }
    },
    //原生节点专用----整棵树范围的检查重名
    pNameRepeat: function(name) {
      var checkRepeat = false,
          list = this.list;
      for(var i = list.length - 1; i >= 0; i--) {
        var fChildList = list[i].children;
        if(fChildList) {
          for(var j = fChildList.length - 1; j >= 0; j--) {
            var sChildList = fChildList[j].children;
            if(sChildList) {
              for(var k = sChildList.length - 1; k >= 0; k--) {
                var tChildList = sChildList[k].children;
                if(tChildList) {
                  for(var m = tChildList.length - 1; m >= 0; m--) {
                    var fourChildList = tChildList[m].children;
                    if(fourChildList) {
                      for(var n = fourChildList.length - 1; n >= 0; n--) {
                        fourChildList[n].serialNumber++;
                        if(fourChildList[n].name == name && !fourChildList[n].isEditName) {
                          checkRepeat = true;
                        }
                      }
                    }
                    if(tChildList[m].name == name && !tChildList[m].isEditName) {
                      checkRepeat = true;
                    }
                  }
                }
                if(sChildList[k].name == name && !sChildList[k].isEditName) {
                  checkRepeat = true;
                }
              }
            }
            if(fChildList[j].name == name && !fChildList[j].isEditName) {
              checkRepeat = true;
            }
          }
        }
        if(list[i].name == name && !list[i].isEditName) {
          checkRepeat = true;
        }
      }
      return checkRepeat;
    },

    //添加同级节点
    AddNode: function(list) {
      list.isAddNode = !list.isAddNode;
      this.editNum++;
    },
    //确认添加同级节点
    confirmAddNode: function(index, list) {
      if(this.nameRepeat(list[index].newNodeName)) {
        this.$message({
          message: '本树中该节点名称已存在，请重新输入',
          type: 'warning'
        });
        return;
      }
      if(!list[index].newNodeName) {
        this.$message.error("节点名称不能为空");
        return;
      }

      for(var i = list.length - 1; i > index; i--){
        list[i].serialNumber++;
      }
      list.push({
        //基础属性
        name: list[index].newNodeName,
        serialNumber: list[index].serialNumber + 1,
        //附加属性
        isCollapsed: true,
        isEditName: false,
        isAddNode: false,
        isAddChildNode: false,
        isProtogenic: false,
        hovering: false,
        newEditName: "",
        newNodeName: "",
        newChildNodeName: "",
      });

      list[index].isAddNode = !list[index].isAddNode;
      list = list.sort(this.sortList);
      list[index].newNodeName = "";
      this.editNum--;
    },
    //取消增加同级节点
    cancelAddNode: function(item) {
      item.isAddNode = !item.isAddNode;
      console.log("取消增加节点");
      item.newNodeName = "";
      this.editNum--;
    },


    //添加子节点
    AddChildNode: function(item) {
      item.isAddChildNode = !item.isAddChildNode;
      item.isCollapsed = false;
      this.editNum++;
    },
    //确认添加子节点
    confirmAddChildNode: function(index, list) {
      if(this.nameRepeat(list[index].newChildNodeName)) {
        this.$message({
          message: '本树中该节点名称已存在，请重新输入',
          type: 'warning'
        });
        return;
      }
      if(!list[index].newChildNodeName) {
        this.$message.error("节点名称不能为空");
        return;
      }

      //若该节点没有children，就创建个空的
      if(!list[index].children) {
        Vue.set(list[index], 'children', []);
      }
      else {
        for(var i = list[index].children.length - 1; i >= 0; i--) {
          list[index].children[i].serialNumber++;
        }
      }

      var childList = list[index].children;
      childList.push({
        //基础属性
        name: list[index].newChildNodeName,
        serialNumber: 1,
        //附加属性
        isCollapsed: true,
        isEditName: false,
        isAddNode: false,
        isAddChildNode: false,
        isProtogenic: false,
        hovering: false,
        newEditName: "",
        newNodeName: "",
        newChildNodeName: "",
      });

      list[index].isAddChildNode = !list[index].isAddChildNode;
      childList = childList.sort(this.sortList);
      list[index].newChildNodeName = "";
      this.editNum--;
    },
    //取消增加子节点
    cancelAddChildNode: function(item) {
      item.isAddChildNode = !item.isAddChildNode;
      item.isCollapsed = !item.isCollapsed;
      console.log("取消增加子节点");
      item.newChildNodeName = "";
      this.editNum--;
    },


    //第一级删除节点
    deleteNode0: function(index, list) {
      for(var i = list.length - 1; i > index; i--) {
        list[i].serialNumber--;
      }
      //若该节点存在子节点
      if(list[index].children) {
        this.findEditChild(list[index]);
      }
      list.splice(index, 1);
      this.$message({
        message: '删除成功',
        type: 'success'
      });
      this.editNum--;
    },
    //非第一级删除节点
    deleteNode: function(index, item) {
      var list = item.children;
      for(var i = list.length - 1; i > index; i--) {
        list[i].serialNumber--;
      }
      //若该节点存在子节点
      if(list[index].children) {
        this.findEditChild(list[index]);
      }
      list.splice(index, 1);
      //若删除了节点后children为空，要删除该属性
      if(item.children == 0) {
        Vue.delete(item, 'children');
      }
      this.$message({
        message: '删除成功',
        type: 'success'
      });
      this.editNum--;
    },
    //删除时找找有没有还在编辑状态的子节点
    findEditChild: function (item) {
      if (item.children === 0) {
        return;
      }
      for (var j in item.children) {
        //分成三个是因为担心有人在同一个节点同时进行这三种操作
        if(item.children[j].isEditName) {
          this.editNum--;
        }
        if(item.children[j].isAddNode) {
          this.editNum--;
        }
        if(item.children[j].isAddChildNode) {
          this.editNum--;
        }
        //递归子节点
        this.findEditChild(item.children[j]);
      }
    },


    //点击向上/向下事件
    toUp: function(index, list) {
      var a = list[index-1].serialNumber;
      list[index-1].serialNumber = list[index].serialNumber;
      list[index].serialNumber = a;
      list = list.sort(this.sortList);
    },
    toDown: function(index, list) {
      var a = list[index].serialNumber;
      list[index].serialNumber = list[index+1].serialNumber;
      list[index+1].serialNumber = a;
      list = list.sort(this.sortList);
    },
    //排序
    sortList: function(a,b) {
      return a.serialNumber - b.serialNumber;
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
    //保存树,即传给父组件
    save: function () {
      this.$emit('save-tree', this.list);
      console.log("保存时的树结构：");
      console.log(this.list);
    },

    //预览
    previewTree: function() {
      //预览的标签
      var labels = [],
          textbook = this.point;
      textbook.publisher = this.publisher;
      textbook.version = this.version;
      for (var i in textbook) {
        //这里是边编辑边预览，所以displayName不能用接口拿的数据，要用现在这个正在修改的
        if(i == "displayName") {
          labels.push(this.displayName);
          continue;
        }
        //"id"和"lastUpdateUserId"不显示
        if(i == "id" || i == "lastUpdateUserId") {
          continue;
        }
        //若版本为0则不显示
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
        //学期
        else if(i === "termDictId") {
          if(this.termName !== "上学期" && this.termName !== "下学期") {
            continue;
          }
          labels.push(this.termName);
        }
        //册数
        else if(textbook[i] == "LAST_VOLUME" || textbook[i] == "NEXT_VOLUME" || textbook[i] == "WHOLE_VOLUME" || textbook[i] == "ELECTIVE" || textbook[i] == "REQUIRED") {
          labels.push(this.valumeName);
        }
        else {
          labels.push(textbook[i]);
        }
      }
      this.labels = labels;

      this.isPreview = true;
    }
  },
  mounted: function () {
    this.getData();
    // this.aaa = this.displayName;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .tree {
    display: inline-block;
    width: 88%;
    vertical-align: top;
  }
  
  .title {
    text-align: center;
  }
  .bookcont {
    padding-left: 100px;
    height: 380px;
    overflow-y: scroll;
    color: #232323;
  }
  .bookcont-main {
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
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
    margin: 10px 0;
    font-size: .7rem;
    cursor: pointer;
  }
  .bookcont-main .con-h2 {
    padding-left: 25px;
  }
  .bookcont .con-h2 {
    padding-left: 32px;
  }
  .elInput {
    display: inline-block;
    width: 200px;
  }
  
  .el_botton {
    text-align: center;
    margin-top: 20px;
  }
  .el_botton .el-button {
    width: 180px;
    margin: 0 20px;
  }
  
  .nodeName {
    display: inline-block;
    max-width: 80%;
    vertical-align: top;
  }
  
  .iconHolder {
    display:inline-block;
    width:27px;
  }
  /*预览用的*/
  .m-labels span {
    margin: 2px 5px;
  }
  
  .iconBox {
    display: inline-block;
    margin-left: 20px;
  }
  .i-addnode:hover,
  .i-addchildnode:hover,
  .i-toup:hover,
  .i-todown:hover {
    color: #00d487;
  }
</style>
