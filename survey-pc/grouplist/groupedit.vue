<template>
<div>
  <span>类别</span>
  <el-select class="g-ml10 s-m g-mr10" v-model="typeId">
    <el-option v-for="item in groupTypes" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
  </el-select>

  <span>名称</span>
  <el-input placeholder="请输入小组名称" class="s-m g-mr10" v-model="groupName"></el-input>

  <span>学段</span>
  <el-select class="g-ml10 s-m g-mr10" v-model="period" @change="getGrades">
    <el-option v-for="item in periods" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>

  <span>年级</span>
  <el-select class="g-ml10 s-m" v-model="grade">
    <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>

  <my-transfer :right-checked="rightChecked"></my-transfer>

  <el-row class="g-tc g-mt50" style="clear: left">
    <el-button type="primary" name="button" @click="updateGroup">更新小组</el-button>
  </el-row>
</div>
</template>

<script>
import store from '@/store/'
import urls from '@/api/url.js'
import {
  hasClass
} from '@/utils/dom'
import utils from '@/utils/index'
import Vue from 'vue'
import myTransfer from './myTransfer'
import {
  mapGetters
} from 'vuex'

export default {
  props: {
    groupData: {
      type: Object,
      require: true,
      default: {}
    }
  },
  data() {
    return {
      typeId: '',
      groupName: '',
      value: '',
      selectedUser: [],
      // data: [],
      rolesList: [],
      rolesUserList: [],
      periods: [],
      period: '',
      grades: [],
      grade: '',
      type: 0,
      addTypeDialog: false,
      groupType: '',
      rightChecked: [], //右边数组
    }
  },
  components: {
    myTransfer
  },
  computed: {
    ...mapGetters([
      'groupTypes'
    ])
  },
  methods: {
    getPeriods() {
      let self = this;
      urls.getSection().then(function(data) {
        let res = data.data || {};
        self.periods = res.sectionList;
      }, function(err) {
        self.$message.error(err);
      })
    },
    getGrades(cb) {
      let self = this;
      urls.getGrades({
        sectionId: this.period
      }).then(function(data) {
        let res = data.data || {};
        self.grades = res.gradeList;
        self.grade = '';
        if (typeof cb === 'function') {
          cb();
        }
      }, function(err) {
        self.$message.error(err);
      })
    },
    getRepeatRoleName(arr1, arr2) {
      return arr1.filter(function(n) {
        return arr2.indexOf(n) !== -1
      })
    },
    formateRightChecked(arr) {
      let stuArr = [], unStuArr = [];
      for(let i=0;i<arr.length;i++){
        for(let j=i+1;j<arr.length;j++) {
          if(arr[i].name == arr[j].name){
            if(this.getRepeatRoleName(arr[i].roleNameList, arr[j].roleNameList).length > 0) {
              let new_arr = this.getRepeatRoleName(arr[i].roleNameList, arr[j].roleNameList);
              if (new_arr.indexOf('学生') !== -1) {
                stuArr.push(i,j);
              } else {
                unStuArr.push(i,j);
              }
            }
          }
        }
      }
      if(stuArr.length) {
        for (var i = 0; i < stuArr.length; i++) {
          arr[i].name = arr[i].name + '（学号：' + arr[i].jobNumber + '）'
        }
      }
      if(unStuArr.length) {
        for (var i = 0; i < unStuArr.length; i++) {
          arr[i].name = arr[i].name + '（电话：' + arr[i].telephone + '）'
        }
      }
      return arr;
    },
    getGroupDetail(id) {
      urls.getGroupDetail({
        groupId: id
      }).then((data) => {
        if (data.resultCode === 'SUCCESS') {
          let res = data.data || {};
          this.groupName = res.groupName;
          this.period = res.section.id;
          this.typeId = res.groupType.id;
          // roleList: [{id: ,name: , userList:[]}, {}]
          this.rightChecked = this.formateRightChecked(res.userList);
          this.getGrades(() => {
            this.grade = res.grade ? res.grade.id : '';
          })
        }
      })
    },
    updateGroup() {
      let self = this;
      // if (this.grade === '') {
      //   self.$message.error('请选择年级');
      //   return;
      // }
      let params = {
        "groupName": this.groupName,
        "sectionId": this.period,
        "gradeId": this.grade,
        "groupMemberList": this.rightChecked.map((item) => item.id),
        "typeId": this.typeId,
        "id": this.groupData.id
      }
      urls.updateGroups(params).then(function(data) {
        if (data.resultCode === 'SUCCESS') {
          self.$message.success('更新成功');
          self.$emit('show-list')
          store.dispatch('getGroupList', {pageNo: 1})
        }
      }, function(err) {
        self.$message.error(err);
      })
    }
  },

  created() {
    this.getPeriods();
    this.getGroupDetail(this.groupData.id);
  },
}
</script>

<style lang="css">
.s-m {
  width: 17%;
  vertical-align: middle;
}
</style>
