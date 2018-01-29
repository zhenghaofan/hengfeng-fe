<template>
<div>
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

  <div class="g-form">
    <div class="control fill-container" v-for="(item, index) in topics">
      <label class="label g-vertop">题目{{parseInt(index) + 1}}：</label>
      <div class="tip">
        <i @click="add(index)" class="iconf i-add g-ml10" title="添加"></i>
        <i @click="del(index)" class="iconf i-trash g-ml10" title="删除"></i>
        <i @click="up(index)" class="iconf i-arrow-up g-ml10" :class="{'iconf-disabled': index === 0}" title="上移"></i>
        <i @click="down(index)" class="iconf i-arrow-down g-ml10" :class="{'iconf-disabled': index === topics.length - 1}" title="下移"></i>
      </div>
      <div class="txts g-mb20">
        <div class="option">
          <el-radio-group v-model="answers[index]">
            <el-radio v-for="(value, key) in item" :class="(key == 'B' || key == 'D') ? 'g-tr': ''" :key="key" :label="key">
              选项{{key}}：
              <div v-html="value" contenteditable="true" @blur="topicschange(index, key, $event)" @click.prevent="optionClick"></div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="control">
        <label class="label g-vertop">解析：</label>
        <div class="txts">
          <div v-html="analysis[index]" contenteditable="true" @blur="analysischange(index, $event)"></div>
          <div class="tip" @click="toggleEditor('analysis', analysis[index], index)">
            <i class="iconf i-toggle"></i>
            <span>高级模式</span>
          </div>
        </div>
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
      _name: '',
      options: {},
      //选项 对象
      topics: [],
      //答案
      answers: [],
      //解析
      analysis: [],
      defaultOptionsLen: 4,
      initcontent: '',
      editorId: 'protypefill-' + (+new Date()),
      showEditor: false,
      optionsInfo: {},
      modelName: '',
    }
  },
  watch: {
    // checkTemplate(template) {
    //   if (template === 'SINGLE_CHOICE') {
    //     this.checkForm();
    //   }
    // },

    topics() {
      this.returnQuestionInfo();
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
    namechange(e, index) {
      this.$emit('namechange', e.target.innerHTML, index);
    },
    optionClick() {
      return;
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
      if (model === '_name') {
        this.$emit('namechange', value, otherInfo.index);
        this.$emit('contentchange', otherInfo.index, {
          topics: this.topics,
          answers: this.answers,
          analysis: this.analysis,
        });
        return;
      }
      this[model][otherInfo.index] = value;

      this.initcontent = '';

      //返回题目信息
      this.returnQuestionInfo();
    },
    //校验TODO
    checkForm() {
      var list = this.options,
        tips = '选项';

      for (var i = 0, len = list.length; i < len; i++) {
        //为空
        if (!list[i].value) {
          this.$message.error('选项' + list[i].label + '内容不能为空!');
          this.$emit('afterChecked', false);
          return;
        }
      }

      if (!this.answers) {
        this.$message.error('问题答案不能为空!');
        this.$emit('afterChecked', false);
        return;
      }

      this.$emit('afterChecked', true);
    },

    //新增选项
    add(index) {
      var nextIndex = index + 1,
        len = this.topics.length,
        rightTopicList = this.topics.splice(nextIndex, len - index),
        rightAnswerList = this.answers.splice(nextIndex, len - index),
        rightAnalysisList = this.analysis.splice(nextIndex, len - index);

      this.topics[index + 1] = {
        "A": "",
        "B": "",
        "C": "",
        "D": ""
      };
      this.answers[index + 1] = 'A';
      this.analysis[index + 1] = '';
      this.topics = this.topics.concat(rightTopicList);
      this.answers = this.answers.concat(rightAnswerList);
      this.analysis = this.analysis.concat(rightAnalysisList);
    },
    //删除选项
    del(index) {
      //至少两项
      if (this.topics.length < 2) {
        // this.$message('单选题至少要两项！');
        return;
      }

      this.topics.splice(index, 1);
      this.answers.splice(index, 1);
      this.analysis.splice(index, 1);
    },
    //交换index
    changeIndex(index, ...arrs) {
      arrs.forEach((arr) => {
        let curItem = arr[index],
          nextItem = arr[index + 1];
        arr[index] = nextItem;
        arr[index + 1] = curItem;
      })
    },

    //向上移动
    up(index) {
      var prevIndex = index - 1;
      //是第一个
      if (index === 0) {
        //不上移
        return;
        //放最后一个
        //this.topics.push(this.topics.shift());
      } else {
        this.changeIndex(prevIndex, this.topics, this.answers, this.analysis)
      }
      this.topics = this.topics.concat([]);
      this.answers = this.answers.concat([]);
      this.analysis = this.analysis.concat([]);
    },

    down(index) {
      //是最后一个
      if (index >= this.topics.length - 1) {
        //不上移
        return;
        //放第一个
        //this.topics.unshift(this.topics.pop());
      } else {
        this.changeIndex(index, this.topics, this.answers, this.analysis);
      }
      this.topics = this.topics.concat([]);
      this.answers = this.answers.concat([])
      this.analysis = this.analysis.concat([]);
    },

    //解析有变
    analysischange(index, e) {
      // this.analysis[index] = e.target.innerHTML;
      Vue.set(this.analysis, index, e.target.innerHTML)
    },
    //选项有变
    topicschange(index, key, e) {
      Vue.set(this.topics[index], key, e.target.innerHTML)
    },
    //返回题目信息
    returnQuestionInfo() {
      if (this.titleIndex > -1) {
        this.$emit('contentchange', this.titleIndex, {
          topics: this.topics,
          answers: this.answers,
          analysis: this.analysis,
        })
      } else {
      this.$emit('contentchange', {
        topics: this.topics,
        answers: this.answers,
        analysis: this.analysis,
      });
    }
    },
    //页面初始化
    initData() {
      //有原始值，按原始值初始化
      if (this.sourceData && Object.keys(this.sourceData).length > 1) {
        var data = this.sourceData;

        //初始化选项
        // this.initOptions(data.topics);
        this.topics = data.topics || [];
        //答案
        this.answers = data.answers || [];
        //解析
        this.analysis = data.analysis || [];
      } else {
        //默认全新的初始化，相当于新建

        //初始化选项
        this.topics = [{
          "A": "",
          "B": "",
          "C": "",
          "D": ""
        }];
        //答案
        this.answers = [];
        //解析
        this.analysis = [];
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
.fill-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  .tip {
    right: 28px;
  }
  .txts {
    width: 848px;
  }
}
.option {
    display: inline-block;
    .el-radio-group {
        margin-top: 36px;
        .el-radio {
            width: 50%;
            margin-bottom: 10px;
            .el-radio__input {
                padding-left: 0;
            }
            .el-radio__label {
                padding-left: 0;
                div[contenteditable="true"] {
                    text-align: left;
                    height: 30px;
                    width: 336px;
                    vertical-align: middle;
                    // overflow: auto;
                    white-space: normal;
                    display: inline-block;
                }
            }
        }
    }
}
.el-radio + .el-radio {
    margin-left: 0;
}
</style>
