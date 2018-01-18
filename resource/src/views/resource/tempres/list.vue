<template>
  <div v-if="list.length > 0">
    <!-- 排序方式 -->
    <div class="g-avai-sort f-clearfix">
      <span class="f-r g-mr20"><i class="iconf i-resources-blue"></i>资源量：{{totalRecordCount}}</span></span>
    </div>

		<div class="resource-list tempres-list f-clearfix" v-for="(item, index) in list" :id="item.id">
			<div class="list-img g-ml10" :class="getCoverClass(item.resourceDictId)" @click="getDetails(item.resourceDictId, item.id, item.hasMark)">
      </div>
			<div class="list-content">
				<p class="tit-resourcename">
          <a :href="'/views/resource/'+(item.hasMark?'detail':'editres')+'.html?status=temp&id='+item.id" v-html="item.name"></a>
        </p>
        <!-- 全部的时候 加个标记显示 -->
        <div class="item-opts" v-if="hasMark === ''" :class="{'t-green': item.hasMark,'t-red': !item.hasMark}">
          {{item.hasMark ? '已编': '待编'}}
        </div>
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
			</div>
		</div>
		<pages :class="{'f-static': list.length > 2}" :pages="pageInfo" @goto="gotoPage"></pages>
	</div>

  <norecord :loading="loading" norecordTxt="请调整筛选条件或者关键字再搜索！" v-else></norecord>
</template>
<script>
import Vue from 'vue'
//引入翻页
import pages from '@/components/GPages'
import norecord from '@/components/NoRecord'
//集成api
import apiUrl from '@/api/url.js'
//引入系统常量数据
import GL_CONST from '@/confdata/constant'
//引入弹窗
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);

export default {
  data: function () {
  	return {
  		list: [],
      perPageCount: 5,
      pageInfo: '',
      //排序方式
      sortTypeList: [
        {
          id: 'CREATE_TIME',
          name: '上传时间',
          checked: false
        }, {
          id: 'USE_TIMES',
          name: '使用次数',
          checked: false
        }, {
          id: 'ARG_SCORE',
          name: '用户评分',
          checked: false
        }
      ],
      sortTypeId: '',
      selectedIdList: [],
      totalRecordCount: 0,
      //是否全选
      checkedAll: false,
      //是否有下架权限
      hasClosedAuth: this.authTempList.indexOf('RESOURCE_CLOSED') !== -1 ? true : false,
      loading: false,
  	};
  },
  props: ['condition', 'hasMark'],
  components: {
    pages,
    norecord,
  },
  watch: {
  	'condition': {
      handler: function (val, oldVal) {
      	console.log('condition changed!');
        this.gotoPage(1);
      },
      deep: true
    },
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
    //查看详情
    getDetails: function (typeId, id, hasMark) {
      var preFix = '/views/resource/editres.html?status=temp&id=';
      //已编的只能查看
      if (hasMark) {
        preFix = '/views/resource/detail.html?status=temp&id=';
      }
      window.location.href = preFix + id;
    },
  	//获取列表
    gotoPage: function (p) {
      //暂未获取科段时
      if (!this.condition.subjectId || !this.condition.learnStageId) {
        return;
      }

      p = p || this.pageInfo.curPage;

      var self = this,
          params = {};

        for (var i in this.condition) {
          if (this.condition[i] !== '') {
            params[i] = this.condition[i];
          }
        }

        params.pageNo = p;
        params.pageSize = this.perPageCount;

        this.list = [];
        this.checkedAll = false;
        this.loading = true;

        apiUrl.getResourceList(params, 'temporary')
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
          console.log('getResourceList:' + res.message);
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
.tempres-list .list-content {
  width: 800px;
}
</style>