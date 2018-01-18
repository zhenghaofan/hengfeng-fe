<template>
<div class="g-form editselects">
	<div class="col">
	  <div class="control">
	    <label class="label">所属科段</label>
	    <div class="txts">
	      <el-select class="select-resourelib g-mr10" v-model="learnStageId" placeholder="选择学段" @change="getGrade">
	        <el-option
	          v-for="learnstage in learnStageList"
	          :key="learnstage.id"
	          :label="learnstage.name"
	          :value="learnstage.id">
	        </el-option>
	      </el-select>
	      <el-select class="select-resourelib g-mr10" :disabled="!learnStageId"  v-model="gradeId" @change="getSubject" placeholder="选择年级">
	        <el-option
	          v-for="grade in gradeList"
	          :key="grade.id"
	          :label="grade.name"
	          :value="grade.id">
	        </el-option>
	      </el-select>
	      <el-select class="select-resourelib" :disabled="!gradeId" v-model="subjectId" placeholder="选择学科" @change="getTextInfo">
	        <el-option
	          v-for="subject in subjectList"
	          :key="subject.id"
	          :label="subject.name"
	          :value="subject.id">
	        </el-option>
	      </el-select>
	    </div>
	  </div>
	</div>
	<!-- 章节筛选 -->
  <div class="col">
    <div class="control">
      <label class="label">适用章节</label>
      <div class="txts">
        <el-select class="select-resourelib g-mr10" @change="getTerm" v-model="versionId" :disabled="!subjectId" placeholder="教材版本">
          <el-option
            v-for="version in versionList"
            :key="version"
            :label="version"
            :value="version">
          </el-option>
        </el-select>
        <el-select class="select-resourelib g-mr10" @change="getTextbook" :disabled="!versionId" v-model="termId" placeholder="所属学期">
          <el-option
            v-for="term in termList"
            :key="term.id"
            :label="term.name"
            :value="term.id">
          </el-option>
        </el-select>
        <el-select class="select-resourelib g-mr10" @change="getTextbookCatalog" :disabled="!termId" v-model="textbookId" placeholder="教材题名">
          <el-option
            v-for="textbook in textbookList"
            :key="textbook.id"
            :label="textbook.name"
            :value="textbook.id">
          </el-option>
        </el-select>
        <el-select class="select-resourelib g-mr10" v-if="unitList" @change="getChapter" :disabled="!textbookId" v-model="unitId" placeholder="所属单元">
          <el-option
            v-for="unit in unitList"
            :key="unit.id"
            :label="unit.name"
            :value="unit.id">
          </el-option>
        </el-select>
        <el-select class="select-resourelib g-mr10" v-if="chapterList" @change="getCourse" :disabled="!unitId" v-model="chapterId" placeholder="选择章">
          <el-option
            v-for="chapter in chapterList"
            :key="chapter.id"
            :label="chapter.name"
            :value="chapter.id">
          </el-option>
        </el-select>
        <el-select class="select-resourelib" v-if="courseList" :disabled="!chapterId" v-model="courseId" placeholder="选择节/课">
          <el-option
            v-for="course in courseList"
            :key="course.id"
            :label="course.name"
            :value="course.id">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
  <!-- 章节筛选\ -->

  <!-- 知识点树筛选 -->
  <div class="col">
    <div class="control">
      <label class="label g-vertop">知识点</label>
      <div class="txts">
        <div class="sel-knwleg g-mr10">
          <el-select class="select-resourelib" @change="getKnwlegChildOptions(2)" v-model="knwlegPointId1" placeholder="一级知识点">
            <el-option
              v-for="knwlegPoint in knwlegPointList1"
              :key="knwlegPoint.id"
              :label="knwlegPoint.name"
              :value="knwlegPoint.id">
            </el-option>
          </el-select>
          <el-select class="select-resourelib g-mt10" @change="getKnwlegChildOptions(3)" :disabled="!knwlegPointId1" v-model="knwlegPointId2" placeholder="二级知识点">
            <el-option
              v-for="knwlegPoint in knwlegPointList2"
              :key="knwlegPoint.id"
              :label="knwlegPoint.name"
              :value="knwlegPoint.id">
            </el-option>
          </el-select>
        </div>
        <div class="chk-knwleg" v-show="knwlegPointList3"> 
          <span class="chk-knwleg-item" v-for="(knwleg, index) in knwlegPointList3"><i class="icon i-check g-mr5" :class="{'i-check-s': knwleg.checked}" @click="toggleCheck('knwleg', index)"></i>{{knwleg.name}}</span>          
        </div>
      </div>
    </div>
  </div>
  <!-- 知识点树筛选\ -->
</div>
</template>
<script>
import Vue from 'vue'
//集成api
import apiUrl from '@/api/url.js'
export default {
  data: function () {
    return {
    	/* 学年科信息 */
      //学段
      learnStageList: [],
      learnStageId: '',
      //年级
      tmpGradeList: [],
      gradeList: [],
      gradeId: '',
      //学科
      tmpSubjectList: [],
      subjectList: [],
      subjectId: '',
      /* 教材信息 */
      //教材版本
      versionList: [],
      versionId: '',
      //所属学期
      termList: [],
      termId: '',
      //教材题名
      textbookList: [],
      textbookId: '',
      //教材目录
      //所属单元
      unitList: [],
      unitId: '',
      //选择章
      chapterList: [],
      chapterId: '',
      //选择节/课
      courseList: [],
      courseId: '',
      /* 知识点 */
      //一级
      knwlegPointList1: [],
      knwlegPointId1: '',
      //二级
      knwlegPointList2: [],
      knwlegPointId2: '',
      //三级
      knwlegPointList3: [],
      knwlegPointId3List: [],
      knwlegPointId3: '',
      temp: {},
      result: {

      }
    };
  },
  props: ['initData'],
  watch: {
  	'initData': {
  		handler: function (data) {
  			/* 学年科信息 */
	      //学段
	      this.temp.learnStageId = data.learnStage.id;
	      //年级
	      this.temp.gradeId = data.grade.id;
	      //学科
	      this.temp.subjectId = data.subject.id;
        this.getSubjectOptions();

	      /* 教材信息 */
	      var textbook = data.textbook;
	      if (textbook) {
	      	//教材版本
		      this.temp.versionId = textbook.version;
		      //所属学期
		      this.temp.termId = textbook.termDictId;
		      //教材题名
		      this.temp.textbookId = textbook.id;
		      //教材目录
		      var txtCata = data.textbookCatalogs,
              tmpK1, tmpK2, tmpK3;
          if (txtCata && txtCata.length > 0) {
            tmpK1 = txtCata[0];
            //所属单元
            this.temp.unitId = tmpK1 ? tmpK1.id : '';           
            if (tmpK1.id && tmpK1.children && tmpK1.children.length > 0) {
              tmpK2 = txtCata[0].children[0];
              //选择章
              this.temp.chapterId = tmpK2 ? tmpK2.id : '';

              if (tmpK2.id && tmpK2.children && tmpK2.children.length > 0) {
                tmpK3 = txtCata[0].children[0].children[0];
                //选择节/课
                this.temp.courseId = tmpK3 ? tmpK3.id : '';
              }
              
            }
            
          }
		      
	      }
	      
	      /* 知识点 */
	      var knowledge = data.knowledgePointCatalogs;
	      if (knowledge) {
	      	//一级
		      this.temp.knwlegPointId1 = knowledge ? knowledge[0].id : '';
		      //二级
		      this.temp.knwlegPointId2 = knowledge[0].children ? knowledge[0].children[0].id : '';
		      //三级
		      var knwlegPointId3List = [],
		      		knwlegPoint2 = knowledge[0].children[0];

	        if (knwlegPoint2.children) {
	          for (var i = 0, len = knwlegPoint2.children.length; i < len; i++) {
	            knwlegPointId3List.push(knwlegPoint2.children[i].id);
	          }
	        }
		      this.temp.knwlegPointId3List = knwlegPointId3List;
	      }
	      
  		},
  		deep: true
  	},
    'learnStageId': function (val) {
      this.result['learnStageId'] = val;
      this.$emit('val-changed', this.result);
    },
    'gradeId': function (val) {
      this.result['gradeId'] = val;
      this.$emit('val-changed', this.result);
    },
    'subjectId': function (val) {
      this.result['subjectId'] = val;
      this.$emit('val-changed', this.result);
    },
    'versionId': function (val) {
      this.result['versionId'] = val;
      this.$emit('val-changed', this.result);
    },
    'termId': function (val) {
      this.result['termId'] = val;
      this.$emit('val-changed', this.result);
    },
    'textbookId': function (val) {
      this.result['textbookId'] = val;
      this.$emit('val-changed', this.result);
    },
    'unitId': function (val) {
      this.result['unitId'] = val;
      this.$emit('val-changed', this.result);
    },
    'chapterId': function (val) {
      this.result['chapterId'] = val;
      this.$emit('val-changed', this.result);
    },
    'courseId': function (val) {
      this.result['courseId'] = val;
      this.$emit('val-changed', this.result);
    },
    'knwlegPointId1': function (val) {
      this.result['knwlegPointId1'] = val;
      this.$emit('val-changed', this.result);
    },
    'knwlegPointId2': function (val) {
      this.result['knwlegPointId2'] = val;
      this.$emit('val-changed', this.result);
    },
    'knwlegPointId3List': {
      handler: function (val) {
        //如果没有三级，则传二级的ID
        if (this.knwlegPointList3.length === 0) {
          if (this.knwlegPointId2) {
            this.result['knwlegPointId3List'] = [this.knwlegPointId2];
          } else {
            this.result['knwlegPointId3List'] = [];
          }
          
        } else {
        //有，则传三级的
          this.result['knwlegPointId3List'] = val;
        }
        
        this.$emit('val-changed', this.result);
      },
      deep: true
    }    
  },
  methods: {
  	//获取学科段
    getSubjectOptions: function () {
      var self = this;

      apiUrl.getSubjectOptions().then(function (res) {
        var _result = res.data;
        self.learnStageList = _result.learnStageList;
        self.learnStageId = self.temp.learnStageId;
        self.temp.learnStageId = '';
        self.tmpGradeList = _result.gradeList;
        self.tmpSubjectList = _result.subjectList;
      });
    },
    //获取年级
    getGrade: function () {
      if (!this.learnStageId) {
        return;
      }

      var list = this.tmpGradeList;
      this.gradeList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].learnStageId === this.learnStageId) {
          this.gradeList.push(list[i]);
        }     
      }

      if (this.temp.gradeId) {
        this.gradeId = this.temp.gradeId;
        this.temp.gradeId = '';
      } else {
        this.gradeId = '';
      }

      //初始化时不重置
      if (!this.temp.versionId) {
        //重置教材
        this.resetTextInfo();      
      }
      if (!this.temp.knwlegPointId1) {
        //重置知识点
        this.resetKnwleg();  
      }
    },
    //获取学科
    getSubject: function () {
      if (!this.gradeId) {
        return;
      }
      var list = this.tmpSubjectList;
      this.subjectList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].gradeId === this.gradeId) {
          this.subjectList.push(list[i]);
        }     
      }

      if (this.temp.subjectId) {
        this.subjectId = this.temp.subjectId;
        this.temp.subjectId = '';
      } else {
        this.subjectId = '';
      }

      //初始化时不重置
      if (!this.temp.versionId) {
        //重置教材
        this.resetTextInfo();      
      }
      if (!this.temp.knwlegPointId1) {
        //重置知识点
        this.resetKnwleg();  
      }
    },
    //重置年级信息
    resetGradeInfo: function () {
      if (this.temp.gradeId) {
        this.gradeId = this.temp.gradeId;
        this.temp.gradeId = '';
      } else {
        this.gradeId = '';
      }

      if (this.temp.subjectId) {
        this.subjectId = this.temp.subjectId;
        this.temp.subjectId = '';
      } else {
        this.subjectId = '';
      }

      //重置教材信息
      this.resetTextInfo();
      //重置知识点信息
      this.resetKnwleg();
    },
    //重置学科信息
    resetSubjectInfo: function () {
      if (this.temp.subjectId) {
        this.subjectId = this.temp.subjectId;
        this.temp.subjectId = '';
      } else {
        this.subjectId = '';
      }

      //重置教材信息
      this.resetTextInfo();
      //重置知识点信息
      this.resetKnwleg();
    },
    //重置教材信息
    resetTextInfo: function () {
      var list = ['versionId', 'termId', 'textbookId',
                  'unitId', 'chapterId', 'courseId'];
      for (var i = 0, len = list.length; i < len; i++) {
        if (this.temp[list[i]]) {
          this[list[i]] = this.temp[list[i]];
          this.temp[list[i]] = '';
        } else {
          this[list[i]] = '';
        }
      }
    },
    //获取教材信息
    getTextInfo: function () {
      if (this.learnStageId && this.subjectId && this.gradeId) {
        //获取教材信息选项菜单
        this.getTextbookOptions();

        //获取知识点项菜单
        if (this.temp.knwlegPointId1) {
          this.knwlegPointId1 = this.temp.knwlegPointId1;
          this.temp.knwlegPointId1 = '';
        } else {
          this.knwlegPointId1 = '';
        }
        this.getKnwlegOptions();
      }
    },
    //获取教材版本
    getTextbookOptions: function () {
      var self = this,
          params = {
            function: 'VERSION',
            gradeId: self.gradeId,
            subjectId: self.subjectId
          };

      apiUrl.getTextbookOptions(params).then(function (res) {
        var _result = res.data;
        self.versionList = _result.versionList;

        if (self.temp.versionId) {
          self.versionId = self.temp.versionId;
          self.temp.versionId = '';
        } else {
          self.versionId = '';
        }

        if (!self.temp.unitId) {
          //重置教材信息
          self.resetTextInfo();
        }
      });
    },
    //获取学期
    getTerm: function () {
      if (!this.gradeId || !this.subjectId || !this.versionId) {
        return;
      }
      var self = this,
          params = {
            function: 'TERM',
            gradeId: self.gradeId,
            subjectId: self.subjectId,
            version: self.versionId
          };

      apiUrl.getTextbookOptions(params).then(function (res) {
        var _result = res.data;
        self.termList = _result.termList;

        if (self.temp.termId) {
        	self.termId = self.temp.termId;
        	self.temp.termId = '';
        } else {
        	self.termId = '';
        }
        self.textbookId = '';
        self.unitId = '';
        self.chapterId = '';
        self.courseId = '';
      });
    },
    //获取教材
    getTextbook: function () {
      if (!this.gradeId || !this.subjectId || !this.versionId || !this.termId) {
        return;
      }
      var self = this,
          params = {
            function: 'TEXTBOOK',
            gradeId: self.gradeId,
            subjectId: self.subjectId,
            version: self.versionId,
            termDictId: self.termId
          };

      apiUrl.getTextbookOptions(params).then(function (res) {
        var _result = res.data;
        self.textbookList = _result.textbookList;

        if (self.temp.textbookId) {
        	self.textbookId = self.temp.textbookId;
        	self.temp.textbookId = '';
        } else {
        	self.textbookId = '';
        }
        self.unitId = '';
        self.chapterId = '';
        self.courseId = '';
      });
    },
    //获取教材目录
    getTextbookCatalog: function () {
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
        self.unitList = _result.textbookCataLogList;

       	if (self.temp.unitId) {
        	self.unitId = self.temp.unitId;
        	self.temp.unitId = '';
        } else {
        	self.unitId = '';
        }
        self.chapterId = '';
        self.courseId = '';
      });
    },
    //获取章
    getChapter: function () {
      var self = this,
          list = self.unitList;

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === self.unitId) {
          self.chapterList = list[i].children || '';

          if (self.temp.chapterId) {
	        	self.chapterId = self.temp.chapterId;
	        	self.temp.chapterId = '';
	        } else {
	        	self.chapterId = '';
	        }
          self.courseId = '';
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
          self.courseList = list[i].children || '';

          if (self.temp.courseId) {
	        	self.courseId = self.temp.courseId;
	        	self.temp.courseId = '';
	        } else {
	        	self.courseId = '';
	        }
          break;
        }
      }
    },
    //重置知识点信息
    resetKnwleg: function () {
      var list = ['knwlegPointList1', 'knwlegPointList2', 'knwlegPointList3',
                  'knwlegPointId3List'],
          list2 = ['knwlegPointId1', 'knwlegPointId2'];

      for (var i = 0, len = list.length; i < len; i++) {
        if (this.temp[list[i]]) {
          this[list[i]] = this.temp[list[i]];
          this.temp[list[i]] = [];
        } else {
          this[list[i]] = [];
        }
      }

      for (var i = 0, len2 = list2.length; i < len2; i++) {
        if (this.temp[list2[i]]) {
          this[list2[i]] = this.temp[list2[i]];
          this.temp[list2[i]] = '';
        } else {
          this[list2[i]] = '';
        }
      }

      // this.knwlegPointList1 = [];
      // this.knwlegPointId1 = '';
      // this.knwlegPointList2 = [];
      // this.knwlegPointId2 = '';
      // this.knwlegPointList3 = [];
      // this.knwlegPointId3List = [];
    },
    //获取知识点项菜单
    getKnwlegOptions: function () {
      var self = this,
          params = {
            learnStageId: self.learnStageId,
            subjectId: self.subjectId
          };

      apiUrl.getKnwlegOptions(params).then(function (res) {
        var _result = res.data;
        self.knwlegPointList1 = _result.knowledPointCatalogList;

        //获取二级知识点
        if (self.temp.knwlegPointId2) {
        	self.getKnwlegChildOptions(2);
        } else {
          //重置二级，三级数据
          self.knwlegPointId2 = '';
          self.knwlegPointList3 = [];
          self.knwlegPointId3List = [];
        }
      });
    },
    //获取二级/三级知识点
    getKnwlegChildOptions: function (index) {
      // 2代表获取二级知识点 3代表获取三级知识点
      var clickIndex = index - 1,
          list = this['knwlegPointList' + clickIndex],
          selectedId = this['knwlegPointId' + clickIndex];

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === selectedId) {
          this['knwlegPointList' + index] = list[i].children || [];
          break;
        }
      }

      //重置二级，三级数据
      if (index === 2 && this.knwlegPointList2.length > 0) {
        //赋初始值
        if (this.temp.knwlegPointId2) {
          this.knwlegPointId2 = this.temp.knwlegPointId2;
          this.temp.knwlegPointId2 = '';
        } else {
          this.knwlegPointId2 = '';
        }
        this.knwlegPointList3 = [];
        this.knwlegPointId3List = [];
      }

      //如果三级知识点 初始化checked属性
      var item, checkedList;
      if (index === 3) {
        this.knwlegPointId3List = [];

        for (var j = 0, len2 = this.knwlegPointList3.length; j < len2; j++) {
        	item = this.knwlegPointList3[j];
        	if (this.temp.knwlegPointId3List) {
        		checkedList = this.temp.knwlegPointId3List;
            this.knwlegPointId3List = checkedList;
        		this.temp.knwlegPointId3List = '';
        	} else {
        		checkedList = this.knwlegPointId3List;
        	}
        	//在选中列表中的则选中
        	if (checkedList.indexOf(item.id) !== -1) {
        		Vue.set(item, 'checked', true);
        	} else {
        		Vue.set(item, 'checked', false);
        	}
          //默认全选
          //Vue.set(this.knwlegPointList3[j], 'checked', true);
          //this.knwlegPointId3List.push(this.knwlegPointList3[j].id);
        }
      }
    },
    //切换checkbox
    toggleCheck: function (type, index) {
      //'dict'类型为资源 否则是三级知识点
      var list = type === 'dict' ? this.childDictList : this.knwlegPointList3,
          state = list[index].checked,
          idList = type === 'dict' ? this.childDictIdList : this.knwlegPointId3List;

      list[index].checked = !state;

      if (!state) {
        idList.push(list[index].id);
      } else {
        var j = idList.indexOf(list[index].id);
        idList.splice(j, 1);
      }
    }
  },
  mounted: function () {
    var self = this;

    this.$nextTick(function () {
    	//获取学科段
      //this.getSubjectOptions();
    });
  }
}

</script>
<style>
.editselects .control {
  margin-bottom: 10px;
  font-size: .7rem;
}
.editselects .select-resourelib {
  height: 40px;
}
.editselects .el-input input {
  height: 40px;
  font-size: .7rem;
  text-align: center;
}
.editselects .sel-knwleg {
  display: inline-block;
  width: 120px;
}
.editselects .chk-knwleg {
  display: inline-block;
  width: 654px;
  max-height: 90px;
  height: 90px;
  overflow-y: scroll;
  line-height: 20px; 
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
  vertical-align: top;
}
.editselects .chk-knwleg .chk-knwleg-item {
  display: inline-block;
  margin: 0 20px 5px 0;
}
</style>