<template>
<div>
  <el-form ref="form" :model="form" action="" label-position="right" label-width="120px" class="selects" v-show="!previewing && !previewingExam && !previewingExer">
    <uploadfilter is-upload-page="true" search-type="all" @filtered="filterChange"></uploadfilter>

    <div class="col" v-if="type == 5 && multiExers || type != 5">
      <el-button v-if="type == 5 && multiExers" class="batchUploadExer" type="primary" size="small" @click="toggleMultiExers">上传单道习题</el-button>

      <div class="control" v-if="type != 5">
        <label class="label g-vertop">选择文件：</label>
        <el-upload :action="uploadFileUrl" :on-success="uploadSuccess" :on-error="uploadFail" :with-credentials="true" :data="checkRepeat" :before-upload="beforeUploadCheck" :accept="acceptTypes" :on-remove="removeFile" :file-list="fileList" :multiple="isMultiple"
          :on-change="uploadFileChange" ref="uploadResource" class="upload-area">
          <!-- <el-button slot="trigger" class="upload-select">选择前，请对文档进行规范命名，支持{{upload_text}}文件</el-button>
        <el-button style="margin-left: 10px;" type="primary" :disabled="uploadButtonDisabled" @click="uploadFile">上传</el-button> -->
          <a href="#" class="upload-btn">上传</a>
          <div slot="tip" class="el-upload__tip">*选择前，请对文件进行规范命名，支持{{upload_text}}文件<a href="/static/filedemo/demo.zip" class="download" v-if="type == 6">下载模板</a></div>
        </el-upload>
      </div>

      <div class="control" v-else>
        <el-form :action="uploadFileUrl" id="batchForm" method="post" label-position="right" label-width="120px" class="selects" enctype="multipart/form-data">
          <label class="label g-vertop">选择文件：</label>
          <input type="hidden" name="gradeId" :value="form.gradeId">
          <input type="hidden" name="subjectId" :value="form.subjectId">
          <input type="hidden" name="textbookCatalogId" :value="form.textbookCatalogId">
          <input type="hidden" name="knowledgePointCatalogIds" :value="form.knowledgePointCatalogIds">
          <input type="file" name="files" value="" style="margin-left: 10px;" @change="formFileChange" :accept="acceptTypes" multiple>

          <a href="/static/filedemo/demo.zip" class="download">下载模板</a>
      </el-form>
    </div>
</div>

<!-- 教案、课件、导学案类型 -->
<div class="panel" v-if="type == 0 || type == 1 || type == 2 ">
  <textpreview :datas="datas" @previewHandle="previewFile" @deleteHandle="deleteHandle" @desChanged="desChanged"></textpreview>
</div>
<!-- 教案、课件、导学案类型/ -->

<!-- 微课、课堂实录类型 -->
<div class="panel" v-if="type == 3 || type == 4">
  <videopreview :datas="datas" @deleteHandle="deleteHandle" @desChanged="desChanged" @coverchanged="coverChanged"></videopreview>
</div>
<!-- 微课、课堂实录类型/ -->

<div class="panel" v-show="type == 5 && !multiExers">
  <el-button class="batchUploadExer" type="primary" size="small" @click="toggleMultiExers">批量上传习题文档</el-button>
  <exercise @exerChanged="exerChanged" :check-template="checkTemplate" @afterChecked="getCheckResult" :source-data="sourceData" :template="template"></exercise>
</div>

<!-- <div class="panel" v-show="type == 6 || (type == 5 && multiExers)"> -->
<div class="panel" v-show="type == 6">
  <exampreview :datas="datas" @deleteHandle="deleteHandle" @uploadHandle="saveResources" :previewDocLink="previewDocLink" :isUploaded="isUploaded"></exampreview>
</div>

<div class="g-tc g-mt20" v-show="(type == 5 && multiExers)">
  <a href="#" class="btn btn-green" @click.prevent="beforeSubmit" :class="{'btn-disabled': isSaveing}">{{txtSave}}</a>
</div>

<div class="g-tc g-mt20" v-show="(type == 5 && !multiExers) || (type != 5 && type != 6)">
<!-- <div class="g-tc g-mt20" v-show="(type == 5 && !multiExers) || (type != 5)"> -->
  <a v-if="type == 5 " href="#" class="btn btn-green" @click.prevent="togglePreviewingExer">预览</a>

  <a href="#" class="btn btn-green" @click.prevent="beforeSubmit" :class="{'btn-disabled': isSaveing}">{{txtSave}}</a>
</div>
</el-form>

<div class="g-tc" v-show="previewing">
  <div class="pdf-preview" id="pageContainer">
  </div>
  <a href="#" class="btn btn-green g-mt20" @click="togglePreviewing">返回</a>
</div>

<div v-show="previewingExam">
  <examdetail :resource="resource" @back="togglePreviewingExam" @beforeSubmit="examSubmit"></examdetail>
</div>
<div v-show="previewingExer">
  <exerdetail :qus="exerObj" :previewingExer="previewingExer" @back="togglePreviewingExer" @beforeSubmit="beforeSubmit"></exerdetail>
</div>
</div>
</template>
<script>
import apiUrl from '@/api/url.js'
import urlConfig from '../../../../config/url.config.js'
import uploads from '@/api/resources.js'
import axios from '@/api/axios'
import util from '@/utils/index.js'
import uploadfilter from '@/components/Filters'
import examdetail from '@/components/examdetail'
import exerdetail from '@/components/exerdetail'
import textpreview from './text/text'
import videopreview from './video/video'
import exampreview from './exam/exam'
import types from './types'
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'
import editor from '@/components/umeditor/Editor'
import exercise from '@/components/Exercise/main'

Vue.use(MyMsgBox)

export default {
  components: {
    uploadfilter,
    textpreview,
    videopreview,
    exampreview,
    editor,
    exercise,
    examdetail,
    exerdetail
  },
  data: function () {
    return {
      sourceData: {
        // //难度星级
        // difficultyLevel: 5,
        // //题干
        // name: '来个测试',
        // //视频链接
        // videoUrl: 'http://baidu.com/',

        // "children": [ //子集
        //   {
        //     "id": "6dkfkdsfj",
        //     "name": "中国属于亚洲？",
        //     "template": "JUDGE",
        //     "answers": true,
        //     "analysis": "中国都知道"
        //   },
        // {
        //   "id": "6dkfkdsdfhdsfd",
        //   "name": "多选题",
        //   "topics": {
        //     "A": "1",
        //     "B": "2",
        //     "C": "3",
        //     "D": "4"
        //   },
        //   "template": "MULTIPLE_CHOICE",
        //   "answers": ["A", "B"],
        //   "analysis": "比3小的数很多，不知道去复习。"
        // }
        // ],
        // "analysis": "",
      },
      datas: [],
      videos: [],
      exams: [],
      previewing: false,
      resource: {}, //预览试卷详情
      previewingExam: false,
      exercise: {},
      previewingExer: false,
      isSaveing: false,
      txtSave: '提交',
      uploadFileUrl: urlConfig.baseUrl + '/manage/resource/import/exercises',
      multiExers: true,
      type: 5,
      attr: '',
      fileList: [],
      isUploaded: false,
      file: '',
      template: '',
      exerObj: {},
      form: {
        "childDictId": '', //资源标签ID
        "subjectId": "", //科目ID，必须
        "gradeId": "", //年级ID，必须
        "knowledgePointCatalogIds": [], //知识点目录：节（课）ID
        "textbookCatalogId": "", //课本目录知识点ID（三级）；
        'name': '', //试卷时
        'sourceFileId': '', //试卷时
        "names": [], //上传资源名称，必须
        "sourceFileIds": [], //上传源文件ID，必须
        "backgroundFileIds": [], //封面ID
        "descriptions": [], //可选
      },
      checkTemplate: '',
      hasError: false, //是否有错
      // uploadButtonDisabled: true
      previewDocLink: ''
    };
  },

  computed: {
    acceptTypes() {
      let _type = this.type;
      if (_type == 0 || _type == 1 || _type == 2) {
        return types.acceptDocTypes;
      } else if (_type == 3 || _type == 4) {
        return types.acceptVideoTypes;
      } else if (_type == 7) {
        return Object.values(types).join();
        // return '*';
      } else {
        return types.acceptExamTypes
      }
    },
    checkRepeat() {
      if (this.type == 3 || this.type == 4) {
        return {
          check: true
        }
      } else {
        return {
          check: false
        }
      }
    },
    isMultiple() {
      if (this.type == 6) {
        return false;
      } else {
        return true;
      }
    },
    upload_text() {
      if (this.type == 6) {
        return '上传单个';
      } else {
        return '一次上传单个或多个'
      }
    }
  },

  watch: {
    type() {
      if (this.type != 5) {
        this.multiExers = false;
      } else {
        this.multiExers = true;
      }
      this.isUploaded = false;
      this.form.names = [];
      this.form.sourceFileIds = [];
      this.form.backgroundFileIds = [];
      this.form.descriptions = [];
      this.fileList = [];
      this.datas = [];
      this.exerObj = {};
    },
    multiExers(val) {
      if (val) {
        this.uploadFileUrl = urlConfig.baseUrl + '/manage/resource/import/exercises'
      } else {
        this.uploadFileUrl = urlConfig.baseUrl + '/manage/file/upload'
      }
    }
  },

  methods: {
    togglePreviewingExam() {
      this.previewingExam = false;
    },
    togglePreviewingExer() {
      this.previewingExer = !this.previewingExer;
    },
    examSubmit() {
      this.$myMsgBox({
        message: '<p><i class="icon-pop-succ"></i></p>\
        <p class="g-mt20">已递交审核！</p>',
        confirmTxt: '待核资源',
        hasCancelBtn: true,
        cancelTxt: '继续上传',
        callback: function () {
          //去正在候审页
          window.location.href = 'myunaudited.html';
        },
        //关闭位置的操作
        closeCallback: function () {
          //重新加载当前页
          window.location.reload();
        },
        //取消位置的操作
        cancelCallback: function () {
          //重新加载当前页
          window.location.reload();
        }
      });
    },
    toggleMultiExers() {
      this.multiExers = !this.multiExers
    },
    exerChanged(exerObj) {
      // if (this.template == 'SYNTHESIS') {
      //
      // }
      this.exerObj = Object.assign({}, this.exerObj, exerObj);
      // for (var key in exerObj) {
      //   Vue.set(this.exerObj, key, exerObj[key])
      // }
      this.exerObj.template = this.template;
      console.log(this.exerObj);
      for (var i in exerObj) {
        if (exerObj[i] || typeof (exerObj[i]) === 'boolean' && !exerObj[i]) {
          this.form[i] = exerObj[i];
        }
      }
    },
    formFileChange() {
      this.isUploaded = true;
    },
    beforeSubmit() {
      //其他模型,走老规则
      if (this.type != 5) {
        this.hasError = false;
        this.saveResources();
        return;
      }

      if (this.type == 5 && this.multiExers) { //批量上传习题
        let self = this;
        var formData = new FormData(document.getElementById('batchForm'));
        if (!this.isUploaded) {
          this.$message.error('请先上传文件！')
          return;
        }
        axios.postFormData(this.uploadFileUrl, formData).then(function (res) {
          self.isSaveing = false;
          self.txtSave = '保存';

          self.$myMsgBox({
            message: '<p><i class="icon-pop-succ"></i></p>\
                        <p class="g-mt20">习题已经成功导入、提交审核。</p>',
            confirmTxt: '待核资源',
            hasCancelBtn: true,
            cancelTxt: '继续上传',
            callback: function () {
              //去正在候审页
              window.location.href = 'myunaudited.html';
            },
            //关闭位置的操作
            closeCallback: function () {
              //重新加载当前页
              window.location.reload();
            },
            //取消位置的操作
            cancelCallback: function () {
              //重新加载当前页
              window.location.reload();
            }
          });
        }, function (err) {
          self.isSaveing = false;
          self.txtSave = '保存';
          self.$message.error(err.message)
        })
        return;
      }


      this.checkTemplate = this.template;
      if (!this.checkForm()) {
        return;
      }

      if (!this.hasError) {
        this.saveResources();
      }
    },
    //表单校验
    checkForm() {
      //TODO
      //章节或知识点
      if (this.form.knowledgePointCatalogIds.length < 1 && !this.form.textbookCatalogId) {
        this.$message.error('章节或知识点至少要选择一个!');
        return false;
      }

      //习题的校验
      if (this.type == 5 && !this.multiExers) {
        //难度级别
        if (!this.form.difficultyLevel) {
          this.$message.error('请设置当前问题的难度级别!');
          return false;
        }

        //题干
        if (!this.form.name) {
          this.$message.error('题干不能为空!');
          return false;
        }
      }


      return true;
    },
    getCheckResult(val) {
      this.hasError = !val;
      this.checkTemplate = '';

      if (!this.checkForm()) {
        return;
      }

      if (!this.hasError) {
        this.saveResources();
      }
    },
    filterChange: function (info) {
      // console.log(info);
      this.type = info.resourceDictIndex;
      this.attr = info.resourceDictId;
      this.form.childDictId = info.childDictId;
      this.form.subjectId = info.subjectId;
      this.form.gradeId = info.gradeId;
      this.form.knowledgePointCatalogIds = info.knowledgePointCatalogIds ? info.knowledgePointCatalogIds.split(',') : [];
      this.form.textbookCatalogId = info.textbookCatalogId;
      this.template = info.quesTemplate ? info.quesTemplate : ''

      // this.isUploaded = false;
      // this.form.names = [];
      // this.form.sourceFileIds = [];
      // this.form.backgroundFileIds = [];
      // this.form.descriptions = [];
      // this.fileList = [];
      // this.datas = [];
    },
    uploadFileChange(file, filelist) {
      // this.uploadButtonDisabled = false;
      if (this.type == 6 && filelist.length > 1) {
        filelist.splice(0, 1);
      }
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
      var type = this.type,
        _type = file.type;
      if (!_type) {
        this.$message.error('暂时不支持该类型的文件');
        return false;
      }
      if (this.type == 6 && this.isUploaded) {
        this.$message.error('只能上传一个文件，若要重新上传，请先删除已经上传的')
        return false;
      }
      return this.checkType(this.acceptTypes, _type)
    },
    uploadFile() {
      this.$refs.uploadResource.submit();
    },
    uploadSuccess: function (res, file, filelist) {
      var self = this;
      if (res.resultCode == 'SUCCESS') {
        var origin_name = file.name,
          _name = file.name.substring(0, file.name.lastIndexOf('.')),
          _data = res.data,
          _sourceFile = _data.sourceFile || {};
        self.isUploaded = true;
        self.datas.push(Object.assign({}, _data, {
          name: origin_name
        }));
        self.fileList = filelist;
        if (self.type == 6) {
          self.form.name = _name;
          self.form.sourceFileId = _sourceFile.id;
          self.form.description = "";
        } else {
          self.form.names.push(_name);
          self.form.sourceFileIds.push(_sourceFile.id);
          self.form.descriptions.push("");
        }
        if (_data.backgroundFile) {
          self.form.backgroundFileIds.push(_data.backgroundFile.id)
        }
      } else {
        self.$message.error(res.message);
      }
    },
    uploadFail: function (err, file) {
      alert(JSON.parse(err))
    },
    removeFile: function (file, filelist) {
      if (!filelist.length > 0) {
        this.isUploaded = false;
      }
      let index = this.datas.map((item) => item.name).indexOf(file.name);
      if (index >= 0) {
        this.deleteHandle(file);
        this.datas.splice(index, 1)
      }
    },
    togglePreviewing() {
      this.previewing = !this.previewing;
    },
    deleteHandle(item) {
      let index = this.fileList.map((_item) => _item.name).indexOf(item.name);
      this.form.backgroundFileIds.splice(index, 1);
      this.form.names.splice(index, 1);
      this.form.descriptions.splice(index, 1);
      this.form.sourceFileIds.splice(index, 1);
      this.fileList.splice(index, 1);
      if (!this.fileList.length) {
        this.isUploaded = false;
      }
    },
    desChanged(arr) {
      this.form.descriptions = arr;
    },
    coverChanged(index, background) {
      if (!background) {
        this.form.backgroundFileIds[index] = '1C69333862F34237A32B9A552280FE99';
      } else {
        this.form.backgroundFileIds[index] = background;
      }
    },
    saveResources: function (event) {
      var self = this;
      //当未上传文件时
      if (this.type != 5 && !this.isUploaded) {
        this.$message.error('请先上传文件！')
        return false;
      }

      if (!this.checkForm() || this.hasError) {
        return;
      }

      //正在保存
      if (self.isSaveing) {
        return;
      }

      self.isSaveing = true;
      self.txtSave = '正在保存中...';
      uploads.uploadResources(this.attr, this.form, this.template).then(function (res) {
        self.isSaveing = false;
        self.txtSave = '保存';
        if (self.type != 6) {
          self.$myMsgBox({
            message: '<p><i class="icon-pop-succ"></i></p>\
            <p class="g-mt20">已递交审核！</p>',
            confirmTxt: '待核资源',
            hasCancelBtn: true,
            cancelTxt: '继续上传',
            callback: function () {
              //去正在候审页
              window.location.href = 'myunaudited.html';
            },
            //关闭位置的操作
            closeCallback: function () {
              //重新加载当前页
              window.location.reload();
            },
            //取消位置的操作
            cancelCallback: function () {
              //重新加载当前页
              window.location.reload();
            }
          });
        } else {
          let id = res.data[0];
          apiUrl.getResourceDetail(id).then((res) => {
            let data = res.data;
            self.resource = data.resource;
            self.previewingExam = true;
          })
        }
      }, function (err) {
        self.isSaveing = false;
        self.txtSave = '保存';
        self.$message.error(err.message);
      })
    },
    previewFile(file) {
      //office文档预览
      if (file && (file.type === 'WORD' || file.type === 'PPT' || file.type === 'EXCEL')) {
        // self.previewDocLink = "POBrowser.openWindow(" + file.path + ", 'width=1200px;height=800px;')";
        this.previewDocLink = "POBrowser.openWindow('" + file.path + "', 'width=1200px;height=800px;')";
        // self.isOfficeDoc = true;
      }
      //PDF预览
      if (file && file.type === 'PDF') {
        // self.previewing = true;
        this.previewPDF(file);
      }
    },
    previewPDF(file) {
      this.previewing = true;
      var DEFAULT_URL = file.path;
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

    },
    // uploadImgSuccess: function (res, file) {
    //   var self = this;
    //   if (res.resultCode == 'SUCCESS') {
    //     var data = res.data || {};
    //     self.imgPreview = URL.createObjectURL(file.raw);
    //     self.form.backgroundFileId = res.data.fileId;
    //   } else {
    //     self.$message.error(res.message);
    //   }
    // },
    // beforeImgUpload: function (file) {
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   const isCorrectImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
    //
    //   if (!isCorrectImg) {
    //     this.$message.error('上传头像图片只能是 png | jpg | jpeg | bmp 格式!');
    //   }
    //
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!');
    //   }
    //   return isLt2M && isCorrectImg;
    // },
  },
  mounted: function () {
    var self = this;
    //获取资源类型及二级标签
    // this.getTypes();
  }
};
</script>
<style>
.active {
  color: #00d487;
  border-color: #00d487;
}

.cover-pic label {
  line-height: 70px;
  padding: 0 12px;
}

.download {
  text-decoration: underline;
  margin-left: 10px;
}

.upload-pic {
  background: url('../../../../static/images/pic.png') no-repeat center;
  background-size: 100%;
  width: 70px;
  height: 70px;
  vertical-align: middle;
  display: inline-block;
}

.el-upload__tip {
  color: red;
  /* line-height: 24px;
  height: 24px; */
  display: inline-block;
  vertical-align: middle;
}

.el-upload-list {
  margin-left: 90px;
}

.batchUploadExer {
  position: absolute;
  right: 15px;
  cursor: pointer;
  z-index: 10;
}

.upload-area {
  display: inline;
  vertical-align: middle;
  margin-left: 10px;
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

/*.btn-childdict:hover, */

.btn-childdict.active {
  color: #00d487;
  border-color: #00d487;
}

.upload-select,
.upload-select:active,
.upload-select:hover,
.upload-select:visited,
.upload-select:focus {
  color: #c4c4c4;
  border-color: #c4c4c4;
}

.pdf-preview {
  border: 1px solid #ccc;
  /*width: 908px;*/
  height: 600px;
  margin-left: 20px;
  overflow-y: scroll;
  background-color: #fff;
}

.control {
  margin-bottom: 10px;
}

.label {
  width: 80px;
  line-height: 30px;
  display: inline-block;
  text-align: right;
}

.upload-btn {
  box-sizing: border-box;
  display: inline-block;
  /*width: 65px;*/
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  margin: 2px 20px 0 0;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  vertical-align: top;
  background-color: #00d487;
  color: #fff;
}









/*.add-option {
    color: #00d487;
    width: 100%;
    border-color: #00d487;
}

.form-preview {
    width: auto;
}

.hardness-label label {
    line-height: 36px;
}

.hardness li {
    display: inline-block;
}

.hardness li:not(:first-child) {
    margin-left: 84px;
}*/
</style>
