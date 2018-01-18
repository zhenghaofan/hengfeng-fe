<template lang="html">
  <div class="">

    <div class="col">
      <div class="control">
        <label class="label g-vertop">答案：</label>

        <div class="txts g-ml10 radios">
          <el-radio v-model="contents.answers" label="true" @change="judgechange">正确</el-radio>
          <el-radio v-model="contents.answers" label="false" @change="judgechange">错误</el-radio>
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
  props: ['analysis'],
  data() {
    return {
      contents: {
        answers: null,
        analysis: ''
      }
    }
  },
  methods: {
    judgechange() {
      this.$emit('judgechange', this.contents.answers)
    },
    toggleEditor(model, item) {
      this.$emit('toggleEditor', model, item)
    },
    analysischange(e) {
      this.contents.analysis = e.target.innerText;
      this.$emit('contentchange', this.contents);
    },
  }
}
</script>

<style lang="css">
</style>
