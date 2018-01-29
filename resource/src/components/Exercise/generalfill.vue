<template>
<div>
  <div class="control" v-if="titleIndex > -1">
    <label class="label g-vertop">小题{{titleIndex + 1}}：</label>
    <div class="txts">
      <editor :editor-id="editorId" @contentchange="contentchange" @lowercrossline="addAnswerOption" @parenthese="addAnswerOption" :init-content="title" :watch-init-content="watchInitContent" :options-info="optionsInfo"></editor>
    </div>
  </div>
  <div class="control" v-else>
    <label class="label g-vertop">题干：</label>
    <div class="txts">
      <editor :editor-id="editorId" @contentchange="contentchange" @lowercrossline="addAnswerOption" @parenthese="addAnswerOption" :init-content="title" :watch-init-content="watchInitContent" :options-info="optionsInfo"></editor>
    </div>
  </div>

  <div class="g-form editor-container" v-for="(item, index) in answers">
    <div class="control">
      <label class="label g-vertop">空格{{index+1}}答案：</label>
      <div class="txts">
        <div v-html="item" contenteditable="true" @blur="optionschange(index, $event)"></div>
        <div class="tip">
          <i class="iconf i-toggle" @click="toggleEditor('topics', item, index)" title="高级模式"></i>
          <i @click="add(index)" class="iconf i-add g-ml10" title="添加"></i>
          <i @click="del(index)" class="iconf i-trash g-ml10" title="删除"></i>
          <i @click="up(index)" class="iconf i-arrow-up g-ml10" :class="{'iconf-disabled': index === 0}" title="上移"></i>
          <i @click="down(index)" class="iconf i-arrow-down g-ml10" :class="{'iconf-disabled': index === answers.length - 1}" title="下移"></i>
        </div>
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

  <editor-dialog :editorId="editorId2" :model-name="modelName" :options-info="optionsInfo" :initcontent="initcontent" :showEditor="showEditor" @fillRichText="updateContent" @closeEditor="closeEditor"></editor-dialog>

</div>
</template>

<script>
import Vue from 'vue'
import editorDialog from '@/components/editorDialog'
import editor from '@/components/umeditor/Editor'
import utils from '@/utils/'

export default {
  components: {
    editorDialog,
    editor,
  },
  // props: [
  //   //原始值，编辑的时候传过来的
  //   'sourceData',
  //   'checkTemplate',
  // ],
  props: {
    titleIndex: {
      default: -1,
      require: false
    },
    sourceData: {
      type: Object
    },
    checkTemplate: {

    },
    name: {
      default: ''
    }
  },
  data() {
    return {
      //name: '',
      title: '',
      //选项 数组
      options: [],
      //选项 对象
      topics: [],
      //答案
      answers: [],
      //解析
      analysis: '',
      defaultOptionsLen: 1,
      initcontent: '',
      editorId: 'generalfill-' + (+new Date()),
      editorId2: 'generalfill-2-' + (+new Date()),
      showEditor: false,
      optionsInfo: {},
      modelName: '',
      innerData: {},
      watchInitContent: true,
    }
  },
  watch: {
    checkTemplate(template) {
      if (template === 'GENERAL_GAP_FILLING') {
        this.checkForm();
      }
    },
    /*'sourceData': {
      handler(val) {
        //
        this.innerData = utils.cloneObj(val);
        console.log('sourceData');
        this.initData();
      },
      deep: true,
    },*/
    /*title() {
      //返回题目信息
      this.returnQuestionInfo();
    },*/
    options: {
      handler(val) {
        //返回题目信息
        this.returnQuestionInfo();
      },
      deep: true,
    },
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
    addAnswerOption(info) {
      this.add(this.answers.length-1);
    },
    contentchange(info) {
      //this.name = info.html;
      this.title = info.html;
       //返回题目信息
      this.returnQuestionInfo();
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

      if (model === 'topics') {
        this.answers[otherInfo.index] = value;
      } else if (model === '_name') {
        this.$emit('namechange', value, otherInfo.index);
        this.$emit('contentchange', otherInfo.index, {
          topics: this.topics,
          answers: this.answers,
          analysis: this.analysis,
        });
        return;
      } else {
        this[model] = value;
      }

      this.initcontent = '';

      //返回题目信息
      this.returnQuestionInfo();
    },
    //校验TODO
    checkForm() {
      var list = this.answers,
        tips = '选项';

      for (var i = 0, len = list.length; i < len; i++) {
        //为空
        if (!list[i]) {
          this.$message.error('空格' + list[i] + '答案不能为空!');
          this.$emit('afterChecked', false);
          return;
        }
      }

      this.$emit('afterChecked', true);
    },
    //新增选项
    add(index) {
      var nextIndex = index + 1,
        len = this.answers.length,
        rightList = this.answers.splice(nextIndex, len - index);

      this.answers[index + 1] = '';
      this.answers = this.answers.concat(rightList);

      this.topics.splice(index, 1, this.answers.length);
    },
    //删除选项
    del(index) {
      this.answers.splice(index, 1);
    },
    //向上移动
    up(index) {
      var curItem = this.answers[index],
        prevIndex = index - 1,
        prevItem;
      //是第一个
      if (index === 0) {
        //不上移
        return;

        //放最后一个
        //this.answers.push(this.answers.shift());
      } else {
        prevItem = this.answers[prevIndex];
        this.answers[index] = prevItem;
        this.answers[prevIndex] = curItem;
      }
      this.answers = this.answers.concat([]);
    },
    //向下移动
    down(index) {
      var curItem = this.answers[index],
        nextIndex = index + 1,
        nextItem;

      //是最后一个
      if (index >= this.answers.length - 1) {
        //不上移
        return;

        //放第一个
        //this.answers.unshift(this.answers.pop());
      } else {
        nextItem = this.answers[nextIndex];
        this.answers[index] = nextItem;
        this.answers[nextIndex] = curItem;
      }
      this.answers = this.answers.concat([]);
    },
    //解析有变
    analysischange(e) {
      this.analysis = e.target.innerHTML;
    },
    //选项有变
    optionschange(index, e) {
      // var value = e.target.innerHTML;
      // this.answers[index] = value;
      Vue.set(this.answers, index, e.target.innerHTML)
    },
    //返回题目信息
    returnQuestionInfo() {
      if (this.titleIndex > -1) {
        this.$emit('contentchange', this.titleIndex, {
          name: this.title,
          topics: this.topics,
          answers: this.answers,
          analysis: this.analysis,
        })
      } else {
        this.$emit('contentchange', {
          name: this.title,
          topics: this.topics,
          answers: this.answers,
          analysis: this.analysis,
        });
      }
    },
    //页面初始化
    initData() {
      //有原始值，按原始值初始化
      if (this.sourceData && this.sourceData.topics) {
        var data = utils.cloneObj(this.sourceData);
        //标题
        //this.name = data.name;
        this.title = data.name || '';
        this.topics = data.topics || [];
        //答案
        this.answers = data.answers || [''];
        //解析
        this.analysis = data.analysis || '';
      } else {
        //默认全新的初始化，相当于新建
        //标题
        //this.name = '';
        this.title = '';
        this.topics = [];
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
      this.watchInitContent = false;
      //let ue = UM.getEditor('gf-name')
    });
  },
}
</script>

<style lang="less">
.exers-txts {
    margin-top: 10px;
}
.txts {
  .edui-body-container {
    width: 100% !important;
  }
}
</style>
