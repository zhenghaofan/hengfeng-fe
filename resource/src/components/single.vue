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
  <div class="g-form editor-container" v-for="(item, index) in options">
    <div class="control">
      <label class="label g-vertop">选项{{item.label}}：</label>
      <div class="txts">
        <div v-html="item.value" contenteditable="true" @blur="optionschange(index, item.label, $event)"></div>
        <div class="tip">
          <i class="iconf i-toggle" @click="toggleEditor('topics', item.value, item.label, index)" title="高级模式"></i>
          <i @click="add(index)" class="iconf i-add g-ml10" title="添加"></i>
          <i @click="del(index)" class="iconf i-trash g-ml10" title="删除"></i>
          <i @click="up(index)" class="iconf i-arrow-up g-ml10" :class="{'iconf-disabled': index === 0}" title="上移"></i>
          <i @click="down(index)" class="iconf i-arrow-down g-ml10" :class="{'iconf-disabled': index === options.length - 1}" title="下移"></i>
        </div>
      </div>
    </div>
  </div>

  <div class="control">
    <label class="label g-vertop">答案：</label>
    <div class="txts exers-txts">
      <el-radio-group v-model="answers">
        <el-radio v-for="(item, index) in options" :label="item.label" :key="item.label">{{item.label}}</el-radio>
      </el-radio-group>
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
    titleIndex: {
      default: -1,
      require: false
    },
    sourceData: {
    },
    checkTemplate: {
    },
    name: {
      // default: ''
    }
  },
  data() {
    return {
      _name: '',
      //选项 数组
      options: [],
      //选项 对象
      topics: {},
      //答案
      answers: '',
      //解析
      analysis: '',
      defaultOptionsLen: 4,
      initcontent: '',
      editorId: 'single',
      showEditor: false,
      optionsInfo: {},
      modelName: '',
    }
  },
  watch: {
    checkTemplate(template) {
      if (template === 'SINGLE_CHOICE') {
        this.checkForm();
      }
    },
    /*'sourceData': {
      handler(val) {
        console.log(1);
        this.initData();
      },
      deep: true,
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
    namechange(e, index) {
      this.$emit('namechange', e.target.innerHTML, index);
    },
    //显示编辑器
    toggleEditor(model, value, label, index) {
      this.modelName = model;

      if (model === 'topics') {
        this.optionsInfo.label = label;
        this.optionsInfo.index = index;
      } else if (model === '_name') {
        this.optionsInfo.index = label;
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
        this.options[otherInfo.index].value = value;
        this.topics[otherInfo.label] = value;
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
    //数字转字母
    getNumToCharacter(i) {
      return String.fromCharCode(i.toString().charCodeAt(0) + 17);
    },
    //数组转对象(仅适用于当前情况)
    getArrayToObj(list) {
      var resultObj = {};

      for (var i = 0, len = list.length; i < len; i++) {
        resultObj[list[i].label] = list[i].value;
      }

      return resultObj;
    },
    //对象转数组(仅适用于当前情况)
    getObjToArray(obj) {
      var resultArr = [];

      for (var i in obj) {
        resultArr.push({
          label: i,
          value: obj[i].toString(),
        });
      }

      return resultArr;
    },
    //纠正label值
    fixListLabel(list) {
      for (var i = 0, len = list.length; i < len; i++) {
        list[i].label = this.getNumToCharacter(i);
      }
    },
    //初始化题目选项
    initOptions(topics) {
      var len = this.defaultOptionsLen;

      //传过来的是一个对象
      /*"topics":{
        "A":"1",
        "B":"2",
        "C":"3",
        "D":"4"
      },*/
      //有初始值
      if (topics) {
        this.options = this.getObjToArray(topics);
        this.topics = this.getArrayToObj(this.options);
        /*var i = 0;
        for (var item in topics) {
          this.options.push({
            label: item,
            value: topics[item]
          });
          this.topics[item] = topics[item];
        }*/
      } else {
        //无初始值
        var label;
        for (var i = 0; i < len; i++) {
          //数字转字母
          label = this.getNumToCharacter(i);
          this.options.push({
            label: label,
            value: '',
          });
          this.topics[label] = '';
        }
      }

    },
    //新增选项
    add(index) {
      var nextIndex = index + 1,
        len = this.options.length,
        rightList = this.options.splice(nextIndex, len - index);

      this.options[index + 1] = {
        label: this.getNumToCharacter(index + 1),
        value: '',
      };
      this.options = this.options.concat(rightList);

      //纠正label值
      this.fixListLabel(this.options);

      //返加的obj
      this.topics = this.getArrayToObj(this.options);
    },
    //删除选项
    del(index) {
      //至少两项
      if (this.options.length < 3) {
        this.$message('单选题至少要两项！');
        return;
      }

      this.options.splice(index, 1);

      //纠正label值
      this.fixListLabel(this.options);

      //返加的obj
      this.topics = this.getArrayToObj(this.options);
    },
    //向上移动
    up(index) {
      var curItemValue = this.options[index].value,
        prevIndex = index - 1,
        prevItemValue;
      //是第一个
      if (index === 0) {
        //不上移
        return;

        //放最后一个
        //this.options.push(this.options.shift());
      } else {
        prevItemValue = this.options[prevIndex].value;
        this.options[index].value = prevItemValue;
        this.options[prevIndex].value = curItemValue;
      }
      this.options = this.options.concat([]);

      //返加的obj
      this.topics = this.getArrayToObj(this.options);
    },
    //向下移动
    down(index) {
      var curItemValue = this.options[index].value,
        nextIndex = index + 1,
        nextItemValue;

      //是最后一个
      if (index >= this.options.length - 1) {
        //不上移
        return;

        //放第一个
        //this.options.unshift(this.options.pop());
      } else {
        nextItemValue = this.options[nextIndex].value;
        this.options[index].value = nextItemValue;
        this.options[nextIndex].value = curItemValue;
      }
      this.options = this.options.concat([]);

      //返加的obj
      this.topics = this.getArrayToObj(this.options);
    },
    //解析有变
    analysischange(e) {
      this.analysis = e.target.innerHTML;
    },
    //选项有变
    optionschange(index, label, e) {
      var value = e.target.innerHTML;
      this.options[index].value = value;
      this.topics[label] = value;
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
        this.initOptions(data.topics);
        // this.name = data.name;
        //答案
        this.answers = data.answers;
        //解析
        this.analysis = data.analysis;
      } else {
        //默认全新的初始化，相当于新建

        //初始化选项
        this.initOptions();
        //答案
        this.answers = '';
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
