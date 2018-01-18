<template lang="html">
  <el-dialog title="高级模式" :visible.sync="showEditor" :before-close="closeEditor" :close-on-click-modal="false">
    <editor :editor-id="editorId" @contentchange="contentchange" :init-content="initcontent" :options-info="optionsInfo"></editor>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEditor">取 消</el-button>
      <el-button type="primary" @click="fillRichText">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import editor from '@/components/umeditor/Editor'

export default {
  data() {
    return {
      richTextHtml: '',
      //initcontent: ''
    }
  },
  components: {
    editor
  },
  props: {
    modelName: {
      type: String
    },
    showEditor: {
      type: Boolean
    },
    editorId: {
      type: String
    },
    initcontent: {
      type: String
    },
    optionsInfo: {
      type: Object
    },
  },
  methods: {
    contentchange(item) {
      this.richTextHtml = item.html
    },
    closeEditor() {
      this.$emit('closeEditor');
    },
    fillRichText() {
      this.$emit('fillRichText', this.modelName, this.richTextHtml, this.optionsInfo);
    }
  }
}
</script>

<style lang="css">
</style>
