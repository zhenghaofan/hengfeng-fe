<template>
  <div v-if="list.length > 0"> 
    <!-- 排序方式 -->
    <div class="g-avai-sort f-clearfix">
      <!-- <span class="g-mr40 t-gray" v-if="hasClosedAuth" @click="setSelArrAll"><i class="icon i-check g-mr5" :class="{'i-check-s': checkedAll}"></i>全选</span> -->
      <span class="t-sortway"><i class="iconf i-sortway g-mr5"></i>排序方式：
        <a href="#" 
          class="g-ml20" 
          @click.prevent="setSortType(index)"
          :class="{'z-selected': type.checked}"
          v-for="(type, index) in sortTypeList">{{type.name}}</a>
      </span>
      <span class="f-r"><!-- <a href="#" @click.prevent="showConfirmBox(false)" class="g-mr20"><i class="iconf i-off-blue"></i>下架</a> --><!-- <a href="#" class="g-mr20"><i class="iconf i-download-blue"></i>下载</a><i class="icon i-resources"></i> --><span class="g-mr20"><i class="iconf i-resources-blue"></i>资源量：{{totalRecordCount}}</span></span>
    </div>

		<div class="resource-list f-clearfix" v-for="(item, index) in list" :id="item.id">
      <!-- <div class="list-icons">
        <span>
          <i class="icon i-check g-mb10" :class="{'i-check-s': item.checked}"  @click="setSelArr(item.id, index)"></i>
        </span>
      </div> -->
      <div class="list-img g-ml10" :class="getCoverClass(item.resourceDictId)" @click="getDetails(item.resourceDictId, item.id)">
      </div>
      <div class="list-content">
        <p class="tit-resourcename"><a :href="'/views/resource/detail.html?status=myoff&id='+item.id" v-html="item.name"></a></p>
        <!-- <div class="item-opts">
          <a href="#" @click.prevent="showConfirmBox(item.id, item.checked)"><i class="iconf i-off-blue" title="下架"></i></a>
          <a :href="'/manage/resource/available/download?id='+item.id" target="_blank" class="g-mlr10" title="下载"><i class="iconf i-download-blue"></i></a>
        </div> -->
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
          <span v-for="knw in item.knowledgePointCatalogNames">{{knw}}</span>
        </p>
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

  <norecord :loading="loading" norecordTxt="所选条件下，暂无下架资源。" v-else></norecord>

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
  		isCheckboxShow: false,
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
      loading: false,
  	};
  },
  props: ['condition'],
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
    //设置排序类型
    setSortType: function (index) {
      var list = this.sortTypeList;
      
      for (var i = 0, len = list.length; i < len; i++) {
        if (i === index) {
          list[index].checked = true;
          this.sortTypeId = list[index].id;
          this.condition.sorts = list[index].id;
        } else {
          list[i].checked = false;
        }
      }
      //this.gotoPage(1);
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
      var preFix = '/views/resource/detail.html?';
      window.location.href = preFix + 'status=myoff&id=' + id;
    },
    //标星
  	getStar: function (score, flag) {
  		return flag ? Math.ceil(score / 20) : Math.floor(score / 20);
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

        apiUrl.getResourceList(params, 'myoff')
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
    //设置选择框
    setSelArr: function (id, index) {
      var idxInArr = this.selectedIdList.indexOf(id);
      //已存在
      if (idxInArr !== -1) {
        //取消选中
        this.list[index].checked = false;
        this.selectedIdList.splice(idxInArr, 1);
      } else {
      //不存在，则选中
        if (this.list[index].checked === undefined) {
          Vue.set(this.list[index], 'checked', true);
        }
        this.list[index].checked = true;
        this.selectedIdList.push(id);
      }

      if (this.selectedIdList.length === this.list.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    },
    //设置全选框
    setSelArrAll: function () {
      var status = this.checkedAll,
          list = this.list;
      //已全选
      if (status) {
        //全不选中
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].checked === undefined) {
            Vue.set(list[i], 'checked', false);
          } else {
            list[i].checked = false;
          }
        }
        this.selectedIdList = [];
      } else {
        this.selectedIdList = [];
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].checked === undefined) {
            Vue.set(list[i], 'checked', true);
          } else {
            list[i].checked = true;
          }
          this.selectedIdList.push(list[i].id);
        }
        
      }
      this.checkedAll = !this.checkedAll;
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
.g-avai-top {
	position: relative;
}
</style>