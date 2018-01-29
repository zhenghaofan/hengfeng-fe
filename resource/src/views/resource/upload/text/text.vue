<template lang="html">
  <!-- 教案、课件、导学案 -->
  <div class="">
    <div class="text-item g-mb20" v-for="(item, index) in datas" :key="item.id">
      <p>
        <i class="iconf i-resource"></i>{{item.name}}
        <i class="iconf i-delete f-r iconb" @click="deleteText(item, index)"></i>
        <i class="iconf i-preview f-r iconb g-mr10" @click="item.officeViewSourceFile ? previewText(item.officeViewSourceFile) : previewText(item.sourceFile)"></i>
      </p>
      <el-input type="textarea" placeholder="请在此填写资源描述" :maxlength="500" v-model="description[index]" :rows="6"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // description: new Array(this.datas.length).fill(""),
      description: [],
      previewDocLink: ''
    }
  },
  props: {
    datas: {
      require: true,
    },
  },
  watch: {
    description(val) {
      this.$emit('desChanged', val)
    }
  },
  methods: {
    previewText(file) {
      this.$emit('previewHandle', file)
    },
    deleteText(item, index) {
      this.datas.splice(index, 1);
      this.$emit('deleteHandle', item)
    },
    // getPreviewDocLink(file) {
    //   return POBrowser.openWindow(" + file.path + ", 'width=1200px;height=800px;');
    // }
  },
  mounted() {
  }
}
</script>

<style lang="css">
.text-item {
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
</style>
