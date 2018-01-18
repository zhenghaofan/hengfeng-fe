<template>
<div class="g-filters-resource g-filters-resource-inner" :class="{'upload-page': isUploadPage, 'edit-page' : isEditPage}">
  <div class="g-form">
    <!-- 科段 -->
    <div class="col">
      <div class="control">
        <label class="label">科段：</label>
        <div class="txts">
          <el-popover
            ref="popoverSubject"
            placement="bottom-start"
            popper-class="g-form popover-tab g-filters-resource-inner"
            trigger="click">
            <div class="control">
              <label class="label">学段：</label>
              <div class="txts">
                <span 
                  class="btn-learn" 
                  v-for="(item, index) in learnStageList"
                  :id="item.id"
                  :class="{'z-selected': learnStageId === item.id}"
                  @click="setLearnStage(index, '', true)"
                >
                  {{item.name}}
                </span>
              </div>
            </div>
            <div class="control">
              <label class="label">科目：</label>
              <div class="txts">
                <span
                  class="btn-learn"
                  v-for="(item, index) in subjectList"
                  :id="item.id"
                  :class="{'z-selected': subjectId === item.id}"
                  @click="setSubject(index)"
                >{{item.name}}</span>
              </div>
            </div>
          </el-popover>
          <div 
            class="select-btn"
            v-popover:popoverSubject>
            <template v-if="learnStageName">{{learnStageName}}{{subjectName}}</template>
            <span class="placeholder" v-else>请选择科段</span>
            <i class="el-select__caret el-input__icon el-icon-arrow-up" :class="{'is-reverse': $refs.popoverSubject && $refs.popoverSubject.showPopper}"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 来源 -->
    <div class="col" v-if="isTempPage">
      <div class="control">
        <label class="label g-vertop">来源：</label>
        <div class="txts">
          <a href="#" class="btn-tab" @click.prevent="source=type.id" :class="{'btn-selected': source === type.id}" v-for="(type, index) in sourceTypes">{{type.name}}</a>
        </div>
      </div>
    </div>

    <!-- 编辑页　资源不可修改，习题的类型不可修改 -->
    <!-- 资源 -->
    <div class="col">
      <div class="control">
        <label class="label g-vertop">资源：</label>
        <div class="txts">
          <a href="#" class="btn-tab" @click.prevent="setResourceType(index, type.id)" :class="{'btn-selected': resourceDictId == type.id, 'btn-disabled': isEditPage && resourceDictId == type.id}" v-for="(type, index) in resourceTypes">{{type.name}}</a>
        </div>
      </div>
    </div>
    <!-- 类型 -->
    <!-- 编辑页　习题的类型不可修改 -->
    <div class="col" v-if="childDictList.length > 0 && (childDictList.length > 1 ||childDictList[0].name !== '不限')">
      <div class="control">
        <label class="label g-vertop">类型：</label>
        <div class="txts">
          <a href="#" 
            class="btn-tab" 
            @click.prevent="setChildDict(index)" 
            :class="{'btn-selected': childDictId == dict.id, 'btn-disabled': isEditPage && childDictId == dict.id && resourceDictId === 'EXERCISES'}" 
             v-for="(dict, index) in childDictList">{{dict.name}}</a>
        </div>
      </div>
    </div>

    <!-- 年级 -->
    <div class="col">
      <div class="control">
        <label class="label g-vertop">年级：</label>
        <div class="txts">
          <a href="#" 
            class="btn-tab" 
            @click.prevent="setGradeId(grade.id, true)" 
            :class="{'btn-selected': gradeId == grade.id}" 
             v-for="(grade, index) in gradeList">{{grade.name}}</a>
        </div>
      </div>
    </div>

    <!-- 学期（章节才有） -->
    <div class="col" v-if="textbookShow">
      <div class="control">
        <label class="label g-vertop">学期：</label>
        <div class="txts">
          <a href="#" 
            class="btn-tab" 
            @click.prevent="setTermId(term.id, true)" 
            :class="{'btn-selected': termId == term.id}" 
             v-for="(term, index) in termList">{{term.name}}</a>
        </div>
      </div>
    </div>

    <!-- 教材章节（章节才有） -->
    <div class="col" v-if="textbookShow">
      <div class="control">
        <label class="label">章节：</label>
        <div class="txts">
          <el-select class="select-resourelib g-mr10" @change="getUint"  v-model="textbookId" placeholder="教材题名">
            <el-option
              v-for="textbook in textbookList"
              :key="textbook.id"
              :label="textbook.displayName"
              :value="textbook.id">
            </el-option>
          </el-select>
          <el-select class="select-resourelib g-mr10" @change="getChapter" v-model="unitId" placeholder="选择单元">
            <el-option
              v-for="unit in unitList"
              :key="unit.id"
              :label="unit.name"
              :value="unit.id">
            </el-option>
          </el-select>
          <el-select class="select-resourelib g-mr10" @change="getCourse" v-model="chapterId" placeholder="选择章">
            <el-option
              v-for="chapter in chapterList"
              :key="chapter.id"
              :label="chapter.name"
              :value="chapter.id">
            </el-option>
          </el-select>
          <el-select class="select-resourelib g-mr10" @change="getClassHour" v-model="courseId" placeholder="选择节/课">
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.name"
              :value="course.id">
            </el-option>
          </el-select>
          <el-select class="select-resourelib" v-model="classHourId" placeholder="选择课时">
            <el-option
              v-for="classHour in classHourList"
              :key="classHour.id"
              :label="classHour.name"
              :value="classHour.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!-- 章节筛选\ -->

    <!-- 知识点树筛选 -->
    <div class="col" v-if="knwlegShow">
      <div class="control">
        <label class="label g-vertop">知识树：</label>
        <div class="txts">
          <el-popover
            ref="popoverTree"
            placement="bottom-start"
            popper-class="g-form popover-tab popover-tree g-filters-resource-inner"
            trigger="click">
            <!-- 弹出框内容 -->
            <div class="knwleg-tab">
              <div class="knwleg-l">
                <!-- 搜索输入框 -->
                <div class="g-search">
                  <input type="search" class="g-ipt-search" v-model="knwlegKeyword" placeholder="输入知识点名" maxlength="50" />
                </div>
                <!-- 树 -->
                <div class="knwleg-tree">
                  <el-tree
                    class="filter-tree"
                    :highlight-current="true"
                    :data="knwlegTree"
                    :props="defaultProps"
                    :filter-node-method="filterKnwleg"
                    auto-expand-parent
                    accordion
                    @node-click="getKnwlegChildren"
                    @node-expand="filterKnwlegLeaf"
                    ref="tree">
                  </el-tree>
                </div>
              </div>
              <!-- 弹出框右边 -->
              <div class="knwleg-r">
                <p class="knwleg-tit"><i class="iconf i-light"></i>可选知识点</p>
                <div class="knwleg-level g-ml10" v-if="leafList.length > 0">
                  <span class="item" v-for="(item, index) in levelList">
                    <i v-if="index > 0">&gt;</i>{{item.name}}
                  </span>
                </div>
                <div class="leaf-box">
                  <el-checkbox 
                    v-for="(leaf, index) in leafList"
                    v-model="leaf.isChecked" 
                    :key="leaf.id"
                    @change="toggleLeafList(index)">{{leaf.name}}</el-checkbox>
                  <span v-if="isLeaf" class="t-error">请选择倒数第二级节点</span>
                </div>
                <div class="knwleg-opts">
                  <el-checkbox  v-if="leafList.length > 0" v-model="checkAllKnwleg" @change="toggleCheckAll">全选</el-checkbox>
                  <div class="f-r"><a href="#" class="btn-knwleg" @click.prevent="setSelectedKnwlegList">确定</a><a href="#" @click.prevent="cancelSet" class="btn-knwleg g-ml20 g-mr20">取消</a></div>
                </div>
              </div>
            </div>
          </el-popover>

          <div>
            <span 
              class="select-btn"
              @click="getKnwlegOptions(false)"
              v-popover:popoverTree>
              <template v-if="learnStageName&&subjectName">{{learnStageName}}{{subjectName}}知识点树</template>
              <span class="placeholder" v-else>请选择科段获取知识点树</span>
              <i class="el-select__caret el-input__icon el-icon-arrow-up" :class="{'is-reverse': $refs.popoverTree && $refs.popoverTree.showPopper}"></i>
            </span>
            <span>已选{{selectedKnwlegCount}}个知识点</span>
          </div>

          <!-- 展示已选知识点 -->
          <div class="knwleg-selected-tab" v-if="selectedKnwlegList.length > 0 && isKnwlegSelTabShow">
            <div class="knwleg-selected-item" v-for="(list, listIndex) in selectedKnwlegList">
              <div class="knwleg-level">
                <span class="item" v-for="(item, index) in list.parent">
                  <i v-if="index > 0">&gt;</i>{{item.name}}
                </span>
              </div>

              <div class="knwleg-leaf">
                <span
                  class="item"
                  v-for="(item, index) in list.leaf">
                  {{item.name}}
                  <i class="iconf i-delete" @click="delSelectedKnwleg(listIndex, index)"></i>
                </span>
              </div>

              <div class="btn-del-selknwleg" @click="delSelectedKnwleg(listIndex)"><i class="iconf i-delete"></i></div>
            </div>
          </div>

          <!-- 显示/收起选中知识点 -->
          <div class="btn-toggle-knwleg">
            <span v-if="isKnwlegSelTabShow" @click="isKnwlegSelTabShow=false">收起选中知识点<i class="i-arrow i-arrow-b"></i></span>
            <span v-else @click="isKnwlegSelTabShow=true">显示选中知识点<i class="i-arrow i-arrow-t"></i></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 知识点树筛选\ -->
  </div>
</div>
</template>
<script>
import Vue from 'vue'
//集成api
import apiUrl from '@/api/url.js'
import utils from '@/utils/'
//引入系统常量数据
import GL_CONST from '@/confdata/constant'

const SOURCETYPES = [
  {
    id: '',
    name: '不限',
  }, {
    id: 0,
    name: '内网',
  }, {
    id: 1,
    name: '外网',
  },
];
const initData = {
  /* 学年科信息 */
  isSubjectTabShow: false,
  //学段
  learnStageList: [],
  learnStageId: '',
  learnStageName: '',
  learnStageSubjectIds: [],
  //学科
  subjectList: [],
  subjectId: '',
  subjectName: '',
  /* 来源 */
  sourceTypes: [
    {
      id: '',
      name: '不限',
    }, {
      id: 0,
      name: '内网',
    }, {
      id: 1,
      name: '外网',
    },
  ],
  source: '',
  /* 资源 */
  //资源类别
  resourceTypes: GL_CONST.RESOURCETYPES,
  resourceDictId: '',
  resourceDictIndex: 0,
  //题型模板
  quesTemplate: '',
  //资源类别二级标签
  childDictList: [],
  childDictId: '',
  /* 年级 */
  //年级
  gradeList: [],
  gradeId: '',
  /* 学期 */
  //所属学期
  termList: [],
  termId: '',
  /* 教材信息 */
  //教材题名
  textbookList: [],
  textbookId: '',
  //所属单元
  unitList: [],
  unitId: '',
  //选择章
  chapterList: [],
  chapterId: '',
  //选择节/课
  courseList: [],
  courseId: '',
  //选择课时
  classHourList: [],
  classHourId: '',
  /* 知识点 */
  //是否显示知识点tab
  isKnwlegTabShow: false,
  //搜索关键字
  knwlegKeyword: '',
  //知识点树
  knwlegTree: [],
  defaultProps: {
    children: 'children',
    label: 'name',
  },
  //全选
  checkAllKnwleg: false,
  //等级
  levelList: [],
  //最后一级
  leafList: [],
  //已选知识点
  selectedKnwlegList: [],
  //已选知识点数目
  selectedKnwlegCount: 0,
  //已选知识点tab显示
  isKnwlegSelTabShow: true,
  //知识点树ID
  knowledgePointId: '',
  //知识点目录ID，多个(,)隔开
  knowledgePointCatalogIds: [],
  isLeaf: false,
  //控制不同选项的显示
  knwlegShow: false,
  textbookShow: false,
  temp: {},
};
export default {
  data: function () {
    return {
      /* 学年科信息 */
      isSubjectTabShow: false,
      //学段
      learnStageList: [],
      learnStageId: '',
      learnStageName: '',
      learnStageSubjectIds: [],
      //学科
      subjectList: [],
      subjectId: '',
      subjectName: '',
      /* 来源 */
      sourceTypes: [
        {
          id: '',
          name: '不限',
        }, {
          id: 0,
          name: '内网',
        }, {
          id: 1,
          name: '外网',
        },
      ],
      source: '',
      /* 资源 */
      //资源类别
      resourceTypes: GL_CONST.RESOURCETYPES,
      resourceDictId: '',
      resourceDictIndex: 0,
      //题型模板
      quesTemplate: '',
      //资源类别二级标签
      childDictList: [],
      childDictId: '',
      /* 年级 */
      //年级
      gradeList: [],
      gradeId: '',
      /* 学期 */
      //所属学期
      termList: [],
      termId: '',
      /* 教材信息 */
      //教材题名
      textbookList: [],
      textbookId: '',
      //所属单元
      unitList: [],
      unitId: '',
      //选择章
      chapterList: [],
      chapterId: '',
      //选择节/课
      courseList: [],
      courseId: '',
      //选择课时
      classHourList: [],
      classHourId: '',
      /* 知识点 */
      //是否显示知识点tab
      isKnwlegTabShow: false,
      //搜索关键字
      knwlegKeyword: '',
      //知识点树
      knwlegTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      //全选
      checkAllKnwleg: false,
      //等级
      levelList: [],
      //最后一级
      leafList: [],
      //已选知识点
      selectedKnwlegList: [],
      //已选知识点数目
      selectedKnwlegCount: 0,
      //已选知识点tab显示
      isKnwlegSelTabShow: true,
      //知识点树ID
      knowledgePointId: '',
      //知识点目录ID，多个(,)隔开
      knowledgePointCatalogIds: [],
      isLeaf: false,
      //控制不同选项的显示
      knwlegShow: false,
      textbookShow: false,
      allhas: {
        id: '',
        name: '不限',
      }, 
      temp: {},
    };
  },
  watch: {
    'resource.id': {
      handler: function (val) {
        this.init();
      },
      deep: true,
    },
    'searchType': {
      handler: function (val) {
        this.init();
      }
    },
    needReset() {
      this.init();
    },
    knwlegKeyword(val) {
      this.$refs.tree.filter(val);
    },
    learnStageId(val) {
      /*if (val) {
        //获取年级
        this.getGrade();
      }*/
      
      /*if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook();
      }*/
      
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    subjectId(val) {
      if (this.learnStageId && val) {
        //获取年级
        this.getGrade();
      }

      if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook();
      }

      //习题时，需要有subjectId 才获取资源类型（二级标签） 非编辑页
      //且是第一次进入的 编辑页
      if ((this.resourceDictId === 'EXERCISES' && !this.isEditPage) || (this.isEditPage && this.temp.childDictId)) {
        for (var i = 0, len = this.resourceTypes.length; i < len; i++) {
          if (this.resourceDictId === this.resourceTypes[i].id) {
            this.getResouceChild(i);
            break;
          }
        }
      }

      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    //来源
    source(val) {
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    resourceDictId() {
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    childDictId() {
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    gradeId() {
      if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook();
      }
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    termId() {
      /*if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook();
      }*/
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    knowledgePointId() {
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    'knowledgePointCatalogIds': {
      handler() {
        //把筛选信息返回给父组件
        this.returnFilterInfo();
      },
      deep: true,
    },
    textbookId() {
      this.getUint();
      //重置章节信息
      //!this.temp.unitId && this.resetTextInfo('textbook');
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    unitId() {
      this.getChapter();
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    chapterId() {
      this.getCourse();
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    courseId() {
      this.getClassHour();
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
    classHourId() {
      //把筛选信息返回给父组件
      this.returnFilterInfo();
    },
  },
  props: [
    'searchType', //textbook章节，know知识点，all所有
    'isUploadPage', //是否是上传页
    'isEditPage', //是否是编辑页
    'resource',//初始化数据
    'needReset', //是否需要重置
    'isTempPage',//暂存资源页
  ],
  methods: {
    //获取学科段
    getSubjectOptions: function () {
      var self = this;

      apiUrl.getSubjectOptions().then(function (res) {
        var _result = res.data;

        //返回数据有误
        if (res.data && !_result.learnStageList) {
          return;
        }

        self.learnStageList = _result.learnStageList;
        self.tmpSubjectList = _result.subjectList;
        self.subjectList = _result.subjectList;

        //从登录接口里获取信息，或搜索过滤过
        if (self.resource && self.resource.learnStage && self.resource.learnStage.id || self.learnStageId && self.subjectId) {
          var learnStageList = self.learnStageList;
          
          //编辑页
          if (self.isEditPage) {
            self.learnStageId = self.resource.learnStage.id;
            self.subjectId = self.resource.subject.id;
          }

          //学段
          for (var i = 0, len = learnStageList.length; i < len; i++) {
            if (learnStageList[i].id === self.learnStageId) {
              self.setLearnStage(i, self.subjectId);
              break;
            }
          }
          
        } else {
        //登录中未给，且未选择过，默认选中第一个
          self.setLearnStage(0, self.subjectId);
        }
        
      });
    },
    //获取科目
    getSubject: function (subjectId, needClearTextbookId) {
      if (!this.learnStageId) {
        return;
      }

      this.subjectList = [];
      this.subjectId = subjectId || '';
      this.subjectName = '';

      var list = this.tmpSubjectList;
      for (var i = 0, len = list.length; i < len; i++) {
        if (this.learnStageSubjectIds.indexOf(list[i].id) !== -1) {
          this.subjectList.push(list[i]);
          //有默认值时
          if (list[i].id === subjectId) {
            this.subjectName = list[i].name;
          }
        }    
      }

      //无默认值，选中第一个
      if (!subjectId) {
        this.setSubject(0);
        return;
      }

      if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook(needClearTextbookId);
      }
    },
    //设置学段
    setLearnStage(index, subjectId, needClearTextbookId) {
      var list = this.learnStageList;

      this.learnStageName = list[index].name;
      this.learnStageSubjectIds = list[index].subjectIds;

      //已选中时||默认值时
      if (this.learnStageId === list[index].id) {
        //默认值时
        //获取对应学段下的科目
        subjectId && this.getSubject(subjectId, needClearTextbookId);        
        return;
      }
      
      //点击选中时
      this.learnStageId = list[index].id;
      //保存至localStorage
      window.localStorage.setItem('learnStageId', this.learnStageId);

      this.getGrade();
      //获取对应学段下的科目
      this.getSubject('', needClearTextbookId);
    },
    //设置科目
    setSubject(index) {
      var list = this.subjectList;

      this.subjectName = list[index].name;

      //已选中时||默认值时
      if (this.subjectId === list[index].id) {
        return;
      }
      
      //点击选中时
      this.subjectId = list[index].id;
      //保存至localStorage
      window.localStorage.setItem('subjectId', this.subjectId);

      //学段也选了，隐藏tab
      if (this.learnStageId) {
        this.$refs.popoverSubject.showPopper = false;
        //this.isSubjectTabShow = false;
        //是知识点筛选||上传页面时
        if (this.searchType === 'knwleg') {
          //获取知识树结构
          this.getKnwlegOptions();
        } else if (this.searchType === 'textbook') {
          //获取课本
          this.getTextbook(true);
        } else {
          //获取课本
          this.getTextbook(true);
          //获取知识树结构
          this.getKnwlegOptions(true);
        }
      }
    },
    //设置年级
    setGradeId(id, needClearTextbookId) {
      this.gradeId = id;
      if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook(needClearTextbookId);
      }
      this.knwlegShow && this.getKnwlegOptions(true);
    },
    //设置学期
    setTermId(id, needClearTextbookId) {
      this.termId = id;
      if (this.searchType === 'textbook' || this.searchType === 'all') {
        //获取教材
        this.getTextbook(needClearTextbookId);
      }
    },
    //设置选中资源
    setResourceType: function (index, id) {
      if (index === '' && id === undefined) {
        return;
      }

      //当时已选中时||是编辑页 且不是第一次载入时，不可操作
      if ((this.resourceDictId === id || this.isEditPage) && index !== '') {
        return;
      }

      //设置选中ID
      var list = this.resourceTypes;
      this.resourceDictId = id || this.resourceTypes[index].id;
      if (id && index === '') {
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].id === id) {
            this.resourceDictIndex = i;
          }
        }
      } else {
        this.resourceDictIndex = index;
      }
      this.quesTemplate = '';
      //获取二级标签内容
      this.getResouceChild();
    },
    //二级标签切换
    setChildDict(index, id) {
      if (this.childDictList.length < 1) {
        return;
      }

      //编辑页&&资源是习题&&不是第一次载入||当前已选中时，二级不可切换
      if (this.isEditPage && this.resourceDictId === 'EXERCISES' && index !== '' || this.childDictId === id) {
        return;
      }

      //设置选中ID
      var list = this.childDictList;

      this.childDictId = id || this.childDictList[index].id;

      if (id && index === '') {
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].id === id) {
            this.quesTemplate = list[i].template;
          }
        }
      } else {
        this.quesTemplate = this.childDictList[index].template;
      }
    },
    //获取二级标签内容
    getResouceChild: function () {
      //当resourceDictId=EXERCISES时必须提供
      if (this.resourceDictId === 'EXERCISES' && !this.subjectId) {
        return;
      }

      //清空二级标签
      this.childDictList = [];
      if (!this.isUploadPage || !this.isEditPage) {
        this.childDictList.unshift(this.allhas);
      }
      this.childDictId = '';

      if (!this.resourceDictId) {
        return;
      }

      var self = this,
          params = {
            resourceDictId: this.resourceDictId,
            subjectId: this.subjectId,
          };

      apiUrl.getResourceTags(params).then(function (res) {
        self.childDictList = res.data;
        //上传页默认选中第一个
        if (self.isUploadPage) {
          self.setChildDict(0);
        } else if (self.isEditPage) {
        //编辑页
          //第一次载入
          if (self.temp.childDictId) {
            self.temp.childDictId = '';
            self.setChildDict('', self.resource.childDictId);
          } else {
            //默认选中第一个
            self.setChildDict(0);
          }    
        } else {
          self.childDictList.unshift(self.allhas);
        }
      });
    },
    //获取年级
    getGrade: function () {
      if (!this.learnStageId) {
        return;
      }

      var self = this,
          params = {
            learnStageId: this.learnStageId,
            subjectId: this.subjectId,
          };

      //重置年级信息
      this.gradeList = [];
      this.gradeId = '';

      apiUrl.getGradeOptions(params).then(function (res) {
        self.gradeList = res.data;

        //上传页，默认选中第一个
        if (self.isUploadPage) {
          self.gradeId = self.gradeList[0].id;
        } else if (self.isEditPage) {
          if (self.temp.gradeId) {
            self.gradeId = self.resource.grade.id;
            self.temp.gradeId = '';
          } else {
            //默认选中第一个
            self.gradeId = self.gradeList[0].id;
          }
        } else {
          self.gradeList.unshift(self.allhas);
        }
        
      });
    },
    //重置章节信息
    resetTextInfo: function (type) {
      //选择教材时
      if (type === 'textbook') {
        this.unitList = [];
        this.unitId = '';
        this.chapterList = [];
        this.chapterId = '';
        this.courseList = [];
        this.courseId = '';
        this.classHourList = [];
        this.classHourId = '';
      } else if (type === 'unit') {
      //选择单元时
        this.chapterList = [];
        this.chapterId = '';
        this.courseList = [];
        this.courseId = '';
        this.classHourList = [];
        this.classHourId = '';
      } else if (type === 'chapter') {
      //选择章时
        this.courseList = [];
        this.courseId = '';
        this.classHourList = [];
        this.classHourId = '';
      } else if (type === 'course') {
        this.classHourList = [];
        this.classHourId = '';
      }
    },
    //获取教材
    getTextbook: function (needClearTextbookId) {
      var self = this,
          params = {
            function: 'TEXTBOOK',
            learnStageId: self.learnStageId,
            gradeId: self.gradeId || self.temp.gradeId,
            subjectId: self.subjectId,
            termDictId: self.termId
          };

      apiUrl.getTextbookOptions(params).then(function (res) {
        var _result = res.data;

        //返回数据有误
        if (res.data && !_result.textbookList) {
          return;
        }

        self.textbookList = _result.textbookList;

        if (needClearTextbookId) {
          self.textbookId = '';
          //重置章节信息
          self.resetTextInfo('textbook');
        }

        if (self.isEditPage && self.temp.textbookId) {
          self.textbookId = self.resource.textbook.id;
          self.temp.textbookId = '';                
        }

      });
    },
    //获取单元
    getUint: function () {
      if (!this.textbookId) {
        return;
      }
      var self = this,
          params = {
            function: 'TEXTBOOK_CATALOG',
            textbookId: self.textbookId
          };

      apiUrl.getTextbookOptions(params).then(function (res) {
        var _result = res.data;

        //返回数据有误
        if (!res.data) {
          return;
        }
        
        self.unitList = _result.textbookCatalogList || [];

        if (self.isEditPage && self.temp.unitId) {
          self.unitId = self.temp.unitId;
          self.temp.unitId = '';        
        } else {
          self.unitId = '';
          //重置章节信息
          self.resetTextInfo('unit');
        }

        
      });
    },
    //获取章
    getChapter: function () {
      var self = this,
          list = self.unitList;

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === self.unitId) {
          self.chapterList = list[i].children || [];
          
          if (self.isEditPage && self.temp.chapterId) {
            self.chapterId = self.temp.chapterId; 
            self.temp.chapterId = '';         
          } else {
            self.chapterId = '';
            //重置章节信息
            self.resetTextInfo('chapter');
          }

          break;
        }
      }
    },
    //获取节/课
    getCourse: function () {
      var self = this,
          list = self.chapterList;

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === self.chapterId) {
          self.courseList = list[i].children || [];

          if (self.isEditPage && self.temp.courseId) {
            self.courseId = self.temp.courseId; 
            self.temp.courseId = '';         
          } else {
            self.courseId = '';
            //重置章节信息
            self.resetTextInfo('course');
          }

          break;
        }
      }
    },
    //获取课时
    getClassHour: function () {
      var self = this,
          list = self.courseList;

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === self.courseId) {
          self.classHourList = list[i].children || [];
          
          if (self.isEditPage && self.temp.classHourId) {
            self.classHourId = self.temp.classHourId;
            self.temp.classHourId = '';        
          } else {
            self.classHourId = '';
          }

          break;
        }
      }
    },
    //获取知识点项菜单
    getKnwlegOptions: function (needClearSeltedKnwInfo) {
      if (!this.learnStageId || !this.subjectId) {
        return;
      }

      //清除之前的数据
      this.knwlegKeyword = "";
      this.levelList = [];
      this.leafList = [];
      this.checkAllKnwleg = false;
      this.knwlegTree = [];
      this.knowledgePointId = '';
      //修改了学段学科时，需要清除已选中的知识点
      if (needClearSeltedKnwInfo) {
        this.selectedKnwlegList = [];
        this.selectedKnwlegCount = 0;
      }

      var self = this,
          params = {
            learnStageId: self.learnStageId,
            subjectId: self.subjectId
          };

      apiUrl.getKnwlegOptions(params).then(function (res) {
        var _result = res.data;

        //返回数据有误
        if (res.data && !_result.knowledgePointCatalogList) {
          return;
        }

        self.knwlegTree = _result.knowledgePointCatalogList;
        self.knowledgePointId = _result.knowledgePointId;
        self.$refs.tree.props.isLeaf = self.isVisualLeaf;
      });
    },
    //搜索知识点时的过滤，叶子节点不返回
    filterKnwleg(value, data, node) {
      //节点被展开时进行筛选，为false该节点不显示
      if (!value) {
        //加个判断，判断是否是根节点，若是根节点则不隐藏
        if(this.isRoot(data.name)) {
          return true;
        }
        return !node.isLeaf;
      }

      //搜索时对节点进行筛选时执行
      if(this.isRoot(data.name)) {
        return data.name.indexOf(value) !== -1;
      }
      return data.name.indexOf(value) !== -1 && !node.isLeaf;
    },
    //通过name判断是否是根节点（一级知识点）
    isRoot(name) {
      for(var i in this.knwlegTree) {
        //加个判断，判断是否是根节点，若是根节点则不隐藏
        if(name == this.knwlegTree[i].name) {
          // 若为根节点则显示
          return true;
        }
      }
      return false;
    },
    //搜索知识点时的过滤
    filterKnwlegLeaf(knwlegTree, knwlegNode, node) {
      if(this.knwlegKeyword){
        this.$refs.tree.filter(this.knwlegKeyword);
      }
      this.$refs.tree.filter('');
    },
    //是否是倒数第二层节点
    isVisualLeaf(knwlegTree, knwlegNode) {
      //无子节点，是真正的叶节点
      if (!knwlegTree.children) {
        return true;
      }

      //有子节点
      var list = knwlegTree.children;
      for (var i = 0, len = list.length; i < len; i++) {
        //还有子节点，说明不是倒数第二层
        if (list[i].children) {
          return false;
        }
      }

      //只有一层子节点，虚拟的叶节点
      return true;
    },
    //重置树
    resetKnwlegTree() {
      //清除之前的数据
      this.levelList = [];
      this.leafList = [];
      this.checkAllKnwleg = false;
      this.isLeaf = false;

      //重新加载知识点树
      this.knwlegTree = this.knwlegTree.concat([]);
    },
    //获取子节点
    getKnwlegChildren(knwlegNode, treeNode, tree) {
      if(this.knwlegKeyword) {
        this.$refs.tree.filter(this.knwlegKeyword);
      }
      var children = knwlegNode.children,
          isLastParentNode = true,
          levelList = [],
          node = treeNode;

      this.levelList = [];
      this.leafList = [];
      //有子节点且是倒数第二层，即是最后一层父节点
      if (children) {
        //子节点不再有子节点
        for (var i = 0, len = children.length; i < len; i++) {
          if (children[i].children) {
            isLastParentNode = false;
          }
        }

        //是最后一层父节点，其子节点展示在右边
        if (isLastParentNode) {
          while (node.parent) {
            levelList.push(node.data);
            node = node.parent;
          }
          this.levelList = levelList.reverse();
          this.leafList = children;
        }
      }

      //叶子节点
      /*if (node.isLeaf) {
        while (node.parent) {
          levelList.push(node.data);
          node = node.parent;
        }
        this.levelList = levelList.reverse();
        this.leafList = [knwlegNode];
      }*/
      if (node.isLeaf) {
        this.isLeaf = true;
      } else {
        this.isLeaf = false;
      }
    },
    //选中/取消叶子节点
    toggleLeafList(index) {
      var list = this.leafList,
          isChecked = list[index].isChecked,
          isCheckedAll = true;

      //选中
      if (isChecked) {
        for (var i = 0, len = list.length; i < len; i++) {
          if (!list[i].isChecked) {
            isCheckedAll = false;
            break;
          }
        }

        //所有子节点已选中
        if (isCheckedAll) {
          this.checkAllKnwleg = true;
        }

      } else {
      //取消
        this.checkAllKnwleg = false;
      }

    },
    //切换全选
    toggleCheckAll() {
      var list = this.leafList,
          isChecked = this.checkAllKnwleg;

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].isChecked === undefined) {
          Vue.set(list[i], 'isChecked', isChecked);
        } else {
          list[i].isChecked = isChecked;
        }
      }

    },
    //确定选中
    setSelectedKnwlegList() {
      //未有子节点
      if (this.levelList.length < 1 || this.leafList.length < 1) {      
        //隐藏筛选框
        this.$refs.popoverTree.showPopper = false;
        //this.isKnwlegTabShow = false;
        return;
      }

      var list = this.leafList,
          levelList = this.levelList,
          selectedList = this.selectedKnwlegList,
          curId = levelList[levelList.length - 1].id,//取父节点的id
          parent = levelList,
          resultList = [];

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].isChecked) {
          resultList.push(list[i]);
        }
      }

      //并未选中任何值
      if (resultList.length < 1) {
        //隐藏筛选框
        this.$refs.popoverTree.showPopper = false
        //this.isKnwlegTabShow = false;
        return;
      }

      for (var j = 0, len2 = selectedList.length; j < len2; j++) {
        //当前列表中有些项，则删除当前项
        if (selectedList[j].id === curId) {
          this.selectedKnwlegCount -= selectedList[j].leafCount;
          selectedList.splice(j, 1);
          break;
        }
      }
      //放到最顶部
      selectedList.unshift({
        parent: parent,
        id: curId,
        leaf: resultList,
        leafCount: resultList.length,
      });
      this.selectedKnwlegCount += resultList.length;

      //隐藏筛选框
      this.$refs.popoverTree.showPopper = false;
      //this.isKnwlegTabShow = false;
      //设置当前所选知识点目录ID
      this.setKnowledgePointIdCatalogIds();
    },
    //取消选中
    cancelSet() {
      this.knwlegKeyword = "";
      this.$refs.popoverTree.showPopper=false;
    },
    //删除选中的知识点
    delSelectedKnwleg(listIndex, leafIndex) {
      var knwlegNode = this.selectedKnwlegList[listIndex];

      //删除某叶子节点
      if (leafIndex !== undefined) {
        this.selectedKnwlegCount -= 1;
        knwlegNode.leaf.splice(leafIndex, 1);
        knwlegNode.leafCount -= 1;
        //整枝删除了
        if (knwlegNode.leafCount < 1) {
          this.selectedKnwlegList.splice(listIndex, 1);
        }
        //全部删除了
        if (this.selectedKnwlegCount < 1) {
          this.selectedKnwlegList = [];
        }
      } else {
      //删除整枝
        this.selectedKnwlegCount -= knwlegNode.leafCount;
        this.selectedKnwlegList.splice(listIndex, 1);
      }

      //设置当前所选知识点目录ID
      this.setKnowledgePointIdCatalogIds();
    },
    //设置当前所选知识点目录ID
    setKnowledgePointIdCatalogIds() {
      var list = this.selectedKnwlegList;
      this.knowledgePointCatalogIds = [];
      for (var i = 0, len = list.length; i < len; i++) {
        for (var j = 0, len2 = list[i].leaf.length; j < len2; j++) {
          this.knowledgePointCatalogIds.push(list[i].leaf[j].id);
        }
      }
    },
    //把筛选信息返回给父组件
    returnFilterInfo: function () {
      var info = {
            learnStageId: this.learnStageId,
            subjectId: this.subjectId,
            source: this.source,
            resourceDictId: this.resourceDictId,
            resourceDictIndex: this.resourceDictIndex,
            quesTemplate: this.quesTemplate,
            childDictId: this.childDictId,
            gradeId: this.gradeId,
            termDictId: this.termId,
            knowledgePointId: this.knowledgePointId,
            knowledgePointCatalogIds: this.knowledgePointCatalogIds.join(','),
            textbookId: this.textbookId,
            textbookCatalogId: this.classHourId || this.courseId || this.chapterId || this.unitId//没有章就用节
          };

      //触发事件
      this.$emit('filtered', info);
    },
    //获取初始始化的章节信息
    getTextbookCatalogsInfo(textbookCatalogs) {
      if (!textbookCatalogs || textbookCatalogs.length < 1) {
        return;
      }

      var cat;
      this.temp.unitId = textbookCatalogs[0].id;

      cat = textbookCatalogs[0].children;
      if (cat && cat[0]) {
        this.temp.chapterId = cat[0].id;

        cat = textbookCatalogs[0].children[0].children;
        if (cat && cat[0]) {
          this.temp.courseId = cat[0].id;

          if (cat && cat[0]) {
            this.temp.classHourId = cat[0].id;
          }
        }
      }
      
    },
    //获取初始化的知识点树
    getSelectedKnwlegListInfo(knowledgePointCatalogs) {
      if (!knowledgePointCatalogs || knowledgePointCatalogs.length < 1) {
        return;
      }
      this.selectedKnwlegCount = 0;

      var self = this,
          knowledgePointCatalogs = knowledgePointCatalogs,
          parent = [],
          curId,
          node,
          parentNode;

      function getRes(node) {
        var curId = node.id,
            resultList = [],
            list = [];

        parent.push({
          id: node.id,
          name: node.name,
        });

        if(node.children) {
          parentNode = node;
          list = node.children;

          for (var i = 0, len = list.length; i < len; i++) {
            node = list[i];
            //最后一级
            if (!node.children || node.children && node.children.length < 1) {
              resultList = parentNode.children;
              self.selectedKnwlegCount += resultList.length;
              self.selectedKnwlegList.push({
                parent: parent,
                id: curId,
                leaf: resultList,
                leafCount: resultList.length,
              });
              break;
            } else {
              getRes(node);
            }
          }
        }
      }

      for (var i = 0, len = knowledgePointCatalogs.length; i < len; i++) {
        parent = [];
        node = knowledgePointCatalogs[i];
        //curId = node.id;
        getRes(node);        
      }
    },
    //初始化下接及其他选项
    init: function () {
      //重置data数据
      this.resetForm();

      var searchType = this.searchType;

      //章节要显示的
      if (searchType === 'textbook') {
        this.knwlegShow = false;
        this.textbookShow = true;
      } else if (searchType === 'knwleg') {
      //知识点树要显示的
        this.knwlegShow = true;
        this.textbookShow = false;
      } else if (searchType === 'all') {
        this.knwlegShow = true;
        this.textbookShow = true;
      }

      //编辑页
      if (this.isEditPage) {
        if (!this.resource) {
          return;
        }

        var initRes = this.resource;
        //获取学科段
        this.getSubjectOptions();

        //设置资源
        this.setResourceType('', initRes.resourceDictId);
        this.temp.childDictId = initRes.childDictId;
        this.childDictId = initRes.childDictId;

        //年级
        this.temp.gradeId = initRes.grade.id;

        //学期
        this.termList = utils.cloneObj(GL_CONST.TERM);

        if (initRes.textbook) {       
          this.termId = initRes.textbook.termDictId;
          //课本
          this.temp.textbookId = initRes.textbook.id;
        }
        
        //章节
        this.getTextbookCatalogsInfo(initRes.textbookCatalogs);
        
        //知识点树
        this.getSelectedKnwlegListInfo(initRes.knowledgePointCatalogs);
        //设置当前所选知识点目录ID
        this.setKnowledgePointIdCatalogIds();

        return;
      }

      //默认科段
      this.learnStageId = window.localStorage.getItem('learnStageId') || '';
      this.subjectId = window.localStorage.getItem('subjectId') || '';
      //获取学科段
      this.getSubjectOptions();
      
      this.resourceTypes = utils.cloneObj(GL_CONST.RESOURCETYPES);
      this.termList = utils.cloneObj(GL_CONST.TERM);
      this.childDictList = [];
      this.gradeList = [];

      //获取学段
      this.getGrade();

      //上传页，默认选中第一个
      if (this.isUploadPage) {
        //资源
        this.setResourceType(0);
        //学期
        this.termId = this.termList[0].id;
      } else {
      //非上传页，加上不限
        this.resourceTypes.unshift(this.allhas);
        this.childDictList.unshift(this.allhas);
        //this.gradeList.unshift(this.allhas);
        this.termList.unshift(this.allhas);
      }

      //清除已选中知识点
      this.selectedKnwlegList = [];

    },
    //重置data数据
    resetForm: function () {
      //Object.assign(this.$data, this.$options.data());
      for (var item in initData) {
        this[item] = initData[item];
      }
      //this.sourceTypes = utils.cloneObj(SOURCETYPES);
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.init();
    });
  }
};
</script>
<style lang="less">
/* popover样式 */
.popover-tab {
  box-sizing: border-box;
  /*min-width: 300px;*/
  padding: 15px 10px;
  font-size: 12px;
  .control {
    display: flex;
  }
  .label {
    flex: 0 0 50px;
  }
  .btn-learn {
    display: inline-block;
    width: 60px;
    margin-top: 2px;
    text-align: center;
    line-height: 26px;
    color: #999;
    cursor: pointer;
  }
  .btn-learn.z-selected {
    background-color: #00d487;
    border-radius: 5px;
    color: #fff;
  }  
  .knwleg-tab {
    display: flex;
    box-sizing: border-box;
    width: 880px;
    height: 360px;
    padding: 0 15px;
    overflow: hidden;
    .el-tree-node__label,
    .el-checkbox__label {
      font-size: 12px;
    }
  }
  .knwleg-tree {
    margin-top: 10px;
    max-height: 285px;
    overflow-y: auto;
  }
  .knwleg-l {
    flex: 1;
    box-sizing: border-box;
    height: 360px;
    padding: 20px 20px 10px 0;
    border-right: 1px solid #e6ebf5;
  }
  .knwleg-r {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    height: 360px;
    padding: 20px 15px 10px 30px;
    .knwleg-tit {
      margin-left: -10px;
      margin-bottom: 20px;
      .i-light {
        margin-right: 5px;
        color: #00d487;
      }
    }
    .el-checkbox {
      margin: 0 30px 5px 0;
    }
    .leaf-box {
      min-height: 220px;
      max-height: 220px;
      margin: 15px 0 0 10px;
      overflow-y: auto;
    }
    .knwleg-opts {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 10px;
      .el-checkbox {
        margin-left: 40px;
        margin-top: 5px;
      }
    }
    .btn-prim {
      color: #00d487;
    }
    .btn-knwleg {
      display: inline-block;
      padding: 4px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      color: #999;
    }
    .btn-knwleg:hover {
      border-color: #00d487;
      color: #00d487;
    }
  }
}
.popover-tab.g-form {
  width: 300px;
}
.popover-tree {
  padding: 0 10px;
}
.popover-tree.g-form {
  width: 880px;
}
.g-filters-resource {
  box-sizing: border-box;
  width: 100%;
  margin: 10px 0;
  padding: 20px 0 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
  .el-range__icon {
    line-height: 24px;
  }
  .el-range-separator {
    line-height: 24px;
  }
  .el-range-input {
    vertical-align: top;
  }
  .select-btn {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    min-width: 120px;
    height: 30px;
    margin-right: 10px;
    border: 1px solid #d8dce5;
    background-color: #fff;
    border-radius: 5px;
    padding: 0 25px 0 15px;
    cursor: pointer;
    vertical-align: top;
    color: #232323;
    .placeholder {
      color: #b4bccc;
    }
    .el-select__caret {
      position: absolute;
      right: 0px;
      top: 0;
      line-height: 22px;
      transition: transform .3s;
      transform: rotateZ(180deg);
      color: #b4bccc;
    }
    .is-reverse {
      transform: rotateZ(0deg);
    }
  }
  .select-btn:focus {
    border-color: #00d487;
  }
  .select-btn:focus:hover {
    border-color: #00d487;
  }
  .select-btn:hover {
    border-color: #d8dce5;
  }
  .knwleg-selected-tab {
    box-sizing: border-box;
    width: 750px;
    max-height: 220px;
    margin: 10px 0;
    padding: 8px 15px;
    background-color: #fff;
    border: 1px solid #d8dce5;
    border-radius: 5px;
    overflow-y: auto;
    .knwleg-selected-item {
      position: relative;
      /*margin-bottom: 10px;*/
    }
  }
  
  .knwleg-leaf {
    /*padding-left: 25px;*/
    line-height: 22px;
    .item {
      position: relative;
      display: inline-block;
      padding: 0 30px 0 10px;
      margin: 0 10px 8px 0;
      background-color: #a5cdff;
      border-radius: 10px;
      color: #fff;
    }
    .i-delete {
      position: absolute;
      top: 2px;
      right: 10px;
      font-size: 10px;
      color: #fff;
      cursor: pointer;
    }
  }
  .btn-del-selknwleg {
    position: absolute;
    right: 0;
    top: 0px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background-color: #eee;
    text-align: center;
    /*font-size: 12px;*/
    font-family: 'Arail';
    cursor: pointer;
    .i-delete {
      /*font-size: 12px;*/
    }
    .i-delete:hover {
      color: #fff;
    }
  }
  .btn-del-selknwleg:hover {
    background-color: #00d487;
    color: #fff;
  }
  .btn-toggle-knwleg {
    line-height: 18px;
    text-align: center;
    cursor: pointer;
    span {
      display: block;
      position: relative;
    }
    .i-arrow {
      position: absolute;
      top: 5px;
      margin-left: 8px;
    }
    .i-arrow-t {
      top: 8px;
    }
  }
  .btn-toggle-knwleg:hover {
    color: #00d487;
  }
  
}
.g-filters-resource-inner {
  .g-form {
    font-size: 12px;
    line-height: 30px;
  }
  .txts {
    position: relative;
    box-sizing: border-box;
    width: 880px;
    color: #999;
  }
  .control {
    margin-bottom: 10px;
  }
  .label {
    width: 80px;
    margin-right: 10px;
    line-height: 30px;
  }
  .select-resourelib .el-input__inner {
    font-size: 12px;
  }
  .el-input__inner {
    height: 30px;
  }
  .btn-tab {
    box-sizing: border-box;
    display: inline-block;
    /*width: 65px;*/
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
    margin: 2px 20px 0 0;
    border-radius: 5px;
    text-align: center;
    /*font-size: 12px;*/
    vertical-align: top;
    color: #999;
  }
  .btn-tab.btn-selected {
    background-color: #00d487;
    color: #fff;
  }
  .btn-tab.btn-disabled {
    background-color: #ccc;
    color: #999;
  }
  .knwleg-level {
    color: #999;
    .item {
      margin-right: 5px;
      i {
        margin-right: 5px;
      }
    }
  }
}
.g-filters-link {
  /*position: absolute;
  right: 350px;*/
  display: inline-block;
  margin-left: 300px;
  padding: 10px 20px;
  border: 1px solid #ebecf1;
  border-radius: 5px;
  cursor: pointer;
}
.g-filters-link.z-selected {
  border-color: #00d487;
  background-color: #fff;
  color: #999;
}
.g-avai-filters .z-selected {
  border-color: #00d487;
  background-color: #fff;
}
.g-filters-link .i-arr-t {
  top: -4px;
}
.g-filters-con {
  position: absolute;
  top: 45px;
  left: 0;
  width: 980px;
  height: 410px;
  box-sizing: border-box;
  border: 1px solid #00d487;
  border-radius: 5px;
  background-color: #fff;
}
.chk-retype, .chk-knwleg {
  display: inline-block;
  box-sizing: border-box;
  width: 790px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: #fff;
  vertical-align: top;
}
.sel-knwleg {
  display: inline-block;
  width: 120px;
}
.chk-knwleg {
  width: 654px;
  height: 74px;
  max-height: 74px;
  overflow-y: scroll;
}
.btn-sure {
  width: 102px;
  height: 30px;
  line-height: 30px;
  padding: 0;
  margin-right: 36px;
  border: 1px solid #00d487;
  color: #00d487;
  font-size: .6rem;
}
.el-select-dropdown__empty {
  padding: 5px 0;
}
.el-select-dropdown__item {
  height: 28px;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 28px;
}
.upload-page {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
}
.edit-page {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  .g-form {
    font-size: 14px;
  }
  .select-resourelib .el-input__inner {
    font-size: 14px;
  }
  .knwleg-tab {
    .el-tree-node__label,
    .el-checkbox__label {
      font-size: 14px;
    }
  }
}
</style>
