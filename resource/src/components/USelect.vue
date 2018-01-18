<template>
	<div class="u-select" @click.stop>
	  <div class="u-select-name" @click="isCollpased=!isCollpased">{{selectedName}}<i class="u-icon i-arr-b"><i class="i-arr-ra"></i><i class="i-arr-rb"></i></i></div>
	  <input type="hidden" class="j-hidden-sel" v-model="selectedId" />
	  <ul class="u-select-list" v-show="!isCollpased">
	  	<li @click="selectOpt(index)" v-for="(opt, index) in selectunit.list" :value="opt.value" :name="opt.name">
	  		{{opt.name}}
	  	</li>
	  </ul>
	</div>
</template>

<script>
//TODO 模拟数据用 后面要删掉
//导入模块
import axios from 'axios'
//引入mock
import MockAdapter from 'axios-mock-adapter'
//引入mock数据源文件
import MockData from '@/mockdata/index.js'
//设置模拟调试器实例 
var mock = new MockAdapter(axios)
//mock数据源
mock.onGet('/select').reply(200, MockData.select)

//集成api
//import api from '@/api/index.js'

//TODO select的收起
import jquery from '../../static/libs/jquery-1.10.1/jquery-1.10.1.min.js'
jquery('body').on('click', function() {
	
});

export default {
  data: function () {
    return {
    	isCollpased: true,
    	selectedId: '',
    	selectedName: ''
    };
  },
  props: ['selectunit'],
  methods: {
  	selectOpt: function (index) {
  		var self = this,
  			$data = self.$data,
  			selList = self.$props.selectunit.list;

  		$data.isCollpased = !$data.isCollpased;
  		$data.selectedName = selList[index].name;
  		$data.selectedId = selList[index].value;
  	}
  },
  mounted: function () {
  	var self = this;
  	self.$data.selectedName = self.$props.selectunit.name;
  	/*this.$nextTick(function () {
    	this.$api.get('/select', {}, function (res) {
	  		self.$data.selectList = res.result;
	  	}, function (res) {
	      console.log('select:' + res);
	    });
  	});*/
  }
}
</script>

<style>
.u-select {
	box-sizing: border-box;
	width: 120px;
	display: inline-block;
	position: relative;
	font-size: .6rem;
	color: #232323;
}
.u-select-name {
	position: relative;
	height: 30px;
	line-height: 30px;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	text-align: center;
	cursor: pointer;
}
.u-select-name .u-icon {
	position: absolute;
	right: 10px;
	top: 12px;
}
.u-select-list {
	position: absolute;
	top: 28px;
	left: 0;
	width: 120px;
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-top-color: #f1f1f1;
	background-color: #fff;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	line-height: 30px;
	text-align: center;
}
.u-select-list li {
	padding: 0 15px;
}
.u-select-list li:last-child {
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}
.u-select-list li:hover {
	background-color: #00d487;
	color: #fff;
	cursor: pointer;
}
</style>
