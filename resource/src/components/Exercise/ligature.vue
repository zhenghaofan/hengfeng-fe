<template>
<div>
  <!-- 连线操作 -->
  <p class="g-tc g-mb10" v-if="!type">点击左边圆点再点击右边圆点为连线，反过来为取消连线。可一对多，但不可多对一。</p>
  <linedraw :source-data="sourceData" :type="type" :check-template="checkTemplate" @contentchange="getLineDrawData" @afterChecked="getCheckResult"></linedraw>

  <div class="control" v-if="!type">
    <label class="label g-vertop">解析：</label>
    <div class="txts">
      <div v-html="analysis" contenteditable="true" @blur="analysischange($event)"></div>
      <div class="tip" @click="toggleEditor('analysis', analysis)">
        <i class="iconf i-toggle"></i>
        <span>高级模式</span>
      </div>
    </div>
  </div>

  <editor-dialog v-if="!type" :editorId="editorId" :model-name="modelName" :initcontent="initcontent" :showEditor="showEditor" @fillRichText="updateContent" @closeEditor="closeEditor"></editor-dialog>

</div>
</template>

<script>
import Vue from 'vue'
import linedraw from './linedraw'
import editorDialog from '@/components/editorDialog'
import editor from '@/components/umeditor/Editor'

export default {
  components: {
    editorDialog,
    editor,
    linedraw,
  },
  props: [
    //原始值，编辑的时候传过来的
    'sourceData',
    'checkTemplate',
    'type',
  ],
  data() {
    return {
      name: '',
      title: '',
      //选项 对象
      topics:[],
      //答案
      answers: [],
      //解析
      analysis: '',
      initcontent: '',
      editorId: 'generalfill',
      showEditor: false,
      modelName: '',
    }
  },
  watch: {
    'sourceData': {
      handler(val) {
        //
        this.initData();
      },
      deep: true,
    },
    analysis () {
      //返回题目信息
      this.returnQuestionInfo();
    },
  },
  methods: {
    //获取连线的数据
    getLineDrawData(info) {
      for (var item in info) {
        this[item] = info[item];
      }
      //返回题目信息
      this.returnQuestionInfo();
    },
    //获取校验情况
    getCheckResult(value) {
      this.$emit('afterChecked', value);
    },
    contentchange(info) {
      //this.name = info.html;
      this.title = info.html;
    },
    //显示编辑器
    toggleEditor(model, value, index) {
      this.modelName = model;

      if (model === 'topics') {
        this.optionsInfo.index = index;
      } else {
        this.optionsInfo = {};
      }

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

      //返回题目信息
      this.returnQuestionInfo();
    },
    //解析有变
    analysischange(e) {
      this.analysis = e.target.innerHTML;
    },
    //返回题目信息
    returnQuestionInfo() {
      this.$emit('contentchange', {
        name: this.title,
        topics: this.topics,
        answers: this.answers,
        analysis: this.analysis,
      });
    },
    //页面初始化
    initData() {
      //有原始值，按原始值初始化
      if (this.sourceData && this.sourceData.topics) {
        var data = this.sourceData;
        //标题
        this.name = data.name;
        this.title = data.name;
        //this.topics = data.topics;
        //答案
        this.answers = data.answers;
        //解析
        this.analysis = data.analysis;
      } else {
      //默认全新的初始化，相当于新建
        //标题
        this.name = '';
        this.title = '';
        //this.topics = [];
        //答案
        this.answers = [];
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

<style lang="less">
.exers-txts {
  margin-top: 10px;
}
</style>
