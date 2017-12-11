<template lang="html">
  <div>
    <g-header :title="title"></g-header>
    <!-- <div v-if="datalist.length > 0" :style="{ height: wrapperHeight + 'px' }" style="-webkit-overflow-scrolling: auto" ref="wrapper"> -->
      <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore"> -->
    <div v-if="datalist.length > 0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <router-link class="item" v-for="(item, index) in datalist" :key="item.id" :to="{name: 'summary', params: {id: item.id}}">
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
          <div class="stop-answer btn" @click="toggleStop(item)">
            <i class="iconf" :class="item.disabled ? 'i-play':'i-stop'"></i>
            <span v-if="!item.disabled">停止作答</span>
            <span v-else class="editing">开始作答</span>
          </div>
          <div class="delete-paper btn" @click="deletePaper(item.id)">
            <i class="iconf i-delete"></i> 删除问卷
          </div>
          <div class="change-time btn" :class="{'editing': item.editing}" @click="changeTime(item)">
          <i class="iconf i-modify" :class="{'editing': item.editing}"></i> 修改时间
        </div>
        </div>
      </router-link>
      <!-- </mt-loadmore> -->
    </div>
    <empty v-else></empty>
    <mt-datetime-picker ref="picker" type="datetime" v-model="datetime" @confirm="confirmDatetime"></mt-datetime-picker>
  </div>
</template>

<script>
import api from 'api/url'
import util from 'utils/index'
import gHeader from 'components/base/header/header'
import empty from 'components/base/empty/empty'
// import {MessageBox, Loadmore} from 'mint-ui'
import {MessageBox, InfiniteScroll} from 'mint-ui'

export default {
  data() {
    return {
      datalist: [],
      title: '已发布',
      stop: false,
      editing: false,
      datetime:null,
      selectedItem: null,
      params: {
        status: 1,
        pageNo: 1
      },
      allLoaded: true,
      scrollMode:"auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      wrapperHeight: 0,
      loading: false
    }
  },
  methods: {
    toggleStop(item) {
      let message = item.disabled ? '确定开始作答该问卷吗' : '确定停止作答该问卷吗';
      MessageBox.confirm(message).then(() => {
        api.stopPaper({
          disabled: !item.disabled
        }, item.id).then((data) => {
          if (data.resultCode === 'SUCCESS') {
            this.getPublishList(this.params)
          }
        })
      }).catch((err) => {});
    },
    deletePaper(id) {
      MessageBox.confirm("确定删除该问卷吗").then(action => {
        api.deletePaper(id).then((data) => {
          if (data.resultCode === 'SUCCESS') {
            this.getPublishList(this.params)
          }
        })
      })
    },
    changeTime(item) {
      item.editing = true;
      this.selectedItem = item;
      this.$refs.picker.open();
    },
    confirmDatetime(data) {
      this.selectedItem.editing = false;
      api.changeTime({endDate: util.formateDate(data)}, this.selectedItem.id).then((res) => {
        if (res.resultCode === 'SUCCESS') {
          this.getPublishList(this.params);
        }
      })
    },
    getPublishList(params) {
      this.loading = true;
      api.getPublishList(params).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          res.qnaireList.forEach((item) => {
            item.editing = false
          });
          this.datalist = this.datalist.concat(res.qnaireList);
          this.loading = false;
          // this.$nextTick(() => {
          //   this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
          // })
        }
      })
    },
    loadMore() {
      this.params.pageNo++;
      this.getPublishList(this.params);
      // this.$refs.loadmore.onBottomLoaded();
    },
  },
  components: {
    gHeader,
    MessageBox,
    empty,
    InfiniteScroll
  },
  mounted() {
    this.params.status = this.$route.params.type;
    if (this.params.status === 2) {
      this.title = '已回收';
    }
    this.getPublishList(this.params)
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
  display: block;
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
  width: 32%;
  padding: 0.6rem 0;
  text-align: center;
  display: inline-block;
  color: #999;
}
.buttons {
  border-top: 1px solid #e5e5e5;
  padding: 0.3rem 0;
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
