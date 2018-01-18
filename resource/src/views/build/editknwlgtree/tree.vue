<template>
  <div class="tree">
    <div class="title" v-show="RequestType === 'edit'">
      <span>{{point.learnStageName}}</span>
      <span>{{point.subjectName}}</span>
      <span>{{point.name}}</span>
    </div>
    <p class="subtit-knwlgcont">（当前共用一级知识点{{firstLevelCount}}个、二级知识点{{secondLevelCount}}个、三级知识点{{thirdLevelCount}}个、四级知识点{{fourthLevelCount}}个、五级知识点{{fifthLevelCount}}个）</p>

    <!-- 树 -->
    <div class="knwlgcont knwlgcont-main">
      <div v-for="(first, fIndex) in list" :key="fIndex">
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
            <el-input v-model="first.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
            <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(first)"></i>
            <span v-if="!first.isProtogenic">
              <i class="el-icon-close" @click.prevent.stop="deleteNode1(fIndex, list)"></i>
            </span>
          </span>
        </h2>
        <!-- 底下弹出的添加框 -->
        <div v-if="first.isAddNode">
          <el-input v-model="first.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
          <i class="el-icon-check" @click.prevent.stop="confirmAddNode(0, fIndex, list)"></i>
          <i class="el-icon-close" @click.prevent.stop="cancelAddNode(first)"></i>
        </div>
        <!-- 第一级添加子节点的框 -->
        <div v-if="first.isAddChildNode">
          <el-input v-model="first.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;"  :maxlength="50"></el-input>
          <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(1, fIndex, list)"></i>
          <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(first)"></i>
        </div>
        
        <!-- 第二级 -->
        <div v-show="!first.isCollapsed">
          <div class="con-h2" v-if="first.children.length > 0" v-for="(sec, sIndex) in first.children" :key="sIndex">
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
                <el-input v-model="sec.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(sec)"></i>
                <span v-if="!sec.isProtogenic">
                  <i class="el-icon-close" @click.prevent.stop="deleteNode2(fIndex, sIndex, list)"></i>
                </span>
              </span>
            </h3>
            <!-- 底下弹出的添加框 -->
            <div v-if="sec.isAddNode">
              <el-input v-model="sec.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
              <i class="el-icon-check" @click.prevent.stop="confirmAddNode(1, sIndex, first.children)"></i>
              <i class="el-icon-close" @click.prevent.stop="cancelAddNode(sec)"></i>
            </div>
            <!-- 第二级添加子节点的框 -->
            <div v-if="sec.isAddChildNode">
              <el-input v-model="sec.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="50"></el-input>
              <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(2, sIndex, first.children)"></i>
              <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(sec)"></i>
            </div>

            <!-- 第三级 -->
            <div v-show="!sec.isCollapsed">
              <div class="con-h3" v-if="sec.children.length > 0" v-for="(thr, tIndex) in sec.children" :key="tIndex">
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
                    <el-input v-model="thr.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                    <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(thr)"></i>
                    <span v-if="!thr.isProtogenic">
                      <i class="el-icon-close" @click.prevent.stop="deleteNode3(sIndex, tIndex, first.children)"></i>
                    </span>
                  </span>
                </h4>
                <!-- 底下弹出的添加框 -->
                <div v-if="thr.isAddNode">
                  <el-input v-model="thr.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                  <i class="el-icon-check" @click.prevent.stop="confirmAddNode(2, tIndex, sec.children)"></i>
                  <i class="el-icon-close" @click.prevent.stop="cancelAddNode(thr)"></i>
                </div>
                <!-- 第三级添加子节点的框 -->
                <div v-if="thr.isAddChildNode">
                  <el-input v-model="thr.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="50"></el-input>
                  <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(3, tIndex, sec.children)"></i>
                  <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(thr)"></i>
                </div>

                <!-- 第四级 -->
                <div v-show="!thr.isCollapsed">
                  <div class="con-h3" v-if="thr.children.length > 0" v-for="(four, fourIndex) in thr.children" :key="fourIndex">
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
                        <el-input v-model="four.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                        <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(four)"></i>
                        <span v-if="!four.isProtogenic">
                          <i class="el-icon-close" @click.prevent.stop="deleteNode4(tIndex, fourIndex, sec.children)"></i>
                        </span>
                      </span>
                    </h4>
                    <!-- 底下弹出的添加框 -->
                    <div v-if="four.isAddNode">
                      <el-input v-model="four.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                      <i class="el-icon-check" @click.prevent.stop="confirmAddNode(3, fourIndex, thr.children)"></i>
                      <i class="el-icon-close" @click.prevent.stop="cancelAddNode(four)"></i>
                    </div>
                    <!-- 第四级添加子节点的框 -->
                    <div v-if="four.isAddChildNode">
                      <el-input v-model="four.newChildNodeName" class="elInput" placeholder="（空）" clearable style="padding-left:25px;" :maxlength="50"></el-input>
                      <i class="el-icon-check" @click.prevent.stop="confirmAddChildNode(4, fourIndex, thr.children)"></i>
                      <i class="el-icon-close" @click.prevent.stop="cancelAddChildNode(four)"></i>
                    </div>

                    <!-- 第五级 -->
                    <div v-show="!four.isCollapsed">
                      <div class="con-h3" v-if="four.children.length > 0" v-for="(fif, fifIndex) in four.children" :key="fifIndex">
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
                            <el-input v-model="fif.newEditName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                            <i class="el-icon-check" @click.prevent.stop="confirmNameEdit(fif)"></i>
                            <span v-if="!fif.isProtogenic">
                              <i class="el-icon-close" @click.prevent.stop="deleteNode5(fourIndex, fifIndex, thr.children)"></i>
                            </span>
                          </span>
                        </h4>
                        <!-- 底下弹出的添加框 -->
                        <div v-if="fif.isAddNode">
                          <el-input v-model="fif.newNodeName" class="elInput" placeholder="（空）" clearable :maxlength="50"></el-input>
                          <i class="el-icon-check" @click.prevent.stop="confirmAddNode(4, fifIndex, four.children)"></i>
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
        <el-button type="primary">保存</el-button>
      </a>
    </div>
    <!-- 预览区 -->
    <el-dialog :title="point.name" center :visible.sync="isPreview">
      <div class="m-labels g-tc" v-if="RequestType==='add'">
        <span>{{lstageName}}</span>
        <span>{{subName}}</span>
        <span>{{lstageName}}{{subName}}</span>
      </div>
      <div class="m-labels g-tc" v-if="RequestType==='edit'">
        <span>{{point.learnStageName}}</span>
        <span>{{point.subjectName}}</span>
        <span>{{point.name}}</span>
      </div>
      <p class="subtit-knwlgcont">（当前共用一级知识点{{firstLevelCount || 0}}个、二级知识点{{secondLevelCount || 0}}个、三级知识点{{thirdLevelCount || 0}}个、四级知识点{{fourthLevelCount || 0}}个、五级知识点{{fifthLevelCount || 0}}个）</p>
      <!-- 第一级 -->
      <div class="knwlgcont">
        <div v-for="(first, fIndex) in list" @click.prevent.stop="toggleCollapse(list, fIndex)">
          <h2 class="tit-h2">
            <i :class="{'i-arr-r': first.isCollapsed,'i-arr-b-s': !first.isCollapsed}" class="g-mr20" v-show="first.children">
              <i class="i-arr-ra"></i>
              <i class="i-arr-rb"></i>
            </i>
            <div class="iconHolder-pre" v-show="!first.children"></div>
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
                <div class="iconHolder-pre" v-show="!sec.children"></div>
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
                    <div class="iconHolder-pre" v-show="!thr.children"></div>
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
                        <div class="iconHolder-pre" v-show="!four.children"></div>
                        {{four.name}}
                      </h4>
                      <!-- 第五级 -->
                      <div v-show="!four.isCollapsed">
                        <div class="con-h2" v-if="four.children.length > 0" v-for="(fif, fifIndex) in four.children" @click.prevent.stop="toggleCollapse(four.children, fifIndex)">
                          <h4 class="tit-h4">
                            <div class="iconHolder-pre" v-show="!fif.children"></div>
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
      RequestType: "", //请求的类别，是add还是edit，edit则通过id请求树的数据，add则给个空树

      firstLevelCount: 0,
      secondLevelCount: 0,
      thirdLevelCount: 0,
      fourthLevelCount: 0,
      fifthLevelCount: 0,

      isPreview: false,

      //add的时候允许修改学段和科目
      learnstageId: "",
      subjectId: ""
    }
  },
  props: ['type', 'knwId','lstageName','subName'],
  components: {
  },
  watch: {
    lstageId: function() {
      this.learnstageId = this.lstageId;
    }
  },
  methods: {
    //页面载入时拿数据
    getData: function() {
      var self = this,
        params = this.knwId; //id来的
      self.RequestType = this.type;
      if(this.knwId) {
        apiUrl.getKnwlgtreePreview(params).then(function (res) {
          console.log("初始化时的树结构:");
          console.log(res.data.knowledgePointCatalogList);
          self.content = res.data;
          self.initialize();
          self.$emit('loaded', {
            learnStageName: self.point.learnStageName,
            subjectName: self.point.subjectName,
          });
        }).catch(function (res) {
          console.log("拿取数据失败");
        });
      }
      else { //若是新建知识点树而不是编辑，则knwId不存在，新建一个知识点树根节点
        self.content = {
          knowledgePoint:{
            levelCounts: [1,0,0,0,0],
            learnStageName: "",
            name: "",
            subjectName: ""
          },
          knowledgePointCatalogList: [
            {
              name: "点我编辑第一个节点名称",
              serialNumber: 1
            },
          ]
        }
        self.initialize();
        self.$emit('loaded', {
          learnStageName: self.point.learnStageName,
          subjectName: self.point.subjectName,
        });
      }
    },
    //拿数据后初始化数据
    initialize: function () {
      var self = this,
        _content = self.content,
        list = [],
        catalogList = [];
      self.point = _content.knowledgePoint;
      self.list = _content.knowledgePointCatalogList;
      list = self.list;

      self.firstLevelCount = self.point.levelCounts[0] || 0;
      self.secondLevelCount = self.point.levelCounts[1] || 0;
      self.thirdLevelCount = self.point.levelCounts[2] || 0;
      self.fourthLevelCount = self.point.levelCounts[3] || 0;
      self.fifthLevelCount = self.point.levelCounts[4] || 0;

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
    //onmouseout时显示图标
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
    },
    //确认添加同级节点
    confirmAddNode: function(flag, index, list) {
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
      //若有父节点id
      var parentId = list[index].parentId;
      if(parentId) {
        Vue.set(list[list.length-1], 'parentId', parentId);
      }

      list[index].isAddNode = !list[index].isAddNode;
      list = list.sort(this.sortList);
      list[index].newNodeName = "";
      
      switch(flag) {
        case 0:
          this.firstLevelCount++;
          break;
        case 1:
          this.secondLevelCount++;
          break;
        case 2:
          this.thirdLevelCount++;
          break;
        case 3:
          this.fourthLevelCount++;
          break;
        case 4:
          this.fifthLevelCount++;
          break;
      }
    },
    //取消增加同级节点
    cancelAddNode: function(item) {
      item.isAddNode = !item.isAddNode;
      console.log("取消增加节点");
      item.newNodeName = "";
    },


    //增加子节点
    AddChildNode: function(item) {
      item.isAddChildNode = !item.isAddChildNode;
      item.isCollapsed = false;
    },
    //确认添加子节点
    confirmAddChildNode: function(flag, index, list) {
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
      //若该节点有id
      var parentId = list[index].id;
      if(parentId) {
        Vue.set(childList[childList.length-1], 'parentId', parentId);
      }

      list[index].isAddChildNode = !list[index].isAddChildNode;
      list[index].children = childList.sort(this.sortList);
      list[index].newChildNodeName = "";

      switch(flag) {
        case 1:
          this.secondLevelCount++;
          break;
        case 2:
          this.thirdLevelCount++;
          break;
        case 3:
          this.fourthLevelCount++;
          break;
        case 4:
          this.fifthLevelCount++;
          break;
      }
    },
    //取消增加子节点
    cancelAddChildNode: function(item) {
      item.isAddChildNode = !item.isAddChildNode;
      item.isCollapsed = !item.isCollapsed;
      console.log("取消增加子节点");
      item.newNodeName = "";
    },

    //删除节点
    //删除第一级的节点
    deleteNode1: function(fIndex, list) {
      var count1 = 1, count2 = 0, count3 = 0, count4 = 0, count5 = 0;
      //找到被删除的这一支在各级拥有多少节点
      var fChildList = list[fIndex].children;
      if(fChildList) {
        count2 = fChildList.length;
        for(var i = 0; i < fChildList.length; i++) {
          var sChildList = fChildList[i].children;
          if(sChildList) {
            count3 += sChildList.length;
            for(var j = 0; j < sChildList.length; j++) {
              var tChildList = sChildList[j].children;
              if(tChildList) {
                count4 += tChildList.length;
                for(var k = 0; k < tChildList.length; k++) {
                  var fourChildList = tChildList[k].children;
                  if(fourChildList) {
                    count5 += fourChildList.length;
                  }
                }
              }
            }
          }
        }
      }
      //从树结构中覆盖掉第一级有关的SerialNumber
      for(var i = list.length - 1; i > fIndex; i--) {
        list[i].serialNumber--;
      }
      list.splice(fIndex, 1);

      this.firstLevelCount -= count1;
      this.secondLevelCount -= count2;
      this.thirdLevelCount -= count3;
      this.fourthLevelCount -= count4;
      this.fifthLevelCount -= count5;
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },
    //删除第二级的节点
    deleteNode2: function(fIndex, sIndex, list) {
      var count2 = 1, count3 = 0, count4 = 0, count5 = 0;
      //找到被删除的这一支在各级拥有多少节点
      var fChildList = list[fIndex].children;
      var sChildList = fChildList[sIndex].children;
      if(sChildList) {
        count3 = sChildList.length;
        for(var i = 0; i < sChildList.length; i++) {
          var tChildList = sChildList[i].children;
          if(tChildList) {
            count4 += tChildList.length;
            for(var j = 0; j < tChildList.length; j++) {
              var fourChildList = tChildList[j].children;
              if(fourChildList) {
                count5 += fourChildList.length;
              }
            }
          }
        }
      }
      //从树结构中覆盖掉第二级有关的SerialNumber
      for(var i = fChildList.length - 1; i > sIndex; i--) {
        fChildList[i].serialNumber--;
      }

      fChildList.splice(sIndex, count2);
      //若删除了节点后children为空，要删除该属性
      if(fChildList.length == 0) {
        Vue.delete(list[fIndex], 'children');
      }
      this.secondLevelCount -= count2;
      this.thirdLevelCount -= count3;
      this.fourthLevelCount -= count4;
      this.fifthLevelCount -= count5;
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },
    //删除第三级节点
    deleteNode3: function(sIndex, tIndex, fChildList) {
      var count3 = 1, count4 = 0, count5 = 0;
      //找到被删除的这一支在各级拥有多少节点
      var sChildList = fChildList[sIndex].children;
      var tChildList = sChildList[tIndex].children;
      if(tChildList) {
        count4 = tChildList.length;
        for(var i = 0; i < tChildList.length; i++) {
          var fourChildList = tChildList[i].children;
          if(fourChildList) {
            count5 += fourChildList.length;
          }
        }
      }
      //从树结构中覆盖掉第三级有关的SerialNumber
      for(var i = sChildList.length - 1; i > tIndex; i--) {
        sChildList[i].serialNumber--;
      }

      sChildList.splice(tIndex, count3);
      //若删除了节点后children为空，要删除该属性
      if(sChildList.length == 0) {
        Vue.delete(fChildList[sIndex], 'children');
      }
      this.thirdLevelCount -= count3;
      this.fourthLevelCount -= count4;
      this.fifthLevelCount -= count5;
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },
    //删除第四级节点
    deleteNode4: function(tIndex, fourIndex, sChildList) {
      var count4 = 1, count5 = 0;
      //找到被删除的这一支在各级拥有多少节点
      var tChildList = sChildList[tIndex].children;
      var fourChildList = tChildList[fourIndex].children;
      if(fourChildList) {
        count5 = fourChildList.length;
      }
      //从树结构中覆盖掉第四级有关的SerialNumber
      for(var i = tChildList.length - 1; i > fourIndex; i--) {
        tChildList[i].serialNumber--;
      }

      tChildList.splice(fourIndex, count4);
      //若删除了节点后children为空，要删除该属性
      if(tChildList.length == 0) {
        Vue.delete(sChildList[tIndex], 'children');
      }
      this.fourthLevelCount -= count4;
      this.fifthLevelCount -= count5;
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },
    //删除第五级节点
    deleteNode5: function(fourIndex, fifIndex, tChildList) {
      var count5 = 1;
      var fourChildList = tChildList[fourIndex].children;
      //从树结构中覆盖掉第四级有关的SerialNumber
      for(var i = fourChildList.length - 1; i > fifIndex; i--) {
        fourChildList[i].serialNumber--;
      }

      fourChildList.splice(fifIndex, count5);
      //若删除了节点后children为空，要删除该属性
      if(fourChildList.length == 0) {
        Vue.delete(tChildList[fourIndex], 'children');
      }
      this.fifthLevelCount -= count5;
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },

    //点击向上/向下事件
    toUp: function(index, list) {
      var a = list[index].serialNumber;
      list[index].serialNumber = list[index-1].serialNumber;
      list[index-1].serialNumber = a;
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

  //
    //保存树,即传给父组件
    save: function () {
      this.$emit('save-tree', this.list);
    },

    //预览
    previewTree: function() {
      this.isPreview = true;
    },
  },
  mounted: function () {
    this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.subtit-knwlgcont {
  margin-top: 10px;
  text-align: center;
  font-size: .6rem;
  color: #999;
}
.knwlgcont {
  margin-top: 10px;
  padding-left: 100px;
  height: 380px;
  overflow-y: scroll;
  color: #232323;
}
.knwlgcont-main {
  background-color: white;
  border:1px solid #ccc;
  border-radius: 5px;
}
.iconHolder-pre {
  display:inline-block;
  width:27px;
}
.title {
  text-align: center;
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
  padding-left: 25px;
}
.knwlgcont .con-h3 {
  padding-left: 50px;
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
  width: 160px;
  margin: 0 20px;
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
