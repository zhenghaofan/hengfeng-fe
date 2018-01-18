<template>
	<ul class="knwtree"><tree-node :node="node"></tree-node></ul>
</template>
<script>
import TreeNode from './TreeNode'
export default {
  name: 'tree',
  props: ['node', 'name'],
  watch: {
    'name': function (name) {
      this.node.name = name;
    }
  },
  components: {
    'tree-node': TreeNode
  }
}
</script>
<style>
.knwtree {
  margin: 30px 0 50px 40px;
  position: relative;
}
/*.knwtree ul:before {
  position: absolute;
  top: 31px;
  left: 0;
  display: block;
  content: "";
  width: 1px;
  height: 124px;
  border-left: 1px solid #00d487;
}*/
.knwtree ul ul:before {

}
.knwtree li {
  padding-left: 2.5em;
  position: relative;
}
/*.knwtree li .tit:before {
  position: absolute;
  top: 31px;
  left: 0;
  display: block;
  content: "";
  width: 30px;
  border-top: 1px solid #00d487;
}*/
.knwtree li li .tit:before {

}
.knwtree li .opts a {
  padding: 0 5px;
}
</style>