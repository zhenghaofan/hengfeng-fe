<template>
  <div class="g-search f-r">
    <input type="search" class="g-ipt-search" v-model="keyword" placeholder="支持输入资源名称/上传者/资源描述进行搜索" @keyup.enter="getList" maxlength="50" />
    <a href="#" class="btn-search" @click.prevent="getList"><i class="iconf i-search"></i></a>
  </div>
</template>
<script>
//集成api
import apiUrl from '@/api/url.js'
export default {
  data: function () {
    return {
      keyword: ''
    };
  },
  methods: {
    //获取列表
    getList: function () {
      var self = this,
          params = {
            keyword: this.keyword
          };

      //重置搜索条件
      //this.keyword = '';

      //触发关键字搜索
      this.$emit('getkeywords', params);
    }
  },
  mounted: function () {
    var self = this;

    this.$nextTick(function () {
    });
  }
};  
</script>
<style lang="less">
</style>