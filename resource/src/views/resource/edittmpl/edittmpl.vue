<template>
  <div class="hello">
    <editor :editor-id="'editor1'" :init-content="initcontent1" @contentchange="editor1changed"></editor>
    <div v-html="initcontent1"></div>
    <editor :editor-id="'editor2'" :init-content="initcontent2" @contentchange="editor2changed"></editor>
    <div v-html="initcontent2"></div>
  </div>
</template>

<script>
import Editor from '@/components/umeditor/Editor.vue'
export default {
  name: 'edittmpl',
  data () {
    return {
      initcontent1: 'Welcome',
      initcontent2: '2',
    }
  },
  components: {
    Editor
  },
  methods: {
    editor1changed(editor) {
      this.initcontent1 = editor.html;
    },
    editor2changed(editor) {
      this.initcontent2 = editor.html;
    },
  },
}
</script>

<style>

</style>
