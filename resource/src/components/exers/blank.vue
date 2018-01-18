<template lang="html">
  <div class="">

    <div class="col editor-container" v-for="(item, index) in blanks">
      <div class="control">
        <label class="label g-vertop">空格{{item}}：</label>
        <div class="txts g-ml10">
          <div v-html="blanks[index]" contenteditable="true"></div>
          <div class="tip">
            <i class="iconf i-toggle" @click="toggleEditor('answers', item, index)"></i>
            <i class="iconf i-add" @click="addBlank(index)"></i>
            <i class="iconf i-trash" @click="delBlank(index)"></i>
          </div>
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
export default {}
</script>

<style lang="css">
</style>
