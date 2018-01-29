<template lang="html">
  <div>
  <div class="g-form">
    <div class="control" v-if="titleIndex > -1">
      <label class="label g-vertop">小题{{titleIndex + 1}}：</label>
      <div class="txts">
        <div v-html="name" contenteditable="true" @blur="namechange($event, titleIndex)"></div>
        <div class="tip" @click="toggleEditor('_name', name, titleIndex)">
          <i class="iconf i-toggle"></i>
          <span>高级模式</span>
        </div>
      </div>
    </div>

    <div class="control">
      <label class="label g-vertop">答案：</label>
      <div class="txts radios">
        <el-radio v-model="answers" :label="true">正确</el-radio>
        <el-radio v-model="answers" :label="false">错误</el-radio>
      </div>
    </div>
  </div>
    <div class="control editor-container">
      <label class="label g-vertop">解析：</label>
      <div class="txts">
        <div v-html="analysis" contenteditable="true" @blur="analysischange($event)"></div>
        <div class="tip" @click="toggleEditor('analysis', analysis)">
          <i class="iconf i-toggle"></i>
          <span>高级模式</span>
        </div>
      </div>
  </div>

  <editor-dialog :editorId="editorId" :model-name="modelName" :options-info="optionsInfo" :initcontent="initcontent" :showEditor="showEditor" @fillRichText="updateContent" @closeEditor="closeEditor"></editor-dialog>
</div>
</template>

<script>
import Vue from 'vue'
import editorDialog from '@/components/editorDialog'

export default {
  components: {
    editorDialog,
  },
  props: {
    sourceData: {
      type: Object
    },
    titleIndex: {
      default: -1,
      require: false
    },
    name: {
      default: ''
    }
  },
  data() {
    return {
      _name: '',
      //答案
      answers: true,
      //解析
      analysis: '',
      initcontent: '',
      editorId: 'judge-' + (+new Date()),
      showEditor: false,
      modelName: '',
      optionsInfo: {}
    }
  },
  watch: {
    answers() {
      //返回题目信息
      this.returnQuestionInfo();
    },
    analysis() {
      //返回题目信息
      this.returnQuestionInfo();
    },
  },
  methods: {
    namechange(e, index) {
      var value = e.target.innerHTML;

      // this.name = value;
      // this.emitExerObj({
      //   name: value,
      // });
      this.$emit('namechange', value, index);
    },
    //显示编辑器
    toggleEditor(model, value, index) {
      this.modelName = model;
      this.optionsInfo.index = index;
      this.showEditor = true;
      this.initcontent = value;
    },
    //隐藏编辑器
    closeEditor() {
      this.showEditor = false;
      this.initcontent = '';
    },
    //更新
    updateContent(model, value, otherInfo) {
      this.closeEditor();
      this[model] = value;
      this.initcontent = '';
      if (model == '_name') {
        this.$emit('namechange', value, otherInfo.index);
        this.$emit('contentchange', otherInfo.index, {
          answers: this.answers,
          analysis: this.analysis
        });
        return;
      }

      //返回题目信息
      this.returnQuestionInfo();
    },

    //解析有变
    analysischange(e) {
      this.analysis = e.target.innerHTML;
    },

    //返回题目信息
    returnQuestionInfo() {
      if (this.titleIndex > -1) {
        this.$emit('contentchange', this.titleIndex, {
          answers: this.answers,
          analysis: this.analysis,
        })
      } else {
        this.$emit('contentchange', {
          answers: this.answers,
          analysis: this.analysis,
        });
      }
    },
    //页面初始化
    initData() {
      //有原始值，按原始值初始化
      if (this.sourceData) {
        var data = this.sourceData;

        //答案
        this.answers = data.answers || false;
        //解析
        this.analysis = data.analysis || '';
      } else {
        //默认全新的初始化，相当于新建

        //答案
        this.answers = true;
        //解析
        this.analysis = '';
      }

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

<style lang="css">
</style>
