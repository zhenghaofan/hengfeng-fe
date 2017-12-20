<template lang="html">
  <div class="container">
    <g-header :title="title" :url="backUrl"></g-header>
    <div v-if="datalist.length > 0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" class="answer-list">
      <a :href="getAnswerUrl(item.id)" class="list" v-for="item in datalist">
          <div class="time">
            <span v-if="type == 3">截止时间：{{item.endDate}}</span>
            <span v-else>回答时间：{{item.answerTime}}</span>
          </div>
          <div class="box">
              <span v-if="type == 3">{{item.title}}</span>
              <span v-else>{{item.qnTitle}}</span>
          </div>
      </a>
    </div>
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
      title: '',
      datalist: [],
      baseAnswerUrl: '',
      type: '',
      backUrl: {path: '/category'},
      params: {
        pageNo: 1
      }
    }
  },
  methods: {
    getAnswerUrl(id) {
      let url = '';
      if (this.type == 3) {
        url = this.baseAnswerUrl + encodeURIComponent(window.btoa(id)) + '&type=3';
      } else {
        url = this.baseAnswerUrl + id + '&userId=' + localStorage.getItem('userId') + '&type=4'
      }
      return url;
    },
    getAnswerList() {
      this.loading = true;
      if (this.type == 3) {
        api.getAnswerList(this.params).then((data) => {
          if (data.resultCode === 'SUCCESS') {
            let res = data.data || {};
            // this.datalist = res.qnaireList;
            this.datalist = this.datalist.concat(res.qnaireList);
            this.loading = false;
          }
        })
      } else {
        api.getUserAnswerList(this.params).then((data) => {
          if (data.resultCode === 'SUCCESS') {
            let res = data.data || {};
            this.datalist = this.datalist.concat(res.answerRecordList);
            this.loading = false;
          }
        })
      }
    },
    loadMore() {
      this.params.pageNo++;
      this.getAnswerList()
    }
  },
  components: {
    gHeader,
    empty
  },
  mounted() {
    this.type = this.$route.params.type || 3;
    if (this.type == 3) {
      this.title = '待回答';
      this.params.status = this.type;
      this.baseAnswerUrl = '/views/ques/answer.html?id='
    } else {
      this.title = '已回答';
      delete this.params.status;
      this.baseAnswerUrl = '/views/ques/answerdet.html?id='
    }
    this.getAnswerList()
  }
}
</script>

<style lang="css">
.container {
  background-color: #dddddd;
}
.answer-list {
  padding-top: 2.5rem;
}
.list {
  background-color: white;
  border-top: 1px solid #e5e5e5;
  height: 4.6rem;
  display: block;
  text-decoration: none;
}

.list:hover {
  /*background-color1: #f5f5f5;*/
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
