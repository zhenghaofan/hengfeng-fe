<template lang="html">
  <div class="answer-detail">
    <g-header :title="title"></g-header>
    <div class="container">
      <table border="1">
        <thead>
          <tr>
            <th>用户名</th>
            <th>手机</th>
            <th>内容</th>
            <th>回答时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="datalist.length > 0" v-for="item in datalist">
            <td>{{item.userName}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.content}}</td>
            <td>{{item.answerTime}}</td>
          </tr>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>
import gHeader from 'components/base/header/header'
import api from 'api/url'
export default {
  data() {
    return {
      datalist: [],
      title: '回答题',
      id: '',
    }
  },
  mounted() {
    api.getAnswerDetail({
      questionId: this.id
    }).then((data) => {
      if (data.resultCode === 'SUCCESS') {
        let res = data.data || {};
        this.datalist = res.answeredUserList;
        this.title = res.questionTitle.replace(/[\r\n]/g, "");
      }
    })
  },
  created() {
    this.id = this.$route.params.id;
  },
  components: {
    gHeader
  }
}
</script>

<style lang="css">
.answer-detail {
  background: white;
  height: 100%;
}
.container {
  padding-top: 3.5rem;
}
.container table {
  width: 88%;
  margin: 0 auto;
}
thead tr {
  font-size: 14px;
}
thead tr th {
  width: 25%;
}
tbody tr{
  font-size: 12px;
  text-align: center;
}
</style>
