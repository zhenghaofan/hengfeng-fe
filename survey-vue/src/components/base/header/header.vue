<template lang="html">
  <div class="head">
    <div v-show="showBack" class="back" @click="goBack">
      <img src="./back.png">返回
    </div>
    <span class="title">{{title}}</span>
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
}

.back {
  position: absolute;
  left: 1.4rem;
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
