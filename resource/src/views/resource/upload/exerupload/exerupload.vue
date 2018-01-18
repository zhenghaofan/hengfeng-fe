<template>
<div class="">
  <div class="col">
    <div class="control">
      <label class="label g-vertop">难度星级：</label>
      <div class="txts g-ml10">
        <el-rate v-model="exerObj.difficultyLevel" @change="emitExerObj" style="line-height: 40px;"></el-rate>
      </div>
    </div>
  </div>

  <div class="col editor-container">
    <div class="control">
      <label class="label g-vertop">题干：</label>
      <div class="txts g-ml10">
        <!-- <el-input type="textarea" class="textarea" :rows="2" v-input="title" @focus.prevent="showTip = true" @blur.prevent="showTip = false"></el-input> -->
        <!-- <div class="tip" v-show="showTip" @click="toggleEditor"> -->
        <div v-html="title" contenteditable="true" @blur="titlechange($event)"></div>
        <div class="tip" @click="toggleEditor('title')">
          <i class="iconf i-toggle"></i>
          <span>高级模式</span>
        </div>
      </div>
    </div>
  </div>

  <singlechoice v-show="template == 'SINGLE_CHOICE'" :options="options" :topics="topics" :analysis="analysis" @optionschange="choiceoptionschange" @contentchange="contentchange" @toggleEditor="toggleEditor" @addoption="addOption" @deloption="delOption"></singlechoice>

  <multichoice v-show="template == 'MULTIPLE_CHOICE'" :options="options" :topics="topics"
  :analysis="analysis" @optionschange="choiceoptionschange" @contentchange="contentchange" @toggleEditor="toggleEditor" @addoption="addOption" @deloption="delOption"></multichoice>

  <judge v-show="template == 'JUDGE'" :analysis="analysis" @judgechange="judgechange" @contentchange="contentchange"></judge>

  <!-- <blank v-show="template == 'GENERAL_GAP_FILLING'"></blank> -->

  <div class="col">
    <div class="control">
      <label class="label g-vertop">视频链接：</label>
      <div class="txts g-ml10">
        <el-input type="textarea" class="textarea" :rows="2" v-model="exerObj.videoUrl" @change="emitExerObj"></el-input>
      </div>
    </div>
  </div>

  <editor-dialog :modelName="input_model" :editorId="editorId" :showEditor="showEditor" @fillRichText="fillInput" @closeEditor="closeEditor"></editor-dialog>
</div>
</template>

<script>
import editorDialog from '@/components/editorDialog'
import singlechoice from '@/components/exers/singlechoice'
import multichoice from '@/components/exers/multichoice'
import judge from '@/components/exers/judge'
import blank from '@/components/exers/blank'

import Vue from 'vue'
export default {
  props: ['template'],
  components: {
    editorDialog,
    singlechoice,
    multichoice,
    judge,
    // blank
  },

  data() {
    return {
      // initcontent: '',
      // showTip: false,
      topics:{},
      showEditor: false,
      input_model: '',
      editorId: '',
      title: '',
      options: [
        'A', 'B', 'C', 'D'
      ],
      analysis: '',
      operatingObj: '',
      exerObj: {
        difficultyLevel: 3,
        videoUrl: '',
        answers: '',
      }
      // blanks: ['1'],
      // blankAnswers: [],
    }
  },
  watch: {
    // difficultyLevel(val) {
    //   this.exerObj.difficultyLevel = val;
    //   this.emitExerObj();
    // },
    exerObj() {
      this.emitExerObj()
    },
    template() {
      this.resetForm();
    }
  },
  mounted() {
  },
  methods: {
    resetForm() {
      this.exerObj.videoUrl = '';
      this.exerObj.answers = '';
    },
    titlechange(e) {
      this.exerObj.name = e.target.innerHTML;
      this.emitExerObj();
    },
    choiceoptionschange(item, text) {
      Vue.set(this.topics, item, text);
      this.exerObj.topics = this.topics;
      this.emitExerObj();
    },
    contentchange(val) {
      for (var i in val) {
        // if (i == 'topics' && !this.exerobj[i] || this.exerObj[i] !== null) {
        if (val[i] !== null) {
          this.exerObj[i] = val[i]
        }
      }
      // this.exerObj = Object.assign({}, this.exerObj, val);

      this.emitExerObj();
    },

    getFormerLetter(str) {
      return String.fromCharCode(str.charCodeAt(0) - 1)
    },
    getNextLetter(str) {
      return String.fromCharCode(str.charCodeAt(0) + 1)
    },
    addOption(index) {
      let arr = this.options.splice(index + 1);
      arr = arr.map((letter) => this.getNextLetter(letter));
      this.options.push(this.getNextLetter(this.options[index]));
      this.options = this.options.concat(arr);
    },
    delOption(index) {
      let arr = this.options.splice(index + 1);
      arr = arr.map((letter) => this.getFormerLetter(letter));
      this.options.pop();
      this.options = this.options.concat(arr);
    },

    toggleEditor(model, id) {
      this.showEditor = true;
      this.operatingObj = model;
      if(id) {
        this.editorId = id;
      }
      if (model == 'topics') {
        this.input_model = id;
      } else {
        this.input_model = model;
      }
    },
    closeEditor() {
      this.showEditor = false;
    },
    fillInput(model, text) {
      this.closeEditor();
      if (this.operatingObj == 'topics') {
        Vue.set(this.topics, model, text)
        this.exerObj.topics = this.topics;
      } else if (this.operatingObj == 'answers'){
        this.blankAnswers[model] == text;
        this.exerObj.answers = this.answers;
      } else {
        this[model] = text;
      }
      if (model == 'title') {
        this.exerObj.name = text;
      } else if (model == 'analysis') {
        this.exerObj.analysis = text;
      }
      this.emitExerObj();
    },
    judgechange(val) {
      this.exerObj.answers = val;
      this.emitExerObj();
    },
    // addBlank(index) {
    //   let arr = this.blanks.splice(index + 1);
    //   arr = arr.map((num) => parseInt(num) + 1);
    //   this.blanks.push(this.getNextLetter(this.blanks[index]));
    //   this.blanks = this.blanks.concat(arr);
    // },
    // delBlank(index) {
    //   let arr = this.blanks.splice(index + 1);
    //   arr = arr.map((num) => parseInt(num) - 1);
    //   this.blanks.pop();
    //   this.blanks = this.blanks.concat(arr);
    // },
    emitExerObj() {
      console.log(this.exerObj);
      this.$emit('exerChanged', this.exerObj);
    },


    // checkboxChange(item) {
    //   this.exerObj.answers = this.checkAnswers;
    //   this.emitExerObj();
    // },
    // getLastKey: function(obj) {
    // 	var lastKey = '';
    // 	for (var key in obj) {
    // 		lastKey = key;
    // 	}
    // 	return lastKey;
    // },
    // toggleTip() {
    //   this.showTip = true;
    // },
    // optionchanged(item) {
    //   this.exerObj.topics[item.id] = item.html;
    //   this.emitExerObj();
    // },
    // blankchanged(item) {
    //   this.exerObj.topics = this.blanks;
    //   this.exerObj.answers = [];
    //   this.exerObj.answers[parseInt(item.id)] = item.html;
    //   this.emitExerObj();
    // }
  },


}
</script>

<style lang="css">
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
div[contenteditable="true"] {
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	padding: 0 10px;
  height: 60px;
  line-height: 30px;
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
</style>
