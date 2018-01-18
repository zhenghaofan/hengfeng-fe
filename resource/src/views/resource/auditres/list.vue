<template>
<div>
  <!-- 排序方式 -->
  <div class="g-avai-sort f-clearfix">
    <span class="t-sortway g-ml10">所属学科：
      <a href="#" 
        class="g-ml20" 
        @click.prevent="setSortType(index)"
        :class="{'z-selected': type.checked}"
        v-for="(type, index) in typeList">{{type.name}}</a>
    </span>
    <span class="f-r">
      <template v-if="waitEnabled"><i class="icon i-wait2 g-mr5"></i>
      待审资源：</template>
      <template v-else><i class="icon i-return g-mr5"></i>历史退回：</template>
      {{totalRecordCount}}
    </span>
  </div>
	<div v-if="list.length > 0">
		<div class="resource-list unauited-list f-clearfix" v-for="(item, index) in list" :id="item.resourceDictId">
			<div class="list-img g-ml10" :class="getCoverClass(item.resourceDictId)"  @click="getDetails(item.resourceDictId, item.id)">
      </div>
			<div class="list-content">
				<p class="tit-resourcename"><a :href="'/views/resource/'+(waitEnabled?'editres':'detail')+'.html?status='+(waitEnabled?'unauited':'rejected')+'&id='+item.id" v-html="item.name"></a></p>
				<p class="tit-sub">资源类型：{{GL_CONST.RESOURCETYPESOBJ[item.resourceDictId]}}<span class="g-ml40 g-mr10">{{item.creatorName}}</span>创建于{{item.createTime}}</span></p>
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

	<div class="m-norecord" v-else>
    <template v-if="waitEnabled">当前暂无新的资源待审</template>
    <template v-else>恭喜，伙伴们都很给力，暂无资源退回记录。</template>
  </div>
</div>
</template>
<script>
import Vue from 'vue'
//引入翻页
import pages from '@/components/GPages'
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
      typeList: [],
      sortTypeId: '',
      GL_CONST: GL_CONST,
  	};
  },
  components: {
    pages
  },
  props: ['waitEnabled', 'needget'],
  watch: {
    'waitEnabled': {
      handler: function (val, oldval) {
        if (this.needget) {
          //重置排序方式  
          this.resetSortType();     
          this.gotoPage(1);
        }     
      },
      deep: true
    },
    'needget': {
      handler: function (val, oldval) {
        if (val) {
          //重置排序方式  
          this.resetSortType();     
          this.gotoPage(1);
        }     
      },
      deep: true
    }
  },
  methods: {
    //获取审核负责的科目
    getAuditSubjects: function () {
      var self = this;
      apiUrl.getAuditSubjects()
      .then(function (res) {
        var _result = res.data,
            typeList = _result.subjectList;
        self.typeList = typeList;
        self.typeList.unshift({
          id: '',
          name: '全部',
          checked: true
        });
      });
    },
    //排序方式
    setSortType: function (index) { 
      var list = this.typeList;

      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].checked === undefined) {
          Vue.set(list[i], 'checked', false);
        }

        if (i === index) {
          list[i].checked = true;
        } else {
          list[i].checked = false;
        }
      }
      this.sortTypeId = this.typeList[index].id;
      this.gotoPage(1);
    },
    //重置排序方式
    resetSortType: function () {
      var list = this.typeList;
      for (var i = 0, len = list.length; i < len; i++) {
        list[i].checked = false;
      }
      //默认选中“全部”
      if (list.length > 0) {
        list[0].checked = true;
      }
      this.sortTypeId = '';
    },
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
    getDetails: function (typeId, id) {
      var type = this.waitEnabled ? 'unauited' : 'rejected',
          preFix = '/views/resource/editres.html?';
      //我退回的只能查看，不能编辑
      if (type === 'rejected') {
        preFix = '/views/resource/detail.html?';
      }
      window.location.href = preFix + 'status=' + type + '&id=' + id;
    },
  	getStar: function (score, flag) {
  		return flag ? Math.ceil(score / 20) : Math.floor(score / 20);
  	},
  	//
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
      		params = {
            subjectId: this.sortTypeId,
            pageNo: p,
            pageSize: this.perPageCount
          },
          method = this.waitEnabled ? 'getResourceUnaudited' : 'getResourceRejected';

        this.list = [];
        apiUrl[method](params)
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
       }, function (res) {
          var type = self.waitEnabled ? 'getResourceUnaudited' : 'getResourceRejected';
          console.log(type + ':' + res.message);
       });
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getAuditSubjects();
      if (this.needget) {
        this.gotoPage(1);
      }     
    });
  }
};
</script>
<style>
.unauited-list .list-content {
  width: 790px;
}
</style>