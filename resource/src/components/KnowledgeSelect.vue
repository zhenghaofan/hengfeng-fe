<template>
	<el-form-item label="知识点">
		<el-select @change="getKnwlegChildOptions(2)" v-model="knwlegPointId1" placeholder="一级知识点">
			<el-option v-for="knwlegPoint in knwlegPointList1" :key="knwlegPoint.id" :label="knwlegPoint.name" :value="knwlegPoint.id">
			</el-option>
		</el-select>
		<el-select @change="getKnwlegChildOptions(3)" :disabled="!knwlegPointId1" v-model="knwlegPointId2" placeholder="二级知识点">
			<el-option v-for="knwlegPoint in knwlegPointList2" :key="knwlegPoint.id" :label="knwlegPoint.name" :value="knwlegPoint.id">
			</el-option>
		</el-select>
		<div v-show="knwlegPointList3.length > 0">
			<span class="g-inblock g-mr20" v-for="(knwleg, index) in knwlegPointList3"><i class="icon i-check g-mr5" :class="{'i-check-s': knwleg.checked}" @click="toggleCheck('knwleg', index)"></i>{{knwleg.name}}</span>
		</div>
	</el-form-item>
</template>

<script>
import Vue from 'vue'
import bus from '@/components/bus.js'
import apiUrl from '@/api/url.js'
export default {
	data: function() {
		return {
			/* 知识点 */
			//一级
			learnStageId: '',
			subjectId: '',
			knwlegPointList1: [],
			knwlegPointId1: '',
			//二级
			knwlegPointList2: [],
			knwlegPointId2: '',
			//三级
			knwlegPointList3: [],
			knwlegPointId3List: [],
			knwlegPointId3: '',
			checkedList: []
		}
	},
	methods: {
		//获取知识点项菜单
		getKnwlegOptions: function() {
			var self = this,
				params = {
					learnStageId: self.learnStageId,
					subjectId: self.subjectId
				};
			apiUrl.getKnwlegOptions(params).then(function(res) {
				var _result = res.data;
				self.knwlegPointList1 = _result.knowledPointCatalogList;
			});
		},
		//获取二级/三级知识点
		getKnwlegChildOptions: function(index) {
			// 2代表获取二级知识点 3代表获取三级知识点
			var clickIndex = index - 1,
				list = this['knwlegPointList' + clickIndex],
				selectedId = this['knwlegPointId' + clickIndex];

			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].id === selectedId) {
					if (list[i].children) {
						this['knwlegPointList' + index] = list[i].children;
					} else {
						this['knwlegPointList' + index] = [];
					}
					break;
				}
			}

			if (index === 2) {
				this.knwlegPointId2 = '';
				this.knwlegPointList3 = [];
			}
			//如果三级知识点 初始化checked属性
			if (index === 3) {
				this.checkedList = [];
				if (this.knwlegPointList3.length) {
					for (var j = 0, len = this.knwlegPointList3.length; j < len; j++) {
						//默认全选
						Vue.set(this.knwlegPointList3[j], 'checked', true);
						this.checkedList.push(this.knwlegPointList3[j].id);
					}
				} else {
					this.checkedList.push(this.knwlegPointId2);
				}
				bus.$emit('knowledgeChange', this.checkedList)
			}
		},

		//切换checkbox
		toggleCheck: function(type, index) {
			//'dict'类型为资源 否则是三级知识点
			var list = type === 'dict' ? this.childDictList : this.knwlegPointList3,
				state = list[index].checked,
				idList = type === 'dict' ? this.childDictIdList : this.knwlegPointId3List;

			list[index].checked = !state;

			if (!state) {
				idList.push(list[index].id);
			} else {
				var j = idList.indexOf(list[index].id);
				idList.splice(j, 1);
			}
			this.checkedList = [];
			for (var i = 0, len = list.length; i < len; i++) {
				if (list[i].checked) {
					this.checkedList.push(list[i].id);
				}
			}
			// console.log(checkedList);
			bus.$emit('knowledgeChange', this.checkedList)
		},

	},
	mounted: function() {
		var self = this;
		bus.$on('stageChange', function(id) {
			self.learnStageId = id;
			self.knwlegPointId1 = '';
			self.knwlegPointList3 = [];
		})
		bus.$on('subjectChange', function(id) {
			self.subjectId = id;
			self.knwlegPointId1 = '';
			self.knwlegPointList3 = [];
			self.getKnwlegOptions();
		})
	}
}
</script>

<style lang="css">
</style>
