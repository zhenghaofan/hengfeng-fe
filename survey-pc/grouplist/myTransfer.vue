<template lang="html">
  <div>
    <ul class="m-lmenu g-mr20 role-group" ref="UL">
      <li style="margin-left:40px;text-align: left"><i class="iconf g-mr10 i-list"></i>角色列表</li>
      <li v-for="(item, index) in rolesList" :key="item.id" ref="roleType">
        <a href="#" :class="{'selected': type==index}" @click.prevent="rolesListClick(index, item.id)">{{item.name}}</a>
      </li>
      <!-- <el-pagination layout="prev, pager, next" :total="totalRolesCount" :current-page.sync="currentPage" @current-change="rolesPageChange">
      </el-pagination> -->
    </ul>
    <div class="el-transfer g-mt20">
      <div class="el-transfer-panel">
        <p class="el-transfer-panel__header">
          <el-checkbox v-model="allChecked" @change="handleAllCheckedChange" :indeterminate="isIndeterminate">
            全选
            <span>已选中{{ leftChecked.length }}人</span>
          </el-checkbox>
        </p>

        <div class="el-transfer-panel__body">
          <el-checkbox-group v-model="leftChecked" v-show="rolesUserList.length > 0" class="el-transfer-panel__list" @change="handleCheckedRolesChange">
            <el-checkbox class="el-transfer-panel__item" :label="item.name" :key="item.id" v-for="item in rolesUserList"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="el-transfer__buttons">
        <el-button type="primary" @click.native="addToRight" :disabled="leftChecked.length === 0">
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>

      <div class="el-transfer-panel">
        <p class="el-transfer-panel__header">已选</p>

        <div class="el-transfer-panel__body">
          <ul v-if="rightChecked.length > 0">
            <!-- <h2 class="role-type">{{item.name}}</h2> -->
            <li v-for="(item, index) in rightChecked" class="role-user">{{item.name}}
              <button type="button" class="g-fr delete" @click="deleteRight(item, index)">
                <i class="el-icon-close"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import urls from '@/api/url.js'
import {
  hasClass
} from '@/utils/dom'
import utils from '@/utils/index'
import Vue from 'vue'

export default {
  props: {
    rightChecked: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      type: 0,
      rolesList: [],
      rolesUserList: [],
      leftChecked: [], //左边已选中
      allChecked: false,
      isIndeterminate: true,
      // totalRolesCount: 0,
      // currentPage: 1,
      // getRolesParams: {
      //   pageNo: 1
      // }
    }
  },
  watch: {
    rolesUserList() {
      // this.updateIndeterminate()
    },
  },
  computed: {
    // rightCheckedNum() { //右边已选人数
    //   let num = 0
    //   this.rightChecked.forEach((item) => {
    //     num += item.userList.length
    //   })
    //   return num
    // },
  },
  methods: {
    handleAllCheckedChange(value) {
      this.leftChecked = value ? this.rolesUserList.map((item) => item.name) : [];
      this.isIndeterminate = false;
    },
    handleCheckedRolesChange(value) {
      let checkedCount = value.length;
      this.allChecked = checkedCount === this.rolesUserList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.rolesUserList.length;
    },
    getSelectedRole() {
      let role = '';
      this.$refs.roleType.forEach(item => {
        if (hasClass(item.children[0], 'selected')) {
          role = item.children[0].innerText
        }
      });
      return role;
    },
    getLeftCheckedItemIdByLabel(label) {
      let _id = null;
      this.rolesUserList.forEach((user) => {
        if(user.name === label) {
          _id = user.id;
        }
      })
      return _id;
    },
    canAddToRight(arr, _item) {
      let _id = this.getLeftCheckedItemIdByLabel(_item), status = 0;
      if (arr.map((obj) => obj.id).indexOf(_id) === -1) {
        status = 1; //直接push item
      } else {
        for (var i = 0; i < arr.length; i++) {
          if(arr[i].id === _id && arr[i].roleNameList.indexOf(this.getSelectedRole()) === -1) {
            status = 2; //添加到roleNameList
          }
        }
      }
      return status;
    },
    addToRight() {
      let role_type = this.getSelectedRole(),
        arr = [];
      this.leftChecked.forEach((item) => {
        // if (!this.rightChecked.length || (this.rightChecked.length && this.rightChecked.map((rightCheckedItem) => rightCheckedItem.name).indexOf(item) === -1)) {
          // let _arr = [], _arr.push(role_type);
          // this.rolesUserList.forEach((obj) => {
          //   if (obj.name === item) {
          //     this.rightChecked.push({
          //       id: obj.id,
          //       name: item,
          //       // roleNameList: _arr
          //     });
          //
            // }
          // })
          if (!this.rightChecked.length || (this.rightChecked.length && this.canAddToRight(this.rightChecked, item) === 1)) {
            this.rolesUserList.forEach((obj) => {
              if (obj.name === item) {
                this.rightChecked.push({
                  id: obj.id,
                  name: item,
                  roleNameList: [role_type]
                });
              }
            })
          } else if (this.rightChecked.length && this.canAddToRight(this.rightChecked, item) === 2) {
            this.rolesUserList.forEach((obj) => {
              if (obj.name === item) {
                for (var i = 0; i < this.rightChecked.length; i++) {
                  if(this.rightChecked[i].id === obj.id) {
                    this.rightChecked[i].roleNameList.push(role_type)
                  }
                }
              }
            })
          }
        })
      // this.rightChecked = this.rightChecked.concat(arr);
      // if (this.rightChecked.length > 0) {
      //   for (var i = 0; i < this.rightChecked.length; i++) {
      //     if (this.rightChecked[i].name === role_type) {
      //       this.rightChecked[i].userList = arr;
      //       return;
      //     }
      //   }
      // }
      // this.rightChecked.push({
      //   name: role_type,
      //   userList: arr
      // })
    },
    deleteRight(obj, index) {
      if(this.rightChecked.map((item) => item.name).indexOf(obj.name) !== -1) {
        utils.removeByValue(this.leftChecked, obj.name);
        this.updateIndeterminate();
      }
      this.rightChecked.splice(index, 1);
    },
    updateIndeterminate() { //更新全选按钮
      if (this.leftChecked.length === this.rolesUserList.length) {
        this.isIndeterminate = false;
        this.allChecked = true;
      } else if (this.leftChecked.length === 0) {
        this.isIndeterminate = false;
        this.allChecked = false;
      } else {
        this.isIndeterminate = true;
      }
    },

    rolesListClick(index, id) {
      this.type = index;
      this.getRolesUserList(id);
    },
    getRolesList() {
      let self = this;
      urls.getRoles().then(function(data) {
        let res = data.data || {};
        self.rolesList = res.roleList;
        // self.totalRolesCount = res.totalRecordCount;
        // self.type = 0;
        self.getRolesUserList(self.rolesList[0].id)
      }, function(err) {
        self.$message.error(err);
      })
    },
    // rolesPageChange() {
    //   this.getRolesParams.pageNo = this.currentPage;
    //   this.getRolesList(this.getRolesParams);
    // },
    getRepeatIndex(arr){
      var new_arr = [];
      for(var i=0;i<arr.length;i++){
        for(var j=i+1;j<arr.length;j++) {
         if(arr[i].name == arr[j].name){
           new_arr.push(i,j);
         }
        }
      }
      return new_arr;
    },
    markRepeat(list, id) {
      var _list = this.getRepeatIndex(list);
      for (var i = 0; i < list.length; i++) {
        if(_list.indexOf(i) !== -1) {
          if(id === 5) {
            list[i].name = list[i].name + '（学号：' + list[i].jobNumber + '）'
          } else {
            list[i].name = list[i].name + '（电话：' + list[i].telephone + '）'
          }
        }
      }
      return list;
    },
    getRolesUserList(id) {
      let self = this;
      urls.getRolesUserList({
        roleId: id
      }).then(function(data) {
        let res = data.data || {};
        self.rolesUserList = self.markRepeat(res.userList, id);
        //异步更新leftChecked
        Vue.nextTick(() => {
          self.leftChecked = [];
          if (!self.rolesUserList.length) return;
          for (var i = 0; i < self.rightChecked.length; i++) {
            let username = self.rightChecked[i].name;
            if (self.rolesUserList.map((item) => item.name).indexOf(username) !== -1 && self.rightChecked[i].roleNameList.join('').indexOf(self.getSelectedRole()) !== -1) {
              self.leftChecked.push(username);
              self.updateIndeterminate();
            }
          }
        })
      }, function(err) {
        self.$message.error(err);
      })
    },
  },
  created() {
    // this.getRolesList(this.getRolesParams);
    this.getRolesList();
  }
}
</script>

<style lang="less">
@import '../../../../static/less/variable.less';
.role-group {
  background: white;
  width: 20%;
  float: left;
  position: relative;
  height: 392px;
  overflow: auto;
}
.role-group li {
  text-align: center;
}
.role-group li a {
  padding-left: 0;
}
.el-pagination {
  text-align: center;
  button {
    height: 100%;
    vertical-align: middle;
  }
}
.el-transfer-panel {
  width: 331px;
  .el-transfer-panel__body {
    overflow: auto;
    height: 350px;
    ul {
      padding: 10px 20px;
      color:#999;
      li {
        line-height: 2em
      }
    }
  }
}
.el-transfer-panel__list {
  height: 350px;
}
.role-group, .el-transfer-panel__body, .el-transfer-panel__list {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);*/
    &::-webkit-scrollbar-track {
    border-radius: 1px;
    background-color: #fff;
    width: 8px;
  }
}
.role-group, .el-transfer-panel__body, .el-transfer-panel__list {
    &::-webkit-scrollbar {
      width: 3px;
      background-color: #fff;
      width: 5px;
    }
}
.role-group, .el-transfer-panel__body, .el-transfer-panel__list {
  &::-webkit-scrollbar-thumb {
    border-radius: 1px;
    /*-webkit-box-shadow: inset 0 0 5px rgba(245, 245, 245, 1);*/
    background-color: #f3f3f3;
  }
}
.el-transfer__buttons {
  padding: 0 10px
}
.role-type {
  color: #232323;
  border-left: 2px solid #1ca2f2;
  padding-left: 10px;
  margin-bottom: 7px;
}
.role-user {
  padding-left: 12px;
}
.delete {
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
