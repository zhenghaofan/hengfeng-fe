<template lang="html">
  <div class="summary">
    <g-header :title="summary.qnaireTitle"></g-header>
    <div class="summary-detail">
      <ul>
        <li>问卷发起时间：<span class="bold">{{summary.startDate}}</span></li>
        <li>问卷截止时间：<span class="bold">{{summary.endDate}}</span></li>
        <li>问卷倒数天数：<span class="bold">{{summary.backTime}}</span></li>
        <li v-if="summary.qnaireType !== 1">问卷指派人数：<span class="bold">{{summary.assignNum}}人</span></li>
        <li>问卷作答人数：<span class="bold">{{summary.doneNum}}人</span></li>
        <li v-if="summary.qnaireType !== 1">未答问卷人数：<span class="bold">{{summary.todoNum}}人</span></li>
        <li>有效问卷份数：<span class="bold">{{summary.vaildNum}}份</span></li>
      </ul>

      <div class="selects" v-if="sendType !== 0"  @touchstart="touchstart">
        <span>选择调查对象：</span>
        <mt-picker :slots="userSlot" @change="onUserChange" :visible-item-count="1" value-key="userName"></mt-picker>
      </div>
      <div class="selects" v-if="sendType !== 0" @touchstart="touchstart">
        <span>选择调查班级：</span>
        <mt-picker :slots="groupSlot" @change="onGroupChange" :visible-item-count="1" value-key="targetGroupName"></mt-picker>
      </div>
      <div class="selects" v-if="sendType === 2" @touchstart="touchstart">
        <span>选择科目：</span>
        <mt-picker :slots="subjectSlot" @change="onSubjectChange" :visible-item-count="1" value-key="targetSubjectName"></mt-picker>
      </div>

      <div class="subject-summary">
        <div class="subject" v-for="item in summary.questionList" :key="item.id">
          第{{item.num}}题：<div v-html="item.title" style="display:inline-block"></div>
            <div v-if="item.type === 0 || item.type === 1 || item.type === 4">
              <div class="thead">
                <span>选项</span>
                <span>人数</span>
                <span>比例</span>
              </div>
              <div class="tbody">
                <div class="subject-content" v-for="obj in item.optionList">
                  <span v-html="obj.title"></span>
                  <span>{{obj.selectNum}}</span>
                  <mt-progress :value="parseInt(obj.selectPercent)" :bar-height="6" class="percent"><div slot="end">{{obj.selectPercent}}</div></mt-progress>
                </div>
              </div>
              <div class="doneNum">作答人数：{{item.vaildFillNum}}人</div>
            </div>

            <div v-if="item.type === 2">
              <div class="thead">
                <span>标题</span>
                <span>人数</span>
                <span>操作</span>
              </div>
              <div class="tbody">
                <div class="subject-content" style="line-height: 0.9rem">
                  <span v-html="item.title"></span>
                  <span>{{item.answerNum}}</span>
                  <router-link :to="{ name: 'answerDetail', params: {id: item.id, targetUserId: targetUser.userId, targetGroupId: targetGroup.targetGroupId} }" style="flex: 1; text-align:center;color:#64aad5">查看</router-link>
                </div>
              </div>
              <div class="doneNum">作答人数：{{item.vaildFillNum}}人</div>
            </div>

            <div v-if="item.type === 3">
              <div class="thead">
                <span>分数项</span>
                <span>总分</span>
                <span>平均分</span>
              </div>
              <div class="tbody">
                <div class="subject-content" v-for="obj in item.optionList">
                  <span v-html="obj.title"></span>
                  <span>{{obj.totalScore}}</span>
                  <span>{{obj.avgScore}}</span>
                </div>
              </div>
              <div class="doneNum">作答人数：{{item.vaildFillNum}}人</div>
            </div>
        </div>
      </div>
    </div>
    <paper-op :item="summary" :callback="getPaperSummary" v-if="$route.params.type == 1"></paper-op>
  </div>
</template>

<script>
import Vue from 'vue'
import gHeader from 'components/base/header/header'
import api from 'api/url'
import paperOp from 'components/base/paper-op/paper-op'
import {
  Picker
} from 'mint-ui'

export default {
  components: {
    Picker
  },
  data() {
    return {
      summary: {},
      sendType: 0,
      isSummary: true,
      targetUserList: [],
      targetUser: {},
      targetGroup: {},
      targetGroupList: [{
        targetGroupName: '全部',
        targetGroupId: ''
      }],
      targetSubject: {},
      targetSubjectList: [{
        targetSubjectName: '全部',
        targetSubjectId: ''
      }],
      userSlot: [{
        flex: 1,
        values: [],
        className: 'slot1'
      }],
      groupSlot: [{
        flex: 1,
        values: [],
        className: 'slot1'
      }],
      subjectSlot: [{
        flex: 1,
        values: [],
        className: 'slot1'
      }],
      touchStartEvent: null,
    }
  },
  methods: {
    touchstart(e) {
      this.touchStartEvent = e;
    },
    getPaperSummary(params, isEnd) {
      let _params = Object.assign({}, params, {
        id: this.$route.params.id
      });
      api.getPaperSummary(_params).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          this.summary = data.data;
          this.sendType = this.summary.sendType;
          this.summary.editing = false;
          // this.targetGroupList = this.targetGroupList.concat(this.summary.targetGroupList);
          if (!isEnd) {
            Vue.set(this.userSlot[0], 'values', this.summary.targetUserList);
            Vue.set(this.groupSlot[0], 'values', this.targetGroupList.concat(this.summary.targetGroupList));
            Vue.set(this.subjectSlot[0], 'values', this.targetSubjectList.concat(this.summary.targetSubjectList));
          }
        }
      })
    },
    getTargetGroup(userId) {
      api.getTargetGroup({
        qnId: this.$route.params.id,
        targetUserId: userId
      }).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          Vue.set(this.groupSlot[0], 'values', this.targetGroupList.concat(res.list));
          if(this.sendType == 2) {
            Vue.set(this.subjectSlot[0], 'values', this.targetSubjectList.concat(res.list));
          }
          this.getPaperSummary({targetUserId: userId}, true);
        }
      })
    },
    getSubjectGroup(userId, groupId) {
      api.getTargetGroup({
        qnId: this.$route.params.id,
        targetUserId: userId,
        targetGroupId: groupId
      }).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          Vue.set(this.subjectSlot[0], 'values', this.targetSubjectList.concat(res.list));
          this.getPaperSummary({targetUserId: userId, targetGroupId: groupId}, true);
        }
      })
    },
    onUserChange(picker, values) {
      this.targetUser = values[0];
      if (this.touchStartEvent) {
        this.getTargetGroup(this.targetUser.userId);
      }
    },
    onGroupChange(picker, values) {
      this.targetGroup = values[0];
      if (this.touchStartEvent) {
        this.getSubjectGroup(this.targetUser.userId, this.targetGroup.targetGroupId);
        this.getPaperSummary({
          targetUserId: this.targetUser.userId,
          targetGroupId: this.targetGroup.targetGroupId
        }, true)
      }
    },
    onSubjectChange(picker, values) {
      this.targetSubject = values[0];
      if (this.touchStartEvent) {
        this.getPaperSummary({
          targetUserId: this.targetUser.userId,
          targetGroupId: this.targetGroup.targetGroupId,
          targetSubjectId: this.targetSubject.targetSubjectId
        }, true)
      }
    }
  },
  mounted() {
    this.getPaperSummary({}, false);
  },
  components: {
    gHeader,
    paperOp
  }
}
</script>

<style lang="css">
.summary {
  height: 100%;
  background: white;
  font-size: 0.7rem;
}
.summary-detail{
  padding: 2.5rem 0;
}
.summary ul{
  /*width: 72%;*/
  margin: 1rem 0 2rem 2.45rem;
  list-style: none;
}
.summary ul li {
  line-height: 1.4rem;
  color: #999;
}

.selects {
  padding: 0 1.6rem 0.4rem;
  display: flex;
  height: 36px;
  line-height: 36px;
}

.selects .picker {
  margin-left: 0.5rem;
  z-index: 0;
}

.selects .picker-item {
  font-size: 14px;
}

.bold {
  color: #232323;
}
.subject-summary {
  padding: 0.5rem 1.6rem 0;
}
.subject {
  font-size: 0.7rem;
  color: #232323;
  margin-bottom: 1rem;
}
.thead {
  display: flex;
  margin: 0.5rem 0;
  font-size: 0.7rem;
  color: #999;
}
.thead span {
  flex: 1;
  text-align: center;
}
.tbody {
  border: 1px solid #e5e5e5;
  padding: 0 0.5rem;
}
.percent {
  flex: 1
}
.tbody .subject-content {
  display: flex;
  margin: 0.5rem 0;
  line-height: 1.5rem;
}
.tbody div span{
  flex: 1;
  text-align: center;
}
.doneNum {
  text-align: right;
  margin-top: 0.25rem;
  color: #999;
  font-size: 0.7rem;
}
.mt-progress-progress {
  border-radius: 40px;
}
</style>
