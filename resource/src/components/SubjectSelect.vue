<template>
  <el-form-item label="所属科段">
  	<el-select placeholder="选择学段" v-model="stageId" @change="stageChange">
  		<el-option v-for="item in subjects.learnStageList" :key="item.id" :label="item.name" :value="item.id">
  		</el-option>
  	</el-select>
  	<el-select placeholder="选择年级" v-model="gradeId" @change="gradeChange" :disabled="!stageId">
  		<el-option v-for="item in gradeArr" :key="item.id" :label="item.name" :value="item.id">
  		</el-option>
  	</el-select>
  	<el-select placeholder="选择学科" v-model="subjectId" :disabled="!gradeId" @change="subjectChange">
  		<el-option v-for="item in subjectArr" :key="item.id" :label="item.name" :value="item.id">
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
			subjects: [],
			stageId: '',
			gradeArr: [],
			gradeId: '',
			subjectArr: [],
			subjectId: '',
		};
	},
	methods: {
		getSubjectOptions: function() {
			var self = this;
			apiUrl.getSubjectOptions().then(function(res) {
				self.subjects = res.data;
			})
		},

		stageChange: function() {
			var self = this,
				list = self.subjects.gradeList;
			self.gradeArr = [];
			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].learnStageId === self.stageId) {
					self.gradeArr.push(list[i]);
				}
			}
      this.gradeId = '';
			bus.$emit('stageChange', self.stageId);
		},

		gradeChange: function() {
			var self = this,
				list = self.subjects.subjectList;
			self.subjectArr = [];
			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].gradeId === self.gradeId) {
					self.subjectArr.push(list[i]);
				}
			}
      this.subjectId = '';
			bus.$emit('gradeChange', self.gradeId);
		},

		subjectChange: function() {
			var self = this;
			bus.$emit('subjectChange', self.subjectId)
		}
	},
	mounted: function() {
		this.getSubjectOptions();
	}
}
</script>
<style>

</style>
