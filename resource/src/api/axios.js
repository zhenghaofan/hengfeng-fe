//to fixed promise undefined in IEs
import 'babel-polyfill';
// 引用axios
import axios from 'axios';

import util from '../utils/index.js';

import Vue from 'vue';
//引入弹窗
import msg from '@/components/MessageBox.js';
//引入登录弹窗
import loginBox from '@/components/LoginBox/';

//API接口地址配置
import urlConfig from '../../config/url.config.js';

var dataType = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 50000; //响应时间
axios.defaults.baseURL = urlConfig.baseUrl;
axios.defaults.headers.post['Content-Type'] = dataType; //
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//开发环境才配置
if (urlConfig.isDevEnv) {
  axios.defaults.withCredentials = true; //可配置cookie
}

//POST传参序列化(添加请求拦截器)
var requestInterceptSuc = function (config) {
  //在发送请求之前做某件事
  if(typeof config.data === 'object' && config.method  === 'post' && config.headers.post['Content-Type'] === dataType){
    config.data = util.objToStr(config.data, '=', '&', true);
  }
  //过滤空值
  if (config.headers.post['Content-Type'] === 'application/json') {
    for (var item in config.data) {
      if (config.data[item] === '' || config.data[item] === null || config.data[item] === undefined) {
        delete config.data[item];
      }
    }
  }
  //加载loading图 TODO

  return config;
}
var requestInterceptErr = function (error) {
  //提示弹窗
  showMessage({
    message: error.message
  });
  console.log("错误的传参", 'fail');
  return Promise.reject(error);
};
axios.interceptors.request.use(requestInterceptSuc, requestInterceptErr);

//返回状态判断(添加响应拦截器)
var responseInterceptSuc = function (res) {
  var flag = res.data.resultCode,
      popMsg = ['FAIL', // 操作失败
                'NO_AUTH', //权限不够
                'SYSTEM_ERROR', //系统出错
                'DUPLICATION', //数据重复、重复操作
                'NO_EXISTS',//数据不存在
                'REMOTE_LOGIN'//异地登录，被挤下线
                ];
          
  //登录成功
  if (popMsg.indexOf(flag) !== -1) {
  //操作失败等
    // msg.showMessage({
    //   message: res.data.message
    // });
    return Promise.reject(res.data);
  } else if (flag === 'OCCUPATION') {
  //同时操作
    msg.showMessage({
      message: res.data.message,
      confirmTxt: '返回资源审核列表',
      confirm: function () {
        //资源审核页
        window.location.href = '/views/resource/auditres.html';
      },
      close: function () {
        //资源审核页
        window.location.href = '/views/resource/auditres.html';
      },
    });//要配置
    return Promise.reject(res.data);
  } else if (flag === 'NO_LOGIN') {
  //未登录或者登陆已超时
    
    msg.showMessage({
      message: res.data.message,
      confirmTxt: '去重新登录',
      confirm: function () {
        //登录页
        //window.location.href = '/views/login.html';
        document.body.removeChild(document.getElementById('g-msg'));
        loginBox.showBox();
      }
    });
    //要配置
    return Promise.reject(res.data);
  } else if (flag === 'REMOTE_LOGIN') {
  //异地登录，被挤下线
    msg.showMessage({
      message: res.data.message,
      confirmTxt: '去重新登录',
      confirm: function () {
        //登录页
        //window.location.href = '/views/login.html';
        document.body.removeChild(document.getElementById('g-msg'));
        loginBox.showBox();
      }
    });
    //要配置
    return Promise.reject(res.data);
  } else if (flag === 'PARAM_ERROR') {
  //参数有误，参数违背协议要求
    return Promise.reject(res.data);
  }

  //其他不成功情况
  if (flag !== 'SUCCESS') {
    return Promise.reject(res.data);
  }
  return res;
};
var responseInterceptErr = function (error) {
  //提示弹窗
  // msg.showMessage({
  //   message: error.message
  // });
  console.log("网络异常", 'fail');
  return Promise.reject(error);
};
axios.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

//返回一个Promise(发送post请求)
export default {
  get: function (url, params) {
    return new Promise(function(resolve, reject) {
      axios.get(url, params)
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          reject(err);
        })
        .catch(function (err) {
          reject(error);
        });
    });
  },
  post: function (url, params) {
    return new Promise(function(resolve, reject) {
      axios.post(url, params)
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          reject(err);
        })
        .catch(function (err) {
          reject(error);
        });
    });
  },
  //JSON格式
  postJson: function (url, params) {
    return new Promise(function(resolve, reject) {
      var inst = axios.create({
        headers: {
          post: {'Content-Type': 'application/json'}
        }
      });

      inst.interceptors.request.use(requestInterceptSuc, requestInterceptErr);
      inst.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

      inst.post(url, params)
      .then(function (response) {
        resolve(response.data);
      }, function (err) {
        reject(err);
      })
      .catch(function (err) {
        reject(error);
      });

    });
  },
  //formData格式
  postFormData: function (url, params) {
    return new Promise(function(resolve, reject) {
      var inst = axios.create({
        headers: {
          post: {'Content-Type': 'multipart/form-data'}
        }
      });

      inst.interceptors.request.use(requestInterceptSuc, requestInterceptErr);
      inst.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

      inst.post(url, params)
      .then(function (response) {
        resolve(response.data);
      }, function (err) {
        reject(err);
      })
      .catch(function (err) {
        reject(error);
      });

    });
  },
  originAxios: axios
};
