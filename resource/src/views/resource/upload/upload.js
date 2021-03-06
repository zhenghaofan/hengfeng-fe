import Vue from 'vue'
//引入头部
import gHeader from '@/components/GHeader'
//引入侧边栏
import gLeftbar from '@/components/GLeftbar'
//左边栏数据
import lefbarData from '@/confdata/leftbar'
//引入尾部
import gFooter from '@/components/GFooter'

//引入内容区
import uploadform from './upload.vue'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-diy/index.css'
// Vue.use(ElementUI)

new Vue({
	el: '.g-app',
	components: {
		gHeader,
		gLeftbar,
		uploadform,
		gFooter
	},
	data: {
		headerSel: 'nav-resource',
    //左侧菜单设置
    leftbarData: {
      leftbar: lefbarData.resource,
      curMenuId: 'lb-upload',
    },
	},
	methods: {

	}
});
