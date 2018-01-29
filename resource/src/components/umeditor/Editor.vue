<template>
  <!-- 加载编辑器的容器 -->
	<script :id="editorId" name="content" type="text/plain" class="editor">
	    这里写你的初始化内容
	</script>
</template>

<script>
/* 注意：需要手动引入js和css文件在html里
  先引用　后面再考虑文件压缩及图标，样式等
 */
import Vue from 'vue'
export default {
  name: 'Editor',
  data () {
    return {

    }
  },
  props: {
		editorId: {
			default: '',
			require: true
		},
		initContent: {
			default: '',
			require: false
		},
    watchInitContent: {
      default: true,
      require: false
    }
	},
  watch: {
    initContent(content) {
      if (!this.watchInitContent) {
        return;
      }
      var um = UM.getEditor(this.editorId);
      um.setContent(content);
    },
    watchInitContent() {
      var um = UM.getEditor(this.editorId);
      um.setContent(this.initContent);
    },
  },
	// ['editorId', 'initContent'],
  mounted() {
    var self = this,
        um = UM.getEditor(this.editorId);
    window.UM = UM;
    /* 设置编辑器内容 */
    um.setContent(this.initContent);

    /* 监听内容变化 */
    um.addListener('contentChange', function(){
      self.$emit('contentchange', {
				id: self.editorId,
        html: um.getContent(),
        text: um.getContentTxt()
      });
    });

    /* 下横线 */
    um.addListener('lowercrossline', function(){
      self.$emit('lowercrossline', {
        id: self.editorId,
        html: um.getContent(),
        text: um.getContentTxt()
      });
    });

    /* 添加小括号 */
    um.addListener('parenthese', function(){
      self.$emit('parenthese', {
        id: self.editorId,
        html: um.getContent(),
        text: um.getContentTxt()
      });
    });
  },
}
</script>
<style>
.editor {
  width: 100%;
  height: 300px;
}
</style>
