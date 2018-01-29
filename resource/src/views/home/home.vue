<template>
<div>
  <div class="g-wrap g-box">
    <div class="g-item">
      <div>
        <div class="title">
          <i class="icon title-i mistake"></i>
          <span>纠错管理</span>
        </div>
        <el-row :gutter="22">
          <el-col :span="12">
            <div class="card">
              <div>
                <i class="icon abs-top tri-blue"></i>
              </div>
              <div class="card-center">
                <span class="pre card-font">待处理</span>
                <span class="num" :class="isLarge(summary.pendingErrorResourceSum) ? 'md-font' : 'lg-font'">{{summary.pendingErrorResourceSum}}</span>
                <span class="before-tail card-font">件</span>
              </div>
              <div>
                <i class="icon abs-bot tri-blue reverse"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card">
              <div>
                <i class="icon abs-top tri-pink"></i>
              </div>
              <div class="card-center">
                <span class="pre card-font">已处理</span>
                <span class="num" :class="isLarge(summary.handledErrorResourceSum) ? 'md-font' : 'lg-font'">{{summary.handledErrorResourceSum}}</span>
                <span class="before-tail card-font">件</span>
                <span class="tail card-font">出错率：{{summary.errorRate}}%</span>
              </div>
              <div>
                <i class="icon abs-bot tri-pink reverse"></i>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="title">
          <i class="icon resource-check"></i>
          <span>资源审核</span>
        </div>
        <el-row :gutter="22">
          <el-col :span="12">
            <div class="card">
              <div>
                <i class="icon abs-top tri-blue"></i>
              </div>
              <div class="card-center">
                <span class="pre card-font">等待审核</span>
                <span class="num" :class="isLarge(summary.unauditResourceSum) ? 'md-font' : 'lg-font'">{{summary.unauditResourceSum}}</span>
                <span class="before-tail card-font">件</span>
              </div>
              <div>
                <i class="icon abs-bot tri-blue reverse"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card">
              <div>
                <i class="icon abs-top tri-pink"></i>
              </div>
              <div class="card-center">
                <span class="pre card-font">本月退回</span>
                <span class="num" :class="isLarge(summary.currentMonthBackResourceSum) ? 'md-font' : 'lg-font'">{{summary.currentMonthBackResourceSum}}</span>
                <span class="before-tail card-font">件</span>
                <span class="tail card-font">退回率：{{summary.backRate}}%</span>
              </div>
              <div>
                <i class="icon abs-bot tri-pink reverse"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="g-item">
      <div class="title">
        <i class="icon new-resource"></i>
        <span>新增资源量</span>
      </div>
      <div class="news">
        <div class="date-picker">
          <el-date-picker v-model="newsDate" type="daterange" :picker-options="newsPicker" format="yyyy-MM-dd" placeholder="选择日期范围" @change="getNews(1)"></el-date-picker>
        </div>
        <ul>
          <li>教案<span class="f-r count">{{news.teachingPlanResourceSum}}</span></li>
          <li>课件<span class="f-r count">{{news.coursewareResourceSum}}</span></li>
          <li>导学案<span class="f-r count">{{news.learningGuideResourceSum}}</span></li>
          <li>微课<span class="f-r count">{{news.microLessonResourceSum}}</span></li>
          <li>课堂实录<span class="f-r count">{{news.courseVideoResourceSum}}</span></li>
          <li>试题<span class="f-r count">{{news.exercisesResourceSum}}</span></li>
          <li>试卷<span class="f-r count">{{news.examPaperResourceSum}}</span></li>
        </ul>
        <div class="total">
          <i class="icon round"></i>
          <span>总数</span>
          <span class="f-r total-count">{{news.resourceSum}}</span>
        </div>
      </div>
    </div>

    <div class="g-item">
      <div class="title">
        <i class="icon rank"></i>
        <span>榜单</span>
      </div>
      <div class="ranks">
        <div class="date-picker">
          <el-date-picker v-model="rankDate" type="daterange" :picker-options="rankPicker" format="yyyy-MM-dd" placeholder="选择日期范围" @change="getRanks(1)">
          </el-date-picker>
        </div>
        <div class="ranks-list">
          <div class="list-th">
            <span class="item th-item1">排名</span>
            <span class="item th-item2">姓名</span>
            <span class="item th-item3">数量</span>
          </div>
          <ul class="list-con">
            <li v-for="(item, index) in rankList">
              <span class="item con-item1">{{item.ranking}}</span>
              <span class="item con-item2">{{item.name}}</span>
              <span class="item con-item3">{{item.amount}}</span>
            </li>
          </ul>
        </div>
        <pages class="page" :pages="pageInfo" @goto="getRanks"></pages>
        <!-- <div class="page">
          <el-pagination layout="prev, pager, next" :total="totalRecordCount" :current-page.sync="currentPage" @current-change="rankPageChange">
          </el-pagination>
        </div> -->
      </div>
    </div>
  </div>
  <div class="g-wrap sum">
    <el-row class="sum-row">
      <el-col :span="4">
        <div class="resource-total">
          <div class="resource-hr"></div>
          <div class="resource-total-tip">资源总量</div>
          <div class="resource-total-count">{{summary.resourceSum}}</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon t-plan"></i>
            <span>教案<br/>Teaching plan</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.teachingPlanResourceSum) ? 'sm-font' : 'md-font'">{{summary.teachingPlanResourceSum}}</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon courseware"></i>
            <span>课件<br/>Courseware</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.coursewareResourceSum) ? 'sm-font' : 'md-font'">{{summary.coursewareResourceSum}}</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon guide"></i>
            <span>导学案<br/>Guiding learning case</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.learningGuideResourceSum) ? 'sm-font' : 'md-font'">{{summary.learningGuideResourceSum}}</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon micro"></i>
            <span>微课<br/>Micro class</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.microLessonResourceSum) ? 'sm-font' : 'md-font'">{{summary.microLessonResourceSum}}</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon course-video"></i>
            <span>课堂实录<br/>Curriculum record</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.courseVideoResourceSum) ? 'sm-font' : 'md-font'">{{summary.courseVideoResourceSum}}</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon test"></i>
            <span>试题<br/>Test questions</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.exercisesResourceSum) ? 'sm-font' : 'md-font'">{{summary.exercisesResourceSum}}</p>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="resource-child">
          <div class="resource-child-tit">
            <i class="icon exam"></i>
            <span>试卷<br/>Test paper</span>
          </div>
          <p class="resource-child-count" :class="isLarge(summary.examPaperResourceSum) ? 'sm-font' : 'md-font'">{{summary.examPaperResourceSum}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import apiUrl from '@/api/url'
import util from '@/utils/index'
//引入翻页
import pages from '@/components/GPages'
export default {
  data: function() {
    var endDate = new Date();
    var startDate = new Date();
    startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 30);

    return {
      summary: {},
      newsPicker: {
        disabledDate(time) {
          //今天以后的日期禁用
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      newsDate: [startDate, endDate],
      news: {},
      currentPage: 1,
      rankPicker: {
        disabledDate(time) {
          //今天以后的日期禁用
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      rankDate: [startDate, endDate],
      rankList: [],
      totalRecordCount: 0,
      //翻页
      pageInfo: '',
      perPageCount: 8
    };
  },

  methods: {
    isLarge: function(num) {
      return (num+"").indexOf('万') > 0 && parseFloat(num) >= 10
    },
    formateNum: function(num) {
      for(var key in num) {
        var count = parseInt(num[key]);
        if (count >= 10000) {
          num[key] = (count / 10000).toFixed(1) + '万'
        }
      }
      return num;
    },
    getSummary: function() {
      var self = this;
      apiUrl.getSummary().then(function(data) {
        var res = data.data || {};
        self.summary = self.formateNum(res);
      }, function(err) {

      })
    },
    getNews: function() {
      //没选中日期
      if (!this.newsDate || !this.newsDate[0]) {
        return;
      }
      var self = this,
          params = {
            startDate: util.formateDate(this.newsDate[0]),
            endDate: util.formateDate(this.newsDate[1])
          };
      apiUrl.getNews(params).then(function(res) {
        self.news = res.data;
      }, function(res) {
        console.log('getNews:' + res.message);
      })
    },
    //获取列表
    getRanks: function (p) {
      p = p || this.pageInfo.curPage;

      //没选中日期
      if (!this.rankDate || !this.rankDate[0]) {
        return;
      }

      var self = this,
          params = {
            startDate: util.formateDate(this.rankDate[0]),
            endDate: util.formateDate(this.rankDate[1])
          };

        params.pageNo = p;
        params.pageSize = this.perPageCount;

        this.rankList = [];
        apiUrl.getRanks(params)
        .then(function (res) {
          var _result = res.data,
              totalRecordCount = _result.totalRecordCount,
              perPageCount = self.perPageCount,
              totalPage = Math.ceil(totalRecordCount / perPageCount);

          self.totalRecordCount = totalRecordCount;
          //过滤掉建设量为0的用户 改为由后台过滤
          /*var list = _result.list;
          for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].amount > 0) {
              self.rankList.push(list[i]);
            }
          }*/
          self.rankList = _result.list;

          self.pageInfo = {
            totalPage: totalPage,
            curPage: p
          };
       }, function (res) {
         console.log('getRanks:' + res.message);
       });
    }
  },
  components: {
    pages
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getSummary();
      this.getNews();
      this.getRanks(1);
    });
  }
}
</script>

<style>
.title {
  padding: 30px 0 10px;
  font-size: 16px;
  font-weight: 500;
}

.title-i {
  width: 16px;
  height: 16px;
}

.mistake {
  background: url(../../../static/images/mistake.png) no-repeat;
}

.resource-check {
  background: url(../../../static/images/resource-check.png) no-repeat;
  width: 15px;
  height: 16px;
}

.card {
  box-sizing: border-box;
  position: relative;
  width: 180px;
  height: 240px;
  background: white;
  padding: 28px 21px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.card-center {
  /*margin: 28px 21px;*/
  position: relative;
}

.card-font {
  font-size: 14px;
  color: #999;
}

.pre {
  position: absolute;
  top: 0;
  left: 0
}

.num {
  text-align: center;
  line-height: 170px;
  display: block;
  color: #232323;
}

.lg-font {
  font-size: 50px;
}

.md-font {
  font-size: 37px;
}

.sm-font {
  font-size: 30px;
  line-height: 1.7em;
}

.tail {
  position: absolute;
  right: 0;
  bottom: 0;
}

.before-tail {
  position: absolute;
  right: 0;
  bottom: 30px;
}

.tri-blue {
  background: url(../../../static/images/tri-blue.png)
}
.abs-top {
  position: absolute;
  top: 5px;
  left: 5px;
}
.abs-bot {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.tri-pink {
  background: url(../../../static/images/tri-pink.png)
}

.reverse {
  transform: rotate(180deg);
}

.new-resource {
  background: url(../../../static/images/new-resource.png) no-repeat;
  width: 17px;
  height: 16px;
}

.news {
  box-sizing: border-box;
  height: 541px;
  padding: 17px 0;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.date-picker {
  text-align: center;
  padding-bottom: 40px;
}
.news ul {
  box-sizing: border-box;
  padding: 5px 60px;
  height: 390px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.news ul li,
.total {
  line-height: 53px;
  font-size: 15px;
  color: #232323;
}

.count {
  color: #999;
}

.total {
  padding: 0 60px;
}

.round {
  background: url(../../../static/images/round.png) no-repeat;
  width: 10px;
  height: 10px;
}

.total-count {
  font-size: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank {
  background: url(../../../static/images/rank.png) no-repeat;
  width: 13px;
  height: 16px;
}

.ranks {
  box-sizing: border-box;
  position: relative;
  height: 541px;
  padding: 17px 0;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
.ranks-list {
  margin-top: -39px;
}
.ranks-list .item {
  display: inline-block;
  width: 32%;
  text-align: center;
}
.ranks-list .list-th {
  padding: 10px 0;
  font-size: .7rem;
  color: #999;
}
.ranks-list .list-con {
  box-sizing: border-box;
  height: 390px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  font-size: 15px;
  color: #666;
  overflow: hidden;
}
.list-con .item {
  padding: 10px 0;
  line-height: 20px;
  vertical-align: middle;
}
.list-con li:nth-child(even) {
  background-color: #fafafa;
}
.list-con li {
  cursor: pointer;
}
.list-con li:hover {
  background-color: #eef1f6;
}
.ranks .page {
  text-align: center;
  position: absolute;
  bottom: -10px;
  width: 100%;
}

.sum {
  box-sizing: border-box;
  margin-top: 40px;
  margin-bottom: 40px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.sum-row {
  margin: 0 40px;
  padding: 40px 0;
}

.sum-row .el-col:not(:first-child) {
  text-align: center;
}

.resource-total {
  position: relative;
}

.resource-total .resource-hr {
  width: 20%;
  display: block;
  border-top: 3px solid #00d487;
  height: 0;
}

.resource-total-tip {
  margin-bottom: 25px;
  line-height: 35px;
  font-size: 15px;
}

.resource-total-count {
  font-size: 46px;
  color: #232323;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-child {
  border-left: 1px solid #e5e5e5;
  padding: 10px 0;
  color: #999;
  cursor: pointer;
}
.resource-child-tit {
  margin-bottom: 20px;
}
.resource-child i {
  width: 24px;
  height: 24px;
}

.resource-child-count {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.resource-child-count:hover {
  color: #00d487;
}

.t-plan {
  background: url(../../../static/images/t-plan.png) no-repeat;
}

.courseware {
  background: url(../../../static/images/courseware.png) no-repeat;
}

.guide {
  background: url(../../../static/images/guide.png) no-repeat;
}

.micro {
  background: url(../../../static/images/micro.png) no-repeat;
}

.course-video {
  background: url(../../../static/images/course-video.png) no-repeat;
}

.test {
  background: url(../../../static/images/test.png) no-repeat;
}

.exam {
  background: url(../../../static/images/exam.png) no-repeat;
  background-size: contain;
}
</style>
