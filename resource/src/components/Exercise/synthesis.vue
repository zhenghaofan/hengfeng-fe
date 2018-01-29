<template lang="html">
  <div class="">

  <div class="g-form">

    <div class="control">
      <label class="label g-vertop">题型：</label>
      <el-select v-model="templateName" size="small" placeholder="请选择模板">
        <el-option v-for="item in templates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" @click="addTemplate">添加</el-button>
    </div>

    <div class="subexers">
      <div class="subexer-container" v-for="(item, index) in templateList">
      <!-- <div class="control" v-if="item != 'GENERAL_GAP_FILLING'">
        <label class="label g-vertop">小题{{index + 1}}：</label>
        <div class="txts">
          <div v-html="name[index]" contenteditable="true" @blur="namechange($event, index)"></div>
          <div class="tip" @click="toggleEditor({model: 'name', value: name[index]})">
            <i class="iconf i-toggle"></i>
            <span>高级模式</span>
          </div>
        </div>
      </div> -->

      <div class="tip sub-tip">
        <i @click="del(index)" class="iconf i-trash g-ml10" title="删除"></i>
        <i @click="up(index)" class="iconf i-arrow-up g-ml10" :class="{'iconf-disabled': index === 0}" title="上移"></i>
        <i @click="down(index)" class="iconf i-arrow-down g-ml10" :class="{'iconf-disabled': index === topics.length - 1}" title="下移"></i>
      </div>

      <div class="g-mb20" v-if="item.template == 'SINGLE_CHOICE'">
        <singlechoice :titleIndex="index" :name="item.name" :sourceData="item" @namechange="namechange" @contentchange="contentchange"></singlechoice>
      </div>
      <div class="g-mb20" v-if="item.template == 'MULTIPLE_CHOICE'">
        <multichoice :titleIndex="index" :name="item.name" :sourceData="item" @namechange="namechange" @contentchange="contentchange"></multichoice>
      </div>
      <div class="g-mb20" v-if="item.template == 'GENERAL_GAP_FILLING'">
        <generalfill :titleIndex="index" :name="item.name" :sourceData="item" @namechange="namechange" @contentchange="contentchange"></generalfill>
      </div>
      <div class="g-mb20" v-if="item.template == 'CLOZE_GAP_FILLING'">
        <protypefill :titleIndex="index" :name="item.name" :sourceData="item" @namechange="namechange" @contentchange="contentchange"></protypefill>
      </div>
      <div class="g-mb20" v-if="item.template == 'JUDGE'">
        <judge :titleIndex="index" :name="item.name" :sourceData="item" @namechange="namechange" @contentchange="contentchange"></judge>
      </div>
      <div class="g-mb20" v-if="item.template == 'ESSAY'">
        <shortanswer :titleIndex="index" :name="item.name" :sourceData="item" @namechange="namechange" @contentchange="contentchange"></shortanswer>
      </div>
      <div class="g-mb20" v-if="item.template == 'LIGATURE'">
        <ligature :titleIndex="index" :name="item.name" :check-template="checkTemplate" :sourceData="item" @afterChecked="getCheckResult" @namechange="namechange" @contentchange="contentchange"></ligature>
      </div>
      <!-- <div class="g-mb20" v-if="item.template == 'SYNTHESIS'">
        <synthesis></synthesis>
      </div> -->
    </div>
  </div>

  </div>
  <editor-dialog :editorId="editorId" :model-name="modelName" :options-info="optionsInfo" :initcontent="initcontent" :showEditor="showEditor" @fillRichText="updateContent" @closeEditor="closeEditor"></editor-dialog>
</div>

</template>

<script>
import Vue from 'vue'
import editorDialog from '@/components/editorDialog'
import singlechoice from './single'
import multichoice from './multi'
import generalfill from './generalfill'
import protypefill from './protypefill'
import judge from './judge'
import shortanswer from './shortanswer'
import ligature from './ligature'
import synthesis from './synthesis'

export default {
  props: [
    //原始值，编辑的时候传过来的
    'sourceData',
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
      templateName: '',
      templates: [{
          value: 'SINGLE_CHOICE',
          label: '单选题'
        },
        {
          value: 'MULTIPLE_CHOICE',
          label: '多选题'
        },
        {
          value: 'JUDGE',
          label: '判断题'
        },
        {
          value: 'GENERAL_GAP_FILLING',
          label: '填空题'
        },
        {
          value: 'ESSAY',
          label: '问答题'
        },
        {
          value: 'CLOZE_GAP_FILLING',
          label: '完型填空题'
        },
        {
          value: 'LIGATURE',
          label: '连线题'
        }
      ],
      templateList: [],

      // name: [],
      initcontent: '',
      editorId: 'synthesis-' + (+new Date()),
      showEditor: false,
      modelName: '',
      optionsInfo: {},
      topics: []
    }
  },
  watch: {
    templateList() {
      let obj = {children: this.templateList};
      this.$emit('contentchange', obj);
    }
  },
  methods: {
    getCheckResult(value) {
      this.$emit('afterChecked', value);
    },
    contentchange(index, obj) {
      for (var key in obj) {
        Vue.set(this.templateList[index], key, obj[key]);
      }
    },
    namechange(val, index) {
      // this.templateList[index].name = val;
      Vue.set(this.templateList[index], 'name', val)
      // console.log(this.templateList);
    },
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
      this[model][otherInfo.index] = value;

      this.initcontent = '';

      //返回题目信息
      this.returnQuestionInfo();
    },

    addTemplate() {
      let obj = {
        template: this.templateName
      }
      if (!this.templateName) {
        return;
      }
      this.templateList.push(obj);
    },

    //删除选项
    del(index) {
      //至少两项
      if (!this.templateList.length) {
        return;
      }

      this.templateList.splice(index, 1);
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
        //this.options.push(this.options.shift());
      } else {
        this.changeIndex(prevIndex, this.templateList)
      }
      this.templateList = this.templateList.concat([]);
    },
    //向下移动
    down(index) {
      //是最后一个
      if (index >= this.templateList.length - 1) {
        //不上移
        return;

        //放第一个
        //this.options.unshift(this.options.pop());
      } else {
        this.changeIndex(index, this.templateList)
      }
      this.templateList = this.templateList.concat([]);
    },
  },
  mounted() {
    if (this.sourceData && this.sourceData.children) {
      this.templateList = this.sourceData.children;
    } else {
      this.templateList = [];
    }
  }
}
</script>

<style lang="less">
.subexers {
  margin-left: 20px;
  margin-bottom: 20px;
  .subexer-container {
    position: relative;
    padding-top: 48px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    .sub-tip {
      right: 35px;
      top: 16px;
    }
    .txts {
      width: 830px;
    }
    .edui-container {
      border-shadow: none;
    }
    .shortanswer-container {
      width: 96%;
      .txts {
        width: 810px;
      }
    }
    .fill-container {
      margin: 0 10px 20px;
    }
  }
}
</style>
