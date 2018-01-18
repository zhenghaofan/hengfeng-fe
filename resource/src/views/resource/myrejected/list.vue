<template>
	<div v-if="list.length > 0">
    <!-- 统计数量 -->
    <div class="g-tr">
      <i class="icon i-wait2 g-mr5"></i>
      复审资源：
      {{totalRecordCount}}
    </div>

		<div class="resource-list unauited-list f-clearfix" v-for="(item, index) in list" :id="item.id">
			<div class="list-img g-ml10" :class="getCoverClass(item.resourceDictId)" @click="getDetails(item.resourceDictId, item.id)">
      </div>
			<div class="list-content" @click="getDetails(item.resourceDictId, item.id)">
				<p class="tit-resourcename">
          <a :href="'/views/resource/editres.html?status=myrejected&id='+item.id" v-html="item.name"></a>
        </p>
				<p class="tit-sub">资源类型：{{getResourceName(item.resourceDictId)}}<span class="g-ml40 g-mr10">{{item.creatorName}}</span>创建于{{item.createTime}}</span></p>
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
        <p class="t-important" v-if="item.remark">{{item.remark}}</p>
			</div>
		</div>

		<pages :class="{'f-static': list.length > 2}" :pages="pageInfo" @goto="gotoPage"></pages>
	</div>

  <norecord :loading="loading" norecordTxt="当前没有等待复核的资源。" v-else></norecord>

</template>
<script>
//引入翻页
import pages from '@/components/GPages'
import norecord from '@/components/NoRecord'
//集成api
import apiUrl from '@/api/url.js'
//引入系统常量数据
import GL_CONST from '@/confdata/constant'

export default {
  data: function () {
  	return {
  		list: [],
      perPageCount: 5,
      pageInfo: '',
      totalRecordCount: '',
      loading: false,
  	};
  },
  components: {
    pages,
    norecord,
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
    //资源类型名
    getResourceName(resourceDictId) {
      var list = GL_CONST.RESOURCETYPES;
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id === resourceDictId) {
          return list[i].name;
        }
      }
    },
    //资源详情
    getDetails: function (typeId, id) {
      var preFix = '/views/resource/editres.html?status=myrejected&id=';
      window.location.href = preFix + id;
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
        this.loading = true;

        apiUrl.getResourceList(params, 'myrejected')
        .then(function (res) {
          var _result = res.data,
              totalRecordCount = _result.totalRecordCount,
              perPageCount = self.perPageCount,
              totalPage = Math.ceil(totalRecordCount / perPageCount);

          self.list = _result.resourceList;
          self.totalRecordCount = totalRecordCount;
          self.pageInfo = {
            totalPage: totalPage,
            curPage: p
          };
          self.loading = false;

       }, function (res) {
          self.loading = false;
          console.log('getResourceList.myrejected err:' + res.message);
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
.unauited-list .list-content {
  width: 790px;
}
</style>