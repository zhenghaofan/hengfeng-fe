<template lang="html">
<div>
  <div class="col editor-container" v-for="(item, index) in options" :key='index'>
    <div class="control">
      <label class="label g-vertop">选项{{item}}：</label>
      <div class="txts g-ml10">
        <div v-html="topics[item]" contenteditable="true" @blur="optionschange($event, item)"></div>
        <div class="tip">
          <i class="iconf i-toggle" @click="toggleEditor('topics', item)"></i>
          <i class="iconf i-add" @click="addOption(index)"></i>
          <i class="iconf i-trash" @click="delOption(index)"></i>
        </div>
      </div>
    </div>
  </div>

  <div class="col">
    <div class="control">
      <label class="label g-vertop">答案：</label>
      <div class="txts g-ml10 radios">
        <el-radio v-for="item in options" v-model="contents.answers" :label="item" :key="item" @change="answerschange">{{item}}</el-radio>
      </div>
    </div>
  </div>

  <div class="col editor-container">
    <div class="control">
      <label class="label g-vertop">解析：</label>
      <div class="txts g-ml10">
        <div v-html="analysis" contenteditable="true" @blur="analysischange($event)"></div>
        <div class="tip" @click="toggleEditor('analysis')">
          <i class="iconf i-toggle"></i>
          <span>高级模式</span>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  props: ['options', 'topics', 'analysis'],
  data() {
    return {
      contents: {
        answers: null,
        analysis: '',
        topics: null
      }
    }
  },
  methods: {
    toggleEditor(model, item) {
      this.$emit('toggleEditor', model, item)
    },
    answerschange() {
      this.$emit('contentchange', this.contents);
    },
    analysischange(e) {
      this.contents.analysis = e.target.innerText;
      this.$emit('contentchange', this.contents);
    },
    optionschange(e, item) {
      this.$emit('optionschange', item, e.target.innerText);
    },
    addOption(index) {
      this.$emit('addoption', index);
    },
    delOption(index) {
      this.$emit('deloption', index);
    }
  }
}
</script>

<style lang="css">
</style>
