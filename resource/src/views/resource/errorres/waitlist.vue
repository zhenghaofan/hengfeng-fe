<template>
	<div v-if="list.length > 0">
		<div class="resource-list f-clearfix" v-for="(item, index) in list" :id="item.resourceDict.id">
			<div class="list-img g-ml10" :class="getCoverClass(item.resourceDict.id)" @click="getDetails(item.resourceDict.id, item.errorId)">
      </div>
			<div class="list-content" @click="getDetails(item.resourceDict.id, item.errorId)">
				<p class="tit-resourcename">{{item.name}}</p>
				<p class="tit-sub">
					<span class="tit-sub-info">资源类型：{{item.resourceDict.name}}</span>
					<span class="tit-sub-info g-tc">来源平台：翻转课堂</span>
					<span class="tit-sub-info g-tr">错误类型：{{item.errorDictName}}</span>
				</p>
				<p class="m-labels">
					<span v-if="item.learnStageName">{{item.learnStageName}}</span>
					<span v-if="item.gradeName">{{item.gradeName}}</span>
					<span v-if="item.subjectName">{{item.subjectName}}</span>
					<span v-if="item.textbookName">{{item.textbookName}}</span>
					<template v-if="item.textbookCatalogNames">
						<span v-for="textbookCatalog in item.textbookCatalogNames">{{textbookCatalog}}</span>
					</template>
        </p>
        <p class="m-labels">
					<span v-for="knw in item.knowledgePointCatalogNames">
            {{knw}}
          </span>
				</p>
				<p class="t-important">{{item.remark}}</p>
			</div>
			<div class="list-others">
				<div class="stars">
					<div class="g-mb10">
						<i class="icon i-star-s" v-for="i in getStar(item.argScore)"></i>
						<i class="icon i-star" v-for="i in getStar(100-item.argScore, 1)"></i>
					</div>
					<p>{{item.commentTimes}}人参与评分</p>
				</div>
				<div class="infos">
          <span :title="'浏览数：'+item.viewTimes"><b><i class="icon i-eye"></i></b>{{item.viewTimes}}</span>
          <span :title="'使用数：'+item.useTimes"><b><i class="icon i-forward"></i></b>{{item.useTimes}}</span>
          <span :title="'评论数：'+item.commentTimes"><b><i class="icon i-message"></i></b>{{item.commentTimes}}</span>
          <span :title="'收藏数：'+item.viewTimes"><b><i class="icon i-heart"></i></b>{{item.viewTimes}}</span>
        </div>
			</div>
		</div>

		<pages :class="{'f-static': list.length > 2}" :pages="pageInfo" @goto="gotoPage"></pages>
	</div>
	<div class="m-norecord" v-else>
    当前无报错信息等待处理
  </div>
</template>
<script>
//引入翻页
import pages from '@/components/GPages'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
  	return {
  		list: [],
      perPageCount: 5,
      pageInfo: ''
  	};
  },
  components: {
    pages
  },
  methods: {
  	//封面
    getCoverClass: function (id) {
      var cover = {
        'COURSEWARE': 'cover-courseware',//课件
        'COURSE_VIDEO': 'cover-coursevideo',//课堂实录
        'EXERCISES': 'cover-exercises',//习题
        'MICRO_LESSON': 'cover-microclass',//微课
        'LEARNING_GUIDE': 'cover-learning',//导学案
        'EXAM_PAPER': 'cover-exercises',//试卷
        'TEACHING_PLAN': 'cover-teach',//教案,
        'MATERIAL': 'cover-microclass'//素材
      };
      return cover[id];
    },
    //查看详情
    getDetails: function (typeId, id) {
      /*var preFix = '/views/resourcelibs/resourcemanage/',
          addr = '';

      //微课||课堂实录
      if (typeId === 'MICRO_LESSON' || typeId === 'COURSE_VIDEO') {
        addr = 'prewmicro';
      } else if (typeId === 'COURSEWARE' || typeId === 'TEACHING_PLAN' || typeId === 'LEARNING_GUIDE') {
      //课件||教案||导学案
        addr = 'prewcourseware';
      } else if (typeId === 'EXERCISES') {
      //习题
        addr = 'prewexercises';
      } else if (typeId === 'EXAM_PAPER') {
      //试卷 TODO 后期处理
        addr = 'prewexam';
      }

      window.location.href = preFix + addr + '.html?status=avail&id=' + id;*/

      var preFix = '/views/resourcelibs/resourcemanage/resdetail.html?';
      window.location.href = preFix + 'status=waithandler&id=' + id;
    },
  	getStar: function (score, flag) {
  		return flag ? Math.ceil(score / 20) : Math.floor(score / 20);
  	},
  	//
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
      		params = {
            pageNo: p,
            pageSize: this.perPageCount
          };

        this.list = [];

        apiUrl.getResourceNeedhandle(params)
        .then(function (res) {
          var _result = res.data,
              totalRecordCount = _result.totalRecordCount,
              perPageCount = self.perPageCount,
              totalPage = Math.ceil(totalRecordCount / perPageCount);

          self.list = _result.resourceList;

          self.pageInfo = {
            totalPage: totalPage,
            curPage: p
          };

          self.$emit('getcount', totalRecordCount);

       }, function (res) {
         console.log('getResourceNeedhandle:' + res.message);
       });
    },
  },
  mounted: function () {
    var self = this;
    this.$nextTick(function () {
      self.gotoPage(1);
    });
  }
};
</script>
<style>
	
</style>