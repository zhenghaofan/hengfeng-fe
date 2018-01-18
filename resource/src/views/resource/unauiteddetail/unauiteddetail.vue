<template>
<el-form ref="form" class="res-detail">
	<el-form-item label="资源类型" v-show="resource.resourceDict">
		<el-col :span='3'>
	    <el-input :value="resourceDictName" disabled></el-input>
		</el-col>
  </el-form-item>

  <el-form-item label="所属科段">
		<el-col :span='3'><el-input :value="learnStageName" disabled></el-input></el-col>
		<el-col :span='3'><el-input :value="gradeName" disabled></el-input></el-col>
		<el-col :span='3'><el-input :value="subjectName" disabled></el-input></el-col>
  </el-form-item>

  <!-- 章节和知识点二有其一 -->
  <el-form-item label="适用章节" v-if="resource.textbook">
  	<!--出版社及书名-->
		<el-col :span='3'><el-input disabled :value="resource.textbook.publisher"></el-input></el-col>
		<el-col :span='3'><el-input disabled :value="termName[resource.textbook.termDictId]"></el-input></el-col>
		<el-col :span='3'><el-input disabled :value="resource.textbook.name"></el-input></el-col>
		<!--知识章节-->
		<div class="g-inblock g-block" v-for="(cat1, index) in resource.textbookCatalogs" :key="cat1.id">
			<el-input class="sel-knwleg g-mr10" disabled :value="cat1.name" :title="cat1.name"></el-input>
      <div class="g-line-l1" v-for="(cat2, index) in cat1.children" :key="cat2.id">
        <el-input class="sel-knwleg g-mr10" disabled :value="cat2.name" :title="cat2.name"></el-input>
        <div class="g-line-l2" v-for="(cat3, index) in cat2.children" :key="cat3.id">
          <el-input class="sel-knwleg" disabled :value="cat3.name" :title="cat3.name"></el-input>
        </div>
      </div>
		</div>
  </el-form-item>

  <!-- TODO -->
  <el-form-item label="知识点" v-show="resource.knowledgePointCatalogs">
  	<!-- 知识点树筛选 -->
	  <div class="col">
	    <div class="control">
	      <div class="txts">
          <div class="sel-knwleg">
            <el-input disabled class="g-mb10" :value="knwlegPoint1.name" :title="knwlegPoint1.name"></el-input>
            <el-input disabled :value="knwlegPoint2.name" :title="knwlegPoint2.name"></el-input>
          </div>
          <div class="chk-knwleg disabled" v-show="knwlegPointList3.length > 0"> 
            <span class="chk-knwleg-item" v-for="(knwleg, index) in knwlegPointList3">{{knwleg.name}}</span>          
          </div>
	      </div>
	    </div>
	  </div>
	  <!-- 知识点树筛选\ -->
  </el-form-item>

  <el-form-item label="题型类别" v-if="resourceDictId === 'EXERCISES'">
  	<el-col :span="3"><el-input disabled v-model="childDictName"></el-input></el-col>
  </el-form-item>

  <!-- 习题才有难度级别 -->
  <el-form-item label="难度级别" v-if="resourceDictId === 'EXERCISES'">
  	<div class="val-num">
 			<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
 		</div>
    <el-slider :value="(resource.difficultyLevel - 1) * 25" :step="25" disabled show-stops></el-slider>
  </el-form-item>

  <el-form-item label="题干" v-show="resource.name">
  	<el-input type="textarea" disabled :value="resourceName"></el-input>
  </el-form-item>

  <!-- 单选或多选时 -->
  <el-form-item v-for="(val, key) in resource.topics" :key="key" v-if="resource.childDictId === 'SINGLE_CHOICE' || resource.childDictId === 'MULTIPLE_CHOICE'">
  	<el-checkbox :value="key === resource.answers || resource.answers.indexOf(key) !== -1" disabled class="chk-lab">选项{{key}}</el-checkbox>
  	<el-input disabled :value="val" class="chk-ipt"></el-input>
  </el-form-item>

	<el-form-item label="资源审核">
    <el-col :span="21">
      <el-radio-group class="g-mt10" v-model="auditeStatus" @change="setTipsShow">
        <el-col class="g-mb10">
          <el-radio class="radio" label="APPROVED">保存入库</el-radio>
        </el-col>
        <el-col>
          <el-radio class="radio" label="REJECTED">退回修改</el-radio>
          <el-input v-if="auditeStatus === 'REJECTED'" type="textarea" class="remark" v-model="remark"></el-input>
        </el-col>
      </el-radio-group>
    </el-col>
  </el-form-item>

  <div class="g-tc">
    <p class="t-error" v-if="showErrorTips">请填写否决原因！</p>
  	<a class="btn btn-green" @click.prevent="save">保存</a>
  </div>

</el-form>
</template>
<script>
import util from '@/utils/index.js'
//集成api
import apiUrl from '@/api/url.js'
//引入弹窗
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);

export default {
  data: function () {
  	return {
      resource:{},
  		resourceId: '',
  		resourceDictId:'',
  		resourceDictName: '',
  		learnStageName:'',
  		subjectName:'',
  		gradeName:'',
  		resourceName:'',
      termName: {
        'LAST_TERM': '上学期',
        'NEXT_TERM': '下学期'
      },
  		dictList: [],
  		//题型类别
  		childDictName: '',
      //知识点
      knwlegPoint1: '',
      knwlegPoint2: '',
      knwlegPointList3: [],
      //状态
      auditeStatus: 'APPROVED',
      //退回说明
      remark: '',
      showErrorTips: false
  	}
  },
  methods: {
    setTipsShow: function (type) {
      if (type === 'APPROVED') {
        this.showErrorTips = false;
      }
      this.remark = '';
    },
  	//资源类型以及其二级标签
  	getResourceTypes: function () {
  		//有，则直接拿
  		var dictList = window.sessionStorage.getItem('dictList');
  		if (dictList) {
  			this.dictList = JSON.parse(dictList);
  			return;
  		}

  		//无，则请求
  		var self = this;

    		apiUrl.getResourceTypes().then(function (res) {
    			var _result = res.data;
	  		self.dictList = _result.dictList;
	  		window.sessionStorage.setItem('dictList', JSON.stringify(self.dictList));
	  	});
  	},
  	//题型类别
  	getChildDict: function (parentId, childId) {
  		var list = this.dictList;

  		for (var i = 0, len = list.length; i < len; i++) {
  			if (list[i].id === parentId && list[i].childDictList.length !== 0) {
  				var childlList = list[i].childDictList;
  				for (var j = 0, len2 = childlList.length; j < len2; j++) {
  					if (childlList[j].id === childId) {
  						this.childDictName = childlList[j].name;
  						break;
  					}
  				}
  				break;
  			}
  		}
  	},
		getDetails: function(){
			var self = this,
					params = self.resourceId;

			apiUrl.getResourceDetail(params).then(function (res) {
				var _result = res.data;
				self.resource = _result.resource;
				self.resourceDictId = _result.resource.resourceDict.id;
				self.resourceName = _result.resource.name;
				self.resourceDictName = _result.resource.resourceDict.name;
				self.learnStageName = _result.resource.learnStage.name;
				self.gradeName = _result.resource.grade.name;
				self.subjectName = _result.resource.subject.name;

        //知识点
        var knowCatalogs = _result.resource.knowledgePointCatalogs;
        self.knwlegPoint1 = knowCatalogs ? knowCatalogs[0] : '';
        self.knwlegPoint2 = self.knwlegPoint1 && self.knwlegPoint1.children ? knowCatalogs[0].children[0] : '';
        self.knwlegPointList3 = self.knwlegPoint2 && self.knwlegPoint2.children ? self.knwlegPoint2.children : [];


				//题型类别
  			self.getChildDict(self.resource.resourceDict.id, self.resource.childDictId);

			}, function (res) {
        console.log('err:' + res);
			});
		},
    //保存
    save: function () {
      var self = this,
          params = {
            id: this.resourceId,
            status: this.auditeStatus,
            remark: this.remark
          };

      if (this.auditeStatus === 'REJECTED' && this.remark == '') {
        this.showErrorTips = true;
        return false;
      } else {
        this.showErrorTips = false;
      }

      apiUrl.auditUpdate(params).then(function (res) {
        self.remark = '';
        var tips = self.auditeStatus === 'APPROVED' ? '已成功入库!' : '已成功退回！',
            iconCls = self.auditeStatus === 'APPROVED' ? 'icon-pop-in' : '';
        self.$myMsgBox({
          message: '<p><i class="' + iconCls + '"></i></p><p class="g-mt20">' + tips +'</p>',
          callback: function () {
            window.location.href = self.baseUrl + '/views/resourcelibs/resourcemanage/auditres.html';
          }
        });
      }, function (res) {
        console.log('auditUpdate err:' + res.message);
      });
    }
  },
  mounted: function() {
  	var self = this;

    self.resourceId = util.getUrlParams('id');

		this.$nextTick(function () {
			//资源类型以及其二级标签
			self.getResourceTypes();

      //获取资源详情
      self.getDetails();
  	});

	}
};
</script>
<style>
.res-detail {
	padding-left: 50px;
}
.res-detail .el-form-item__label {
	width: 80px;
	color: #232323;
	text-align: left;
}
.res-detail .el-input.is-disabled .el-input__inner,
.res-detail .el-textarea.is-disabled .el-textarea__inner {
	background-color: #f0f0f0;
  border-color: #ccc;
  color: #999;
}
.res-detail .el-form-item {
	margin-bottom: 10px;
}
.res-detail .el-input__inner {
  text-overflow: ellipsis;
}
.res-detail .el-input input{
	text-align: center;
}
.res-detail .el-col-3 {
  margin-right: 10px;
}
.val-num {
	display: inline-block;
	padding-left: 2px;
}
.val-num span {
	width: 72px;
  padding-left: 5px;
  display: inline-block;
}
.res-detail .el-slider{
	position: absolute;
	left: 90px;
	top: 20px;
	width: 310px;
}
.chk-lab{
	width: 75px;
}
.chk-ipt{
	width: 850px;
}
/*三级知识点style*/
.sel-knwleg {
  display: inline-block;
  width: 117px;
  margin-right: 7px;
}
.g-block{
	display: block;
}
.g-inblock .el-input, .sel-knwleg .el-input {
  width: 117px;
  float: left;
}
.res-detail .chk-knwleg {
  display: inline-block;
  width: 720px;
  min-height: 90px;
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
  vertical-align: top;
}
.res-detail .chk-knwleg.disabled {
  background-color: #f0f0f0;
  border-color: #ccc;
  color: #999;
}
.res-detail .chk-knwleg .chk-knwleg-item {
  margin-right: 10px;
}
.res-detail .remark .el-textarea__inner{
  margin-top: 6px;
  width: 850px;
}
</style>
