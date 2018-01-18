<template>
<transition name="fade">
  <div class="m-popup-wrap" v-show="pBox.show" transition="fade">
    <!-- 遮罩层 -->
  	<div class="g-mask"></div>

    <!-- 弹窗 -->
    <div class="m-popup" :class="[pBox.addCls]">
      <!-- 头部 -->
      <slot name="pop-header">
        <div class="m-popup-tit">{{pBox.title}}</div>
      </slot>
      <div class="m-popup-close" @click="close(0)">X</div>

      <!-- 内容区 -->
      <div class="m-popup-con">
        <slot name="pop-body">
          <div class="g-mt20">{{pBox.content}}</div>
        </slot>       
      </div>

      <!-- 确定or取消按钮 -->
      <div class="m-popup-bot" v-show="pBox.hasBtns">
        <slot name="pop-footer">
          <a href="#" class="btn btn-green g-mr10" v-show="pBox.hasCancelBtn" @click.prevent="close(1)" :class="pBox.cancelClass">{{pBox.cancelTxt}}</a>
          <a href="#" class="btn btn-green" v-show="pBox.hasConfirmBtn" @click.prevent="confirm" :class="pBox.confirmClass">{{pBox.confirmTxt}}</a>
        </slot>
      </div>

    </div>
    <!-- 弹窗/ -->
  </div>
</transition>
</template>

<script>
import gHeader from '@/components/GHeader'

export default {
  name: 'PopupBox',
  data: function () {
    return {
      show: false
    };
  },
  props: ['popupBoxOptions'],
  computed: {
    pBox: {
      get() {
        var pBox = this.$props.popupBoxOptions;

        function isUndefined(val) {
          return val === undefined ? true : val;
        }

        pBox = {
          show: pBox.show || false,
          addCls: pBox.addCls || '', //额外的修饰类
          title: pBox.title || '提示', //标题
          content: pBox.content || '', //提示内容
          hasBtns: isUndefined(pBox.hasBtns), //是否需要按钮
          hasCancelBtn: isUndefined(pBox.hasCancelBtn), //是否需要“取消”按钮
          cancelTxt: pBox.cancelTxt || '取消', //“取消”按钮的文字
          cancelClass: pBox.cancelClass || '', //“取消”按钮的样式
          hasConfirmBtn: isUndefined(pBox.hasConfirmBtn), //是否需要“确定”按钮
          confirmTxt: pBox.confirmTxt || '确定', //“确定”按钮的文字
          confirmClass: pBox.confirmClass || '', //“确定”按钮的样式
        };

        return pBox;
      }
    }
  },
  mounted: function () {
    this.$emit('show-popupbox');
  },
  //销毁前清理
  beforeDestroy: function () {
    this.$off('confirm', this.confirm);
    this.$off('close', this.close);
  },
  methods: {
    //确定
    confirm: function () {
      this.$emit('confirm');
      //this.$props.popupBoxOptions.show = false;
    },
    //取消
    //type 0为X关闭 1为取消并关闭
    close: function (type) {
      this.$props.popupBoxOptions.show = false;
      this.$emit('close', type);
    }
  }
}
</script>

<style>
.m-popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 997;
}
.g-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 998;
  background-color: rgba(0, 0, 0, .3);
}
.m-popup {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 51rem;
  height: 30rem;
  margin: -15rem 0 0 -25.5rem;
  /*width: 20rem;
  height: 20rem;
  margin: -10rem 0 0 -10rem;*/
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, .1);
  z-index: 999;
}
.m-popup-close {
  position: absolute;
  right: 20px;
  top: 10px;
  width: 14px;
  height: 16px;
  font-size: .8rem;
  cursor: pointer;
}
.m-popup-tit {
  padding: 20px 10px;
  font-size: 1rem;
  text-align: center;
}
.m-popup-con {
  padding: 0 40px 20px;
  font-size: .7rem;
}
.m-popup-bot {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
/* 小弹窗 */
.m-popup-mini {
  width: 26rem;
  height: 18rem;
  margin: -9rem 0 0 -13rem;
  text-align: center;
}
</style>