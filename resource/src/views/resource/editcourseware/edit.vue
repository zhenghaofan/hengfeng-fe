<template>
<div>
	<el-form ref="form" action="" class="selects g-form" label-position="right" label-width="120px">
		<el-form-item class="aud-box" v-if="status === 'REJECTED'">
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
			<el-button class="source-btn" disabled>{{resource_name}}</el-button>
		</el-form-item>

		<editselects :init-data="resource" @val-changed="selectChanged"></editselects>

		<el-form-item label="二级标签" v-if="childDictList.length > 0">
			<a href="#" class="btn-childdict" v-for='(item, index) in childDictList' :class="{'active':seledDictId == item.id}" :key='item.id' @click.prevent="setChildDictId(item.id)">{{item.name}}</a>
		</el-form-item>

		<el-form-item label="资源描述">
			<el-input type="textarea" v-model="description" :rows="2"></el-input>
		</el-form-item>
		<el-form-item label="封面图片" class="cover-pic" v-if="coverLink">
			<el-upload :action="uploadFileUrl" :on-success="uploadImgSuccess" :on-error="uploadFail" :show-file-list="false" :before-upload="beforeImgUpload" :with-credentials="true">
				<img v-if="coverLink" :src="coverLink" class="imgPreview" alt="">
				<i v-else class="upload-pic"></i>
				<span class="emphasis">*点击选择本地图片文件，大小要求200kb</span>
			</el-upload>
		</el-form-item>

		<el-form-item label="资源文件">
			<div class="up-info">
				<el-col :span="12">
					<span class="source-img"></span>
					{{resource.name}}
				</el-col>
				<el-col class="col-rgt" :span="12">初始录入：
					<span>{{resource.creatorName}}</span> &nbsp;
					<span>{{resource.createTime}}</span>
				</el-col>
				<video v-if="backgroundFileId" :src="previewLink" controls="controls"></video>
				<!-- pdf预览 试卷的先加预览 -->
		    <div class="pdf-preview" id="pageContainer" v-show="resourceDictId==='TEACHING_PLAN' || resourceDictId==='LEARNING_GUIDE' || resourceDictId==='COURSEWARE' || resourceDictId ==='EXAM_PAPER'">
  			</div>
				<el-upload :action="uploadFileUrl" :on-success="uploadSuccess" :on-error="uploadFail" :with-credentials="true" :on-remove="removeFile" class="upload-btn">
					<el-button type="primary">重新上传</el-button>
					<span class="emphasis">*选择前，请对文档进行规范命名</span>
				</el-upload>
			</div>
		</el-form-item>

		<div class="block save-btn ft-av-btn">
			<div class="wrapper btn-box">
				<el-button type="success" class="chk-btn" @click.prevent="update">更新</el-button>
			</div>
		</div>
	</el-form>
</div>
</template>
<script>
import editselects from '@/components/EditSelects'
import bus from '@/components/bus.js'
import apiUrl from '@/api/url.js'
import axios from '@/api/axios.js'
import resources from '@/api/resources.js'
import util from '@/utils/index.js'
import urlConfig from '../../../../config/url.config.js'

export default {
	components: {
		editselects
	},
	data: function() {
		return {
			uploadFileUrl: urlConfig.baseUrl + '/manage/resource/upload/file',
			resource: {},
			statusLog:{},
			status:'',
			resource_name: '',
			resourceDictId: '',
			gradeId: '',
			subjectId: '', //学科ID，可选
			textbookCatalogId: '', //章节ID，可选
			knowledgePointCatalogIds: [], //知识点ID，可选
			description: '', //描述，可选
			sourceFileId: '', //视频源文件ID，可选
			backgroundFileId: '',
			previewLink: '',
			fileName: '',//上传的文件名
			coverLink: '',
			dictList: [],
			childDictList: [],
			seledDictId: ''
		};
	},
	methods: {
		getResource: function(id) {
			var self = this;
			apiUrl.getResourceDetail(id, 'my').then(function(res) {
				var data = res.data;
				self.resource = data.resource;
				self.resourceDictId = data.resource.resourceDict.id;
				self.statusLog = data.statusLog;
				self.status = data.resource.status;
				self.resource_name = data.resource.resourceDict.name;
				self.description = data.resource.description;
				self.sourceFileId = data.resource.sourceFileId;
				self.backgroundFileId = data.resource.backgroundFileId;

				//获取二级标签
				self.getTypes();

				if (self.sourceFileId) {
					self.previewLink = urlConfig.baseUrl + '/manage/file/view/' + self.sourceFileId;
					// var url = urlConfig.baseUrl + '/manage/file/view/' + self.sourceFileId;
					// var video = document.createElement('video');
					// video.src = url;
					// video.controls = "controls";
					// document.body.appendChild(video);
				}
				if (self.backgroundFileId) {
					self.coverLink = urlConfig.baseUrl + '/manage/file/view/' + self.backgroundFileId
				}

				//获取预览 课件、教案、导学案 暂时先加上试卷的
        var resourceDictId = self.resourceDictId,
        		_resource = res.data.resource;
        if (resourceDictId==='TEACHING_PLAN' || resourceDictId==='LEARNING_GUIDE' || resourceDictId==='COURSEWARE' || resourceDictId ==='EXAM_PAPER') {
        	//预览文档
          self.previewPDF(_resource.sourceFileId);
        }
			}, function(err) {

			});
		},
		//预览文档
		previewPDF: function (sourceFileId) {
      var DEFAULT_URL = '/manage/file/view/'+ sourceFileId;
      var DEFAULT_SCALE = 1;

      var container = document.getElementById('pageContainer');
      container.innerHTML = '';
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

		},
		selectChanged: function(data) {
			this.gradeId = data.gradeId;
			this.subjectId = data.subjectId;
			if (data.courseId) {
				this.textbookCatalogId = data.courseId;
			} else if (data.chapterId) {
				this.textbookCatalogId = data.chapterId;
			} else if (data.unitId) {
				this.textbookCatalogId = data.unitId;
			} else if (data.textbookId) {
				this.textbookCatalogId = data.textbookId;
			} else if (data.termId) {
				this.textbookCatalogId = data.termId;
			} else {
				this.textbookCatalogId = data.versionId;
			}
			this.knowledgePointCatalogIds = data.knwlegPointId3List;
		},
		uploadImgSuccess: function(res, file) {
			var self = this;
			if (res.resultCode == 'SUCCESS') {
				var data = res.data || {};
				self.coverLink = URL.createObjectURL(file.raw);
				self.backgroundFileId = res.data.fileId;
			} else {
				self.$message.error(res.message);
			}
		},
		//删除上传文件
		removeFile: function(file, filelist) {
			this.sourceFileId = '';
		},
		uploadSuccess: function(res, file) {
			var self = this;
			self.fileName = file.name.substring(0,file.name.lastIndexOf('.'));
			if (res.resultCode == 'SUCCESS') {
				self.sourceFileId = res.data.fileId;
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
			var self = this;
			var params = {
				id: this.resource.id, //资源ID，必须
				name: this.fileName || this.resource.name,//资源名称。可选，源文件变化时，截取源文件名称
				gradeId: this.gradeId, //所属年级ID，可选（不提供不变更，以下类同）
				subjectId: this.subjectId, //学科ID，可选
				textbookCatalogId: this.textbookCatalogId, //章节ID，可选
				knowledgePointCatalogIds: this.knowledgePointCatalogIds, //知识点ID，可选
				description: this.description, //描述，可选
				sourceFileId: this.sourceFileId, //视频源文件ID，可选
				backgroundFileId: this.backgroundFileId, //封面文件ID，可选
				childDictId: this.seledDictId
			};
			resources.updateResources(self.resource.resourceDict.id, params).then(function() {
				self.$message({
					message: '修改成功',
					type: 'success',
					showClose: true,
					onClose: function() {
						location.reload();
					}
				});
			}, function(err) {
				self.$message.error(err.message);
			})
		},
		//设置二级标签
		setChildDictId: function (id) {
			if (!id) {
				return;
			}
			if (id === this.seledDictId) {
				if (this.resource_name !== '试卷') {
				//试卷的二级必须选一个
					this.seledDictId = '';
				}
			} else {
				this.seledDictId = id;
			}
		},
		//获取资源类型及二级标签
		getTypes: function() {
			var self = this;

			apiUrl.getResourceTypes().then(function(res) {
				var data = res.data || {},
					list = data.dictList;
				if (!list.length) return;

				for (var i = 0, len = list.length; i < len; i++) {
					if (list[i].name === self.resource_name) {
						self.childDictList = list[i].childDictList;
						break;
					}
				}
				self.setChildDictId(self.resource.childDictId);
			});
		},
	},
	mounted: function() {
		var self = this;
		this.getResource(util.getUrlParams('id'));
	}
};
</script>
<style>
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
</style>
