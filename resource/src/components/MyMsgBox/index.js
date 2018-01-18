import Vue from 'vue'
import Message from './MyMsgBox.vue'

Message.installMessage = function(options) {
	var message = Vue.extend(Message);
  var component = new message({
    data: options
  }).$mount();
  document.querySelector('body').appendChild(component.$el);
};

const install = function(Vue) {
  Vue.component(Message.name, Message);

  Vue.prototype.$myMsgBox = Message.installMessage;
}
export default install;