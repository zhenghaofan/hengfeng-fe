<template lang="html">
  <div class="publish">
    <g-header :title="title" ref="gheader"></g-header>
    <!-- <div v-if="datalist.length > 0" :style="{ height: wrapperHeight + 'px' }" style="-webkit-overflow-scrolling: auto" ref="wrapper"> -->
      <!-- <mt-loadmore :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore"> -->
    <div v-if="datalist.length > 0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" class="publish-list" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" ref="lists">
      <router-link class="item" v-for="(item, index) in datalist" :key="item.id" :to="{name: 'summary', params: {id: item.id, type: $route.params.type}}">
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
        <div class="item-detail" :class="{'item-padding' : $route.params.type == 2}">
          <ul>
            <li>问卷发起时间：{{item.startDate}}</li>
            <li>问卷截止时间：{{item.endDate}}</li>
            <li v-if="item.qnaireType !== 1 && item.really !== 1">问卷指派人数：{{item.assignNum}}人</li>
            <li>问卷作答人数：{{item.doneNum}}人</li>
            <li v-if="item.qnaireType !== 1 && item.really !== 1">未答问卷人数：{{item.todoNum}}人</li>
            <li>有效问卷份数：{{item.vaildNum}}份</li>
          </ul>
        </div>
        <paper-op :item="item" :callback="refresh" :isFixedBottom="isFixedBottom" v-if="$route.params.type == 1" @time-changed="changeTime"></paper-op>
      </router-link>
      <mt-datetime-picker ref="datetime" type="datetime" v-model="datetime" :start-date="now" @confirm="confirmDatetime"></mt-datetime-picker>
      <!-- </mt-loadmore> -->
    </div>
    <empty v-else></empty>
  </div>
</template>

<script>
import api from 'api/url'
import util from 'utils/index'
import gHeader from 'components/base/header/header'
import empty from 'components/base/empty/empty'
import paperOp from 'components/base/paper-op/paper-op'
import {
  MessageBox
} from 'mint-ui'

export default {
  data() {
    return {
      datalist: [],
      title: '已发布',
      stop: false,
      editing: false,
      datetime: null,
      isFixedBottom: false,
      selectedItem: null,
      params: {
        status: 1,
        pageNo: 1
      },
      now: new Date,
      touch: {

      }
      // allLoaded: true,
      // scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      // wrapperHeight: 0,
    }
  },
  methods: {
    onTouchStart(e) { //记录当前y轴值
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
    },
    onTouchMove(e) { //计算滚动位置
      let listHeight = this.$refs.lists.offsetHeight;
      let windowTop = document.documentElement.scrollTop || document.body.scrollTop;
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = Math.min(0, Math.max(-50, this.touch.y2 - this.touch.y1));
      if (windowTop < listHeight) {
        this.$refs.gheader.$el.style.transform = `translateY(${delta/20}rem)`;
        this.$refs.gheader.$el.style.transition = `transform 1s`;
      }
    },
    onTouchEnd(e) {
      let listHeight = this.$refs.lists.offsetHeight;
      let windowTop = document.documentElement.scrollTop || document.body.scrollTop;
      let delta = this.touch.y2 - this.touch.y1
      if (windowTop < listHeight && delta > 0) {
        this.$refs.gheader.$el.style.transform = `translateY(0px)`;
      } else {
      this.$refs.gheader.$el.style.transform = `translateY(-3rem)`;
      }
    },
    refresh() {
      this.params.pageNo = 1;
      this.getPublishList(false);
    },
    changeTime(item) {
      item.editing = true;
      this.selectedItem = item;
      this.now = new Date();
      this.$refs.datetime.open();
    },
    confirmDatetime(data) {
      this.selectedItem.editing = false;
      api.changeTime({
        endDate: util.formateDateToStr(data)
      }, this.selectedItem.id).then((res) => {
        if (res.resultCode === 'SUCCESS') {
          MessageBox.alert('修改成功')
          this.refresh();
        }
      }).catch((err) => {
        MessageBox.alert(err.message)
      })
    },
    getPublishList(multi) {
      this.loading = true;
      // this.datalist = [{
      //     "todoNum": 1,
      //     "asignNum": 1,
      //     "doneNum": 0,
      //     "disabled": true,
      //     "vaildNum": 0,
      //     "endDate": "2017-11-24 18:10",
      //     "id": 29,
      //     "qnaireTitle": "第一份问卷",
      //     "qnaireType": 0,
      //     "really": 1,
      //     "startDate": "2017-11-21 15:00"
      //   },
      //   {
      //     "todoNum": 1,
      //     "asignNum": 1,
      //     "disabled": true,
      //     "doneNum": 0,
      //     "vaildNum": 0,
      //     "endDate": "2017-11-24 17:10",
      //     "id": 28,
      //     "qnaireType": 0,
      //     "really": 1,
      //     "qnaireTitle": "第二份问卷",
      //     "startDate": "2017-11-21 15:00"
      //   },
      //   {
      //     "doneNum": 0,
      //     "vaildNum": 0,
      //     "disabled": true,
      //     "endDate": "2017-11-24 17:10",
      //     "id": 32,
      //     "qnaireType": 1,
      //     "really": 1,
      //     "qnaireTitle": "第一份问卷",
      //     "startDate": "2017-11-21 15:00"
      //   },
      //   {
      //     "doneNum": 0,
      //     "vaildNum": 0,
      //     "disabled": true,
      //     "endDate": "2017-11-24 17:10",
      //     "id": 32,
      //     "qnaireType": 1,
      //     "really": 1,
      //     "qnaireTitle": "第一份问卷",
      //     "startDate": "2017-11-21 15:00"
      //   },
      //   {
      //     "doneNum": 0,
      //     "vaildNum": 0,
      //     "disabled": true,
      //     "endDate": "2017-11-24 17:10",
      //     "id": 32,
      //     "qnaireType": 1,
      //     "really": 1,
      //     "qnaireTitle": "第一份问卷",
      //     "startDate": "2017-11-21 15:00"
      //   },
      //   {
      //     "doneNum": 0,
      //     "vaildNum": 0,
      //     "disabled": true,
      //     "endDate": "2017-11-24 17:10",
      //     "id": 32,
      //     "qnaireType": 1,
      //     "really": 1,
      //     "qnaireTitle": "第一份问卷",
      //     "startDate": "2017-11-21 15:00"
      //   }
      // ];
      api.getPublishList(this.params).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          res.qnaireList.forEach((item) => {
            item.editing = false
          });
          if (multi) {
            this.datalist = this.datalist.concat(res.qnaireList);
          } else {
            this.datalist = res.qnaireList
          }

          this.loading = false;
          // this.$nextTick(() => {
          //   this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
          // })
        }
      }).catch((err) => {
        MessageBox.alert(err.message)
      })
    },
    loadMore() {
      this.params.pageNo++;
      this.getPublishList(true);
      // this.$refs.loadmore.onBottomLoaded();
    },
  },
  components: {
    gHeader,
    empty,
    MessageBox,
    paperOp
  },
  mounted() {
    this.params.status = parseInt(this.$route.params.type);
    if (this.params.status === 2) {
      this.title = '已回收';
    }
    this.getPublishList(true)
  }
}
</script>

<style lang="css">
body {
  height: auto;
}
.publish {
    background-color: #dddddd;
}
.publish-list {
  padding-top: 2.5rem;
}
.item {
  margin-top: 0.5rem;
  background: white;
  font-size: 0.75rem;
  text-decoration: none;
  display: block;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
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
.item-padding {
  padding: 0 0 1.2rem;
}
</style>
