import Vue from 'vue'
//引入弹窗
import messageBox from './PopupBox.vue'

var tmpVue;
//提示弹窗
function showMessage (obj) {
  //暂时
  /*if (document.getElementById('g-login')) {
    return;
  }*/
  var html, msgBox;
  //已有
  if (document.getElementById('g-msg')) {
    msgBox = tmpVue.messageBox;

    msgBox.show = true;
    msgBox.content = obj.message;
    msgBox.confirmTxt = obj.confirmTxt || msgBox.confirmTxt;
    msgBox.hasCancelBtn = obj.hasCancelBtn || false;
    msgBox.cancelTxt = obj.cancelTxt;
    msgBox.title = obj.title || msgBox.title;
    msgBox.addCls = obj.addCls || msgBox.addCls;

    tmpVue.confirm = obj.confirm || tmpVue.confirm;
  } else {
    //第一次用
    html = '<message-box :popup-box-options="messageBox" @confirm="confirm" @close="close"></message-box>';
    var div = document.createElement('div');
    div.innerHTML = html;
    div.id = 'g-msg';
    document.body.appendChild(div);

    tmpVue = new Vue({
      el: '#g-msg',
      data: {
        messageBox: {
          show: true,
          hasCancelBtn: obj.hasCancelBtn || false,
          confirmTxt: obj.confirmTxt ||'确定',
          title: obj.title || '提示',
          content: obj.message || '出错了',
          confirm: obj.confirm || '',
          addCls: obj.addCls || 'm-popup-mini'
        }
      },
      components: {
        messageBox
      },
      methods: {
        confirm: obj.confirm || function () {
          this.messageBox.show = false;         
        },
        close: obj.close || function () {
          this.messageBox.show = false;
        }
      }
    });
  }
}

export default {
	showMessage: showMessage
};