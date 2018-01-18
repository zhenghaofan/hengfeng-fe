<template>
  <div class="g-categoryedit">
    <div class="g-form-control f-l f-clearfix">
      <label>类别名称</label>
      <div class="g-form-ipts"><input type="text" disabled="disabled" class="g-form-iptxt" v-model="item.name" /></div>
    </div>
    <div class="g-form-control f-l f-clearfix">
      <label class="g-valign-t">类别释义</label>
      <div class="g-form-ipts">
        <textarea class="g-form-txtarea" v-model.trim="remark" placeholder="高中教学教案" :maxlength="remarkMaxLength"></textarea>
        <span class="g-form-lft">{{remarkMaxLength - remarkLength}}</span>
      </div>
    </div>
    <div class="g-form-control f-l f-clearfix">
      <label class="g-valign-t">下属标签</label>
      <div class="g-form-ipts">
        <input type="text" class="g-form-iptxt g-catetxtlabel" placeholder="请输入拟增加的二级属性标签，支持一次性输入多个，以':'作隔" v-model.trim="newLabel" @keyup.enter="addLabel" />
        <span class="btn btn-m btn-normal g-ml10" @click="addLabel"><i class="g-mr10">+</i>添加</span>
        <div class="g-mt10 m-labels g-tl m-catelabels">
          <div class="g-inblock g-mr10" v-for="(label, index) in item.childDictList"><span>{{label.name}}</span><i class="icon i-close" @click="delLabel(index)"></i></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      newLabel: '',
      item: '',
      remark: '',
      remarkMaxLength: 225,
      remarkLength: 0
    };
  },
  props: ['itemInfo'],
  watch: {
    'itemInfo': {
      handler: function (val, oldVal) {
        var self = this,
            item = val,
            childDictList = item.childDictList || [],
            labels = [];

        for (var i = 0, len = childDictList.length; i < len; i++) {
          labels.push({
            id: childDictList[i].id,
            name: childDictList[i].name
          });
        }
        self.item = {
          remark: item.remark,
          name: item.name,
          id: item.id,
          childDictList: labels
        };
        self.remark = item.remark;
        self.remarkLength = 0;
      },
      deep: true
    },
    'item': {
      handler: function (val, oldVal) {
        this.item.remark = this.remark;
        this.$emit('childEdited', this.item);
      },
      deep: true
    },
    'remark': {
      handler: function (val, oldVal) {
        this.item.remark = val;
        this.$emit('childEdited', this.item);
        if(this.remark) {
          this.remarkLength = this.remark.length || 0;
        }
      }
    }
  },
  methods: {
    //添加标签
    addLabel: function () {
      var self = this;
      if (!this.newLabel) {
        return;
      }

      //去掉末尾的';'
      if (this.newLabel.slice(-1) === ';') {
        this.newLabel = this.newLabel.slice(0, -1);
      }
      //';'号做分隔
      var labels = this.newLabel.split(':'),
          temp = [];

      for (var i = 0, len = labels.length; i < len; i++) {
        //过滤相同的标签
        if (!isInList(this.item.childDictList, labels[i])) {
          this.item.childDictList.push({
            name: labels[i]
          });
        }       
      }

      function isInList(list, name) {
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].name === name) {
            return true;
          }
        }
        return false;
      }

      //清空输入框
      this.newLabel = '';
    },
    //删除标签
    delLabel: function (index) {   
      this.item.delLabels = this.item.delLabels || [];
      this.item.delLabels.push({
        id: this.item.childDictList[index].id
      });
      this.item.childDictList.splice(index, 1);
    }
  },
  mounted: function () {
    var self = this;
    this.$nextTick(function () {

    });
  }
}
</script>

<style>
.g-categoryedit {
  width: 700px;
  margin: 0 auto;
}
.g-catetxtlabel {
  width: 510px;
}
</style>
