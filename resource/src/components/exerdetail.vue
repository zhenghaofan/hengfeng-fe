<template lang="html">
  <div class="preview-box">
  <div class="question">
    <div class="item">
      <label class="tit">题目：</label>
      <div class="detail">
        <div v-html="qus.name"></div>

        <!-- 连线题 -->
        <!-- <div class="ligature" v-if="qus.template==='LIGATURE'">
          <div class="ligature-item" v-for="(lx, idx) in qus.topics">
            <div v-for="(item, idx2) in lx" v-html="item"></div>
          </div>
        </div> -->
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
        <div class="choice" v-else-if="qus.template==='SINGLE_CHOICE' || qus.template==='MULTIPLE_CHOICE'">
          <span class="choice-item" v-for="(value, key) in qus.topics">
            {{key}}.<span v-html="value"></span>
          </span>
        </div>

        <!-- 综合题 -->
        <div class="synthesis" v-else-if="qus.template == 'SYNTHESIS'">
          <div v-for="(childexer, index) in qus.children" class="qus-item">
            <span>小题{{index+1}}: <span v-html="childexer.name"></span></span>

            <!-- 连线题 -->
            <div class="ligature" v-if="childexer.template==='LIGATURE'">
              <div class="ligature-item" v-for="(lx, idx) in childexer.topics">
                <div v-for="(item, idx2) in lx" v-html="item"></div>
              </div>
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
            <div class="details">

              <label>【答案】</label>
              <div class="detail">
                <!-- 多选 -->
                <template v-if="childexer.template==='MULTIPLE_CHOICE'">
                  <template v-for="(ans, ansIdx) in childexer_answers">
                    <template v-if="ansIdx > 0">,</template>{{ans}}
                  </template>
                </template>
                <!-- 填空或完型填空题或简答题 -->
                <template v-else-if="childexer.template==='GENERAL_GAP_FILLING'||childexer.template==='CLOZE_GAP_FILLING' || childexer.template === 'ESSAY'">
                  <span class="g-mr10" v-for="(ans, ansIdx) in childexer.answers">
                    {{ansIdx+1}}.{{ans}}<template v-if="ansIdx < childexer.answers.length-2">,</template>
                  </span>
                </template>
                <!-- 判断 -->
                <template v-else-if="childexer.template==='JUDGE'">
                  {{childexer.answers==false?'错':'对'}}
                </template>
                <template v-else>
                  {{childexer.answers}}
                </template>
              </div>
            </div>
            <div class="details">
              <label>【解析】</label>
              <div class="detail">
                <!--简答题||连线题||完型填空 -->
                <template v-if="childexer.template==='ESSAY'||childexer.template==='LIGATURE'||childexer.template==='CLOZE_GAP_FILLING'">
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
      </div>
    </div>
    <div class="item" v-if="qus.answers!=undefined && qus.template != 'SYNTHESIS'">
      <label>【答案】</label>
      <div class="detail">
        <!-- 多选 -->
        <template v-if="qus.template==='MULTIPLE_CHOICE'">
          <template v-for="(ans, ansIdx) in qus_answers">
            <template v-if="ansIdx > 0">,</template>{{ans}}
          </template>
        </template>
        <!-- 填空或完型填空题 -->
        <template v-else-if="qus.template==='GENERAL_GAP_FILLING'||qus.template==='CLOZE_GAP_FILLING'">
          <span class="g-mr10" v-for="(ans, ansIdx) in qus.answers">
            {{ansIdx+1}}.{{ans}}<template v-if="ansIdx < qus.answers.length-2">,</template>
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
    <div class="item" v-if="qus.analysis  && qus.template != 'SYNTHESIS'">
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
  <div class="g-tc g-mt20">
    <a href="#" class="btn btn-green" @click.prevent="back">返回</a>

    <a href="#" class="btn btn-green" @click.prevent="beforeSubmit">提交</a>
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
    qus: {
      type: Object
    },
    previewingExer: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      qus_answers: [],
      childexer_answers: []
    }
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

  methods: {
    getDifcInfo(level) {
      return GL_CONST.EXESDIFCINFO[level];
    },
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
