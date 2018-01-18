<template lang="html">
  <div class="">
    <div class="exam-item g-mb20" v-if="datas[0]">
      <p>
        <i class="iconf i-resource"></i>{{datas[0].name}}
        <i class="iconf i-delete i-fixed iconb" @click="deleteExam(datas[0].sourceFile)"></i>
      </p>
    </div>
    <div class="g-tc g-mt20" v-if="isUploaded">
      <!-- <a :href="previewDocLink" target="_blank" class="btn btn-green">预览</a> -->
      <a href="#" class="btn btn-green" @click="uploadExam">预览</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      // previewDocLink: ''
    }
  },
  props: {
    datas: {
      require: true,
    },
    isUploaded: {}
  },
  methods: {
    uploadExam(file) {
      this.$emit('uploadHandle', file)
    },
    deleteExam(item) {
      this.datas.splice(0, 1);
      this.$emit('deleteHandle', item);
      // Vue.set(this.datas, 0, null);
    }
  },
  watch: {
    // datas() {
    //   if(this.datas[0]) {
    //     this.previewDocLink = "javascript:POBrowser.openWindow('" + this.datas[0].sourceFile.path + "', 'width=1200px;height=800px;')";
    //   }
    // }
  },
  mounted() {
  }
}
</script>

<style lang="css">
.exam-item {
  margin-left: 90px;
  background: white;
  padding: 20px;
}
.el-textarea {
  margin: 10px 2%;
}
.el-textarea__inner {
  background: #EBECF1;
  width: 96%;
}
.i-fixed {
  position: absolute;
  right: 50px;
  font-size: 14px;
}
</style>
