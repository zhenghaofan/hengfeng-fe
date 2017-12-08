<template lang="html">
  <div class="container">
    <g-header :title="title"></g-header>
    <template v-if="datalist.length > 0">
      <div class="list" v-for="item in datalist">
          <div class="time">截止时间：{{item.endDate}}</div>
          <div class="box">
              {{item.title}}
          </div>
      </div>
    </template>
    <empty v-else></empty>
  </div>
</template>

<script>
import gHeader from 'components/base/header/header'
import empty from 'components/base/empty/empty'
import api from 'api/url'

export default {
  data(){
    return {
      title: '待回答',
      datalist: []
    }
  },
  methods: {
    getAnswerList(params) {
      api.getAnswerList(params).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          this.datalist = res.qnaireList;
        }
      })
    }
  },
  components: {
    gHeader,
    empty
  },
  mounted() {
    let defaultParams = {
      pageNo: 1
    }
    let type = this.$route.params.type || 3;
    if (type === 4) {
      this.title = '已回答';
    }
    defaultParams.status = type;
    this.getAnswerList(defaultParams)
  }
}
</script>

<style lang="css">
.container {
  background-color: #dddddd;
}

.list {
  background-color: white;
  border-top: 1px solid #e5e5e5;
  height: 4.6rem;
}

.list:hover {
  background-color: #f5f5f5;
}

.time {
  color: #999999;
  font-size: 0.7rem;
  text-align: right;
  position: relative;
  top: 3.05rem;
  margin-right: 1.5rem;
}

.line {
  background-color: white;
  margin: 0 auto;
  width: 100%;
  height: 1px;
}

.box {
  margin: 0 1.5rem;
  margin-top: 0px;
  font-size: 0.8rem;
}
</style>
