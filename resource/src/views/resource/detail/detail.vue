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
  <div class="preview-box">
    <div class="icon-blue-trang"></div>
    <!-- 类型,章节,科段信息等 -->
    <div class="resource-info">
      <div class="item">
        <label>类型：</label>
        <div class="detail">{{resourceDictName}}</div>
      </div>
      <div class="item" v-if="resource.textbook">
        <label>章节：</label>
        <div class="detail">
          {{resource.textbook.publisher}}－{{GL_CONST.TERMOBJ[resource.textbook.termDictId]}}<template v-for="(book, index) in resource.textbookCatalogs">－{{book.name}}<catalog
              v-for="catalog in book.children"
              :key="catalog.id"
              :folder="catalog">
            </catalog>
          </template>
        </div>
      </div>
      <div class="item" v-if="resource.learnStage">
        <label>科段：</label>
        <div class="detail">{{resource.learnStage.name}}－{{resource.grade.name}}－{{resource.subject.name}}</div>
      </div>
      <div class="item" v-if="resource.childDict">
        <label>题型：</label>
        <div class="detail">{{resource.childDict.name}}</div>
      </div>
      <!-- 试卷总题数 TODO -->
      <div class="g-tr" v-if="resource.resourceDictId === 'EXAM_PAPER'">
        试卷共{{resource.topics[0].examQuestionCount}}小题
      </div>
    </div>

    <!-- 题目展示 -->
    <div class="question" v-if="resource.template" v-for="(qus, queIdx) in questionList">
      <div class="item">
        <label class="tit">题目：</label>
        <div class="detail">
          <div v-html="qus.name"></div>
        
          <!-- 连线题 -->
          <div class="ligature" v-if="qus.template==='LIGATURE'">
            <ligature :check-template="'LIGATURE'" type="preview" :source-data="{topics: qus.topics, answers: qus.answers}"></ligature>
          </div>
          <!-- 填空题 -->
          <template v-else-if="qus.template==='GENERAL_GAP_FILLING'"></template>
          <!-- 完型填空题 -->
          <template v-else-if="qus.template==='CLOZE_GAP_FILLING'">
            <div class="choice" v-for="(filling, fillIdx) in qus.topics">
              {{fillIdx+1}}.
              <span class="choice-item" v-for="(value, key) in filling">
                {{key}}.{{value}}
              </span>
            </div>
          </template>
          <!-- 其他题型 -->
          <div class="choice" v-else>
            <span class="choice-item" v-for="(value, key) in qus.topics">
              {{key}}.{{value}}
            </span>
          </div>

        </div>
      </div>
      <div class="item" v-if="qus.answers!=undefined && qus.template!=='LIGATURE'">
        <label>【答案】</label>
        <div class="detail">
          <!-- 多选 -->
          <template v-if="qus.template==='MULTIPLE_CHOICE'">
            <template v-for="(ans, ansIdx) in qus.answers">
              <template v-if="ansIdx > 0">,</template>{{ans}}
            </template>
          </template>
          <!-- 填空或完型填空题 -->
          <template v-else-if="qus.template==='GENERAL_GAP_FILLING'||qus.template==='CLOZE_GAP_FILLING'">
            <span class="g-mr10" v-for="(ans, ansIdx) in qus.answers">
              {{ansIdx+1}}.{{ans}}<template v-if="ansIdx < qus.answers.length-2">,</template>
            </span>
          </template>
          <!-- 判断 -->
          <template v-else-if="qus.template==='JUDGE'">
            {{qus.answers==false?'错':'对'}}
          </template>
          <template v-else>
            {{qus.answers}}
          </template>
        </div>
      </div>
      <div class="item" v-if="qus.difficultyLevel">
        <label>【难度】</label>
        <div class="detail">{{getDifcInfo(qus.difficultyLevel)}}</div>
      </div>
      <div class="item" v-if="qus.difficultyLevel">
        <label>【星级】</label>
        <div class="detail">{{qus.difficultyLevel}}</div>
      </div>
      <div class="item" v-if="qus.knowledgePoint">
        <label>【知识点】</label>
        <div class="detail">
          <span class="knwpoint-item">{{qus.knowledgePoint.name}}</span>
          <template v-for="(knwpoint, index) in qus.knowledgePointCatalogs">
            {{knwpoint.name}}
            <knwpoint
              v-for="knwpoint in knwpoint.children"
              :key="knwpoint.id"
              :folder="knwpoint">
            </knwpoint>
          </template>
        </div>
      </div>
      <div class="item" v-if="qus.analysis">
        <label>【解析】</label>
        <div class="detail">
          <!--简答题||连线题||完型填空 -->
          <template v-if="qus.template==='ESSAY'||qus.template==='CLOZE_GAP_FILLING'"><!-- ||qus.template==='LIGATURE' -->
            <div v-for="(analysis, ansIdex) in qus.analysis">
              {{ansIdex+1}}.<div v-html="analysis"></div>
            </div>
          </template>
          <template v-else>
            <div v-html="qus.analysis"></div>
          </template>
        </div>
      </div>

      <div class="item" v-if="qus.videoUrl">
        <label>【视频链接】</label>
        <div class="detail">{{qus.videoUrl}}</div>
      </div>

    </div>

    <!-- 教案/课件/导学案之类 -->
    <div class="question" v-show="!resource.template">
      <!--资源描述 教案的资源描述-->
      <template v-if="resource.description">
        <div class="item">
          <label>资源描述：</label>
          <div class="detail">
            <div v-html="resource.description"></div>
          </div>
        </div>
      </template>

      <!--资源文件-->
      <template v-if="resource.sourceFile">
        <div class="item">
          <label>资源文件：</label>
          <div class="detail">
            <div class="g-mb10" v-if="resource.sourceFile.type === 'IMAGE' || resource.sourceFile.type === 'VIDEO' || resource.sourceFile.type === 'AUDIO'">  
              <img class="preview-img g-block" v-if="resource.sourceFile.type === 'IMAGE'" :src="resource.sourceFile.path" />
              <template v-else><i class="iconf i-image g-mr10"></i>无指定</template>
            </div>

            <div class="g-mb10">
              <i class="iconf" :class="{'i-video': resource.backgroundFileId, 'i-attach': !resource.backgroundFileId}"></i>
              <span class="preview-link">{{resourceName}}</span>
            </div>
            
            <!-- office 文件 -->
            <div class="g-mb10" v-if="isOfficeDoc">
              <a :href="previewDocLink" target="_blank" class="btn btn-green btn-s">预览</i></a>
            </div>

            <!-- 视频 -->
            <video class="g-mb10" controls="controls" v-if="resource.sourceFile.type === 'VIDEO'">
              <source :src="resource.sourceFile.path"></source>
              Your browser does not support the video tag.
            </video>

            <!-- 音频 -->
            <audio class="g-mb10" v-if="resource.sourceFileId.type === 'AUDIO'" :src="resource.sourceFile.path" controls="controls">
              Your browser does not support the audio element.
            </audio>

          </div>
        </div>
      </template>

      <!-- pdf预览 试卷的先加预览 -->
      <div class="pdf-preview" id="pageContainer" v-show="resourceDictId==='TEACHING_PLAN' || resourceDictId==='LEARNING_GUIDE' || resourceDictId==='COURSEWARE' || resourceDictId ==='EXAM_PAPER'">

      </div>

    </div>
    <!-- 教案/课件/导学案之类\ -->
  </div>

  <!-- 录入信息 -->
	<div class="manage-info"> <!-- v-if="resource.status==='APPROVED'||resource.status==='REJECTED'" -->
		<p v-if="resource.creatorName && resource.createTime">初始录入：{{resource.creatorName}}<span class="g-ml10">{{resource.createTime}}</span></p>
		<p v-if="resource.statusLog && resource.statusLog.auditorName && resource.statusLog.auditTime">审核录库：{{resource.statusLog.auditorName}}<span class="g-ml10">{{resource.statusLog.auditTime}}</span></p>
		<p v-if="resource.lastUpdateTime && resource.lastUpdateUser">新近更新：{{resource.lastUpdateUser.name}}<span class="g-ml10">{{resource.lastUpdateTime}}</span></p>
	</div>

  <!-- 返加列表按钮 -->
	<div class="g-tc">
    <a class="btn btn-green" :href="backUrl">返回列表</a>
  </div>
  
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

//连线题
import ligature from '@/components/Exercise/ligature'

//章节目录
Vue.component('catalog', {
  props: ['folder'],
  template: '<span><span>－{{ folder.name }}</span><catalog-contents :children="folder.children"/></span>'
  });
Vue.component('catalog-contents', {
  props: ['children'],
  template: '<span><span v-for="child in children"><catalog v-if="child.children" :folder="child"/><span v-else>－{{ child.name }}</span></span></span>'
});

//知识点层级
Vue.component('knwpoint', {
  props: ['folder'],
  template: '<span><span class="knwpoint-item">{{ folder.name }}</span><catalog-contents :children="folder.children"/></span>'
  });
Vue.component('knwpoint-contents', {
  props: ['children'],
  template: '<span><span v-for="child in children"><knwpoint v-if="child.children" :folder="child"/><span class="knwpoint-item" v-else>{{ child.name }}</span></span></span>'
});

export default {
  data: function () {
  	return {
  		baseUrl: urlConfig.baseUrl,
      GL_CONST: GL_CONST,
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
      termDictName: '',
  		resourceName:'',
  		resource:{},
  		dictList: GL_CONST.RESOURCETYPES,
  		//题型类别
  		childDictName: '',
      //题型模板
      childDitTemplate: '',
      //填空题或简答题的数据
      fillOrShortList: [],
      questionList: [],
      //office文档预览地址
      previewDocLink: '',
      isOfficeDoc: false,
  	}
  },
  props: ['backUrl'],
  components: {
    ligature,
  },
  methods: {
  	setTipsShow: function (type) {
      if (type === 'APPROVED') {
        this.showErrorTips = false;
      }
      this.remark = '';
    },
    //难度描述
    getDifcInfo(level) {
      return GL_CONST.EXESDIFCINFO[level];
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
        self.resourceDictName = GL_CONST.RESOURCETYPESOBJ[_resource.resourceDictId];
        self.resourceName = _resource.name;

        self.questionList = [];
        //综合题
        if (_resource.children) {
          self.questionList = _resource.children;
        } else {
        //单个题
          self.questionList.push(_resource);
        }
        //章节
        if (_resource.textbook) {
          self.textbookName = _resource.textbook.name;
          self.termDictName = GL_CONST.TERMOBJ[_resource.textbook.termDictId];
        }
				
				//题型类别 习题才有
        if (_resource.childDictId) {
          self.childDitTemplate = _resource.template;
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

        //office文档预览
        if (_resource.sourceFile && (_resource.sourceFile.type === 'WORD' || _resource.sourceFile.type === 'PPT' || _resource.sourceFile.type === 'EXCEL')) {
          self.previewDocLink = "javascript:POBrowser.openWindow('" + _resource.sourceFile.path + "', 'width=1200px;height=800px;')";
          self.isOfficeDoc = true;
        }

        //PDF预览
        if (_resource.sourceFile && _resource.sourceFile.type === 'PDF') {
          self.previewPDF(_resource.sourceFile.path);
        }
        
			}, function (res) {
			console.log('getResourceDetail err:' + res.message);
			});
		},
    //预览文档
    previewPDF: function (path) {
      var DEFAULT_SCALE = 1;

      var container = document.getElementById('pageContainer');
      container.innerHTML = '';
      // Fetch the PDF document from the URL using promises.
      PDFJS.getDocument(path).then(function (doc) {
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
.preview-box {
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  /*width: 920px;*/
  padding: 20px 70px;
  border-radius: 5px;
  font-size: .7rem;
  .icon-blue-trang {
    position: absolute;
    left: -3px;
    top: -3px;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: #a5cdff;
    transform: rotateZ(135deg);
  }
  .resource-info {
    box-sizing: border-box;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    line-height: 20px;
    .item {
      box-sizing: border-box;
      display: inline-block;
      width: 49%;
      padding: 0 20px 0 30px;
      margin-bottom: 10px;
      vertical-align: top;
      label {
        display: inline-block;
        color: #999;
        vertical-align: top;
      }
      .detail {
        display: inline-block;
        width: 80%;
      }
    }
  }
  .question {
    box-sizing: border-box;
    padding: 5px 0 10px 25px;
    border-bottom: 1px dashed #e5e5e5;
    margin-bottom: 10px;
    .item {
      display: flex;
      margin-bottom: 8px;
      label {
        box-sizing: border-box;
        min-width: 90px;
        color: #999;
      }
    }
    .tit {
      padding-left: 8px;    
    }
    .choice {
      .choice-item {
        display: inline-block;
        margin-right: 40px;
      }
    }
    .ligature {
      .ligature-item {
        display: inline-block;
        width: 200px;
        vertical-align: top;
      }
    }
    .iconf {
      color: #00d487;
      font-size: .7rem;
    }
    .i-attach {
      margin-top: -6px;
    }
  }
  .question:last-child {
    border-bottom: none;
  }
}
  

.res-detail {
  padding-left: 20px;
  line-height: 24px;
  /*font-size: 14px;*/
  .el-rate {
    margin-top: 10px;
  }
}





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
	width: 600px;
	cursor: pointer;
}
/* pdf */
.res-detail .pdf-preview {
  border: 1px solid #ccc;
  /*width: 908px;*/
  height: 600px;
  /*margin-left: 20px;*/
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
.preview-img {
  max-width: 700px;
  max-height: 300px;
}
</style>
