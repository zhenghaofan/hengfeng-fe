<template>
<div>
  <span>类别</span>
  <el-select class="g-ml10 s-m" v-model="typeId" placeholder="请选择类别">
    <el-option v-for="item in groupTypes" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
  </el-select>

  <el-button type="primary" size="small" @click="openDialog" style="margin-right: 10px">添加类别</el-button>
  <el-dialog title="小组类别创建/编辑" :visible.sync="addTypeDialog" width="30%" center>
    <el-input placeholder="请输入小组类别名称" v-model="groupType" style="margin-bottom:12px;"></el-input>
    <template v-for="(item, index) in groupTypes">
      <span class="type-button">
        <span @click="editGroupType($event, index)" @input="groupTypeChange($event)" @blur="editComplete($event, item)">{{item.typeName}}</span>
        <button type="button" class="delete-type" v-if="index !== 0 && index !== 1" @click="deleteGroupType(item)"><i class="el-icon-close"></i></button>
      </span>

    </template>
    <p class="tips">Tips</p>
    <p class="sm-font">1.小组类别的创建，能够提高问卷发送对象选择的便捷性。建议至少创建两大类，如：按用户身份划分成“学生编班”“教职分组”</p>
    <p class="sm-font">2.可一次性输入多个小组类别名称，请用“英文的分号”进行文本间隔。</p>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addTypeDialog = false">取 消</el-button>
    <el-button type="primary" @click="createGroupType">确 定</el-button>
  </span>
  </el-dialog>

  <span>名称</span>
  <el-input placeholder="请输入小组名称" class="s-m g-mr10" v-model="groupName"></el-input>
  <span>学段</span>
  <el-select class="g-ml10 s-m g-mr10" v-model="period" placeholder="请选择学段" @change="getGrades">
    <el-option v-for="item in periods" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>
  <span>年级</span>
  <el-select class="g-ml10 s-m" v-model="grade" placeholder="请选择年级">
    <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>

  <my-transfer :right-checked="rightChecked"></my-transfer>

  <el-row class="g-tc g-mt50" style="clear: left">
    <el-button type="primary" name="button" @click="createGroup">确认创建</el-button>
  </el-row>
</div>
</template>

<script>
import store from '@/store/'
import urls from '@/api/url.js'
import {
  addClass
} from '@/utils/dom'
import myTransfer from './myTransfer'
import {
  mapGetters
} from 'vuex'
import Vue from 'vue'
import MyMsgBox from '@/components/MyMsgBox/index.js'

Vue.use(MyMsgBox)

export default {
  data() {
    return {
      typeId: '',
      groupName: '',
      periods: [],
      period: '',
      grades: [],
      grade: '',
      addTypeDialog: false,
      groupType: '',
      rightChecked: [],
    }
  },
  computed: {
    ...mapGetters([
      'groupTypes'
    ])
  },
  components: {
    myTransfer
  },
  methods: {
    openDialog() {
      this.addTypeDialog = true;
      this.groupType = ''
    },
    getPeriods() {
      let self = this;
      urls.getSection().then(function(data) {
        let res = data.data || {};
        self.periods = res.sectionList;
      }, function(err) {
        self.$message.error(err);
      })
    },
    getGrades() {
      let self = this;
      this.grade = '';
      urls.getGrades({
        sectionId: this.period
      }).then(function(data) {
        let res = data.data || {};
        self.grades = res.gradeList;
      }, function(err) {
        self.$message.error(err);
      })
    },
    createGroupType() {
      if (this.groupType === '') {
        this.addTypeDialog = false;
        return;
      }
      if (!this.groupType.match(/^[a-zA-Z0-9\u4e00-\u9fa5;]+$/g)) {
        this.$message.error('小组类别名称为中英文、阿拉伯数字');
        return;
      }
      this.addTypeDialog = false;
      let self = this;
      let params = {
        typeName: this.groupType
      }
      urls.createGroupType(params).then(function(data) {
        if (data.resultCode == 'SUCCESS') {
          self.$message.success('添加类别成功');
          store.dispatch('getGroupTypes')
        }
      }, function(err) {
        self.$message.error(err);
      })
    },
    editGroupType(ev, index) {
      if (index !== 0 && index !== 1) {
        let el = ev.target;
        el.contentEditable = "true";
        addClass(el, 'editing');
        el.nextElementSibling.style.display = "none";
        el.focus();
      }
    },
    groupTypeChange(ev) {
      // let el = ev.target;
      // if (el.innerText.length > 77) {
      //   this.$message.error('小组类别名称为中英文、阿拉伯数字，不超过15字');
      //   el.innerText = el.innerText.substring(0,14);
      // }
    },
    editComplete(ev, item) {
      let el = ev.target;
      el.contentEditable = "false";
      el.nextElementSibling.style.display = "inline";
      if (el.innerText === item.typeName) return;
      if (!el.innerText.match(/^[a-zA-Z0-9\u4e00-\u9fa5;]+$/g)) {
        this.$message.error('小组类别名称为中英文、阿拉伯数字');
        el.innerText = item.typeName;
        return;
      }
      urls.editGroupType({
        id: item.id,
        typeName: el.innerText
      }).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          this.$message.success('更改类别成功');
          store.dispatch('getGroupTypes')
        } else {
          el.innerText = item.typeName;
          this.$message.error(data.message)
        }
      }).catch((err) => {
        el.innerText = item.typeName;
        this.$message.error(err)
      })
    },
    deleteGroupType(item) {
      let self = this;
      this.$confirm('请问确定删除【' + item.typeName + '】小组类别？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        urls.deleteGroupType({
          id: item.id
        }).then((data) => {
          if (data.resultCode === 'SUCCESS') {
            self.$message.success('删除类别成功');
            store.dispatch('getGroupTypes')
          } else {
            self.$message.error(data.message)
          }
        }).catch((err) => {
          self.$message.error(err)
        })
      })
    },

    createGroup() {
      let self = this;
      let checkedArr = this.rightChecked.map((item) => item.id);
      let params = {
        "groupName": this.groupName,
        "sectionId": this.period,
        "gradeId": this.grade,
        "groupMemberList": checkedArr,
        "typeId": this.typeId
      }
      urls.createGroups(params).then(function(data) {
        if (data.resultCode === 'SUCCESS') {
          self.$myMsgBox({
            message: '<p><i class="icon-pop-succ"></i></p>\
                      <p>恭喜，小组创建成功。</p>',
            confirmTxt: '查看小组列表',
            hasCancelBtn: true,
            cancelTxt: '继续添加',
            callback: function () {
              //去列表页
              window.location.href = 'grouplist.html';
            },
            cancelCallback: function () {
              self.typeId = '';
              self.groupName = '';
              self.period = '';
              self.grade = '';
              self.groupType = '';
              self.rightChecked = [];
            }
          });

          store.dispatch('getGroupList', {
            pageNo: 1
          })
        }
      }, function(err) {
        self.$message.error(err);
      })
    }
  },

  created() {
    this.getPeriods();
  }
}
</script>

<style lang="less">
@import '../../../../static/less/variable.less';
.s-m {
  width: 17%;
  vertical-align: middle;
}
.sm-font {
  font-size: 12px;
}
.tips {
  color: black;
  margin-top: 20px;
  font-weight: bold;
  font-size: 14px;
}
.el-dialog__body {
  overflow: hidden;
  text-overflow: ellipsis;
}
.type-button {
  border: 1px solid #e5e5e5;
  border-radius: 25px;
  padding: 9px 15px;
  margin-right: 10px;
  background: #f5f5f5;
  // line-height: 5em;
  display: inline-block;
  margin-bottom: 12px;
  height: 20px;
  max-width: 92%;
}
.editing {
  outline: none;
}
.delete-type {
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  vertical-align: middle;
  &:hover {
    color: @colorPrimary;
  }
}
</style>
