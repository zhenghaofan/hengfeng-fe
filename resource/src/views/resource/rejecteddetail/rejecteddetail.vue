<template>
<div>
  <!-- 筛选项 -->
  <el-form ref="form" label-position="right" label-width="120px" class="selects">
  	<el-form-item class="delmsg">
  		<div>本资源由{{resource.creatorName}}于{{resource.createTime}}上传</div>
  	</el-form-item>
  	<el-form-item class="aud-box" v-if="resource.status === 'REJECTED'">
			<div class="aud-div">
  			<span class="leftlogo"></span>
  			<el-col :span="12"><span class="aud-name">审核时间：</span><span class="audit">{{statusLog.auditTime}}</span></el-col>
  			<el-col :span="12"><span class="aud-name">审核人：</span><span class="audit">{{statusLog.auditorName}}</span></el-col>
	  		<el-row>
	  			<span class="aud-name">退回原因：</span> <span class="audit audit-con">{{statusLog.remark}}</span>
	  		</el-row>
			</div>
  	</el-form-item>
    <el-form-item label="资源类型">
			<el-col :span='3'>
		    <el-input :value="resourceDictName" disabled></el-input>
			</el-col>
	  </el-form-item>
	
	  <el-form-item label="所属科段">
			<el-col :span='3' class="col-mr10"><el-input :value="learnStageName" disabled></el-input></el-col>
			<el-col :span='3' class="col-mr10"><el-input :value="gradeName" disabled></el-input></el-col>
			<el-col :span='3' class="col-mr10"></el-input><el-input :value="subjectName" disabled></el-input></el-col>
	  </el-form-item>

	  <!-- 章节和知识点二有其一 -->
	  <el-form-item label="适用章节" v-if="resource.textbook">
	  	<!--出版社及书名-->
			<el-col :span='3' class="col-mr10"><el-input disabled :value="resource.textbook.publisher"></el-input></el-col>
			<el-col :span='3' class="col-mr10"><el-input disabled :value="resource.textbook.termDictId==='LAST_TERM'?'上学期':'下学期'"></el-input></el-col>
			<el-col :span='3' class="col-mr10"><el-input disabled :value="textbookName" :title="textbookName"></el-input></el-col>
			<!--知识章节-->
			<el-col class="col-mr10" :span="3" v-for="(item,index) in resource.textbookCatalogs" :key="item.id">
				<el-input disabled :value="item.name" :title="item.name"></el-input>
			</el-col>
			<el-col class="col-mr10" :span="3" v-for="(item,index) in resource.textbookCatalogs.children" :key="item.id">
				<el-input disabled :value="item.name" :title="item.name"></el-input>
			</el-col>
	  </el-form-item>

	  <!-- TODO -->
	 	<el-form-item label="知识点" v-show="resource.knowledgePointCatalogs">
	  	<!-- 知识点树筛选 -->
		  <div class="col">
		    <div class="control">
		      <div class="txts">
		        <div class="sel-knwleg knw-one g-mr10" v-for="(item, index) in resource.knowledgePointCatalogs" :key="item.id">
		          <el-select class="select-resourelib" v-model="item.name" disabled>
		            <el-option
		              :label="item.name"
		              :value="item.id">
		            </el-option>
		          </el-select>
		          <div class="sel-knwleg knw-two g-mr10" v-for="items in item.children" :key="items.id">
			          <el-select class="select-resourelib g-mt10" v-model="items.name" disabled>
			            <el-option
			              :label="items.name"
			              :value="items.id">
			            </el-option>
			          </el-select>
				        <div class="chk-knwleg knw-three" v-show="itemss"> 
				          <span class="chk-knwleg-item" v-for="itemss in items.children" :key="itemss.id"><i class="icon i-check g-mr5"></i>{{itemss.name}}</span>          
				        </div>
		          </div>
		        </div>
		      </div>
		    </div>
		  </div>
		<!-- 知识点树筛选\ -->
	  </el-form-item>
	
	  <el-form-item label="题型类别" v-if="childDictName">
	  	<el-col :span="3"><el-input disabled v-model="childDictName"></el-input></el-col>
	  </el-form-item>

	  <!-- 习题才有难度级别 -->
	  <el-form-item label="难度级别" v-if="resourceDictId === 'EXERCISES'">
	  	<div class="val-num">
	 			<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
	 		</div>
	    <el-slider :value="(resource.difficultyLevel - 1) * 25" :step="25" disabled show-stops></el-slider>
	  </el-form-item>
	
	  <el-form-item label="题干">
	  	<el-input type="textarea" :autosize="{minRows: 4,}" disabled :value="resourceName"></el-input>
	  </el-form-item>

	  <!-- 单选或多选时 -->
	  <el-form-item v-for="(val, key) in resource.topics" :key="key" v-if="resource.childDictId === 'SINGLE_CHOICE' || resource.childDictId === 'MULTIPLE_CHOICE'">
	  	<el-checkbox :value="key === resource.answers || resource.answers.indexOf(key) !== -1" disabled class="chk-lab">选项{{key}}</el-checkbox>
	  	<el-input disabled :value="val" class="chk-ipt"></el-input>
	  </el-form-item>

	  <div class="g-tc">
	  	<a class="btn btn-green" href="auditres.html">返回列表</a>
	  </div>
  </el-form>
</div>
</template>
<script>
import util from '@/utils/index.js'
//集成api
import apiUrl from '@/api/url.js'

export default {
  data: function () {
  	return {
  		resourceId: '',
  		resourceDictId:'',
  		resourceDictName: '',
  		learnStageName:'',
  		subjectName:'',
  		gradeName:'',
  		textbookName:'',
  		resourceName:'',
			auditorName:'',
			auditTime:'',
			remark:'',
  		resource:{},
  		dictList: [],
  		//题型类别
  		childDictName: ''
  	}
  },
  methods: {
  	//资源类型以及其二级标签
  	getResourceTypes: function (resourceId) {
  		//有，则直接拿
  		var dictList = window.sessionStorage.getItem('dictList');
  		if (dictList) {
  			this.dictList = JSON.parse(dictList);
  			return;
  		}

  		//无，则请求
  		var self = this;

    		apiUrl.getResourceTypes().then(function (resourceId,res) {
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
		getDetails: function(id){
			var self = this,
					params = self.resourceId;

			apiUrl.getResourceDetail(params,'off').then(function (res) {
				var _result = res.data;
				
				self.resource = _result.resource;
				self.resource.status = _result.resource.status;
				self.statusLog = _result.statusLog;
				self.resourceDictId = _result.resource.resourceDict.id;
				self.resourceName = _result.resource.name;
				self.resourceDictName = _result.resource.resourceDict.name;
				self.learnStageName = _result.resource.learnStage.name;				
				self.gradeName = _result.resource.grade.name;
				self.subjectName = _result.resource.subject.name;
				self.textbookName = _result.resource.textbook.name;
				self.auditTime = _result.resource.auditTime;
				self.auditorName = _result.resource.auditorName;
				self.remark = _result.resource.remark;

				//题型类别
  			self.getChildDict(self.resource.resourceDict.id, self.resource.childDictId);

			}, function (res) {
			console.log('err:' + res);
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
.delmsg .el-form-item__content {
  text-align: center;
  border-radius: 20px;
  color: #f25454;
  border: 1px solid #e5e5e5;
  box-shadow: 0 0 10px #ccc;
  margin-left: 57px !important;
  background: #fff;
}
.el-form-item {
  margin-bottom: 10px;
}
.multi-import-btn {
  float: right;
}
.col-mr10 {
  margin-right: 10px;
}
.el-input__inner {
  text-overflow: ellipsis;
}
.selects .el-row {
  margin-top: 10px;
}
.selects .el-select {
  width: 120px;
  margin-right: 10px;
}
.el-input__inner {
  text-align: center;
  padding: 0px !important;
}
.block {
  position: relative;
}
.val-num {
  display: inline-block;
  margin-bottom: 20px;
}
.val-num span {
  width: 77px;
  display: inline-block;
}
.el-slider__runway {
	width: 310px;
  position: absolute;
  top: 20px;
  right: 63.5%;
}
.chk-lab{
	margin-right: 19px;
}
.chk-ipt{
	width: 90%;
}
.el-form-item.aud-box .el-form-item__content {
  border-radius: 5px;
  box-shadow: 0 0 10px #cccccc;
  margin-left: 53px!important;
  padding-left: 67px;
  background: #fff;
}
.audit {
  color: #999999;
}
.audit-con{
  width: 566px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: top;
}
.leftlogo{
	background: url(../../../../static/images/icons.png) no-repeat -205px -35px;
  width: 31px;
  height: 31px;
  display: inline-block;
  position: absolute;
  left: 0px;
  top: 0px;
}
.aud-div{
	background: url(../../../../static/images/magnifier_green.png) no-repeat 660px 20px;
	margin-bottom: 10px;
	padding: 10px 0;
  min-height: 252px;
}
</style>