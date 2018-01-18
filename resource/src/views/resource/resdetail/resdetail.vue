<template>
<el-form class="res-detail">
  <!-- 我退回的 -->
  <template  v-if="status === 'rejected'">
    <!-- <div class="delmsg">本资源由{{resource.creatorName}}于{{resource.createTime}}上传</div> -->
    <div class="aud-box">
      <i class="icon i-trangle-green"></i>
      <el-form-item class="aud-box-inner">
        <el-col :span="12">审核时间：<span class="txt-gray">{{auditTime}}</span></el-col>
        <el-col :span="12">审核人：<span class="txt-gray">{{auditorName}}</span></el-col>
        <el-col :span="24">退回原因：<span class="txt-gray">{{rejectedRemark}}</span></el-col>
      </el-form-item>
    </div>
  </template>

  <!-- 等待处理 -->
  <template  v-if="status === 'waithandler' || status === 'errorlog'">
  <div class="waithandler-box">
    <i class="icon i-trangle-red"></i>
    <el-form-item class="waithandler-box-inner">
      <!-- 报错处理才有 -->
      <div class="handler-info f-clearfix" v-if="status === 'errorlog'">
        <el-col :span="12" v-if="handleTime">处理时间：<span class="txt-gray">{{handleTime}}</span></el-col>
        <el-col :span="12" v-if="handlerName">处置人：<span class="txt-gray">{{handlerName}}</span></el-col>
        <el-col :span="24" v-if="hasError">错误判定：<span class="txt-gray">{{hasError}}</span></el-col>
        <el-col :span="12" v-if="handleType">处置方式：<span class="txt-gray">{{handleType}}</span></el-col>
        <!-- <el-col :span="12">处置结果：<span class="txt-gray">{{}}</span></el-col> -->
      </div>
      <!-- 报错处理才有/ -->
      <el-col :span="12">来源平台：<span class="txt-gray">翻转课堂</span></el-col>
      <el-col :span="12">错误类型：<span class="txt-gray">{{errorType}}</span></el-col>
      <el-col :span="24">补充说明：<span class="txt-gray">{{errorLogRemark}}</span></el-col>
      <el-col :span="12">用户名称：<span class="txt-gray">{{reporterName}}</span></el-col>
      <el-col :span="12">用户联系方式：<span class="txt-gray">{{reporterTelephone}}</span></el-col>
      <el-col :span="12">报错时间：<span class="txt-gray">{{reportTime}}</span></el-col>
    </el-form-item>
  </div>
  </template>

  <!-- 普通编辑页 start -->
  <!-- 资源类型 -->
	<el-form-item label="资源类型">
		<el-col :span='3'>
	    <el-input :value="resourceDictName" disabled></el-input>
		</el-col>
  </el-form-item>

  <!-- 学科段 -->
  <el-form-item label="所属科段">
		<el-col :span='3'><el-input :value="learnStageName" disabled></el-input></el-col>
		<el-col :span='3'><el-input :value="gradeName" disabled></el-input></el-col>
		<el-col :span='3'></el-input><el-input :value="subjectName" disabled></el-input></el-col>
  </el-form-item>

  <!-- 章节和知识点二有其一 -->
  <!-- 章节 -->
  <el-form-item label="适用章节" v-if="resource.textbook">
  	<!--出版社及书名-->
		<el-col :span='3'><el-input disabled :value="resource.textbook.publisher" :title="resource.textbook.publisher"></el-input></el-col>
		<el-col :span='3'><el-input disabled :value="resource.textbook.termDictId==='LAST_TERM'?'上学期':'下学期'"></el-input></el-col>
		<el-col :span='3'><el-input disabled :value="textbookName" :title="textbookName"></el-input></el-col>
		<!--知识章节-->
		<el-col :span="3" v-for="(item,index) in resource.textbookCatalogs" :key="item.id">
			<el-input disabled :value="item.name" :title="item.name"></el-input>
		</el-col>
    <template v-if="resource.textbookCatalogs[0] && resource.textbookCatalogs[0].children">
      <el-col :span="3" v-for="(item,index) in resource.textbookCatalogs[0].children" :key="item.id">
        <el-input disabled :value="item.name" :title="item.name"></el-input>
      </el-col>
      <el-col :span="3" v-if="resource.textbookCatalogs[0].children[0].children" v-for="(item,index) in resource.textbookCatalogs[0].children[0].children" :key="item.id">
        <el-input disabled :value="item.name" :title="item.name"></el-input>
      </el-col>
    </template>
  </el-form-item>

  <!-- 知识点树 -->
  <el-form-item label="知识点" v-if="resource.knowledgePointCatalogs">
	  <div class="txts" v-for="(item, index) in resource.knowledgePointCatalogs" :key="item.id">
      <div class="sel-knwleg knw-one">
        <el-select class="select-resourelib" v-model="item.name" disabled>
          <el-option
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div class="sel-knwleg knw-two" v-for="items in item.children" :key="items.id">
          <el-select class="select-resourelib g-mt10" v-model="items.name" disabled>
            <el-option
              :label="items.name"
              :value="items.id">
            </el-option>
          </el-select>
          <div class="chk-knwleg knw-three" v-if="items.children"> 
            <span class="chk-knwleg-item" v-for="third in items.children" :key="third.id"><i class="icon i-check-disabled g-mr5"></i>{{third.name}}</span>    
          </div>
        </div>
      </div>
    </div>
  </el-form-item>
  <!-- 知识点树\ -->

  <!-- 题型类别 -->
  <el-form-item :label="resourceDictId === 'EXERCISES' ? '题型类别' : '试卷类型'" v-if="childDictName">
    <el-col :span="3"><el-input disabled v-model="childDictName"></el-input></el-col>
  </el-form-item>

  <!-- 习题才有难度级别 -->
  <el-form-item label="难度级别" v-if="resourceDictId === 'EXERCISES'">
    <el-rate
      v-model="resource.difficultyLevel"
      disabled
      void-color="#ccc"
      disabled-void-color="#ccc"
      :colors="['#99A9BF', '#666', '#00d487']">
    </el-rate>
  </el-form-item>

  <!-- 教案/课件/导学案之类 -->
  <!--资源描述 教案的资源描述-->
  <el-form-item label="资源描述" v-if="resource.description">
    <div v-html="resource.description" class="area-restitle"></div>
  	<!-- <el-input disabled class="res-descript" :value="resource.description"></el-input> -->
  </el-form-item>
  
  <!--资源文件-->
  <el-form-item label="资源文件" v-if="resource.sourceFileId">
  	<el-col v-if="resourceDictId==='MICRO_LESSON' || resourceDictId==='COURSE_VIDEO'" class="g-ml20">  
      <img v-if="resource.backgroundFileId" class="g-block" :src="baseUrl+'/manage/file/view/'+resource.backgroundFileId" width="150" />
      <template v-else><i class="icon i-img"></i>无指定</template>
    </el-col>

  	<el-col class="g-ml20">
  		<i class="icon" :class="{'i-video': resource.backgroundFileId, 'i-attach': !resource.backgroundFileId}"></i>
			<span class="preview-link">{{resourceName}}</span>
  	</el-col>

    <!-- 视频 -->
  	<video controls="controls" v-if="resourceDictId==='MICRO_LESSON'|| resourceDictId==='COURSE_VIDEO'" class="g-ml20">
	    <source :src="resource.sourceFile.path"></source>
	    Your browser does not support the video tag.
		</video>
  </el-form-item>
  <!-- pdf预览 试卷的先加预览 -->
  <div class="pdf-preview" id="pageContainer" v-show="resourceDictId==='TEACHING_PLAN' || resourceDictId==='LEARNING_GUIDE' || resourceDictId==='COURSEWARE' || resourceDictId ==='EXAM_PAPER'">
  </div>
  <!-- 教案/课件/导学案之类\ -->

  <!-- 习题类 -->
  <!-- 题干 -->
  <el-form-item label="题干" v-if="resourceDictId === 'EXERCISES'">
    <div v-html="resourceName" class="area-restitle"></div>
  </el-form-item>

  <!-- 单选或多选时 -->
  <el-form-item class="cont-singlesel" v-if="resource.childDictId && (childDitTemplate === 'SINGLE_CHOICE' || childDitTemplate === 'MULTIPLE_CHOICE')" v-for="(val, key) in resource.topics" :key="key">
  	<el-checkbox :value="key === resource.answers || resource.answers.indexOf(key) !== -1" disabled class="chk-lab">选项{{key}}</el-checkbox>
    <span v-html="val" class="chk-ipt"></span>
  	<!-- <el-input disabled :value="val" class="chk-ipt"></el-input> -->
  </el-form-item>

  <!-- 填空题 -->
  <template v-if="resource.childDictId && (childDitTemplate === 'FILL_IN_THE_BLANK' || childDitTemplate === 'SHORT_ANSWER')">
    <div class="cont-fillblank" v-for="(item, index) in fillOrShortList">
      <template v-for="(ans, qus) in item">
        <div class="g-mb10" v-if="resource.childDictId === 'FILL_IN_THE_BLANK'">
          <span class="chk-lab">
            【填空<i class="ff-arial">{{qus}}</i>】: 
          </span>
          <div v-html="ans" class="txt-fillblank"></div>
        </div>
        <div v-else>
          <!-- <p>简答{{index+1}}: </p> -->
          <div class="g-mb30">
            <p class="t-bold">【题目】: </p>
            <div class="g-mb10 g-ml5" v-html="qus"></div>
            <p class="t-bold">【答案】: </p>
            <div class="g-ml5" v-html="ans"></div>
          </div>
        </div>
        
      </template>
    </div>
  </template>
  <!-- 习题类\ -->

  <!-- 解析 -->
  <el-form-item label="解析" v-if="resource.analysis">
    <div v-html="analysis" class="area-restitle"></div>
  </el-form-item>
  <!-- 解析\ -->

  <!-- 视频链接 -->
  <!-- 视频链接\ -->

  <!-- 录入信息 -->
	<div class="manage-info"> <!-- v-if="resource.status==='APPROVED'||resource.status==='REJECTED'" -->
		<p v-if="resource.creatorName && resource.createTime">初始录入：{{resource.creatorName}}<span class="g-ml10">{{resource.createTime}}</span></p>
		<p v-if="resource.statusLog && resource.statusLog.auditorName && resource.statusLog.auditTime">审核录库：{{resource.statusLog.auditorName}}<span class="g-ml10">{{resource.statusLog.auditTime}}</span></p>
		<p v-if="resource.lastUpdateTime && resource.lastUpdateUser">新近更新：{{resource.lastUpdateUser.name}}<span class="g-ml10">{{resource.lastUpdateTime}}</span></p>
	</div>

  <!-- 返加列表按钮 -->
	<el-form-item v-if="resource.status==='APPROVED'||resource.status==='REJECTED'||resource.status==='CLOSED'">
	  <div class="g-tc">
	  	<a class="btn btn-green" :href="backUrl">返回列表</a>
	  </div>
	</el-form-item>
  <!-- 普通编辑页 end -->

  <!-- 资源审核操作 -->
	<!--资源审核-资源查看-status="UNAUDITED"-->
	<el-form-item label="资源审核" v-if="resource.status === 'UNAUDITED'">
    <el-col :span="21">
      <el-radio-group class="g-mt10" v-model="auditeStatus" @change="setTipsShow">
        <el-col class="g-mb10">
          <el-radio class="radio" label="APPROVED">保存入库</el-radio>
        </el-col>
        <el-col>
          <el-radio class="radio" label="REJECTED">退回修改</el-radio>
          <el-input v-if="auditeStatus === 'REJECTED'" type="textarea" class="remark g-mt5" v-model="remark"></el-input>
        </el-col>
      </el-radio-group>
    </el-col>
  </el-form-item>

  <div class="g-tc" v-if="resource.status === 'UNAUDITED'">
    <p class="t-error" v-if="showErrorTips">请填写否决原因！</p>
  	<a class="btn btn-green" @click.prevent="save">保存</a>
  </div>
  <!-- 资源审核操作\ -->
  
</el-form>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index.js'
//引入系统常量数据
import GL_CONST from '@/confdata/constant'
//集成api
import apiUrl from '@/api/url.js'
import urlConfig from '../../../../config/url.config.js'
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);

export default {
  data: function () {
  	return {
  		baseUrl: urlConfig.baseUrl,
      //资源状态
      status: '',
      //我退回的 状态日志
      statusLog: null,
      //审核时间
      auditTime: '',
      //审核人
      auditorName: '',
      //退回原因
      rejectedRemark: '',

      //报错处理 错误日志
      errorLog: null,
      //错误类型
      errorType: '',
      //补充说明
      errorLogRemark: '',
      //用户名称
      reporterName: '',
      //用户联系方式
      reporterTelephone: '',
      //报错时间：
      reportTime: '',

      //处理记录
      //处理时间
      handleTime: '',
      //处置人
      handlerName: '',
      //错误判定
      hasError: '',
      //处置方式
      handleType: '',

  		resourceId: '',
  		resourceDictId:'',
  		resourceDictName: '',
  		learnStageName:'',
  		subjectName:'',
  		gradeName:'',
  		textbookName:'',
  		resourceName:'',
  		resource:{},
  		dictList: GL_CONST.RESOURCETYPES,
  		//题型类别
  		childDictName: '',
      //题型模板
      childDitTemplate: '',
      //填空题或简答题的数据
      fillOrShortList: [],
      auditeStatus: 'APPROVED',
      //退回说明
      remark: '',
      showErrorTips: false
  	}
  },
  props: ['backUrl'],
  methods: {
  	setTipsShow: function (type) {
      if (type === 'APPROVED') {
        this.showErrorTips = false;
      }
      this.remark = '';
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
		getDetails: function(){
			var self = this,
					params = self.resourceId,
					status = self.status;

			apiUrl.getResourceDetail(params,status).then(function (res) {
				var _result = res.data,
            _resource = _result.resource,
            statusLog = _result.statusLog,
            errorLog = _result.errorLog;

				self.resource = _resource;

        //我退回的
        self.statusLog = statusLog || null;
        if (statusLog) {
          //审核时间
          self.auditTime = statusLog.auditTime;
          //审核人
          self.auditorName = statusLog.auditorName;
          //退回原因
          self.rejectedRemark = statusLog.remark;
        }
        
        //报错处理
        self.errorLog = errorLog || null;
        if (errorLog) {
          //错误类型
          self.errorType = errorLog.errorDict.name;
          //补充说明
          self.errorLogRemark = errorLog.remark;
          //用户名称
          self.reporterName = errorLog.reporter.name;
          //用户联系方式
          self.reporterTelephone = errorLog.reporter.telephone;
          //报错时间：
          self.reportTime = errorLog.reportTime;

          var handleType = {
            'UNDONE': '尚未处理',
            'NO_NEED': '无需处理',
            'UPDATE': '资源更新',
            'CLOSED': '下架'
          };
          if (errorLog.handleType !== 'UNDONE') {          
            //处理时间
            self.handleTime = errorLog.reportTime;
            //处置人
            self.handlerName = errorLog.handler.name;
            //错误判定
            self.hasError = errorLog.hasError ? '确有错误' : '核实无误';  
          }
          //处置方式
          self.handleType = handleType[errorLog.handleType];
        }

				self.resourceDictId = _resource.resourceDictId;
				self.resourceName = _resource.name;
				self.resourceDictName = self.getResourceName(_resource.resourceDictId);
				self.learnStageName = _resource.learnStage.name;
				self.gradeName = _resource.grade.name;
				self.subjectName = _resource.subject.name;
				self.textbookName = _resource.textbook ? _resource.textbook.name : '';

				//题型类别 习题才有
        if (_resource.childDictId) {
          self.childDitTemplate = _resource.childDict.template;
          self.childDictName = GL_CONST.EXESTYPESOBJ[self.childDitTemplate];
        }
  			
        //如果是填空题 或 简答题 进行数据重组
        if (_resource.childDictId && (_resource.childDictId === 'FILL_IN_THE_BLANK' || _resource.childDictId === 'SHORT_ANSWER')) {
          var curLen = 0;
          for (var i = 0, len = _resource.topics.length; i < len; i++) {
            self.fillOrShortList[curLen] = {};
            self.fillOrShortList[curLen][_resource.topics[i]] = _resource.answers[i];
            curLen++;
          }
        }

        //获取预览 课件、教案、导学案 暂时先加上试卷的
        var resourceDictId = self.resourceDictId;
        if (resourceDictId==='TEACHING_PLAN' || resourceDictId==='LEARNING_GUIDE' || resourceDictId==='COURSEWARE' || resourceDictId ==='EXAM_PAPER') {
          var DEFAULT_URL = '/manage/file/view/'+_resource.sourceFileId;
          var DEFAULT_SCALE = 1;

          var container = document.getElementById('pageContainer');

          // Fetch the PDF document from the URL using promises.
          PDFJS.getDocument(DEFAULT_URL).then(function (doc) {
            // Use a promise to fetch and render the next page.
            var promise = Promise.resolve();

            for (var i = 1; i <= doc.numPages; i++) {
              promise = promise.then(function (pageNum) {
                return doc.getPage(pageNum).then(function (pdfPage) {
                  // Create the page view.
                  var pdfPageView = new PDFJS.PDFPageView({
                    container: container,
                    id: pageNum,
                    scale: DEFAULT_SCALE,
                    defaultViewport: pdfPage.getViewport(DEFAULT_SCALE),
                    annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory(),
                    renderInteractiveForms: true,
                  });

                  // Associate the actual page with the view and draw it.
                  pdfPageView.setPdfPage(pdfPage);
                  return pdfPageView.draw();
                });
              }.bind(null, i));
            }
          });
        }
        
			}, function (res) {
			console.log('getResourceDetail err:' + res.message);
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
        var tips = self.auditeStatus === 'APPROVED' ? '已成功入库!' : '已成功退回！',
            iconCls = self.auditeStatus === 'APPROVED' ? 'icon-pop-in' : '';
        self.$myMsgBox({
          message: '<p><i class="' + iconCls + '"></i></p><p class="g-mt20">' + tips +'</p>',
          closeCallback: function () {
            window.location.href = 'auditres.html';
          },
          confirmTxt: '返回列表',
          callback: function () {
            window.location.href = 'auditres.html';
          }
        });
      }, function (res) {
        console.log('auditUpdate err:' + res.message);
      });
    },
  },
  mounted: function() {
    this.resourceId = util.getUrlParams('id');
    //状态值
    this.status = util.getUrlParams('status');
		this.$nextTick(function () {
      //获取资源详情
      this.getDetails();
  	});

	}
};
</script>
<style lang="less">
/* 我退回的 */
.res-detail .delmsg {
  padding: 10px 0;
  margin-bottom: 20px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 0 10px #ccc;
  background: #fff;
  text-align: center;
  border-radius: 20px;
  color: #f25454; 
}
/* 等待处理 */
.res-detail .aud-box, .res-detail .waithandler-box {
  background: #fff url(../../../../static/images/magnifier_green.png) no-repeat right bottom;
  border-radius: 5px;
  box-shadow: 0 0 10px #ccc;
  margin-bottom: 20px;
  min-height: 220px;
}
.res-detail .aud-box-inner, .res-detail .waithandler-box-inner {
  padding: 0 20px 40px 70px;
  margin-top: -20px;
}
.res-detail .waithandler-box {
  min-height: 140px;
  background-image: url(../../../../static/images/magnifier_pink.png);
}
.res-detail .txt-gray {
  color: #999;
}
.res-detail .handler-info {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.res-detail {
	padding-left: 50px;
  line-height: 24px;
  font-size: .7rem;
  .el-rate {
    margin-top: 10px;
  }
}
.res-detail .el-form-item__label {
	width: 80px;
	color: #232323;
	/*text-align: left;*/
}
.res-detail .el-input.is-disabled .el-input__inner,
.res-detail .el-textarea.is-disabled .el-textarea__inner {
	background-color: #f0f0f0;
  border-color: #ccc;
  color: #999;
}
.res-detail .res-descript .el-input__inner {
  text-align: left;
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
	display: block;
  margin-top: -5px;
	padding-left: 2px;
}
.val-num span {
	width: 72px;
  padding-left: 5px;
  display: inline-block;
}
.res-detail .el-slider{
	position: absolute;
	left: 88px;
	top: 15px;
	width: 310px;
}
.res-detail .chk-lab{
  display: inline-block;
	width: 80px;
  padding-right: 5px;
  font-size: .7rem;
  text-align: right;
}
.res-detail .chk-ipt{
  box-sizing: border-box;
  display: inline-block;
	width: 760px;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  line-height: 30px;
  color: #999;
}
.res-detail .chk-ipt .el-input__inner {
  text-align: left;
}
.manage-info{
	margin: 20px 0 40px;
	text-align: right;
	font-size: 14px;
	line-height: 24px;
}
.knw-point {
  display: inline-block;
  width: 116.25px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.knw-box {
  font-size: 0px;
}
/*三级知识点style*/
.sel-knwleg .select-resourelib {
  width: 118px;
}
.sel-knwleg .select-resourelib .el-input__inner {
  height: 40px;
  font-size: 14px;
}
.sel-knwleg.knw-one {
  margin-left: 80px;
}
.sel-knwleg.knw-two {
  /*margin-left: 80px;*/
}
.chk-knwleg.knw-three {
  width: 700px;
  height: 78px;
  max-height: 78px;
  margin: -85px 0 0 127px;
  border: 1px solid #ccc;
  padding: 3px 10px;
  border-radius: 5px;
  text-align: left;
  overflow-y: scroll;
  line-height: 25px;
}
.knw-two .el-select.select-resourelib.g-mt10,.knw-one .el-input.is-disabled {
  width: 116.25px;
}
.res-detail .chk-knwleg-item {
  display: inline-block;
  margin-right: 13px;
  white-space: nowrap;
  color: #999;
}
i.icon.i-check.g-mr5 {
  margin-right: 3px;
}
.i-check {
  background-position: -100px -180px;
}
.el-radio-group{
	width: 100%;
	margin-top: 40px;
}
/* 题干 */
.area-restitle {
  box-sizing: border-box;
  margin: 10px 0 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  color: #999;
  max-height: 120px;
  overflow-y: scroll;
  /*line-height: 24px;*/
}
video{
	width: 465px;
	cursor: pointer;
}
/* pdf */
.res-detail .pdf-preview {
  border: 1px solid #ccc;
  /*width: 908px;*/
  height: 600px;
  margin-left: 20px;
  overflow-y: scroll;
  background-color: #fff;
}
.res-detail .page {
  position: relative;
}
/* 简答题 */
.cont-fillblank, .cont-singlesel {
  margin-left: 80px;
  color: #999;
}
.cont-fillblank {
  line-height: 24px;
}
.txt-fillblank {
  border-bottom: 1px solid #ccc;
  display: inline-block;
  padding: 0 15px;
}
</style>
