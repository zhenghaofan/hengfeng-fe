<template lang="html">
  <div class="container">
    <g-header :title="title" :url="backUrl"></g-header>
    <div v-if="datalist.length > 0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" class="answer-list">
      <a :href="getAnswerUrl(item)" class="list" v-for="item in datalist">
        <div class="box">
          <span class="box-title" v-if="type == 3" :class="hasTarget(item) ? '':'box-middle'">{{item.title}}</span>
          <span class="box-title" v-else :class="hasTarget(item) ? '':'box-middle'">{{item.qnTitle}}</span>
          <div class="time" :class="hasTarget(item) ? '':'box-middle'">
            <span v-if="type == 3">截止时间：{{item.endDate}}</span>
            <span v-else>回答时间：{{item.answerTime}}</span>
          </div>
        </div>
          <div class="info" v-if="item.target">
              <span v-if="item.target.targetUserName">评价对象：{{item.target.targetUserName}}</span>
              <span v-if="item.target.targetGroupName" style="margin-left:0.5rem">班级：{{item.target.targetGroupName}}</span>
          </div>

          <!-- <div class="info" v-if="type == 4 && item.target">
              <span v-if="item.target.targetUserName">评价对象：{{item.targetUserName}}</span>
              <span v-if="item.target.targetGroupName" style="margin-left:0.5rem">班级：{{item.targetGroupName}}</span>
          </div> -->
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
    getAnswerUrl(item) {
      let url = '';
        if (this.type == 3) {
          if (item.target) {
            url = this.baseAnswerUrl + encodeURIComponent(window.btoa(item.id)) + '&type=3&targetId=' + encodeURIComponent(window.btoa(item.target.id));
          } else {
            url = this.baseAnswerUrl + encodeURIComponent(window.btoa(item.id)) + '&type=3&targetId=';
          }
        } else {
          if (item.target) {
            url = this.baseAnswerUrl + item.qnId + '&userId=' + localStorage.getItem('userId') + '&type=4&targetId=' + encodeURIComponent(window.btoa(item.target.id));
          } else {
            url = this.baseAnswerUrl + item.qnId + '&userId=' + localStorage.getItem('userId') + '&type=4&targetId='
          }
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
        // this.datalist =  [
        //     {
        //         "createTime": "2017-11-22 10:45:12",
        //         "endDate": "20170707",
        //         "createrId": 3,
        //         "createrName": "昆管理员",
        //         "delMark": false,
        //         "disabled": false,
        //         "id": 27,
        //         "note": "第一份问卷说明",
        //         "status": 0,
        //         "title": "第一份问卷",
        //         "updateTime": "2017-11-22 10:45:12",
        //         "assignNum":30,
        //         "doneNum":18,
        //         "target":{
        //             "id":1,
        //             "targetUserName":"zhang",
        //             "targetGroupName":"一年级1班"
        //         }
        //     }
        // ];
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
    },
    hasTarget(item) {
      return item.target && item.target.targetUserName || item.target && item.target.targetGroupName || item.targetUserName || item.targetGroupName
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
  height: 3.4rem;
  display: block;
  text-decoration: none;
  padding: 1rem 1.8rem 0.1rem;
}

.list:hover {
  /*background-color1: #f5f5f5;*/
}

.answer-list .info {
  color: #999999;
  line-height: 1rem;
  margin-top: 0.8rem;
  font-size: 0.7rem;
  margin-left: 0;
}

.answer-list .time {
  display: inline-block;
  float: right;
  font-size: 12px;
  height: 1rem;
  line-height: 1rem;
}

.answer-list .line {
  background-color: white;
  margin: 0 auto;
  width: 100%;
  height: 1px;
}

.answer-list .box {
  font-size: 0.8rem;
}

.box .box-title {
  width: 38%;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}
.box .box-middle {
  line-height: 2.4rem;
}
</style>
