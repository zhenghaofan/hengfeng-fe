<template>
<div class="g-form">
  <div class="control">
    <label class="label g-vertop">难度星级：</label>
    <div class="txts exers-txts">
      <el-rate v-model="difficultyLevel"></el-rate>
    </div>
	</div>

  <div class="control editor-container" v-if="template != 'GENERAL_GAP_FILLING'">
    <label class="label g-vertop">题干：</label>
    <div class="txts">
      <div v-html="name" id="main_name" contenteditable="true" @blur="namechange($event)" @click="focusDiv('main_name')"></div>
      <div class="tip" @click="toggleEditor({model: 'name', value: name, id: 'main_name'})">
        <i class="iconf i-toggle"></i>
        <span>高级模式</span>
      </div>
    </div>
  </div>

  <!-- 习题类型 -->
  <div v-if="quesData">
    <!-- 单选 -->
    <singlechoice v-if="template == 'SINGLE_CHOICE'" :check-template="checkTemplate" @afterChecked="getCheckResult" :source-data="quesData" @contentchange="contentchange" @focused="focusDiv" @markDiv="markDiv"></singlechoice>
    <!-- 多选 -->
    <multichoice v-if="template == 'MULTIPLE_CHOICE'" :check-template="checkTemplate" @afterChecked="getCheckResult" :source-data="quesData" @contentchange="contentchange"></multichoice>
    <!-- 填空 -->
    <generalfill v-if="template == 'GENERAL_GAP_FILLING'" :check-template="checkTemplate" @afterChecked="getCheckResult" :source-data="quesData" @contentchange="contentchange"></generalfill>
    <!-- 完型填空 -->
    <protypefill v-if="template == 'CLOZE_GAP_FILLING'" :check-template="checkTemplate" @afterChecked="getCheckResult" :source-data="quesData" @contentchange="contentchange"></protypefill>
    <!-- 判断 -->
    <judge v-if="template == 'JUDGE'" :source-data="quesData" @contentchange="contentchange"></judge>
    <!-- 问答 -->
    <shortanswer v-if="template == 'ESSAY'" :source-data="quesData" @contentchange="contentchange"></shortanswer>
    <!-- 连线 -->
    <ligature v-if="template == 'LIGATURE'" :user-class="'edit-liga'" :check-template="checkTemplate" @afterChecked="getCheckResult" :source-data="quesData" @contentchange="contentchange"></ligature>
    <!-- 综合 -->
    <synthesis v-if="template == 'SYNTHESIS'" :check-template="checkTemplate" :source-data="quesData" @afterChecked="getCheckResult" @contentchange="contentchange"></synthesis>
  </div>

  <!-- 习题类型\ -->
  <div class="control">
    <label class="label g-vertop">视频链接：</label>
    <div class="txts">
    	<textarea class="g-form-txtarea" v-model="videoUrl"></textarea>
    </div>
  </div>

  <editor-dialog :modelName="inputModel" :editorId="editorId" :initcontent="initcontent" :showEditor="showEditor" @fillRichText="fillInput" @closeEditor="closeEditor" :optionsInfo="otherInfo"></editor-dialog>
</div>
</template>
<script>
import editorDialog from '@/components/editorDialog'
import singlechoice from './single'
import multichoice from './multi'
import generalfill from './generalfill'
import protypefill from './protypefill'
import judge from './judge'
import shortanswer from './shortanswer'
import ligature from './ligature'
import synthesis from './synthesis'

import utils from '@/utils/'

import Vue from 'vue'
export default {
  props: [
    //原始值，编辑的时候传过来的
    'sourceData',
    'template',
    'checkTemplate',
  ],
  components: {
    editorDialog,
    singlechoice,
    multichoice,
    generalfill,
    protypefill,
    judge,
    shortanswer,
    ligature,
    synthesis
  },
  data() {
    return {
    	//难度星级
    	difficultyLevel: null,
    	//题干
    	name: '',
    	//视频链接
    	videoUrl: '',
    	topics: {},
  		answers: '',
  		analysis: '',
      //是否显示编辑器
      showEditor: false,
      editorId: 'main-' + (+new Date()),
      inputModel: '',
      otherInfo: {},
      operatingObj: '',
      //
      initcontent: '',
      /*singleChoiceData: {},
      multiChoiceData: {},
      generalFillData: {},
      protypeFillData: {},
      shortanswerData: {},
      judgeData: {},
      ligatureData: {},
      synthesisData: {},*/
      obj: {},
      quesData: null,
    }
  },
  watch: {
  	/*'sourceData': {
      handler(val) {
        //
        this.initData();
      },
      deep: true,
    },*/
    // sourceData(val) {
    //   this.quesData = val;
    // },
    difficultyLevel(val) {
      this.emitExerObj({
      	difficultyLevel: val
      });
    },
    name(val) {
      this.emitExerObj({
      	name: val
      });
    },
    videoUrl(val) {
      this.emitExerObj({
      	videoUrl: val
      });
    },
  },
  methods: {
  	getCheckResult(value) {
  		this.$emit('afterChecked', value);
  	},
    namechange(e) {
    	var value = e.target.innerHTML;

    	this.name = value;
      this.emitExerObj({
      	name: value,
      });
    },
    contentchange(info) {
      this.emitExerObj(info);
    },
    toggleEditor(info) {
      this.showEditor = true;
      this.inputModel = info.model;
      this.initcontent = info.value;
      this.otherInfo.id = info.id;
    },
    markDiv(str, id) {
      let targetDiv = document.getElementById(id);
      if (str.indexOf('mathquill-embedded-latex') != -1) {
        this.$nextTick(() => {
          $(targetDiv).find('.mathquill-embedded-latex').mathquill();
          $(targetDiv).attr('contenteditable', 'false');
        })
      } else {
        $(targetDiv).attr('contenteditable', 'true');
      }
    },
    focusDiv(id) {
      if (document.getElementById(id) && document.getElementById(id).contentEditable !== "true") {
        this.$message.warning('包含公式须在高级模式下编辑')
      }
    },
    closeEditor() {
      this.showEditor = false;
    },
    fillInput(model, text, otherInfo) {
      this.closeEditor();

      var resultObj = {};
      resultObj[model] = text;
      this[model] = text;
      this.markDiv(text, otherInfo.id);

      this.emitExerObj(resultObj);
    },
    emitExerObj(info) {
    	// var obj = {
			//   		name: '',
			//   		difficultyLevel: null,
			//   		videoUrl: '',
			//   		topics: '',
			//   		answers: '',
			//   		analysis: '',
			//   	};
			for (var i in info) {
				this.obj[i] = info[i];
			}
      this.$emit('exerChanged', this.obj);
    },
    //数据初始化
	  initData() {
	  	//深拷贝TODO
      this.quesData = utils.cloneObj(this.sourceData);
	  	for (var i in this.sourceData) {
	  		/*this.singleChoiceData[i] = this.sourceData[i];
        this.multiChoiceData[i] = this.sourceData[i];
        this.judgeData[i] = this.sourceData[i];
        this.generalFillData[i] = this.sourceData[i];
        this.protypeFillData[i] = this.sourceData[i];
        this.shortanswerData[i] = this.sourceData[i];
        this.ligatureData[i] = this.sourceData[i];
        this.synthesisData[i] = this.sourceData[i];*/

	  		this[i] = this.sourceData[i];
	  	}
      this.$nextTick(() => {
        this.markDiv(this.name, 'main_name')
      })
	  },
  },
  mounted: function () {
    this.$nextTick(function () {
      //页面初始化
      this.initData();
    });
  },
}
</script>
<style lang="less">
.txts {
  display: inline-block;
  /*height: 30px;*/
  width: 880px;
  position: relative;
}
.tip {
  position: absolute;
  right: 17px;
  top: 7px;
  cursor: pointer;
  z-index: 1000;
}
.editor-container {
  height: 60px;
  margin-bottom: 10px;
}
div[contenteditable] {
	box-sizing: border-box;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	padding: 0 10px;
  height: 60px;
  line-height: 30px;
  overflow: auto;
  i {
  	font-style: italic;
  }
  strong,
  em,
  b {
	  font-weight: bold;
	}
}
div[contenteditable="true"]:focus {
	outline: none;
	border-color: #00d487;
}
.operate {
  position: absolute;
  right: 27px;
  top: 8px;
  z-index: 1000;
}
.operate i {
  color: black;
  cursor: pointer;
}
.radios {
  line-height: 30px;
}
.textarea {
  margin: 0 !important;
}
.textarea .el-textarea__inner {
  background: white;
  width: 100%;
  padding: 5px 10px;
}
.edui-container {
  width: 100% !important;
}
.control {
  position: relative;
}
.exers-txts {
	margin-top: 10px;
}
</style>
