<template>
  <div class="g-pages" v-if="pages.totalPage > 1">
    <a class="icon i-prev" @click.prevent.stop="prev" :class="{'btn-disabled': pages.curPage < 2}">
      <!-- <i class="i-arr-l i-arr-l4" @click.stop><i class="i-arr-ra" @click.stop></i><i class="i-arr-rb" @click.stop></i></i> -->
    </a>

    <!-- currPage前 -->
    <template v-if="pages.curPage >= pageLimit">
      <a @click.prevent="gotoPage(1)">1</a>
      ...
      <a @click.prevent="gotoPage(pages.curPage - 1)">{{pages.curPage - 1}}</a>
    </template>
    <template v-else>
      <a v-for="n in (pages.curPage - 1)" @click.prevent="gotoPage(n)">{{n}}</a>
    </template>

    <!-- currPage -->
    <template>
      <a class="z-cur">{{pages.curPage}}</a>
    </template>

    <!-- currPage后 -->
    <template v-if="pages.totalPage - pages.curPage >= pageLimit">
      <a @click.prevent="gotoPage(pages.curPage + 1)">{{pages.curPage + 1}}</a>
      ...
      <a @click.prevent="gotoPage(pages.totalPage)">{{pages.totalPage}}</a>
    </template>
    <template v-else>
      <template v-for="n in pages.totalPage">
      <a v-if="n > pages.curPage" @click.prevent="gotoPage(n)">{{n}}</a>
      </template>
    </template>
    
    <a class="icon i-next" @click.prevent.stop="next" :class="{'btn-disabled': pages.curPage > pages.totalPage - 1}">
      <!-- <i class="i-arr-r i-arr-r4" @click.stop><i class="i-arr-ra" @click.stop></i><i class="i-arr-rb" @click.stop></i></i> -->
    </a>

    <span class="g-goto" v-if="!notNeedGoto">前往第<input class="ipt-page" v-model.number="curPage" @keyup="fixPageNum" @keyup.enter="gotoPage(curPage)" @blur="gotoPage(curPage)" maxlength="4" />页</span>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      pageLimit: 3, //超过几就显示...
      curPage: 1
    }
  },
  props: ['pages', 'notNeedGoto'], //notNeedGoto 不需要“前往第几页”
  methods: {
    //上一页
    prev: function (e) {
      if (e.target.className.indexOf('btn-disabled') !== -1) {
        return;
      }
      this.$data.curPage = this.$props.pages.curPage--;
      this.gotoPage(this.$data.curPage - 1);
      //this.$emit('prev');
    },
    //去到某一页
    gotoPage: function (p) {
      if (p > this.$props.pages.totalPage) {
        p = this.$props.pages.totalPage;
      }
      if (p < 1) {
        p = 1;
      }
      this.$data.curPage = p;
      this.$props.pages.curPage = p;
      this.$emit('goto', p);
    },
    //下一页
    next: function (e) {
      if (e.target.className.indexOf('btn-disabled') !== -1) {
        return;
      }
      this.$data.curPage = this.$props.pages.curPage++;
      this.gotoPage(this.$data.curPage + 1);
      //this.$emit('next');
    },
    fixPageNum: function (e) {
      e.target.value = e.target.value.toString().replace(/[^0-9]/, '');
    }
  },
  mounted: function () {
    this.curPage = this.$props.pages.curPage;
  }
}
</script>

<style>
.g-pages {
  /*position: absolute;
  left: 0;
  bottom: 0;*/
  width: 100%;
  margin-top: 50px;
  margin-bottom: 20px;
  text-align: center;
}
.g-pages a {
  box-sizing: border-box;
  display: inline-block;
  min-width: 30px;
  height: 30px;
  line-height: 26px;
  margin: 0 4px;
  padding: 2px 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  vertical-align: middle;
}
.g-pages .prev, .g-pages .next {
  font-family: 'Aril';
}
.g-pages a:hover, .g-pages .z-cur {
  background-color: #00d487;
  border-color: #00d487;
  color: #fff;
}
.g-pages .btn-disabled, .g-pages .btn-disabled:hover {
  background-color: #f1f1f1;
  border-color: #ccc;
  color: #999;
  cursor: default;
}
.g-goto {
  display: inline-block;
  margin-left: 10px;
}
.ipt-page {
  box-sizing: border-box;
  width: 40px;
  height: 30px;
  line-height: 30px;
  margin: 0 4px;
  border: 1px solid #ccc;
  border-radius: 2px;
  text-align: center;
}
.g-pages .i-prev, .g-pages .i-next {
  width: 30px;
  height: 30px;
  /*padding: 10px 12px;*/
}
.btn-disabled .i-prev, .btn-disabled .i-prev:hover {
  background-position: -60px -30px;
}
.btn-disabled .i-next, .btn-disabled .i-next:hover {
  background-position: -60px 0;
}
/*.prev .i-arr-l {
  left: -4px;
}
.btn-disabled .i-arr-l .i-arr-rb {
  border-right-color: #f1f1f1;
}
.btn-disabled .i-arr-r .i-arr-rb {
  border-left-color: #f1f1f1;
}
.prev:hover .i-arr-ra {
  border-right-color: #999;
}
.prev:hover .i-arr-rb {
  border-right-color: #00d487;
}
.prev.btn-disabled:hover .i-arr-rb {
  border-right-color: #f1f1f1;
}
.next:hover .i-arr-ra {
  border-left-color: #999;
}
.next:hover .i-arr-rb {
  border-left-color: #00d487;
}
.next.btn-disabled:hover .i-arr-rb {
  border-left-color: #f1f1f1;
}*/
</style>