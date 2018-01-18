<template>
<transition name="fade">
  <div class="mymsg-wrap" id="mymsg-wrap" v-show="show" transition="fade">
    <!-- 遮罩层 -->
  	<div class="mymsg-mask"></div>

    <!-- 弹窗 -->
    <div class="mymsg-inner" :class="[addCls]">
      <!-- 头部 -->
      <slot name="mymsg-header">
        <div class="mymsg-tit">{{title}}</div>
      </slot>
      <div class="mymsg-close" @click="close" v-if="hasCloseBtn"></div>

      <!-- 内容区 -->
      <div class="mymsg-con">
        <slot name="mymsg-body">
          <div v-html="message"></div>
        </slot>       
      </div>

      <!-- 确定or取消按钮 -->
      <div class="mymsg-bot" v-show="hasBtns">
        <slot name="mymsg-footer">
          <a href="#" class="btn btn-green g-mr20" v-show="hasCancelBtn" @click.prevent="cancel" :class="cancelClass">{{cancelTxt}}</a>
          <a href="#" class="btn btn-green" v-show="hasConfirmBtn" @click.prevent="confirm" :class="confirmClass">{{confirmTxt}}</a>
        </slot>
      </div>

    </div>
    <!-- 弹窗/ -->
  </div>
</transition>
</template>

<script>
export default {
  name: 'MyMsgBox',
  data: function () {
    return {
      show: true,
      hasCloseBtn: true,
      addCls: '', //额外的修饰类
      title: '提示', //标题
      message: '', //提示内容
      hasBtns: true, //是否需要按钮
      hasCancelBtn: false, //是否需要“取消”按钮
      cancelTxt: '取消', //“取消”按钮的文字
      cancelClass: '', //“取消”按钮的样式
      hasConfirmBtn: true, //是否需要“确定”按钮
      confirmTxt: '确定', //“确定”按钮的文字
      confirmClass: '', //“确定”按钮的样式
    };
  },
  mounted: function () {
    
  },
  methods: {
    confirm: function () {
      this.callback && this.callback();
      this.originClose();
    },
    cancel: function () {
      this.cancelCallback && this.cancelCallback();
      this.originClose();
    },
    //关闭
    close: function () {
      this.closeCallback && this.closeCallback();
      this.originClose();
    },
    originClose: function () {
      document.querySelector('body').removeChild(document.querySelector('#mymsg-wrap'));
      this.show = false;
    }
  }
}
</script>

<style>
.mymsg-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9997;
}
.mymsg-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background-color: rgba(0, 0, 0, .3);
}
.mymsg-inner {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 26rem;
  height: 18rem;
  margin: -9rem 0 0 -13rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, .1);
  text-align: center;
  z-index: 9999;
}
.mymsg-close {
  position: absolute;
  right: 20px;
  top: 10px;
  width: 16px;
  height: 16px;
  background: url('images/icon_close.jpg') 0 0 no-repeat;
  cursor: pointer;
}
.mymsg-tit {
  padding: 20px 10px;
  font-size: 1rem;
  text-align: center;
}
.mymsg-con {
  width: 300px;
  margin: 10px auto 0;
  font-size: 15px;
}
.mymsg-bot {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
/* 只有文字提示的弹窗 */
.mymsg-txtonly {
  width: 16rem;
  height: 10rem;
  margin: -5rem 0 0 -8rem;
  text-align: center;
}
</style>