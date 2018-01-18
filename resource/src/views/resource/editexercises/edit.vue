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
			<el-button class="source-btn" :disabled="true">{{resource_name}}</el-button>
		</el-form-item>

		<editselects :init-data="resource" @val-changed="selectChanged"></editselects>

		<div class="">
			<el-form-item label="题型类别">
				<el-button v-if="childDictId === 'SINGLE_CHOICE'" size="large" :disabled="true">单选题</el-button>
				<el-button v-if="childDictId === 'MULTIPLE_CHOICE'" size="large" :disabled="true">多选题</el-button>
				<el-button v-if="childDictId === 'FILL_IN_THE_BLANK'" size="large" :disabled="true">填空题</el-button>
				<el-button v-if="childDictId === 'SHORT_ANSWER'" size="large" :disabled="true">解答题</el-button>
			</el-form-item>

			<el-form-item label="难度级别" class="hardness-label">
				<el-col :span="11">
					<ul class="hardness">
						<li>1</li>
						<li>2</li>
						<li>3</li>
						<li>4</li>
						<li>5</li>
					</ul>
					<el-slider :step="1" :min="1" :max="5" show-stops v-model="difficultyLevel"></el-slider>
				</el-col>
			</el-form-item>

			<el-form-item label="题干">
				<div v-html="title" contenteditable="true" @blur="editTitle($event)">
				</div>
			</el-form-item>

			<el-form-item label="答案" v-if="childDictId === 'SINGLE_CHOICE'">
				<el-radio-group v-model="answers">
					<el-radio v-for="(value, key) in options" :key='key' :label="key" @change="singleChoiceChanged($event)">
						<div v-html="key" class="radio-choice"></div>
						<div contenteditable="true" v-html="value" @blur="editOption($event, key)" @click.prevent="singleClick" class="radio-choice"></div>
					</el-radio>
				</el-radio-group>
				<div class="g-mt20">
					<el-button @click="addChoiceOption">+再加一项</el-button>
					<el-button @click="delChoiceOption">-删除一项</el-button>
				</div>
			</el-form-item>

			<el-form-item label="答案" v-if="childDictId === 'MULTIPLE_CHOICE'">
				<el-checkbox-group v-model="answers">

					<el-row v-for="(value, key) in options" :key='key'>
						<el-col :span="2">
							<el-checkbox :label="key" name="type" @change="multiChoiceChanged($event)"></el-checkbox>
						</el-col>
						<el-col :span="22">
							</el-input> -->
							<div contenteditable="true" v-html="value" @blur="editOption($event, key)"></div>
						</el-col>
					</el-row>
					<el-row>
						<el-button @click="addChoiceOption">+再加一项</el-button>
						<el-button @click="delChoiceOption">-删除一项</el-button>
					</el-row>
				</el-checkbox-group>
			</el-form-item>

			<el-form-item label="答案" v-if="childDictId === 'FILL_IN_THE_BLANK'">
				<el-row v-for="(value, key) in options" :key='key'>
					<el-col :span="1">
						<div contenteditable="true" @blur="editOption($event, key)">{{value}}</div>
					</el-col>
					<el-col :span="23">
						<div contenteditable="true" v-html="answers[key]" @blur="editAnswer($event, key)"></div>
					</el-col>
				</el-row>
				<el-row>
					<el-button @click="addTextOption">+再加一项</el-button>
					<el-button @click="delTextOption">-删除一项</el-button>
				</el-row>
			</el-form-item>

			<el-form-item label="" v-if="childDictId === 'SHORT_ANSWER'" class="g-mt20-">
				<!-- <span>题目：</span> -->
				<el-row v-for="(value, key) in options" :key='key'>
					<div contenteditable="true" v-html="value" @blur="editOption($event, key)"></div>
				</el-row>
				<el-row>
					<el-button @click="addTextOption">+再加一项</el-button>
					<el-button @click="delTextOption">-删除一项</el-button>
				</el-row>
				<br>
				<span>答案：</span>
				<el-row v-for="(value, key) in answers" :key='key'>
					<div contenteditable="true" v-html="value" @blur="editAnswer($event, key)"></div>
				</el-row>
				<el-row>
					<el-button @click="addAnswerOption">+再加一项</el-button>
					<el-button @click="delAnswerOption">-删除一项</el-button>
				</el-row>
			</el-form-item>

			<el-button type="success" class="chk-btn" @click.prevent="update">更新</el-button>
		</div>
	</el-form>
</div>
</template>
<script>
import editselects from '@/components/EditSelects'
import bus from '@/components/bus.js'
import apiUrl from '@/api/url.js'
import resources from '@/api/resources.js'
import util from '@/utils/index.js'
import Vue from 'vue'

export default {
	components: {
		editselects
	},
	data: function() {
		return {
			resource: {},
			statusLog:{},
			status: '',
			resource_name: '',
			gradeId: '',
			subjectId: '', //学科ID，可选
			textbookCatalogId: '', //章节ID，可选
			knowledgePointCatalogIds: [], //知识点ID，可选
			childDictId: '',
			difficultyLevel: 1,
			title: '',
			options: '',
			answers: ''
		};
	},
	methods: {
		getExercise: function(id) {
			var self = this;
			apiUrl.getResourceDetail(id, 'off').then(function(res) {
				var data = res.data;
				self.resource = data.resource;
				self.status = data.resource.status;
				self.statusLog = data.statusLog;
				self.childDictId = self.resource.childDictId;
				self.resource_name = self.resource.resourceDict.name;
				self.difficultyLevel = self.resource.difficultyLevel;
				self.title = self.resource.name;
				self.options = self.resource.topics;
				self.answers = self.childDictId === 'SINGLE_CHOICE' ? self.resource.answers.replace(/\"/g, "") : self.resource.answers;
			}, function(err) {
				self.$message.error(err)
			})

		},
		singleClick: function() {
			return;
		},
		singleChoiceChanged: function(e) {
			if (e.target.checked) {
				this.answers = e.target.innerText;
			}
		},
		multiChoiceChanged: function(e) {
			if (e.target.checked) {
				this.answers.push(e.target.innerText);
			} else {
				this.answers.splice(this.answers.indexOf(e.target.innerText))
			}
		},
		getLastKey: function(obj) {
			var lastKey = '';
			for (var key in obj) {
				lastKey = key;
			}
			return lastKey;
		},
		getNextLetter: function(obj) {
			return String.fromCharCode(this.getLastKey(obj).charCodeAt(0) + 1)
		},
		addChoiceOption: function() {
			Vue.set(this.options, this.getNextLetter(this.options), '选项')
		},
		delChoiceOption: function() {
			Vue.delete(this.options, this.getLastKey(this.options))
		},
		addTextOption: function() {
			this.options.push('');
		},
		delTextOption: function() {
			this.options.pop();
		},
		addAnswerOption: function() {
			this.answers.push('');
		},
		delAnswerOption: function() {
			this.answers.pop();
		},
		editTitle: function(e) {
			this.title = e.target.innerHTML;
		},
		editOption: function(e, index) {
			this.options[index] = e.target.innerText;
		},
		editAnswer: function(e, index) {
			this.answers[index] = e.target.innerText;
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
		update: function() {
			var self = this;
			var params = {
				id: self.resource.id,
				gradeId: self.gradeId,
				subjectId: self.subjectId,
				textbookCatalogId: self.textbookCatalogId,
				knowledgePointCatalogIds: self.knowledgePointCatalogIds,
				name: self.title,
				difficultyLevel: self.difficultyLevel,
				topics: self.options,
				answers: self.answers
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
		}
	},
	mounted: function() {
		var self = this;
		this.getExercise(util.getUrlParams('id'));

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

.radio-choice {
	display: inline-block;
}

.selects .el-select {
	width: 120px;
	margin-right: 10px;
}

.wrapper.btn-box {
	height: 100px;
}

.el-button.chk-btn.el-button--success {
	position: absolute;
	right: 50%;
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
	background: url(../../../../static/images/icons.png) no-repeat -187px -32px;
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: middle;
}

div[contenteditable="true"] {
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	padding: 0 10px;
}
.el-radio {
	display: block;
	line-height: 2;
  margin-top: 10px;
}
.el-radio + .el-radio {
	margin-left: 0
}
.selects .editselects .label {
	margin-right: 5px;
	margin-left: 30px;
}

.el-form-item__label {
	color: #232323
}

.hardness-label label {
	line-height: 36px;
}

.hardness li {
	display: inline-block;
}

.hardness li:not(:first-child) {
	margin-left: 84px;
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
</style>
