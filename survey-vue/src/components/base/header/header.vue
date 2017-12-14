<template lang="html">
  <div class="head">
    <div v-show="showBack" class="back" @click="goBack">
      <i class="iconf i-back"></i>返回
    </div>
    <span class="title">{{title.length > 10 ? formateTitle(title) : title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '问卷调查系统',
      require: true
    },
    showBack: {
      type: Boolean,
      default: true
    },
    url: {
      type: Object,
      default: null
    }
  },
  methods: {
    goBack() {
      if(this.url) {
        this.$router.push(this.url)
      } else {
        this.$router.back();
      }
    },
    formateTitle(title) {
      return title.substr(0, 10) + '...'
    }
  }
}
</script>

<style lang="css">
.head {
  font-size: 0.8rem;
  height: 2.5rem;
  background-color: #232323;
  color: white;
  text-align: center;
  width: 100%;
  z-index: 10;
  position: fixed;
  top: 0
}

.back {
  position: absolute;
  left: 1rem;
  line-height: 2.5rem;
}

.back img {
  margin-right: 0.3rem;
  width: 0.4rem;
  vertical-align: top;
  margin-top: 1rem;
}
.title {
  line-height: 2.5rem
}
</style>
