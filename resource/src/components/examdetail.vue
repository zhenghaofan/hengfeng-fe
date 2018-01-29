<template lang="html">
  <div class="preview-box">
    <div class="icon-blue-trang"></div>
    <!-- 类型,章节,科段信息等 -->
    <div class="resource-info">
      <div class="item">
        <label>类型：</label>
        <div class="detail">{{resourceDictName}}</div>
      </div>
      <div class="item" v-if="resource.learnStage">
        <label>学段：</label>
        <div class="detail">{{resource.learnStage.name}}</div>
      </div>
      <div class="item" v-if="resource.grade">
        <label>年级：</label>
        <div class="detail">{{resource.grade.name}}</div>
      </div>
      <div class="item" v-if="resource.subject">
        <label>科目：</label>
        <div class="detail">{{resource.subject.name}}</div>
      </div>
      <div class="item" v-if="resource.textbook">
        <label>章节：</label>
        <div class="detail">
          {{resource.textbook.publisher}}－{{this.constdata.TERMOBJ[resource.textbook.termDictId]}}<template v-for="(book, index) in resource.textbookCatalogs">－{{book.name}}<catalog
            v-for="catalog in book.children"
            :key="catalog.id"
            :folder="catalog">
          </catalog>
        </template>
      </div>
      </div>
      <div class="item" v-if="resource.childDict">
        <label>题型：</label>
        <div class="detail">{{resource.childDict.name}}</div>
      </div>
      <!-- 试卷总题数 TODO -->
      <div class="g-tr" v-if="resource.resourceDictId === 'EXAM_PAPER'">
        试卷共{{resource.exercisesList.length}}小题
      </div>
    </div>

    <!-- 标题 -->
    <div class="g-tc big-font g-mb20">
      {{resource.name}}
    </div>
    <!-- 题目展示 -->
    <div class="question" v-for="(qus, queIdx) in questionList">
      <div class="g-mb20" v-for="(topic, topicIndex) in topics">
        <div class="" v-if="topicIndex === queIdx && topicIndex === 0">
          1、{{topic.childDict ? topic.childDict.name : ''}}（{{topic.examQuestionCount}}小题，共{{topic.scores}}分）
        </div>

        <div class="" v-else-if="topicIndex != 0 && (queIdx === getSum(topicIndex))">
          {{topicIndex + 1}}、{{topic.childDict ? topic.childDict.name : ''}}（{{topic.examQuestionCount}}小题，共{{topic.scores}}分）
        </div>
      </div>
        <exerpreview :qus="qus" :showEdit="true" :url="getEditUrl(qus.id)"></exerpreview>
    </div>

    <!-- 提交 -->
    <div class="g-tc g-mt20" v-if="!justpreview">
      <a href="#" class="btn btn-green" @click.prevent="back">返回</a>

      <a href="#" class="btn btn-green g-ml20" @click.prevent="beforeSubmit">提交</a>
    </div>
  </div>
</template>

<script>
import GL_CONST from '@/confdata/constant'
import exerpreview from '@/components/exerpreview'
// import ligature from '@/components/Exercise/ligature'

import Vue from 'vue'

//章节目录
Vue.component('catalog', {
  props: ['folder'],
  template: '<span><span>－{{ folder.name }}</span><catalog-contents :children="folder.children"/></span>'
});
Vue.component('catalog-contents', {
  props: ['children'],
  template: '<span><span v-for="child in children"><catalog v-if="child.children" :folder="child"/><span v-else>－{{ child.name }}</span></span></span>'
});

//知识点层级
Vue.component('knwpoint', {
  props: ['folder'],
  template: '<span><span class="knwpoint-item">{{ folder.name }}</span><catalog-contents :children="folder.children"/></span>'
});
Vue.component('knwpoint-contents', {
  props: ['children'],
  template: '<span><span v-for="child in children"><knwpoint v-if="child.children" :folder="child"/><span class="knwpoint-item" v-else>{{ child.name }}</span></span></span>'
});
export default {
  components: {
    exerpreview,
  },
  // props: ['justpreview', 'resource'],
  props: {
    justpreview: {
      default: false
    },
    resource: {
      type: Object
    },
    resource_id: {
      type: String
    },
    status: {
      type: String
    }
  },
  data() {
    return {
      resourceDictName: '',
      questionList: [],
      constdata: GL_CONST,
      topics: [],
      isOfficeDoc: false,
    }
  },
  watch: {
    resource: {
      handler(val) {
        this.init(val);
      },
      deep: true
    },
  },
  methods: {
    getEditUrl(id) {
      return '/views/resource/editres.html?status=' + this.status + '&id=' + id + '&resource_id=' + this.resource_id
    },
    getDifcInfo(level) {
      return this.constdata.EXESDIFCINFO[level];
    },
    back() {
      this.$emit('back', this.resource.id)
    },
    beforeSubmit() {
      this.$confirm('请检查试卷所有内容，确认无误后提交', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('beforeSubmit')
      })
    },
    getSum(topicIndex) {
      let sum = 0;
      while (topicIndex > 0) {
        sum += this.topics[topicIndex - 1].examQuestionCount;
        topicIndex--;
      }
      return sum;
    },
    init(val) {
      this.resourceDictId = val.resourceDictId;
      this.resourceDictName = this.constdata.RESOURCETYPESOBJ[val.resourceDictId];
      this.resourceName = val.name;
      this.questionList = val.exercisesList;
      this.topics = val.topics;
      //综合题
      // if (val.children) {
      //   this.questionList = val.children;
      // } else {
      // //单个题
      //   this.questionList.push(val);
      // }
      //章节
      if (val.textbook) {
        this.textbookName = val.textbook.name;
        this.termDictName = this.constdata.TERMOBJ[val.textbook.termDictId];
      }

      //题型类别 习题才有
      if (val.childDictId) {
        this.childDitTemplate = val.template;
        this.childDictName = this.constdata.EXESTYPESOBJ[this.childDitTemplate];
      }

      //如果是填空题 或 简答题 进行数据重组
      if (val.childDictId && (val.childDictId === 'FILL_IN_THE_BLANK' || val.childDictId === 'SHORT_ANSWER')) {
        var curLen = 0;
        for (var i = 0, len = val.topics.length; i < len; i++) {
          this.fillOrShortList[curLen] = {};
          this.fillOrShortList[curLen][val.topics[i]] = val.answers[i];
          curLen++;
        }
      }
    },
  },
  mounted() {
    this.init(this.resource);
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
    .resource-info {
        box-sizing: border-box;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #e5e5e5;
        line-height: 20px;
        .item {
            box-sizing: border-box;
            display: inline-block;
            width: 49%;
            padding: 0 20px 0 30px;
            margin-bottom: 10px;
            vertical-align: top;
            position: relative;
            label {
                display: inline-block;
                color: #999;
                vertical-align: top;
            }
            .detail {
                display: inline-block;
                width: 80%;
            }
        }
    }
    .question {
        box-sizing: border-box;
        padding: 5px 0 10px 25px;
        border-bottom: 1px dashed #e5e5e5;
        margin-bottom: 10px;
        .item {
            display: flex;
            margin-bottom: 8px;
            position: relative;
            .i-edit {
                position: absolute;
                right: 0;
            }
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
.big-font {
    font-size: 20px;
}
.s2 {
    text-decoration: underline;
}
.s4 {
    text-decoration: underline;
}
.s6 {
    text-decoration: underline;
}
.s8 {
    text-decoration: underline;
}
.s10 {
    text-decoration: underline;
}
.s12 {
    text-decoration: underline;
}
</style>
