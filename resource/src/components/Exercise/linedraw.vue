<template>
	<div class="liga-content f-clearfix" :class="[{'liga-preview': type}, userClass]">
		<canvas id="liga-canvas" class="liga-canvas"></canvas>
		<div class="liga-content-inner f-clearfix" v-if="type">
	    <div class="liga-l">
	      <div class="liga-item" v-for="(item, lIndex) in leftArr">
	        <div class="title" v-html="item"></div>
	        <div class="opts">
	          <span class="i-draw">
	          	<i class="iconf i-circle"></i>
	          </span>
	        </div>
	      </div>
	    </div>
	    <div class="liga-r">
	      <div class="liga-item" v-for="(item, rIndex) in rightArr">
	        <span class="i-draw">
	        	<i class="iconf i-circle"></i>
	        </span>
	        <div class="title" v-html="item"></div>
	      </div>
	    </div>
	  </div>
	  <div class="liga-content-inner f-clearfix" v-else>
	    <div class="liga-l">
	      <div class="liga-item" v-for="(item, lIndex) in leftArr">
	      	<span class="liga-opts">
	      		<i class="iconf i-add" @click="addItem(lIndex, 'left')" title="增加"></i>
	          <i class="iconf i-image" title="传图" @click="showUpload(lIndex, 'left')"></i>
	          <i class="iconf i-trash" @click="delItem(lIndex, 'left')" title="删除"></i>
	      	</span>
	        <div class="title" contenteditable="true" @blur="topicsItemChanged($event, 'left', lIndex)" v-html="item"></div>
	        <div class="opts">
	          <!-- <i class="iconf i-add" @click="addItem(lIndex, 'left')" title="增加"></i>
	          <i class="iconf i-image" title="传图"></i>
	          <i class="iconf i-trash" @click="delItem(lIndex, 'left')" title="删除"></i> -->
	          <span class="i-draw" @click="addLine(lIndex, 'left')">
	          	<i class="iconf i-circle" 
	          	:class="{'i-selected': curLeftIndex === lIndex}" 
	          	></i>
	          </span>
	        </div>
	      </div>
	    </div>
	    <div class="liga-r">
	      <div class="liga-item" v-for="(item, rIndex) in rightArr">
	        <span class="i-draw">
	        	<i class="iconf i-circle" :class="{'i-selected': curRightIndex === rIndex}" @click="addLine(rIndex, 'right')"></i>
	        </span>
	        <div class="title" contenteditable="true" @blur="topicsItemChanged($event, 'right', rIndex)" v-html="item"></div>
	        <div class="opts">
	          <i class="iconf i-add" @click="addItem(rIndex, 'right')" title="增加"></i>
	          <i class="iconf i-image" title="传图" @click="showUpload(rIndex, 'right')"></i>
	          <i class="iconf i-trash" @click="delItem(rIndex, 'right')" title="删除"></i>
	        </div>
	      </div>
	    </div>
	    <el-dialog class="upload-dialog" title="上传图片" :visible.sync="isUploadShow" :close-on-click-modal="false">
	    	<el-upload
				  class="upload-demo g-tc"
  				drag
				  action="/manage/file/upload"
				  v-show="isUploadShow"
				  :on-success="insertToList"
				  :on-error="uploadError"
				  :show-file-list="false"
				  accept="image/jpeg,image/png,image/bmp">
				  <i class="el-icon-upload"></i>
	  			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				  <div class="el-upload__tip" slot="tip">只能上传jpg/png/bmp文件，且宽不超过200px，大小不超过200kb</div>
				</el-upload>
	    </el-dialog>
	    
	  </div>
  </div>
</template>
<script>
import Vue from 'vue'
import utils from '@/utils/'
export default {
	data() {
		return {
			topics:[
			],
			answers: {},
			//最少有几项
			MIN: 3,
			//当前选中的左边节点序号
			curLeftIndex: '',
			//当前选中的右边节点序号
			curRightIndex: '',
			//连线的宽度
			lineWidth: 3,
			//连线的颜色
			strokeStyle: '#00d487',
			//线条截点样式
			lineCap: 'round',
			//每一项的高度
			itemHeight: 50,
			leftArr: [],
			rightArr: [],
			isUploadShow: false,//显示上传框
			curUploadInfo: {//当前在哪边列表上传
				index: 0,
				type: '',
			},
			userClass: '',
		};
	},
	props: ['sourceData', 'checkTemplate', 'type', 'previewingExer'],//, 'userClass'
	watch: {
		/*'sourceData.topics'(val) {
			if (this.type) {
				this.initData();
			}
		},*/
		previewingExer(val) {
			if (val && this.type) {
				this.initData();
			}
		},
		checkTemplate(template) {
			//是连线题 或者综合题时，检查
      if (template === 'LIGATURE' || template === 'SYNTHESIS') {
        this.checkForm();
      }
    },
		answers: {
			handler(answersObj) {
				//var answers = this.changeAnswersToText();
				/*var answers = {},
						rightList = this.rightArr;

				for (var item in answersObj) {
					answers[item] = [];
					for (var i = 0, len = answersObj[item].length; i < len; i++) {
						answers[item].push(rightList[answersObj[item][i]]);
					}
				}*/
				this.$emit('contentchange', {
	        topics: [this.leftArr, this.rightArr],
	        answers: this.answers,
	      });
			},
			deep: true,
		},
		rightArr: {
			handler(list) {
				//var answers = this.changeAnswersToText();

				this.$emit('contentchange', {
	        topics: [this.leftArr, this.rightArr],
	        answers: this.answers,
	      });

			},
			deep: true,
		},
	},
	methods: {
		//显示上传框
		showUpload(index, type) {
			this.isUploadShow = true;
			this.curUploadInfo.index = index;
			this.curUploadInfo.type = type;
		},
		//上传成功
		insertToList(response, file, fileList) {
			var curUploadInfo = this.curUploadInfo,
					type = curUploadInfo.type,
					index = curUploadInfo.index,
					self = this,
					html;

			html = '<img src=' + response.data.sourceFile.path + ' />';
			//插入图片
			this[type + 'Arr'].splice(index, 1, html);

			//清除当前正在上传的数据
			this.curUploadInfo = {};

			//隐藏上传框
			this.isUploadShow = false;

			//重画(可能上传了图片后输入框高度改变了)
			setTimeout(function() {
				self.draw(self.leftArr.length, self.rightArr.length);		
			}, 600);
			//this.draw(this.leftArr.length, this.rightArr.length);		
		},
		//上传失败
		uploadError(err, file, fileList) {
			this.$message.error(err);
		},
		//把答案由序号变成文本
		changeAnswersToText() {
			var answers = {},
					rightList = this.rightArr,
					answersObj = this.answers;

			for (var item in answersObj) {
				answers[item] = [];
				for (var i = 0, len = answersObj[item].length; i < len; i++) {
					answers[item].push(rightList[answersObj[item][i]]);
				}
			}

			return answers;
		},
		//校验TODO
    checkForm() {
      var answers = this.answers,
      		list = this.leftArr;

     	for (var i = 0, len = list.length; i < len; i++) {
     		if (!answers[i] || answers[i].length < 1) {
     			this.$message.error('选项'+(i+1)+'未设置连线答案!');
          this.$emit('afterChecked', false);
          return;
     		}
     	}

      this.$emit('afterChecked', true);
    },
		//选项值发生改变时
		topicsItemChanged(e, type, index) {
    	var value = e.target.innerHTML;
    	//检查是否是重复项
    	if (this.isRepeatItems(type, value, index)) {
    		this.$message.error('该选项的值重复，请重新填写！');
    		//当前填写的值设为空值
    		value = '';
    	}

    	this[type + 'Arr'].splice(index, 1, value);
    },
    //检查是否是重复项
    isRepeatItems(type, value, index) {
    	var list = this[type + 'Arr'];
    	for (var i = 0, len = list.length; i < len; i++) {
    		if (list[i] === value && i !== index && value !== '') {
    			return true;
    		}
    	}
    	return false;
    },
		//增加一个选项
		addItem(index, type) {
			var next = index + 1,
					leftList = this.leftArr,
					rightList = this.rightArr,
					answers = this.answers;

			//左边加一项
			if (type === 'left') {
				//修改answers
				for (var i = leftList.length; i >= next; i--) {
					if (this.answers[i - 1] && this.answers[i - 1].length > 0) {
						this.answers[i] = this.answers[i - 1] || [];

						if (i === next) {
							this.answers[i] = [];
						}
					}
				}
				//

				leftList.splice(next, 0, '');
			} else if (type === 'right') {
			//右边加一项
				//修改answers
				var listWrap = this.answers,
						list, ansIndex;

				for (var ansItem in listWrap) {
					list = listWrap[ansItem];
					if (!list || list.length < 1) {
						continue;
					}
					ansIndex = list.indexOf(index);

					if (ansIndex !== -1) {
						list.splice(ansIndex, 1, index);
					}
				}

				rightList.splice(next, 0, '');
			}
			//重画
			this.draw(leftList.length, rightList.length);
		},
		//删除一个选项
		delItem(index, type) {
			var list = this.answers,
					leftList = this.leftArr,
					rightList = this.rightArr,
					item;

			//左边减一项
			if (type === 'left') {
				if (leftList.length < this.MIN + 1) {
					this.$message.error('连线题至少要有' + this.MIN + '项！');
					return;
				}

				//删除项
				leftList.splice(index, 1);

				//删除整项 当面项后面的往前移
				var tempAnswers = utils.cloneObj(this.answers);
				for (var item in this.answers) {
					if (item >= index) {
						this.answers[item] = tempAnswers[+item + 1];
					}
				}
				this.answers[this.leftArr.length] = [];		
			} else if (type === 'right') {
			//右边减一项
				if (rightList.length < this.MIN + 1) {
					this.$message.error('连线题至少要有' + this.MIN + '项！');
					return;
				}

				//删除答案中包括右边当前项的项
				this.delAnswer(index, true);
				//删除项
				rightList.splice(index, 1);
			}

			//重画
			this.draw(leftList.length, rightList.length);
		},
		//添加/删除一条连线
		addLine(index, type) {
			//画线规则，左到右为连线，右到左为取消
			var leftList = this.leftArr,
					rightList = this.rightArr;

			//左边
			if (type === 'left') {
				//右边没选中，是要连线
				if (this.curRightIndex === '') {
					//左边选项内容区为空
					if (this.leftArr[index] === '') {
						this.$message.error('请先填写选项内容~');
						return;
					}
					//选中左边
					this.curLeftIndex = index;
				} else {
				//取消连线
					var seledValueList = this.answers[index];

					//有连线
					if (seledValueList) {
						for (var i = 0, len = seledValueList.length; i < len; i++) {
							//当前答案中与右边某一值相等
							if (seledValueList[i] == this.curRightIndex) {
								seledValueList.splice(i, 1);
							}
						}
					}
					
					//完成，重置数据
					this.curLeftIndex = '';
					this.curRightIndex = '';
				}
			} else if (type === 'right') {
				//左边没选中，是要取消连线
				if (this.curLeftIndex === '') {
					this.curRightIndex = index;
				} else {
				//左边选中，是要连线
					
					//左边选项内容区为空
					if (this.rightArr[index] === '') {
						this.$message.error('请先填写选项内容~');
						return;
					}
					
					//判断多选一的情况(去掉上次选的)
					this.delAnswer(index);

					//连线
					if (!this.answers[this.curLeftIndex]) {
						//this.answers[this.curLeftIndex] = [];
						Vue.set(this.answers, this.curLeftIndex, []);
					}
					this.answers[this.curLeftIndex].push(index);
					
					//完成，重置数据
					this.curLeftIndex = '';
					this.curRightIndex = '';
				}
			}
			this.draw();
		},
		//删除一个||多个答案
		delAnswer(index, checkAll) {
			var listWrap = this.answers,
					tempAnswers = utils.cloneObj(this.answers),
					list;

			for (var ansItem in listWrap) {
				list = listWrap[ansItem];
				//为空不处理
				if (!list || list.length < 1) {
					continue;
				}
				for (var i = 0, len = list.length; i < len; i++) {
					if (list[i] == index) {
						//去掉上一个答案||去掉已选中的答案
						list.splice(i, 1);
						if (!checkAll) {
							break;
						}
					} else if (list[i] > index && checkAll) {
					//后面的序号都减1
						list[i] = list[i] - 1;
					}
				}
			}
		},
		//画图
		draw(leftLen, rightLen) {
			var canvas = document.querySelector('.' +  this.userClass+ ' .liga-canvas'),
					context = canvas.getContext('2d'),
					list = this.answers,
					offset = Math.abs(this.lineWidth / 2),
					drawWrap = document.querySelector('.' + this.userClass + ' .liga-content-inner'),
					pointLeft,
					pointRight;

			//初始化canvas
			this.initCanvas(leftLen, rightLen);

			//清除画布
			context.clearRect(0, 0, canvas.width, canvas.height);

			for (var item in list) {
				//为空不处理
				if (!list[item] || list[item].length < 1) {
					continue;
				}

				context.beginPath();

				//左边点位置
				pointLeft = this.getPointPosition(item, 'left');
				for (var i = 0, len = list[item].length; i < len; i++) {				
					context.moveTo(pointLeft.x, pointLeft.y - offset);

					//右边点位置 有多个的情况
					pointRight = this.getPointPosition(list[item][i], 'right');
					context.lineTo(pointRight.x, pointRight.y - offset);
					context.stroke();
				}

			}
			
		},
		//获取点的位置
		getPointPosition(index, type) {
			var list = document.querySelectorAll('.' + this.userClass + ' .liga-l .liga-item'),
					item = list[0],
					point;

			//左边时，value就是左边的index值
			if (type === 'left') {
				point = {
					x: item.offsetWidth,
					//y: item.offsetTop + itemOuterHeight * index  + item.offsetHeight / 2,
					y: item.offsetTop + this.getItemListHeight(list, index)  + 20,
				};
			} else {
			//右边时，是右边的值
				//先找到右边值的序号
				list = document.querySelectorAll('.' + this.userClass + ' .liga-r .liga-item');
				item = list[0];
				point = {
					x: item.offsetLeft,
					//y: item.offsetTop + itemOuterHeight * index  + item.offsetHeight / 2,
					y: item.offsetTop + this.getItemListHeight(list, index)  + 20,
				};
			}
			return point;
		},
		//获取列表的高度
		getItemListHeight(list, endIndex) {
			var resultHeight = 0;
			for (var i = 0; i < endIndex; i++) {
				resultHeight += (list[i].offsetHeight + 15);
			}
			return resultHeight;
		},
		//初始化canvas
		initCanvas(leftLen, rightLen) {
			var drawWrap = document.querySelector('.' + this.userClass + ' .liga-content-inner'),
					canvas = document.querySelector('.' + this.userClass + ' .liga-canvas'),
					context = canvas.getContext('2d'),
					itemOuterHeight;

			//设置画布区域大小
			canvas.width = drawWrap.offsetWidth;
			if (leftLen && rightLen) {
				itemOuterHeight = document.querySelectorAll('.' + this.userClass + ' .liga-l .liga-item')[0].offsetHeight + 15;
				canvas.height = itemOuterHeight * (Math.max(leftLen, rightLen));
			} else {
				canvas.height = drawWrap.offsetHeight || 150;//拿不到高度先给个值
			}
			
			//线条宽度
			context.lineWidth = this.lineWidth || 3;
			//线条颜色
			context.strokeStyle = this.strokeStyle || '#00d487';
			//线条截点样式
			context.lineCap = this.lineCap || 'round';

		},
		//页面初始化
    initData() {
    	var self = this,
    			data, topics, answers, item;

    	//初始化数据
    	if (this.sourceData && this.sourceData.topics) {
    		data = this.sourceData;
    		topics = data.topics;
    		answers = data.answers;

    		this.answers = utils.cloneObj(data.answers);
    		//初始化topics
    		this.initTopics(topics);
    	} else {
    		//初始化topics
    		this.initTopics();
    	}
    	//初始化canvas
    	setTimeout(function () {
    		//self.initCanvas();
    		self.draw();
    	}, 1000);
			//this.initCanvas();
    },
    //初始化topics
    initTopics(topics) {
    	//默认三组
    	if (!topics) {
    		for (var k = 0, len = this.MIN; k < len; k++) {
	    		this.leftArr.push('');
	  			this.rightArr.push('');			
	  		}
    	} else {
   		//有初始值，分别初始化左边和右边数据
   			var leftList = topics[0],
   					rightList = topics[1];

   			this.leftArr = [];
   			this.rightArr = [];

    		for (var i = 0, len1 = leftList.length; i < len1; i++) {
    			this.leftArr.push(leftList[i]);	
	  		}
	  		for (var j = 0, len2 = rightList.length; j < len2; j++) {
    			this.rightArr.push(rightList[j]);
	  		}
    	}
    	
    },
	},
	mounted: function () {
    this.$nextTick(function () {
    	this.userClass = 'lined-' + (+new Date());
      //页面初始化
    	this.initData();
    });
  },
  updated() {
  	this.draw();
  },
};
</script>
<style lang="less">
/* 连线题 */
.liga-content {
  position: relative;
  box-sizing: border-box;
  margin: 0 0 20px 95px;
  .liga-content-inner {
  	/*z-index: 10;*/
  }
  .liga-l {
    float: left;
    width: 340px;
    vertical-align: top;
  }
  .liga-item {
    position: relative;
    margin-bottom: 15px;
    .title {
      display: inline-block;
      width: 220px;
      /*height: 35px;*/
      height: auto;
      padding-top: 5px;
      padding-bottom: 5px;
      line-height: 25px;
      overflow: hidden;
      img {
      	max-width: 200px;
  			max-height: 200px;
      }
    }
    .opts {
      position: absolute;
      right: 3px;
      top: 6px;
    }
    .liga-opts {
    	display: inline-block;
    	vertical-align: top;
    	margin-top: 6px;
    	margin-right: 18px;
    }
    .i-draw {
    	display: inline-block;
    	width: 25px;
    	height: 100%;
    	text-align: center;
    }
    .iconf {
    	margin-left: 5px;
    	font-size: 14px;
    }
    .iconf:hover {
    	color: #00d487;
      cursor: pointer;
    }
  }
  .liga-r {
    float: right;
    display: inline-block;
    width: 340px;
    margin-right: 20px;
    vertical-align: top;
    .i-draw {	
    	margin-top: 6px;
    	margin-left: 5px;
    	text-align: left;
    	vertical-align: top;
    }
  }
  .i-circle.i-selected {
  	border-color: #00d487;
  }
}
.liga-canvas {
	position: absolute;
	top: 0;
	left: 0;
	/*width: 100%;
	height: 100%;*/
}
.liga-preview {
	margin-left: 0;
	margin-top: 0;
	.liga-l,
	.liga-r {
		max-width: 150px;
		.title {
			max-width: 100px;
			img {
      	max-width: 100px;
  			max-height: 100px;
      }
		}
	}
	.liga-r {
		margin-left: 150px;
	}
	.iconf {
		cursor: default;
	}
}
</style>