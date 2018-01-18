<template>
  <el-form-item label="章节：">
  	<el-select v-model="versionId" placeholder="教材版本" @change='getTerm'>
  		<el-option v-for="version in versionList" :key="version" :label="version" :value="version">
  		</el-option>
  	</el-select>
  	<el-select v-model="termId" placeholder="所属学期" @change='getTextbook' :disabled="!versionId">
  		<el-option v-for="term in termList" :key="term.id" :label="term.name" :value="term.id">
  		</el-option>
  	</el-select>
  	<el-select v-model="textbookId" @change="getTextbookCatalog" :disabled="!termId" placeholder="教材题名">
  		<el-option v-for="textbook in textbookList" :key="textbook.id" :label="textbook.name" :value="textbook.id">
  		</el-option>
  	</el-select>
  	<el-select v-model="unitId" @change="getChapter" :disabled="!textbookId" placeholder="所属单元">
  		<el-option v-for="unit in unitList" :key="unit.id" :label="unit.name" :value="unit.id">
  		</el-option>
  	</el-select>
  	<el-select v-model="chapterId" @change="getCourse" :disabled='!unitId' placeholder="选择章">
  		<el-option v-for="chapter in chapterList" :key="chapter.id" :label="chapter.name" :value="chapter.id">
  		</el-option>
  	</el-select>
  	<el-select v-model="courseId" @change="courseChanged" :disabled='!chapterId' placeholder="选择节/课">
  		<el-option v-for="course in courseList" :key="course.id" :label="course.name" :value="course.id">
  		</el-option>
  	</el-select>
  </el-form-item>
</template>

<script>
import bus from '@/components/bus.js'
import apiUrl from '@/api/url.js'
export default {
	data: function() {
		return {
			gradeId: '',
			subjectId: '',
			versionList: [],
			versionId: '',
			//所属学期
			termList: [],
			termId: '',
			//教材题名
			textbookList: [],
			textbookId: '',
			//教材目录
			//所属单元
			unitList: [],
			unitId: '',
			//选择章
			chapterList: [],
			chapterId: '',
			//选择节/课
			courseList: [],
			courseId: '',
		}
	},
	methods: {
		//获取教材版本
		getTextbookOptions: function() {
			var self = this,
				params = {
					function: 'VERSION',
					gradeId: self.gradeId,
					subjectId: self.subjectId
				};

			apiUrl.getTextbookOptions(params).then(function(res) {
				var _result = res.data;
				self.versionList = _result.versionList;
			});
		},
		//获取学期
		getTerm: function() {
			var self = this,
				params = {
					function: 'TERM',
					gradeId: self.gradeId,
					subjectId: self.subjectId,
					version: self.versionId
				};

			apiUrl.getTextbookOptions(params).then(function(res) {
				var _result = res.data;
				self.termList = _result.termList;
        self.termId = '';
        self.textbookId = '';
        self.unitId = '';
        self.chapterId = '';
			});
		},
		//获取教材
		getTextbook: function() {
			var self = this,
				params = {
					function: 'TEXTBOOK',
					gradeId: self.gradeId,
					subjectId: self.subjectId,
					version: self.versionId,
					termDictId: self.termId
				};

			apiUrl.getTextbookOptions(params).then(function(res) {
				var _result = res.data;
				self.textbookList = _result.textbookList;
        self.textbookId = '';
        self.unitId = '';
        self.chapterId = '';
			});
		},
		//获取教材目录
		getTextbookCatalog: function() {
			var self = this,
				params = {
					function: 'TEXTBOOK_CATALOG',
					textbookId: self.textbookId
				};

			apiUrl.getTextbookOptions(params).then(function(res) {
				var _result = res.data;
				self.unitList = _result.textbookCataLogList;
        self.unitId = '';
			});
		},
		//获取章
		getChapter: function() {
			var self = this,
				list = self.unitList;

			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].id === self.unitId) {
					self.chapterList = list[i].children;
					break;
				}
			}
      // console.log(self.chapterId);
      if(self.unitId && !self.chapterId && !self.courseId) {
        bus.$emit('textbookChange', self.unitId)
      }
      self.chapterId = ''
		},
		//获取节/课
		getCourse: function() {
			var self = this,
				list = self.chapterList;

			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].id === self.chapterId) {
					self.courseList = list[i].children;
					break;
				}
			}
      if(self.chapterId && !self.courseId) {
        bus.$emit('textbookChange', self.chapterId)
      }
      self.courseId = ''
		},
    courseChanged: function() {
      if(this.courseId) {
        bus.$emit('textbookChange', this.courseId)
      }
    },
    reset: function() {
      this.versionId = '';
      this.termId = '';
      this.textbookId = '';
      this.unitId = '';
      this.chapterId = '';
      this.courseId = '';
    }
	},
	mounted: function() {
		var self = this;
		bus.$on('gradeChange', function(id) {
			self.gradeId = id;
      self.reset();
		});
		bus.$on('subjectChange', function(id) {
			self.subjectId = id;
      self.reset();
			self.getTextbookOptions();
		})
	}
}
</script>

<style lang="css">
</style>
