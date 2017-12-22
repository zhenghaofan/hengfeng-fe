<template>
<div class="group-list">
  <ul class="m-lmenu g-mr20 type-list">
    <li style="margin-left:40px;text-align: left">
      <i class="iconf g-mr10 i-list"></i>类别列表
    </li>
    <li style="border-top: 1px solid lightgray">
      <a href="#" @click.prevent="groupTypeClick(-1, '')" :class="{'selected': type==-1}">全部</a>
    </li>
    <li v-for="(item, index) in groupType" :key="item.id">
      <a href="#" :class="{'selected': type==index}" @click.prevent="groupTypeClick(index, item.id)">{{item.typeName}}</a>
    </li>
  </ul>

  <el-table :data="tableData.groupList" style="width: 75%">
    <el-table-column prop="groupName" label="小组名称"></el-table-column>
    <el-table-column prop="sectionName" label="所属学段"></el-table-column>
    <el-table-column prop="gradeName" label="所属年级"></el-table-column>
    <el-table-column prop="totalNum" label="当前人数"></el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <i @click="editGroup(scope.row)" class="iconf i-pencil big-font"></i>
        <i @click="deleteGroup(scope.row)" class="iconf i-trash big-font"></i>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagin">
    <el-pagination layout="prev, pager, next" :total="tableData.totalRecordCount" :current-page.sync="currentPage" @current-change="listPageChange">
    </el-pagination>
  </div>

</div>
</template>

<script>
import urls from '@/api/url.js'
import store from '@/store/'
import {
  mapGetters
} from 'vuex'

export default {
  data() {
    return {
      type: -1,
      currentPage: 1,
      params: {
        pageNo: 1
      },
      pageInfo: {
        totalPage: 1,
        curPage: 1
      },
    }
  },
  computed: {
    ...mapGetters({
      groupType: 'groupTypes',
      tableData: 'groupListData'
    })
  },
  methods: {
    getGroupTypes() {
      var self = this;
      store.dispatch('getGroupTypes').then(function() {
        self.getGroupList(self.params)
      });
    },
    groupTypeClick(index, id) {
      this.type = index;
      this.params.groupTypeId = id;
      this.getGroupList(this.params);
    },
    getGroupList(params) {
      store.dispatch('getGroupList', params).catch((err) => {
        this.$message.error(err)
      })
    },
    editGroup(row) {
      this.$emit('edit-group', row);
    },
    deleteGroup(row) {
      this.$confirm('确认删除该小组吗？', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         let id = row.id;
         urls.deleteGroup({
           groupId: id
         }).then((data) => {
           if (data.resultCode === 'SUCCESS') {
             this.$message({
               message: '删除小组成功',
               type: 'success',
               showClose: true,
               onClose: this.getGroupList(this.params)
             })
           }
         }).catch((err) => {
           this.$message.error(err)
         })
       }).catch(() => {

       });

    },
    listPageChange() {
      this.params.pageNo = this.currentPage;
      this.getGroupList(this.params);
    },
    // ...mapMutations({
    //   setGroupTypes: 'SET_GROUPTYPES'
    // })
  },
  created() {
    this.getGroupTypes();
  }
}
</script>

<style lang="css">
.type-list {
  background: white;
  width: 20%;
  float: left;
  max-height: 558px;
  overflow: scroll;
}
.type-list li {
  text-align: center;
}
.type-list li a {
  padding-left: 0;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
}
.big-font {
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
}
.pagin {
  margin: 20px 26px 0 0;
  text-align: right;
}
</style>
