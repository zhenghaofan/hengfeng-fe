<template lang="html">
  <div class="summary-detail">
    <g-header :title="summary.qnaireTitle"></g-header>
    <ul>
      <li>问卷发起时间：<span class="bold">{{summary.startDate}}</span></li>
      <li>问卷截止时间：<span class="bold">{{summary.endDate}}</span></li>
      <li>问卷倒数天数：<span class="bold">{{summary.backTime}}</span></li>
      <li v-if="summary.qnaireType !== 1">问卷指派人数：<span class="bold">{{summary.assignNum}}人</span></li>
      <li>问卷作答人数：<span class="bold">{{summary.doneNum}}人</span></li>
      <li v-if="summary.qnaireType !== 1">未答问卷人数：<span class="bold">{{summary.todoNum}}人</span></li>
      <li>有效问卷份数：<span class="bold">{{summary.vaildNum}}份</span></li>
    </ul>
  </div>
</template>

<script>
import gHeader from 'components/base/header/header'
import api from 'api/url'
export default {
  data() {
    return {
      summary: {},
    }
  },
  methods: {
    getPaperSummary(id) {
      api.getPaperSummary({id: id}).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          this.summary = data.data;
        }
      })
    }
  },
  mounted() {
    let id = this.$route.params.id;
    this.getPaperSummary(id)
  },
  components: {
    gHeader
  }
}
</script>

<style lang="css">
body {
  background: white;
  font-size: 0.8rem;
}
.summary-detail ul{
  /*width: 72%;*/
  margin: 1rem 0 2rem 2.45rem;
  list-style: none;
}
.summary-detail ul li {
  line-height: 1.4rem;
  color: #999;
}
.bold {
  color: #232323;
}
</style>
