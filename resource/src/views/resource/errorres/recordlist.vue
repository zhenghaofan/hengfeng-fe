<template>
	<div>
		<div class="handler-top f-clearfix">
			<span class="f-l"><!-- <i class="icon g-mr5 i-check" :class="{'i-check-s': hasError}" @click="getList(!!hasError)"></i>只看有误<i class="icon g-ml10 g-mr5 i-check" :class="{'i-check-s': hasError === ''}" @click="getList('')"></i>全部记录 -->
        <el-select @change="gotoPage(1)" v-model="hasError" placeholder="过滤条件">
          <el-option
            v-for="item in filterList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </span>
			<span class="f-r">已有记录{{totalRecordCount}}（确有记录{{hasErrorRecordCount}}，占比{{hasErrorRate}}%）</span>
		</div>
    <div v-if="list.length > 0">
  		<div class="m-list g-list-error">
  	    <div class="m-list-th">
  	      <span class="item th-item1">处理时间</span>
  	      <span class="item th-item2">资源类型</span>
  	      <span class="item th-item3">所属学科</span>
  	      <span class="item th-item4">资源名称</span>
  	      <span class="item th-item5">错误类型</span>
  	      <span class="item th-item6">补充说明</span>
  	      <span class="item th-item7">错误判定</span>
  	      <span class="item th-item8">处理方式</span>
  	      <span class="item th-item9">操作</span>
  	    </div>
  	    <ul class="m-list-con">
  	      <li v-for="(item, index) in list" :id="item.errorId">
  	        <span class="item con-item1">{{item.handleTime}}</span>
  	        <span class="item con-item2">{{item.resourceDict.name}}</span>
  	        <span class="item con-item3">{{item.subjectName}}</span>
  	        <span class="item con-item4">{{item.name}}</span>
  	        <span class="item con-item5">{{item.errorDictName}}</span>
  	        <span class="item con-item6">{{item.remark}}</span>
  	        <span class="item con-item7">{{item.hasError ? '确有错误' : '核实无误'}}</span>
  	        <span class="item con-item8">{{getHandleType(item.handleType)}}</span>
  	        <span class="item con-item9"><i class="icon i-eye" @click="getDetails(item.resourceDict.id, item.errorId)"></i></span>
  	      </li>
  	    </ul>
  	  </div>

      <pages :class="{'f-static': list.length > 5}" :pages="pageInfo" @goto="gotoPage"></pages>

    </div>

  	<div class="m-norecord" v-else>
      暂无处理记录
    </div>
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
      perPageCount: 10,
      pageInfo: '',
      hasError: '',
      filterList: [
        {
          id: true,
          name: '确有错误'
        },
        {
          id: false,
          name: '核实无误'
        },
        {
          id: '',
          name: '全部记录'
        }
      ],
      totalRecordCount: 0,
      hasErrorRecordCount: 0,
      hasErrorRate: 0
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
      window.location.href = preFix + 'status=errorlog&id=' + id;
    },
  	getList: function (hasError) {
      if (hasError === '') {
        this.hasError = '';
      } else {
        this.hasError = !hasError;
      }
  		this.gotoPage(1);
  	},
  	getHandleType: function (handleType) {
  		var type = {
  			'UNDONE': '尚未处理',
  			'NO_NEED': '无需处理',
  			'UPDATE': '资源更新',
  			'CLOSED': '下架'
  		};
  		return type[handleType];
  	},
  	//
    gotoPage: function (p) {
      p = p || this.pageInfo.curPage;

      var self = this,
      		params = {
      			hasError: this.hasError,
            pageNo: p,
            pageSize: this.perPageCount
          };

        apiUrl.getHandlelist(params)
        .then(function (res) {
          var _result = res.data,
              totalRecordCount = _result.totalRecordCount,
              perPageCount = self.perPageCount,
              totalPage = Math.ceil(totalRecordCount / perPageCount);

          self.list = _result.errorResourceList;

          self.pageInfo = {
            totalPage: totalPage,
            curPage: p
          };

          self.$emit('getcount', totalRecordCount);

       }, function (res) {
         console.log('getHandlelist:' + res.message);
       });
    },
    getErrorStatistics: function () {
    	var self = this;

    	apiUrl.getErrorStatistics()
      .then(function (res) {
      		var _result = res.data;	
      		
      		self.totalRecordCount = _result.totalRecordCount;
		      self.hasErrorRecordCount = _result.hasErrorRecordCount;
		      self.hasErrorRate = _result.hasErrorRate;
      		
      });
    }
  },
  mounted: function () {
    var self = this;
    this.$nextTick(function () {
      self.gotoPage(1);
      self.getErrorStatistics();
    });
  }
};
</script>
<style>
.handler-top {
	padding: 5px 0;
}
.handler-top .icon {
	margin-top: 1px;
	vertical-align: top;
}
.handler-top .el-select {
  width: 120px;
}
.g-list-error .th-item1, .g-list-error .con-item1 {
	width: 90px;
	white-space: normal;
  line-height: 16px;
}
.g-list-error .con-item1 {
	width: 80px;
	padding-left: 10px;
 	text-align: left;
}
.g-list-error .th-item2, .g-list-error .con-item2,
.g-list-error .th-item3, .g-list-error .con-item3,
.g-list-error .th-item4, .g-list-error .con-item4,
.g-list-error .th-item7, .g-list-error .con-item7,
.g-list-error .th-item8, .g-list-error .con-item8 {
	width: 90px;
}
.g-list-error .th-item5, .g-list-error .con-item5 {
	width: 110px;
}
.g-list-error .th-item6, .g-list-error .con-item6 {
	width: 130px;
}
</style>