<template>
  <div class="m-norecord"
    :class="{'m-norecord-bg': !loading}"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.6)" 
    v-text="loading ? '加载中...' : txt">
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      txt: this.norecordTxt || '无记录~',
    }
  },
  props: ['loading', 'norecordTxt'],
}
</script>

<style lang="less">
@import '../../static/less/variable.less';
.m-norecord {
  margin: 30px auto;
  padding: 270px 0 130px;
  text-align: center;
  font-size: .7rem;
  font-weight: bold;
}
.m-norecord-bg {
  background: url('../../static/images/norecord.png') center 0/35% no-repeat;
}
</style>
