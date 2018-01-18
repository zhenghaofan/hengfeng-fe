<template lang="html">
  <div class="">
    <div class="video-item g-mb20" v-for="(item, index) in datas" :key="item.id">
      <div class="video-container">
        <div class="video-block" :class="{'video-block-short':item.resource}">
          <p class="m-font">
            <i class="iconf i-video"></i>{{item.name}}
            <span>（{{item.sourceFile.duration ? item.sourceFile.duration.toFixed(2) : 0}}'）</span>
          </p>
          <video :src="item.sourceFile.path" controls="controls" style="width: 293px"></video>
        </div>
        <div class="video-block-short" v-if="item.resource">
          <p>
            {{item.resource.resource.name}}
          </p>
          <video :src="item.resource.resource.sourceFile.path" controls="controls" style="width:293px"></video>
        </div>
        <i class="iconf i-delete i-fixed iconb" @click="deleteVideo(item, index)"></i>
      </div>

      <div class="cover g-mt20">
        <p class="g-mb10">微课封面</p>
        <div class="cover_area" @click="selectCover(index, item.backgroundFile.path)">
          <img :src="item.backgroundFile.path" alt="">
          <i v-if="defaultChecked" class="iconf i-tick"></i>
        </div>
        <div class="cover_area" @click="selectCover(index)">
          <img src="../img/default_cover.jpg" alt="">
          <i v-if="!defaultChecked" class="iconf i-tick"></i>
        </div>
      </div>
      <el-input type="textarea" placeholder="请在此填写资源描述" :maxlength="500" v-model="description[index]" :rows="6"></el-input>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      description: [],
      hasRepeat: true,
      defaultChecked: true
    }
  },
  watch: {
    description(val) {
      this.$emit('desChanged', val)
    }
  },
  props: {
    datas: {
      require: true
    }
  },
  methods: {
    selectCover(index, background) {
      if (background) {
        this.defaultChecked = true;
      } else {
        this.defaultChecked = false;
      }
      this.$emit('coverchanged', index, background);
    },
    deleteVideo(item, index) {
      this.datas.splice(index, 1);
      this.$emit('deleteHandle', item)
    }
  },
  mounted() {
  }
}
</script>

<style lang="css">
.video-item {
  margin-left: 90px;
  background: white;
  padding: 20px;
}
.video-container {
  padding: 10px;
}
.video-block, .video-block-short {
  display: inline-block;
}
.video-block-short {
  width: 47%;
}
.video-block video, .video-block-short video {
  width: 75%;
  margin-top: 15px;
}
.m-font {
  font-size: 14px;
}
.el-textarea {
  margin: 10px 2%;
}
.el-textarea__inner {
  background: #EBECF1;
  width: 96%;
}
.i-fixed {
  position: absolute;
  right: 70px;
  font-size: 14px;
}
.cover {
  padding: 10px
}
.cover_area {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.cover_area img {
  margin: 0 10px;
  width: 120px;
  height: 120px;
}
.i-tick {
  color: white;
  background: #00d487;
  border-radius: 20px;
  border: 1px solid white;
  font-size: 12px;
  padding: 4px;
  position: absolute;
  bottom: 8px;
  right: 15px;
}
</style>
