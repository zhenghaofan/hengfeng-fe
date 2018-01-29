import Vue from 'vue'
//引入弹窗
import loginBox from './LoginBox.vue'

var tmpVue;
//提示弹窗
function showBox (returnPrevPage) {
  //暂时先移除
  //document.body.removeChild(document.getElementById('g-login'));

  var html, msgBox;
  //已有
  if (document.getElementById('g-login')) {
    tmpVue.show = true;
  } else {
    //第一次用
    html = '<login-box :show="show" :return-prev-page="returnPrevPage"></login-box>';
    var div = document.createElement('div');
    div.innerHTML = html;
    div.id = 'g-login';
    document.body.appendChild(div);

    tmpVue = new Vue({
      el: '#g-login',
      components: {
        loginBox
      },
      data: {
        show: true,
        returnPrevPage: returnPrevPage,
      }
    });
  }
}

export default {
	showBox: showBox
};