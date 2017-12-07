<template lang="html">
  <div>
    <g-header :title="title"></g-header>
    <div class="item" v-for="(item, index) in datalist" :key="item.id">
      <div class="item-head">
        <img src="./info.png" alt="">
        <div class="info">
          <p>问卷信息</p>
          <p>{{item.startDate}}</p>
        </div>
      </div>
      <div class="item-title">
        {{item.qnaireTitle}}
      </div>
      <div class="item-detail">
        <ul>
          <li>问卷发起时间：{{item.startDate}}</li>
          <li>问卷截止时间：{{item.endDate}}</li>
          <li v-if="item.qnaireType !== 1">问卷指派人数：{{item.assignNum}}人</li>
          <li>问卷作答人数：{{item.doneNum}}人</li>
          <li v-if="item.qnaireType !== 1">未答问卷人数：{{item.todoNum}}人</li>
          <li>有效问卷份数: {{item.vaildNum}}份</li>
        </ul>
      </div>
      <div class="buttons">
        <div class="stop-answer btn" @click="toggleStop">
          <i class="iconf" :class="stop ? 'i-play':'i-stop'"></i>
          <span v-if="!stop">停止作答</span>
          <span v-else class="editing">开始作答</span>
        </div>
        <div class="delete-paper btn" @click="deletePaper">
          <i class="iconf i-delete"></i> 删除问卷
        </div>
        <div class="change-time btn" :class="{'editing': editing}" @click="changeTime">
          <i class="iconf i-modify"></i> 修改时间
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api/url'
import util from 'utils/dom'
import gHeader from 'components/base/header/header'

export default {
  data() {
    return {
      datalist: [],
      title: '已发布',
      stop: false,
      editing: false,
    }
  },
  methods: {
    toggleStop() {
      this.stop = !this.stop;
    },
    deletePaper() {

    },
    changeTime() {
      this.editing = true;
    },
    getPublishList(type) {
      api.getPublishList({
        status: type
      }).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          this.datalist = res.qnaireList;
        }
      })
    }
  },
  components: {
    gHeader
  },
  mounted() {
    let type = this.$route.params.type || 1;
    if (type === 2) {
      this.title = '已回收';
    }
    this.getPublishList(type)
  }
}
</script>

<style lang="css">
body {
    background-color: #dddddd;
}

.item {
  margin-top: 0.5rem;
  background: white;
  font-size: 0.55rem;
  text-decoration: none;
}

.item-head {
  margin-top: 0.5rem;
  height: 1.8rem;
  padding: 0.5rem 1rem;
  color: #999
}

.item-head img {
  width: 1rem;
  height: 1rem;
  margin-bottom: 6px;
}
.info {
  display: inline-block;
  margin-left: 0.5rem;
}
.info p {
  line-height: 0.85rem;
}
.item-title {
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
.item-detail {
  width: 72%;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}
.item-detail ul{
  list-style: none;
}
.item-detail ul li {
  line-height: 1.2rem;
  color: #999;
}
.btn {
  width: 25%;
  padding: 0.6rem;
  text-align: center;
  display: inline-block;
  color: #999;
}
.buttons {
  border-top: 1px solid #e5e5e5;
  padding: 0.3rem;
}
.buttons img{
    width: 0.4rem;
    height: 0.5rem;
}
.stop-answer, .delete-paper {
  border-right: 1px solid #e5e5e5;
}
.editing {
  color: #64aad5;
}
</style>
