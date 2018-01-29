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
        	<textarea class="g-form-txtarea" v-model="description" maxlength="500"></textarea>
        </div>
      </div>
  	</div>

    <!-- 微课、课堂实录封面才有 -->
  	<div class="g-form" v-if="coverLink && (resourceDictId === 'MICRO_LESSON' || resourceDictId === 'COURSE_VIDEO')">
      <div class="control">
        <label class="label">封面图片：</label>
        <div class="txts">
        	<el-upload :action="uploadFileUrl" :on-success="uploadImgSuccess" :on-error="uploadFail" :accept="acceptImageTypes" :show-file-list="false" :before-upload="beforeImgUpload" :with-credentials="true">
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

  	<!-- 封面图 -->
  	<!-- <div class="g-form" v-if="backgroundFile">
  		<div class="control">
        <label class="label">封面</label>
        <div class="txts">
        	<div class="cover_area" @click="selectCover(backgroundFile.id)">
		        <img :src="backgroundFile.path" alt="" />
		        <i v-if="!defaultChecked" class="iconf i-tick"></i>
		      </div>
		      <div class="cover_area" @click="selectCover(false)">
		        <img v-if="resourceDictId === 'MICRO_LESSON'" src="../../../../static/images/cover_microclass.jpg" alt="">
		        <img v-if="resourceDictId === 'COURSE_VIDEO'" src="../../../../static/images/cover_coursevideo.jpg" alt="">
		        <i v-if="defaultChecked" class="iconf i-tick"></i>
		      </div>
        </div>
      </div>
    </div> -->

  	<div class="g-form" v-show="sourceFileId || resourceDictId === 'EXAM_PAPER'">
      <div class="control">
        <label class="label">资源文件：</label>
        <div class="txts resource-file-txts">
        	<div class="g-clearfix">
        		<span class="source-img"></span>
						{{name}}
						<!-- pdf预览 -->
          	<a v-if="officeViewLink" :href="officeViewLink" target="_blank" class="btn btn-s btn-green f-r">预览</a>
					</div>

					<div v-if="resourceDictId === 'EXAM_PAPER'">
						<examdetail :resource="resource" :status="pageStatus" :resource_id="resourceId" :justpreview="true"></examdetail>
					</div>

					<div class="g-mb10" v-if="resource.sourceFile && resource.sourceFile.type === 'IMAGE'">
						<img v-if="resource.sourceFile" class="g-block" :src="sourceFilePath" width="150" />
						<template v-else><i class="icon i-img"></i>无指定</template>
					</div>

					<!-- 视频 -->
					<video class="g-mb10" controls="controls" v-if="resource.sourceFile && resource.sourceFile.type === 'VIDEO'" :src="sourceFilePath">
						<!-- <source :src="sourceFilePath"></source> -->
						Your browser does not support the video tag.
					</video>

					<!-- 音频 -->
					<audio class="g-mb10" v-if="resource.sourceFile && resource.sourceFile.type === 'AUDIO'" :src="sourceFilePath" controls="controls">
						Your browser does not support the audio element.
					</audio>

  				<el-upload v-if="resourceDictId !== 'EXAM_PAPER'" :action="uploadFileUrl" :on-success="uploadSuccess" :accept="acceptTypes" :on-error="uploadFail" :with-credentials="true" :on-progress="uploading" :before-remove="beforeRemove" :before-upload="beforeUploadCheck" :on-remove="removeFile" class="upload-btn" ref="uploadResource">
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
			          <el-input v-if="auditeStatus === 'REJECTED'" type="textarea" class="txtarea-remark g-mt5" :maxlength=128 v-model="remark"></el-input>
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

	<div class="totext g-hidden"></div>
</div>
</template>
<script>
import apiUrl from '@/api/url.js'
import utils from '@/utils/index.js'
import urlConfig from '../../../../config/url.config.js'

//引入过滤器
import filters from '@/components/Filters'
//习题模板
import exercise from '@/components/Exercise/main'
import examdetail from '@/components/examdetail'
//引入系统常量数据
import GL_CONST from '@/confdata/constant'

export default {
	components: {
		filters,
		exercise,
    examdetail
	},
	props: ['backUrl'],
	data: function() {
		return {
			uploadFileUrl: urlConfig.baseUrl + '/manage/file/upload',
			resourceId: '',
			resource: {},
			statusLog:{},
			status:'',
			resourceDictId: '',
			gradeId: '',
			subjectId: '', //学科ID，可选
			textbookCatalogId: '', //章节ID，可选
			knowledgePointCatalogIds: [], //知识点ID，可选
			description: '', //描述，可选
			name: '',//上传的文件名
			childDictId: '',
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
      //可接受的图片上传格式
      acceptImageTypes: GL_CONST.MEDIATYPES.acceptImageTypes,
      acceptTypes: '',
      resourceDictIndex: '',
      //PDF预览地址
      officeViewLink: '',
      isUploaded: false,
      isBeforeUploadError: false,
      sourceFileTemp: '',
      officeViewLinkTemp: '',
      sourceFileTemp: '',
      sourceFileId: '', //视频源文件ID，可选
			sourceFilePath: '',//视频源文件路径
			backgroundFile: '',
			backgroundFileTemp: '',
			coverLink: '',
			//默认封面
			defaultChecked: false,
			//正在上传
			isUploading: false,
		};
	},
	watch: {
		backUrl(url) {
      //如果是从编辑试卷过来的子题目
      //id为子题目id resource_id为试卷的id
      var childId = utils.getUrlParams('id'),
          resourceId = utils.getUrlParams('resource_id');

      if (resourceId) {
        this.backUrlChild = '/views/resource/editres.html?status=' + this.pageStatus + '&id=' + resourceId;
      } else {
        this.backUrlChild = url;
      }	
		},
		resourceDictIndex() {
			this.acceptTypes = this.getAcceptTypes();
		},
	},
	methods: {
		//设置微课、课堂实录封面
		selectCover(backgroundId) {
      if (backgroundId) {
        this.defaultChecked = true;
      } else {
        this.defaultChecked = false;
      }
      this.backgroundFileId = backgroundId;
    },
		//上传文件可用类型
		getAcceptTypes() {
			var _type = this.resourceDictIndex,
					MEDIATYPES = GL_CONST.MEDIATYPES;
			//教案，课件，导学案
      if (_type == 0 || _type == 1 || _type == 2) {
        return MEDIATYPES.acceptDocTypes;
      } else if (_type == 3 || _type == 4) {
    	//微课，课堂实录
        return MEDIATYPES.acceptVideoTypes;
      } else if (_type == 7) {
      //素材
        return Object.values(MEDIATYPES).join();
        // return '*';
      } else {
        return MEDIATYPES.acceptExamTypes
      }
		},
		exerChanged(exerObj) {
      //this.form = Object.assign({}, this.form, exerObj);
      for (var i in exerObj) {
        if (exerObj[i] || typeof(exerObj[i]) === 'boolean' && !exerObj[i]) {
          this.form[i] = exerObj[i];
          this.quesData[i] = exerObj[i];
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
    //过滤html空格
    trimHTMLSpace(str) {
    	var domElem = document.querySelector('.totext');
    	domElem.innerHTML = str;
    	str = domElem.innerText;
      if (typeof(str) === 'string') {
        return str.replace(/\s+/ig,'');
      }
      return str;
    },
    //过滤空格
    checkTrim(arrs) {
      return typeof(arrs) === 'object' && arrs === null || typeof(arrs) === 'object' && Object.values(arrs).filter((item) => {return this.trimHTMLSpace(item) === ''}).length !== 0 || Array.isArray(arrs) && arrs.filter((item) => {return this.trimHTMLSpace(item) === ''}).length !== 0 || this.trimHTMLSpace(arrs) === '' || Array.isArray(arrs) && arrs.length === 0
    },
    //表单校验
    checkForm() {
      //TODO
      //章节或知识点
      if (this.knowledgePointCatalogIds.length < 1 && !this.textbookCatalogId) {
        this.$message.error('章节或知识点至少要选择一个!');
        return false;
      }

      //习题的校验
      if (this.resourceDictId === 'EXERCISES') {
        //难度级别
        if (!this.form.difficultyLevel) {
          this.$message.error('请设置当前问题的难度级别!');
          return false;
        }

        //题干
        if (!this.trimHTMLSpace(this.form.name)) {
          this.$message.error('题干不能为空!');
          return false;
        }

        if (this.template !== 'SYNTHESIS') {
          if (this.template !== 'JUDGE') {
            if(this.checkTrim(this.form.topics)) {
              this.$message.error('请完善题目信息')
              return false
            }
          }
          if (this.checkTrim(this.form.answers)) {
            this.$message.error('答案不能为空！')
            return false;
          }
        } else {
          if (this.form.children.filter((item) => {return this.trimHTMLSpace(item.name) === ''}).length !== 0 ) {
            this.$message.error('子题目标题不能为空！')
            return false;
          }
          if (this.form.children.filter((item) => {if(item.template !== 'JUDGE') {return this.checkTrim(item.topics)}}).length !== 0 ) {
            this.$message.error('子题目信息不能为空！')
            return false;
          }
          if (this.form.children.filter((item) => {return this.checkTrim(item.answers)}).length !== 0 ) {
            this.$message.error('子题目答案不能为空！')
            return false;
          }
        }
      }

      return true;
    },
		changedData(info) {
			this.gradeId = info.gradeId;
			this.subjectId = info.subjectId;
			this.textbookCatalogId = info.textbookCatalogId;
			this.knowledgePointCatalogIds = info.knowledgePointCatalogIds ? info.knowledgePointCatalogIds.split(',') : '';
			this.childDictId = info.childDictId;
			this.resourceDictIndex = info.resourceDictIndex;
		},
		getResource: function(id, status) {
			var self = this;

			apiUrl.getResourceDetail(id, status).then(function(res) {
				var data = res.data,
						_resource = data.resource;
				self.resourceDictId = _resource.resourceDictId;
				self.resource = _resource;

				self.name = self.resource.name;
				self.statusLog = data.statusLog;
				self.status = _resource.status;
				self.resourceDictName = GL_CONST.RESOURCETYPESOBJ[_resource.resourceDictId];
				self.description = _resource.description || '';

				if (_resource.sourceFile) {
					self.sourceFileTemp = _resource.sourceFile;
					self.sourceFilePath = _resource.sourceFile.path;
					self.sourceFileId = _resource.sourceFile.id || '';
				}
				if (_resource.backgroundFile) {
					self.backgroundFile = utils.cloneObj(_resource.backgroundFile) || '';
					self.backgroundFileTemp = _resource.backgroundFile;
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

        //PDF预览
        var path;
        //office转成的pdf文件
        if (_resource.officeViewSourceFile && _resource.officeViewSourceFile.type === 'PDF') {
        	path = _resource.officeViewSourceFile.path;
          self.officeViewLink = 'pdfview.html?file=' + encodeURIComponent(path);
        }
        //本身是pdf的文件
        if (_resource.sourceFile && _resource.sourceFile.type === 'PDF') {
        	path = _resource.sourceFile.path;
          self.officeViewLink = 'pdfview.html?file=' + encodeURIComponent(path);
        }
        self.officeViewLinkTemp = self.officeViewLink;

				//资源审核
				if (self.resource.status === 'UNAUDITED' && (self.pageStatus === 'unauited' || self.pageStatus === 'rejected')) {
					self.hasAuditeAuth = true;
				}

			}, function(err) {

			});
		},
		//图片上传成功
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
		uploading(e, file, fileList) {
      if (e.percent < 100) {
        this.isUploading = true;
      } else {
        this.isUploading = false;
      }
    },
    beforeRemove() {
      if(this.isUploading) return false;
    },
		//删除上传文件
		removeFile: function(file, filelist) {
			//上传检查类型不匹配时，不做任何操作
			if (this.isBeforeUploadError) {
				this.isBeforeUploadError = false;
				return;
			}

			//this.sourceFileId = '';
			this.name = this.resource.name;

			//pdf文件预览地址
			this.officeViewLink = this.officeViewLinkTemp;

			if (this.sourceFileTemp) {
				//源文件id
				this.sourceFileId = this.sourceFileTemp.id;
				this.sourceFilePath = this.sourceFileTemp.path;
			}

			if (this.backgroundFileTemp) {
				//背景图id
				this.backgroundFileId = this.backgroundFileTemp.id;
				//封面图地址
				this.coverLink = this.backgroundFileTemp.path;
			}

			this.isUploaded = false;
		},
		// 文件上传
    checkType: function (arr, filetype) {
      if (arr.indexOf(filetype) != -1) {
        return true;
      } else {
        this.$message.error('暂时不支持该类型的文件');
        return false;
      }
    },
    beforeUploadCheck: function (file) {
      var _type = file.type;
        // console.log(file.type);
      if (!_type || this.acceptTypes.indexOf(_type) == -1) {
        this.$message.error('暂时不支持该类型的文件');
        this.isBeforeUploadError = true;
        return false;
      }
      if (this.isUploaded) {
        this.$message.error('只能上传一个文件，若要重新上传，请先删除已经上传的');
        this.isBeforeUploadError = true;
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        this.$message.error('文件过大，请重新上传');
        this.isBeforeUploadError = true;
        return false;
      }
      return true;
    },
    //上传成功
		uploadSuccess: function(res, file) {
			var self = this,
					_result,
					backgroundFile,
					sourceFile,
					officeViewSourceFile;

			self.name = file.name.substring(0,file.name.lastIndexOf('.'));

			if (res.resultCode == 'SUCCESS') {
				_result = res.data;

				//有背景图
				backgroundFile = _result.backgroundFile;
			  if(backgroundFile) {
          self.coverLink = backgroundFile.path;
          self.backgroundFileId = backgroundFile.id;
				}

				//有源文件
				sourceFile = _result.sourceFile;
				if (sourceFile) {
					self.sourceFileId = sourceFile.id;
					self.sourceFilePath = sourceFile.path;
					if (sourceFile.type === 'PDF') {
						self.officeViewLink = 'pdfview.html?file=' + encodeURIComponent(self.sourceFilePath);
					}
				}

				//有office文件
				officeViewSourceFile = _result.officeViewSourceFile;
				if (officeViewSourceFile) {
					if (officeViewSourceFile.type === 'PDF') {
						self.officeViewLink = 'pdfview.html?file=' + encodeURIComponent(officeViewSourceFile.path);
					}
				}

				self.isUploaded = true;

			} else {
				//删除文件
				self.$refs.uploadResource.clearFiles();
				self.name = self.resource.name;
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

			if (!this.checkForm()) {
        return;
      }

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
				self.$alert('成功', '提示', {
          confirmButtonText: '返回',
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
		this.resourceId = utils.getUrlParams('id');
		//状态值
    this.pageStatus = utils.getUrlParams('status');
		this.$nextTick(() => {
			this.getResource(this.resourceId, this.pageStatus);
		})
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
	width: 100px;
	height: 100px;
	border-radius: 8px;
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
	background: url(../../../../static/images/magnifier_green.png) no-repeat 660px 10px;
	margin-bottom: 10px;
	padding: 10px 0;
  min-height: 200px;
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
.txtarea-remark {
	width: 880px;
	min-height: 100px!important;
	textarea {
		width: 880px;
		min-height: 100px!important;
	}
}

.res-edit {
	.cover_area {
	  position: relative;
	  display: inline-block;
	  cursor: pointer;
	}
	.cover_area img {
		margin-right: 10px;
	  width: 120px;
	  height: 120px;
	  border-radius: 8px;
	}
	.i-tick {
	  color: white;
	  background: #00d487;
	  border-radius: 20px;
	  border: 1px solid white;
	  font-size: 12px;
	  padding: 4px;
	  position: absolute;
	  bottom: 8px;
	  right: 15px;
	}
}
</style>
