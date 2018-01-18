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
        试卷共{{resource.topics[0].examQuestionCount}}小题
      </div>
    </div>

    <!-- 题目展示 -->
    <div class="question" v-for="(qus, queIdx) in questionList">
      <div class="item">
        <label class="tit">题目：</label>
        <div class="detail">
          <div v-html="qus.name"></div>

          <!-- 连线题 -->
          <div class="ligature" v-if="qus.template==='LIGATURE'">
            <ligature type="preview" :source-data="{topics: qus.topics, answers: qus.answers}"></ligature>
          </div>
          <!-- 填空题 -->
          <template v-else-if="qus.template==='GENERAL_GAP_FILLING'"></template>
          <!-- 完型填空题 -->
          <template v-else-if="qus.template==='CLOZE_GAP_FILLING'">
            <div class="choice" v-for="(filling, fillIdx) in qus.topics">
              {{fillIdx+1}}.
              <span class="choice-item" v-for="(value, key) in filling">
                {{key}}.<span v-html="value"></span>
              </span>
            </div>
          </template>
          <!-- 其他题型 -->
          <div class="choice" v-else>
            <span class="choice-item" v-for="(value, key) in qus.topics">
              {{key}}.<span v-html="value"></span>
            </span>
          </div>

        </div>
      </div>
      <div class="item" v-if="qus.answers!=undefined">
        <label>【答案】</label>
        <div class="detail">
          <!-- 多选 -->
          <template v-if="qus.template==='MULTIPLE_CHOICE'">
            <template v-for="(ans, ansIdx) in qus.answers">
              <template v-if="ansIdx > 0">,</template><span v-html="ans"></span>
            </template>
          </template>
          <!-- 填空或完型填空题或简答题-->
          <template v-else-if="qus.template==='GENERAL_GAP_FILLING'||qus.template==='CLOZE_GAP_FILLING' || qus.template === 'ESSAY'">
            <span class="g-mr10" v-for="(ans, ansIdx) in qus.answers">
              {{ansIdx+1}}.<span v-html="ans"></span><template v-if="ansIdx < qus.answers.length-2">,</template>
            </span>
          </template>
          <!-- 判断 -->
          <template v-else-if="qus.template==='JUDGE'">
            {{qus.answers==false?'错':'对'}}
          </template>
          <template v-else>
            {{qus.answers}}
          </template>
        </div>
      </div>
      <div class="item" v-if="qus.difficultyLevel">
        <label>【难度】</label>
        <div class="detail">{{getDifcInfo(qus.difficultyLevel)}}</div>
      </div>
      <div class="item" v-if="qus.difficultyLevel">
        <label>【星级】</label>
        <div class="detail">{{qus.difficultyLevel}}</div>
      </div>
      <div class="item" v-if="qus.knowledgePoint">
        <label>【知识点】</label>
        <div class="detail">
          <span class="knwpoint-item">{{qus.knowledgePoint.name}}</span>
          <template v-for="(knwpoint, index) in qus.knowledgePointCatalogs">
            {{knwpoint.name}}
            <knwpoint
              v-for="knwpoint in knwpoint.children"
              :key="knwpoint.id"
              :folder="knwpoint">
            </knwpoint>
          </template>
        </div>
      </div>
      <div class="item" v-if="qus.analysis">
        <label>【解析】</label>
        <div class="detail">
          <!--简答题||连线题||完型填空 -->
          <template v-if="qus.template==='ESSAY'||qus.template==='LIGATURE'||qus.template==='CLOZE_GAP_FILLING'">
            <div v-for="(analysis, ansIdex) in qus.analysis">
              {{ansIdex+1}}.<div v-html="analysis"></div>
            </div>
          </template>
          <template v-else>
            <div v-html="qus.analysis"></div>
          </template>
        </div>
      </div>

      <div class="item" v-if="qus.videoUrl">
        <label>【视频链接】</label>
        <div class="detail">{{qus.videoUrl}}</div>
      </div>

    </div>

    <!-- 教案/课件/导学案之类 -->
    <div class="question">
      <!--资源描述 教案的资源描述-->
      <template v-if="resource.description">
        <div class="item">
          <label>资源描述：</label>
          <div class="detail">
            <div v-html="resource.description"></div>
          </div>
        </div>
      </template>

      <!--资源文件-->
      <template v-if="resource.sourceFile">
        <div class="item">
          <label>资源文件：</label>
          <div class="detail">
            <div class="g-mb10" v-if="resource.sourceFile.type === 'IMAGE' || resource.sourceFile.type === 'VIDEO' || resource.sourceFile.type === 'AUDIO'">
              <img v-if="resource.backgroundFileId" class="g-block" :src="resource.sourceFile.path" width="150" />
              <template v-else><i class="icon i-img"></i>无指定</template>
            </div>

            <div class="g-mb10">
              <i class="iconf" :class="{'i-video': resource.backgroundFileId, 'i-attach': !resource.backgroundFileId}"></i>
              <span class="preview-link">{{resourceName}}</span>
            </div>

            <!-- office 文件 -->
            <div class="g-mb10" v-if="isOfficeDoc">
              <a :href="previewDocLink" target="_blank" class="btn btn-green btn-s">预览</i></a>
            </div>

            <!-- 视频 -->
            <video class="g-mb10" controls="controls" v-if="resource.sourceFile.type === 'VIDEO'">
              <source :src="resource.sourceFile.path"></source>
              Your browser does not support the video tag.
            </video>

            <!-- 音频 -->
            <audio class="g-mb10" v-if="resource.sourceFileId.type === 'AUDIO'" :src="resource.sourceFile.path" controls="controls">
              Your browser does not support the audio element.
            </audio>

          </div>
        </div>
      </template>

      <!-- pdf预览 试卷的先加预览 -->
      <div class="pdf-preview" id="pageContainer" v-show="resource.sourceFile && resource.sourceFile.type === 'PDF'">

      </div>

    </div>
    <!-- 教案/课件/导学案之类\ -->
    <div class="g-tc g-mt20">
      <a href="#" class="btn btn-green" @click.prevent="back">返回</a>

      <a href="#" class="btn btn-green" @click.prevent="beforeSubmit">提交</a>
    </div>
  </div>
</template>

<script>
import GL_CONST from '@/confdata/constant'
import ligature from '@/components/Exercise/ligature'

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
  components:{
    ligature
  },
  props: {
    resource: {
      // type: Object
    }
  },
  data() {
    return {
      resourceDictName: '',
      questionList: [],
      constdata: GL_CONST
    }
  },
  watch: {
    resource(val) {
      this.resourceDictId = val.resourceDictId;
      this.resourceDictName = this.constdata.RESOURCETYPESOBJ[val.resourceDictId];
      this.resourceName = val.name;

      this.questionList = val.exercisesList;
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

      //office文档预览
      if (val.sourceFile && (val.sourceFile.type === 'WORD' || val.sourceFile.type === 'PPT' || val.sourceFile.type === 'EXCEL')) {
        this.previewDocLink = "javascript:POBrowser.openWindow('" + val.sourceFile.path + "', 'width=1200px;height=800px;')";
        this.isOfficeDoc = true;
      }

      //PDF预览
      if (val.sourceFile && val.sourceFile.type === 'PDF') {
        this.previewPDF(val.sourceFile.path);
      }
    }
  },
  methods: {
    getDifcInfo(level) {
      return this.constdata.EXESDIFCINFO[level];
    },
    back() {
      this.$emit('back')
    },
    beforeSubmit() {
      this.$emit('beforeSubmit')
    }
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
  font-size: .7rem;
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
      font-size: .7rem;
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
