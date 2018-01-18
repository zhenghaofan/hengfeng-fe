<template>
	<li class="g-mb10 treeli">
    <div class="g-mb10">
      <span class="tit">
      	<i class="icon g-mr5" @click="toggle" :class="{'i-circle': !isDisabled, 'i-dot': isDisabled}"></i>
      	<input :disabled="isDisabled" @click="editNode" type="text" v-model="node.name" @blur="changeNodeName" :placeholder="node.placeholder||'请输入知识点名称'" class="g-knwtree-iptxt" v-focus="needFocus" maxlength="16" />
        <p class="errortips" v-if="needTips">知识点名称不能为空！</p>
      </span>
      <small class="opts">
        <template v-if="node.placeholder !== '知识点标题默认学段+学科'"><a @click.prevent="removeNode" href="#">删除</a>|</template>
        <a @click.prevent="editNode" href="#">编辑</a>    
        <template v-if="node.levelIndex < 3">|<a @click.prevent="addNode" href="#">新增</a></template>
      </small>
    </div>
    <ul v-show="node.children.length && node.open">
    	<tree-node v-for="node in node.children" :key="node.id" :node="node"></tree-node>
    </ul>
  </li>
</template>
<script>
//引入弹窗
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);
export default {
	name: 'tree-node',
	data: function(){
    return {
      isDisabled: false,
      needFocus: true,
      needTips: false,
      levelIndex: 1
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      },
      update(el, binding, oldVal, newVal) {
        if (newVal) {
          el.focus();
      	}
      }
    }
  },
  props: ['node'],
  methods:{
    addNode: function() {
      var name = this.node.name.trim();
      //标题不需要做非空判断
      //if (!name && this.node.placeholder !== '请输入知识点标题') {
        // this.$myMsgBox({
        //   message: '<p><i class="icon-pop-impt"></i></p>\
        //             <p class="g-mt20">知识点名称不能为空！</p>'
        // });
      if (this.needTips) {
        return;
      }

    	var id = (+new Date()).toString(),
    			nodeLen = this.node.children.length,
    			serialNumber = nodeLen > 0 ? nodeLen + 1 : 1,
          levelIndex = this.node.levelIndex + 1;

    	this.node.children.push({
    		//id: id,
        //parentId: this.node.id,
    		//serialNumber: serialNumber,
        levelIndex: levelIndex,
        name: '',
    		open: true,
    		children:[]
    	});
    },
    removeNode: function(){
      if (this.needTips) {
        return;
      }
      var current_node = this.node;
      this.$parent.node.children = this.$parent.node.children.filter(function(node){
        return node !== current_node;
      });
    },
    editNode: function(){
      if (this.needTips) {
        return;
      }
      this.isDisabled = false;
    },
    changeNodeName: function () {
      var name = this.node.name.trim();

      //标题不需要做非空判断
      if (this.node.placeholder !== '知识点标题默认学段+学科') {
        if (name) {
          this.isDisabled = true;
          this.needTips = false;           
        } else {
          this.isDisabled = false;
          this.needFocus = true;
          this.needTips = true;
          /*this.$myMsgBox({
            message: '<p><i class="icon-pop-impt"></i></p>\
                      <p class="g-mt20">知识点名称不能为空！</p>'
          });*/
        }
        
      } else {
        if (name) {
          this.isDisabled = true;
        }
        this.needTips = false;
      }
    },
    toggle: function () {
    	this.node.open = !this.node.open;
    }
  }
}
</script>
<style>
.g-knwtree-iptxt {
  box-sizing: border-box;
  width: 290px;
  height: 40px;
  padding-left: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: '\5FAE\8F6F\96C5\9ED1';
  font-size: .7rem;
  color: #232323;
}	
.g-knwtree-iptxt:disabled {
	color: #999;
}
.treeli .tit {
  position: relative;
}
.treeli .errortips {
  position: absolute;
  top: 28px;
  left: 30px;
  padding: 5px 10px;
  color: #f25454;
  /*background-color: rgba(255,255,255,0.8);
  border: 1px solid #f25454;
  border-radius: 5px;*/
}
</style>