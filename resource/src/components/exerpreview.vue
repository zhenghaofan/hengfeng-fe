<template lang="html">
<div>
  <div class="item">
    <label class="tit">题目：</label>
    <a :href="url" v-if="showEdit">
      <i class="iconf i-edit"></i>
    </a>
    <div class="detail">
      <div class="width-limit" v-html="qus.name"></div>
      <!-- 连线题 -->
      <div class="ligature" v-if="qus.template==='LIGATURE'">
        <ligature :check-template="'LIGATURE'" type="preview" user-class="detail-liga" :source-data="{topics: qus.topics, answers: qus.answers}"></ligature>
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
      <!-- 选择题 -->
      <div class="choice" v-else-if="qus.template==='SINGLE_CHOICE' || qus.template==='MULTIPLE_CHOICE'">
        <span class="choice-item width-limit" v-for="(value, key) in qus.topics">
          {{key}}.<span v-html="value"></span>
        </span>
      </div>

      <!-- 问答题 -->
      <div class="choice" v-else-if="qus.template==='ESSAY'"></div>
      <!-- 判断题 -->
      <div v-else-if="qus.template === 'JUDGE'"></div>

      <!-- 综合题 -->
      <div class="synthesis" v-else-if="qus.template == 'SYNTHESIS'">
        <div v-for="(childexer, index) in qus.children" class="qus-item">
          <span>小题{{index+1}}: <span v-html="childexer.name"></span></span>

          <!-- 连线题 -->
          <div class="ligature" v-if="childexer.template==='LIGATURE'">
            <ligature :check-template="'LIGATURE'" type="preview" :source-data="{topics: childexer.topics, answers: childexer.answers}"></ligature>
          </div>
          <!-- 填空题 -->
          <template v-else-if="childexer.template==='GENERAL_GAP_FILLING'"></template>
          <!-- 完型填空题 -->
          <template v-else-if="childexer.template==='CLOZE_GAP_FILLING'">
            <div class="choice" v-for="(filling, fillIdx) in childexer.topics">
              {{fillIdx+1}}.
              <span class="choice-item" v-for="(value, key) in filling">
                {{key}}.{{value}}
              </span>
            </div>
          </template>
          <!-- 其他题型 -->
          <div class="choice" v-else-if="childexer.template==='SINGLE_CHOICE' || childexer.template==='MULTIPLE_CHOICE'">
            <span class="choice-item" v-for="(value, key) in childexer.topics">
              {{key}}.<span v-html="value"></span>
            </span>
          </div>
          <div class="details" v-if="childexer.template!=='LIGATURE'">

            <label>【答案】</label>
            <div class="detail width-limit">
              <!-- 多选 -->
              <template v-if="childexer.template==='MULTIPLE_CHOICE'">
                <template v-for="(ans, ansIdx) in childexer_answers">
                  <template v-if="ansIdx > 0">,</template>{{ans}}
                </template>
              </template>
              <!-- 填空或完型填空题 -->
              <template v-else-if="childexer.template==='GENERAL_GAP_FILLING'||childexer.template==='CLOZE_GAP_FILLING'">
                <span class="g-mr10" v-for="(ans, ansIdx) in childexer.answers">
                  {{ansIdx+1}}.<span v-html="ans" class="inline-span"></span><template v-if="ansIdx < childexer.answers.length-2"><br></template>
                </span>
                <br>
              </template>
              <!-- 简答题 -->
              <template v-else-if="childexer.template === 'ESSAY'">
                <span class="g-mr10" v-for="(ans, ansIdx) in childexer.answers">
                  {{ansIdx + 1}}.<span class="inline-span" v-html="childexer.topics[ansIdx]"></span>
                  <br>
                  <span class="inline-span" v-html="ans"></span>
                  <br>
                </span>
              </template>
              <!-- 判断 -->
              <template v-else-if="childexer.template==='JUDGE'">
                {{childexer.answers==false?'错':'对'}}
              </template>
              <template v-else>
                <div v-html="childexer.answers"></div>
              </template>
            </div>
          </div>
          <div class="details">
            <label>【解析】</label>
            <div class="detail">
              <!--简答题||连线题||完型填空 -->
              <template v-if="childexer.template==='ESSAY'||childexer.template==='CLOZE_GAP_FILLING'">
                <div v-for="(analysis, ansIdex) in childexer.analysis">
                  {{ansIdex+1}}.<div v-html="analysis" class="analysis"></div>
                </div>
              </template>
              <template v-else>
                <div v-html="childexer.analysis" class="analysis"></div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="choice" v-else>
        <span class="choice-item" v-for="(value, key) in qus.topics">
          {{key}}.{{value}}
        </span>
      </div>
    </div>
  </div>
  <div class="item" v-if="qus.answers!=undefined && qus.template!=='LIGATURE' && qus.template!=='SYNTHESIS'">
    <label>【答案】</label>
    <div class="detail width-limit">
      <!-- 多选 -->
      <template v-if="qus.template==='MULTIPLE_CHOICE'">
        <template v-for="(ans, ansIdx) in qus_answers">
          <template v-if="ansIdx > 0">,</template><span v-html="ans"></span>
        </template>
      </template>
      <!-- 填空或完型填空题 -->
      <template v-else-if="qus.template==='GENERAL_GAP_FILLING'||qus.template==='CLOZE_GAP_FILLING'">
        <span class="g-mr10" v-for="(ans, ansIdx) in qus.answers">
          {{ansIdx+1}}.<span v-html="ans" class="inline-span"></span><template v-if="ansIdx < qus.answers.length-2"><br></template>
        </span>
      </template>
      <!-- 简答题 -->
      <template v-else-if="qus.template === 'ESSAY'">
        <span class="g-mr10" v-for="(ans, ansIdx) in qus.answers">
          {{ansIdx + 1}}.<span class="inline-span" v-html="qus.topics[ansIdx]"></span>
          <br>
          <span class="inline-span" v-html="ans"></span>
          <br>
        </span>
      </template>
      <!-- 判断 -->
      <template v-else-if="qus.template==='JUDGE'">
        {{qus.answers==false?'错':'对'}}
      </template>
      <template v-else>
        <div v-html="qus.answers"></div>
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
  <div class="item" v-if="qus.analysis && qus.template != 'SYNTHESIS'">
    <label>【解析】</label>
    <div class="detail width-limit">
      <!--简答题||连线题||完型填空 -->
      <template v-if="qus.template==='ESSAY'||qus.template==='CLOZE_GAP_FILLING'">
        <div v-for="(analysis, ansIdex) in qus.analysis">
          {{ansIdex+1}}.<span v-html="analysis"></span>
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
</template>

<script>
import GL_CONST from '@/confdata/constant'
import ligature from '@/components/Exercise/ligature'

export default {
  components: {
    ligature
  },
  props: {
    qus: {},
    previewingExer: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    url: ''
  },
  data() {
    return {
      qus_answers: [],
      childexer_answers: []
    }
  },
  watch: {
    qus(value) {
      // console.log(value);
    },
    /*previewingExer(val) {
      console.log(this.qus);
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
    }*/
  },
  methods: {
    getDifcInfo(level) {
      return GL_CONST.EXESDIFCINFO[level];
    },
    sortAnswer(arr) {
      arr.sort((a, b) => {
        return a > b
      });
      return arr;
    },
    //初始化多选题的答案配置
    initData() {
      if (this.qus.template == 'MULTIPLE_CHOICE') {
        this.qus_answers = this.sortAnswer(this.qus.answers)
      } else if (this.qus.template == 'SYNTHESIS') {
        this.qus.children.forEach((child) => {
          if (child.template == 'MULTIPLE_CHOICE') {
            this.childexer_answers = this.sortAnswer(child.answers)
          }
        })
      }
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      this.initData();
    });
  },
}
</script>

<style lang="less" scoped>
.item {
    box-sizing: border-box;
    display: inline-block;
    // width: 49%;
    width: 100%;
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
        .synthesis {
            margin-top: 20px;
            .qus-item {
                margin-top: 20px;
            }
            .details {
                margin-top: 20px;
                .detail {
                    display: inline-block;
                    width: 80%;
                    .analysis {
                      display: inline-block;
                    }
                }
            }
        }
    }
    // }
}
.ligature {
  .ligature-item {
    display: inline-block;
    width: 200px;
    vertical-align: top;
  }
}
.liga-preview .liga-r {
  margin-left: 70px;
}
.inline-span p {
  display: inline-block;
}
.width-limit {
  max-width: 100%;
  overflow: auto;
  word-wrap: break-word;
}
</style>
