<template lang="html">
  <div class="preview-box">
  <div class="question">
    <exerpreview :qus="qus" :qus_answers="qus_answers" :childexer_answers="childexer_answers"></exerpreview>
  </div>
  <div class="g-tc g-mt20">
    <a href="#" class="btn btn-green" @click.prevent="back">返回</a>

    <a href="#" class="btn btn-green g-ml20" @click.prevent="beforeSubmit">提交</a>
  </div>
  </div>
</template>

<script>
import exerpreview from '@/components/exerpreview'

export default {
  components: {
    exerpreview
  },
  props: {
    qus: {
      type: Object
    },
    previewingExer: {
      type: Boolean,
      default: false
    },
  },

  watch: {
    previewingExer(val) {
      if (val) {
        if (this.qus.template == 'MULTIPLE_CHOICE') {
          this.qus_answers = this.sortAnswer(this.qus.answers)
        } else if (this.qus.template == 'SYNTHESIS') {
          this.qus.children.forEach((child) => {
            if (child.template == 'MULTIPLE_CHOICE') {
              this.childexer_answers = this.sortAnswer(child.answers)
            }
          })
        }
      }
    }
  },

  data() {
    return {
      qus_answers: [],
      childexer_answers: []
    }
  },

  methods: {
    back() {
      this.$emit('back')
    },
    beforeSubmit() {
      this.$emit('beforeSubmit')
    },
    sortAnswer(arr) {
      arr.sort((a, b) => {
        return a > b
      });
      return arr;
    }
  },
  mounted() {
  }
}
</script>

<style lang="less">
.preview-box {
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
    /*width: 920px;*/
    padding: 20px 70px;
    border-radius: 5px;
    font-size: 0.7rem;
    .icon-blue-trang {
        position: absolute;
        left: -3px;
        top: -3px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-top-color: #a5cdff;
        transform: rotateZ(135deg);
    }
    // .resource-info {
    //     box-sizing: border-box;
    //     padding-bottom: 10px;
    //     margin-bottom: 10px;
    //     border-bottom: 1px solid #e5e5e5;
    //     line-height: 20px;

    .question {
        box-sizing: border-box;
        padding: 5px 0 10px 25px;
        border-bottom: 1px dashed #e5e5e5;
        margin-bottom: 10px;
        .item {
            display: flex;
            margin-bottom: 15px;
            label {
                box-sizing: border-box;
                width: 90px;
                color: #999;
            }
        }
        .tit {
            padding-left: 8px;
        }
        .choice {
            .choice-item {
                display: inline-block;
                margin-right: 40px;
            }
            margin-top: 15px;
        }
        .ligature {
            .ligature-item {
                display: inline-block;
                width: 200px;
                vertical-align: top;
            }
        }
        .iconf {
            color: #00d487;
            font-size: 0.7rem;
        }
        .i-attach {
            margin-top: -6px;
        }
    }
    .question:last-child {
        border-bottom: none;
    }

}
</style>
