import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'

//引入过滤器
import filters from '@/components/Filters'
//搜索
import search from '@/components/Search'
//引入内容区
import list from './list.vue'

new Vue({
  el: '.g-app',
  components: {
  	gHeader,
  	gLeftbar,
	  filters,
    search,
  	list,
  	gFooter
  },
  data: {
    headerSel: 'nav-resource',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.resource,
      curMenuId: 'lb-avaire',
    },
    chapterEnabled: true,
    searchType: 'textbook',
    totalRecordCount: '',
    keyword: '',
    //查询过滤条件
    searchCondition: {
      learnStageId: '',
      subjectId: '',
      resourceDictId: '',
      childDictId: '',
      gradeId: '',
      termDictId: '',
      textbookId: '',
      textbookCatalogId: '',
      knowledgePointId: '',
      knowledgePointCatalogIds: '',
      sorts: '',
      keyword: '',
    },
  },
  methods: {
    //tab切换
    toggleList: function (flag) {
      if (!flag == !this.chapterEnabled) {
        return;
      }

      this.chapterEnabled = !this.chapterEnabled;

      if (flag) {
        this.searchType = 'textbook';
      } else {
        this.searchType = 'knwleg';
      }
      //重置搜索条件
      this.resetCondition();
    },
    //设置搜索条件
    setFilters: function (filterInfo) {
      for (var i in filterInfo) {
        if (this.searchCondition[i] !== undefined) {
          this.searchCondition[i] = filterInfo[i];
        }
      }
    },
    //重置搜索条件
    resetCondition: function () {
      var type = this.searchType;

      this.searchCondition = {
        learnStageId: '',
        subjectId: '',
        resourceDictId: '',
        childDictId: '',
        gradeId: '',
        termDictId: '',
        textbookId: '',
        textbookCatalogId: '',
        knowledgePointId: '',
        knowledgePointCatalogIds: '',
        sorts: '',
        keyword: '',
      };
    },
    //查询列表
  	search: function (filterInfo) {
  		this.setFilters(filterInfo);
      //重置搜索条件
      //this.resetCondition();
  	}, 
  },
  mounted: function () {
  }
});