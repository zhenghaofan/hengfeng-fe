import Vue from 'vue'
const install = function(Vue) {
	Vue.prototype.$validator = validator;
};
export default install;

function validator(checkMap, vue) {
	var rules, tips;
	for (var name in checkMap) {
		rules = checkMap[name][0].split(',');
		tips = checkMap[name].length > 1 ? checkMap[name][1] : '不能为空';
		for (var i = 0, len = rules.length; i < len; i++) {
			if (!myRules[rules[i]].test(vue[name])) {
				//必填项特殊
				if (rules[i] !== 'requried' && rules[i] !== 'notEptArr') {
					tips = myRules[rules[i]].message;
				}
				return {
					test: false,
					tips: tips
				};
				break;
			}
		}
	}
	return {
		test: true
	};
}

var myRules = {
	//不为空
	requried: {
    test: function(val){
      if(val) {
        return true;
      }
      return false;
    },
    message: '必填项不能为空'
	},
	notEptArr: {
    test: function(val){
      if(val.length > 0) {
        return true;
      }
      return false;
    },
    message: '必填项不能为空'
	},
	//手机
	phone: {
    test: function(val){
      if(/^((010-\d{7,8})|(0[2-9]\d{1,2}-\d{7,8})|(13\d{9})|(14[57]\d{8})|(15[0-35-9]\d{8})|(18[0-35-9]\d{8}))$/.test(val)) {
        return true;
      }
      return false;
    },
    message: '电话号码格式不正确'
	},
	//姓名
	name: {
    test: function(val){
    	if(/^[\u4e00-\u9fa5]{2,4}$/.test(val)) {
        return true;
      }
      return false;
    },
    message: '姓名应为2至4个汉字'
	},
	//工号
	jobNumber: {
		test: function(val){
    	if(/(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{3,10}/.test(val)) {
        return true;
      }
      return false;
    },
    message: '工号应为字母+数字，长度为3-10。'
	},
	//角色名称
	roleName: {
		test: function(val){
    	if(/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
        return true;
      }
      return false;
    },
    message: '角色应为2至10个汉字。'
	},
	//密码
	pwd: {
		test: function(val){
    	if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$/.test(val)) {
        return true;
      }
      return false;
    },
    message: '密码应为6-8位数字字母组合。'
	},
	max6: {
    test: function(val){
      if(val.length > 6) {
        return false;
      }
      return true;
    },
    message: '最大为6位'
	}
};