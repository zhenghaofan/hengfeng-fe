<template>
<div>
	<el-form ref="form" action="" class="selects res-edit g-form" label-position="right" label-width="120px">
		<el-form-item class="aud-box" v-if="status === 'REJECTED'">
			<div class="aud-div">
  			<span class="leftlogo"></span>
  			<el-col :span="12"><span class="aud-name">审核时间：</span><span class="audit">{{statusLog.auditTime}}</span></el-col>
  			<el-col :span="12"><span class="aud-name">审核人：</span><span class="audit">{{statusLog.auditor.name}}</span></el-col>
	  		<el-row>
	  			<span class="aud-name">退回原因：</span> <span class="audit audit-con">{{statusLog.remark}}</span>
	  		</el-row>
			</div>
  	</el-form-item>

  	<filters @filtered="changedData" search-type="all" is-edit-page="true" :resource="resource"></filters>

  	<!-- 文档类型 -->
  	<div class="g-form" v-if="sourceFileId">
      <div class="control">
        <label class="label">资源描述：</label>
        <div class="txts">
        	<textarea class="g-form-txtarea" v-model="description"></textarea>
        </div>
      </div>
  	</div>

  	<div class="g-form" v-if="coverLink">
      <div class="control">
        <label class="label">封面图片：</label>
        <div class="txts">
        	<el-upload :action="uploadFileUrl" :on-success="uploadImgSuccess" :on-error="uploadFail" :show-file-list="false" :before-upload="beforeImgUpload" :with-credentials="true">
						<img v-if="coverLink" :src="coverLink" class="imgPreview" alt="">
						<i v-else class="upload-pic"></i>
						<span class="emphasis">*点击选择本地图片文件，大小要求2MB</span>
					</el-upload>
        </div>
      </div>
  	</div>

  	<div class="g-form" v-if="hasAuditeAuth && resource.creator && resource.creator.name">
      <div class="control">
        <label class="label">初始录入：</label>
        <div class="txts resource-file-txts">
        	<span class="g-mr10">{{resource.creator.name}}</span>{{resource.createTime}}
        </div>
      </div>
  	</div>
  	<div class="g-form" v-show="sourceFileId">
      <div class="control">
        <label class="label">资源文件：</label>
        <div class="txts resource-file-txts">
        	<div>
        		<span class="source-img"></span>
						{{name}}
					</div>

					<!-- office 文件 -->
          <div v-if="isOfficeDoc">
            <a :href="previewDocLink" target="_blank" class="btn btn-green btn-s">预览</i></a>
          </div>

					<div class="g-mb10" v-if="resource.sourceFile && (resource.sourceFile.type === 'IMAGE' || resource.sourceFile.type === 'VIDEO' || resource.sourceFile.type === 'AUDIO')">
						<img v-if="resource.sourceFile" class="g-block" :src="resource.sourceFile.path" width="150" />
						<template v-else><i class="icon i-img"></i>无指定</template>
					</div>

					<!-- pdf预览 试卷的先加预览 -->
			    <div class="pdf-preview" id="pageContainer" v-show="resourceDictId==='TEACHING_PLAN' || resourceDictId==='LEARNING_GUIDE' || resourceDictId==='COURSEWARE' || resourceDictId ==='EXAM_PAPER'">
	  			</div>

					<!-- 视频 -->
					<video class="g-mb10" controls="controls" v-if="resource.sourceFile && resource.sourceFile.type === 'VIDEO'" :poster="coverLink">
						<source :src="resource.sourceFile.path"></source>
						Your browser does not support the video tag.
					</video>

					<!-- 音频 -->
					<audio class="g-mb10" v-if="resource.sourceFile && resource.sourceFile.type === 'AUDIO'" :src="resource.sourceFile.path" controls="controls">
						Your browser does not support the audio element.
					</audio>

  				<el-upload :action="uploadFileUrl" :on-success="uploadSuccess" :on-error="uploadFail" :with-credentials="true" :on-remove="removeFile" class="upload-btn">
						<a href="#" class="btn btn-s btn-green">重新上传</a>
						<span class="emphasis">*选择前，请对文档进行规范命名</span>
					</el-upload>

        </div>
      </div>
  	</div>
  	<!-- 文档类型\ -->

  	<!-- 习题类型 -->
  	<div v-if="resourceDictId==='EXERCISES' && quesData">
  		<exercise @exerChanged="exerChanged" :source-data="quesData" :check-template="checkTemplate" @afterChecked="getCheckResult" :template="template"></exercise>
  	</div>
  	<!-- 习题类型\ -->

  	<!-- 普通编辑页 -->
  	<div class="g-mt20 g-tc" v-if="!hasAuditeAuth">
  		<a :href="backUrlChild" class="btn btn-green g-mr20">返回</a>
  		<a href="#" class="btn btn-green" @click.prevent="update">更新</a>
  	</div>

  	<!-- 资源审核操作 -->
		<!--资源审核-资源查看-status="UNAUDITED"-->
		<div class="g-form" v-if="hasAuditeAuth">
      <div class="control">
        <label class="label">资源审核：</label>
        <div class="txts">
        	<el-col>
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
        </div>
      </div>
    </div>

	  <div class="g-tc" v-if="hasAuditeAuth">
	    <p class="t-error" v-if="showErrorTips">请填写否决原因！</p>
	  	<a class="btn btn-green" @click.prevent="update">确认</a>
	  </div>
	  <!-- 资源审核操作\ -->

	</el-form>
</div>
</template>
<script>
import apiUrl from '@/api/url.js'
import util from '@/utils/index.js'
import urlConfig from '../../../../config/url.config.js'

//引入过滤器
import filters from '@/components/Filters'
//习题模板
import exercise from '@/components/Exercise/main'

//引入系统常量数据
import GL_CONST from '@/confdata/constant'

export default {
	components: {
		filters,
		exercise,
	},
	props: ['backUrl'],
	data: function() {
		return {
			uploadFileUrl: urlConfig.baseUrl + '/manage/file/upload',
			resourceId: '',
			resource: '',
			statusLog:{},
			status:'',
			resourceDictId: '',
			gradeId: '',
			subjectId: '', //学科ID，可选
			textbookCatalogId: '', //章节ID，可选
			knowledgePointCatalogIds: [], //知识点ID，可选
			description: '', //描述，可选
			sourceFileId: '', //视频源文件ID，可选
			sourceFilePath: '',//视频源文件路径
			backgroundFileId: '',
			previewLink: '',
			name: '',//上传的文件名
			coverLink: '',
			childDictId: '',
			//office文档预览地址
			previewDocLink: '',
			isOfficeDoc: false,
			auditeStatus: 'APPROVED',
      //退回说明
      remark: '',
      showErrorTips: false,
      curUserId: window.localStorage.getItem('userId'),
      hasAuditeAuth: false,
      pageStatus: '',//页面传过来的status
      checkTemplate: '',
      template: '',
      hasError: true,//是否有错
      form: {},
      quesData: '',
      backUrlChild: 'myunaudited.html',
		};
	},
	/*computed: {
		backUrlChild() {
			return this.backUrl || 'myunaudited.html';
		},
	},*/
	watch: {
		backUrl(url) {
			this.backUrlChild = url;
		},
	},
	methods: {
		exerChanged(exerObj) {
      //this.form = Object.assign({}, this.form, exerObj);
      for (var i in exerObj) {
        if (exerObj[i] || typeof(exerObj[i]) === 'boolean' && !exerObj[i]) {
          this.form[i] = exerObj[i];
        }
      }
    },
    getCheckResult(val) {
      this.hasError = !val;
      this.checkTemplate = '';

      if (!this.checkForm()) {
        return;
      }

      if (!this.hasError) {
        this.update();
      }
    },
    checkForm() {
    	return true;
    },
		changedData(info) {
			this.gradeId = info.gradeId;
			this.subjectId = info.subjectId;
			this.textbookCatalogId = info.textbookCatalogId;
			this.knowledgePointCatalogIds = info.knowledgePointCatalogIds ? info.knowledgePointCatalogIds.split(',') : '';
			this.childDictId = info.childDictId;
		},
		getResource: function(id, status) {
			var self = this;
			apiUrl.getResourceDetail(id, status).then(function(res) {
				var data = res.data,
						_resource = data.resource;
				self.resource = _resource;
				self.name = self.resource.name;
				self.resourceDictId = _resource.resourceDictId;
				self.statusLog = data.statusLog;
				self.status = _resource.status;
				self.resourceDictName = GL_CONST.RESOURCETYPESOBJ[_resource.resourceDictId];
				self.description = _resource.description || '';
				self.backgroundFileId = _resource.backgroundFileId || '';

				if (self.resource.sourceFile) {
					self.previewLink = _resource.sourceFile.path;
					self.sourceFileId = _resource.sourceFile.id || '';
				}
				if (self.backgroundFileId) {
					self.coverLink = _resource.backgroundFile.path;
				}

				self.template = _resource.template;
				self.quesData = {};
				self.quesData.difficultyLevel = _resource.difficultyLevel;
				self.quesData.name = _resource.name;
				self.quesData.videoUrl = _resource.videoUrl;
				self.quesData.topics = _resource.topics;
				self.quesData.answers = _resource.answers;
				self.quesData.analysis = _resource.analysis;
				self.quesData.children = _resource.children;

				//office文档预览
        if (_resource.sourceFile && (_resource.sourceFile.type === 'WORD' || _resource.sourceFile.type === 'PPT' || _resource.sourceFile.type === 'EXCEL')) {
          self.previewDocLink = "javascript:POBrowser.openWindow('" + _resource.sourceFile.path + "', 'width=1200px;height=800px;')";
          self.isOfficeDoc = true;
        }
        //PDF预览
        if (_resource.sourceFile && _resource.sourceFile.type === 'PDF') {
          self.previewPDF(_resource.sourceFile.path);
        }

				//资源审核
				if (self.resource.status === 'UNAUDITED' && (self.pageStatus === 'unauited' || self.pageStatus === 'rejected')) {
					self.hasAuditeAuth = true;
				}

			}, function(err) {

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
		uploadImgSuccess: function(res, file) {
			var self = this;
			if (res.resultCode == 'SUCCESS') {
				var data = res.data || {};
				self.coverLink = URL.createObjectURL(file.raw);
				self.backgroundFileId = res.data.sourceFile.id;
			} else {
				self.$message.error(res.message);
			}
		},
		//删除上传文件
		removeFile: function(file, filelist) {
			this.sourceFileId = '';
			this.name = this.resource.name;
		},
		uploadSuccess: function(res, file) {
			var self = this,
					sourceFile;
			self.name = file.name.substring(0,file.name.lastIndexOf('.'));
			if (res.resultCode == 'SUCCESS') {
				sourceFile = res.data.sourceFile;
				self.sourceFileId = sourceFile.id;
				self.sourceFilePath = sourceFile.path;
				self.previewDocLink = "POBrowser.openWindow(self.sourceFilePath, 'width=1200px;height=800px;')";
			} else {
				self.$message.error(res.message);
			}
		},
		uploadFail: function(err, file) {
			alert(JSON.parse(err))
		},
		beforeImgUpload: function(file) {
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isLt2M;
		},
		update: function() {
			var self = this,
					params = {
						/*  微课、课堂实录 */
						name: this.name,//资源名称。可选，源文件变化时，截取源文件名称
						gradeId: this.gradeId, //所属年级ID，可选（不提供不变更，以下类同）
						subjectId: this.subjectId, //学科ID，可选
						textbookCatalogId: this.textbookCatalogId, //章节ID，可选
						knowledgePointCatalogIds: this.knowledgePointCatalogIds, //数组，知识点ID，可选
						description: this.description, //描述，可选
						sourceFileId: this.sourceFileId, //视频源文件ID，可选
						backgroundFileId: this.backgroundFileId, //封面文件ID，可选
						childDictId: this.childDictId,//资源标签。可选
						/* 课件、教案、导学案、素材 */
						/* 修改试卷关联的每一道习题请调用习题编辑接口 */
					},
					postUrl = 'updateResources',//自己的资源更新
					type;

			//资源审核时
			if (this.hasAuditeAuth) {
				postUrl = 'auditResources';
				params.status = this.auditeStatus;
				params.remark = this.remark;
			}

			//暂存资源时
			if (this.pageStatus === 'temp') {
				postUrl = 'updateResources';
				type = 'temp';
			}

			//习题时
			if (self.resourceDictId === 'EXERCISES') {
				for (var i in this.form) {
					params[i] = this.form[i];
				}
			}

			apiUrl[postUrl](self.resourceId, params, type).then(function() {
				self.$alert('修改成功', '提示', {
          confirmButtonText: '返回列表',
          callback: action => {
            window.location.href = self.backUrlChild;
          }
        });
				/*self.$message({
					message: '修改成功',
					type: 'success',
					showClose: true,
					onClose: function() {
						location.reload();
					}
				});*/
			}, function(err) {
				self.$message.error(err.message);
			})
		},
		//审核
		setTipsShow: function (type) {
      if (type === 'APPROVED') {
        this.showErrorTips = false;
      }
      this.remark = '';
    },
	},
	mounted: function() {
		this.resourceId = util.getUrlParams('id');
		//状态值
    this.pageStatus = util.getUrlParams('status');
		this.getResource(this.resourceId, this.pageStatus);
	}
};
</script>
<style lang="less">
.res-edit {
	.txts {
		width: 880px;
	}
}
.selects .control {
	margin-bottom: 10px;
	font-size: .7rem;
}

.g-avai-top {
	position: relative;
}

.g-avai-filters {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	font-size: .6rem;
	color: #999;
	text-align: center;
}

.multi-import-btn {
	float: right;
}

.selects .el-row {
	margin-top: 10px;
}

.selects .el-select {
	/*min-width: 120px;
  max-width: 200px;*/
  width: 120px;
	margin-right: 10px;
}

.wrapper.btn-box {
	height: 100px;
}

.el-button.chk-btn.el-button--success {
	width: 120px;
	position: absolute;
	right: 50%;
	margin: 50px 0;
}

.sourcefile {
	padding-top: 20px;
}

.col-rgt {
	text-align: right;
}

.source-btn {
	width: 120px;
}

.source-img {
	background: url(../../../../static/images/icons.png) no-repeat -185px -35px;
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: middle;
}

.preview-link:hover {
		color: blue
}

.cover-pic label {
	line-height: 70px;
	padding: 0 12px;
}

.imgPreview {
	width: 70px;
	height: 70px;
	display: inline-block;
}
.upload-pic {
	background: url('../../../../static/images/pic.png') no-repeat center;
	background-size: 100%;
	width: 70px;
	height: 70px;
	vertical-align: middle;
	display: inline-block;
}
.emphasis {
	color: red;
	margin-left: 10px
}
.selects .editselects .label {
	margin-right: 5px;
	margin-left: 30px;
}

.el-form-item__label {
	color: #232323
}
.el-form-item.aud-box .el-form-item__content {
  border-radius: 5px;
  box-shadow: 0 0 10px #cccccc;
  margin-left: 20px!important;
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
	background: url(../../../../static/images/icons.png) no-repeat -208px -43px;
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
.up-info {
  margin-top: 30px;
}
/* pdf */
.up-info .pdf-preview {
  border: 1px solid #ccc;
  /*width: 858px;*/
  height: 600px;
  margin-bottom: 20px;
  overflow-y: scroll;
  background-color: #fff;
}
.up-info .page {
  position: relative;
}
.up-info video {
	max-width: 860px;
}
.active {
	color: #00d487;
	border-color: #00d487;
}
.btn-childdict {
  display: inline-block;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0 15px;
  margin: 0 15px 5px 0;
  border-radius: 5px;
  color: #232323;
}
/*.btn-childdict:hover, */.btn-childdict.active {
	color: #00d487;
	border-color: #00d487;
}
.resource-file-txts {
	line-height: 40px;
}
video {
	max-width: 100%;
}
</style>
