export default {
	leftbar: {
	  resultCode: 'SUCCESS',
	  message: 'success',
	  data: [{ 
      href: '#',
      name: '资源管理',
      id: '0',
      isCollapsed: true,
      submenus: [{
        href: '#',
        name: '可用资源',
        id: '0-0'
      }, {
        href: '#',
        name: '上传资源',
        id: '0-1'
      }, {
        href: '#',
        name: '我的资源',
        id: '0-2'
      }, {
        href: '#',
        name: '资源审核',
        id: '0-3'
      }]
    },
    { 
      href: 'contmanage',
      name: '建设管理',
      isCollapsed: false,
      id: '1',
      submenus: [{
        href: '#',
        name: '建设统计',
        id: '1-0'
      }, {
        href: '/views/resourcelibs/contmanage/classeslist.html',
        name: '资源属性',
        id: '1-1'
      }]
	  }]
	},
	//下拉列表组
	filterList: {
		resultCode: 'SUCCESS',
	  message: 'success',
	  data: [
	  	{
	  		name: '类别',
	  		list: [{
			  	name: '教材',
			  	value: '00',
			  	selected: false
			  }, {
			  	name: '其他等等',
			  	value: '01',
			  	selected: false
			  }, {
			  	name: '还有随便',
			  	value: '02',
			  	selected: false
			  }]
	  	}, {
		  	name: '学段',
		  	list: [{
			  	name: '二年级',
			  	value: '20',
			  	selected: false
			  }, {
			  	name: '三年级',
			  	value: '21',
			  	selected: false
			  }, {
			  	name: '一年级',
			  	value: '22',
			  	selected: false
			  }]
	  	}, {
		  	name: '年级',
		  	list: [{
			  	name: '二年级',
			  	value: '20',
			  	selected: false
			  }, {
			  	name: '三年级',
			  	value: '21',
			  	selected: false
			  }, {
			  	name: '一年级',
			  	value: '22',
			  	selected: false
			  }]
	  	}, {
		  	name: '学科',
		  	list: [{
			  	name: '二年级',
			  	value: '20',
			  	selected: false
			  }, {
			  	name: '三年级',
			  	value: '21',
			  	selected: false
			  }, {
			  	name: '一年级',
			  	value: '22',
			  	selected: false
			  }]
	  	}, {
		  	name: '学期',
		  	list: [{
			  	name: '二年级',
			  	value: '20',
			  	selected: false
			  }, {
			  	name: '三年级',
			  	value: '21',
			  	selected: false
			  }, {
			  	name: '一年级',
			  	value: '22',
			  	selected: false
			  }]
	  	}, {
		  	name: '出版社',
		  	list: [{
			  	name: '二年级',
			  	value: '20',
			  	selected: false
			  }, {
			  	name: '三年级',
			  	value: '21',
			  	selected: false
			  }, {
			  	name: '一年级',
			  	value: '22',
			  	selected: false
			  }]
	  	}
	  ]
	},
	list: {
		resultCode: 'SUCCESS',
	  message: 'success',
	  data: [{
	  	jc: '教材',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }, {
	  	jc: '课本',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }, {
	  	jc: '练习',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }, {
	  	jc: '其他',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }, {
	  	jc: '参考书',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }/*, {
	  	jc: '教材',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }*//*, {
	  	jc: '教材',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }, {
	  	jc: '教材',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }*//*, {
	  	jc: '教材',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }, {
	  	jc: '教材',
	  	xd: '高中',
	  	nj: '三年级',
	  	xk: '数学',
	  	xq: '上学期',
	  	cbs: '人民教育出版社',
	  	zb: '李三四',
	  	bb: '2006',
	  	tm: '高中数学必修六'
	  }*/]
	},
	categorylist: {
		resultCode: 'SUCCESS',
	  message: 'success',
	  data: [{
	  	t1: '2017-9-1/王小丽',
	  	t2: '教案',
	  	t3: '高中数学教案',
	  	t4: ['数学', '类别2']
	  }, {
	  	t1: '2017-9-1/王小丽',
	  	t2: '教案',
	  	t3: '高中数学教案',
	  	t4: ['数学', '类别2']
	  }]
	},
	accountManage:{
	 	resultCode: 'SUCCESS',
	  message: 'success',
	  data:	[{
	  	t1:	'2017-12-11	18:18',
	  	t2:	'张三',
	  	t3:	'12306',
	  	t4:	'语文学科编辑',
	  	t5:	'学科资源部',
	  	t6:	'隔壁老王',
	  	t7:	'250',
	  	t8:	'13568886888'
	  },{
	  	t1:	'2017-12-11	18:18',
	  	t2:	'张三',
	  	t3:	'12306',
	  	t4:	'语文学科编辑',
	  	t5:	'学科资源部',
	  	t6:	'隔壁老王',
	  	t7:	'250',
	  	t8:	'13568886888'
	  }]
	 }
}