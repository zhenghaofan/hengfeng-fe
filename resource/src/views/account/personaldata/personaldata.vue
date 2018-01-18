<template>
<!-- 表单 1-->
<div class="g-form g-mt20">
	<div class="col2 f-clearfix">
		<div class="control">
			<label class="label">账号角色</label>
			<div class="txts">
				<input type="text" disabled="disabled" class="ipt ipt-disabled" v-model="roleName" />
			</div>
		</div>
		<div class="control">
			<label class="label">登录账号</label>
			<div class="txts">
				<input type="text" disabled="disabled" class="ipt ipt-disabled" v-model="username" />
			</div>
		</div>
	</div>

	<div class="col2 f-clearfix">
		<div class="control">
			<label class="label">姓名</label>
			<div class="txts">
				<input type="text" class="ipt ipt-disabled" disabled="disabled" v-model.trim.lazy="name" />
			</div>
		</div>
		<div class="control">
			<label class="label">工号</label>
			<div class="txts">
				<input type="text" class="ipt ipt-disabled" disabled="disabled" v-model.trim="jobNumber" />
			</div>
		</div>
	</div>

	<div class="col2 f-clearfix">
		<div class="control" v-if="parentName">
			<label class="label">直接上级</label>
			<div class="txts">
				<input type="text" class="ipt ipt-disabled" disabled="disabled" v-model="parentName" />
			</div>
		</div>
		<div class="control" v-if="parentRoleName">
			<label class="label">上级角色</label>
			<div class="txts">
				<input type="text" class="ipt ipt-disabled" disabled="disabled" v-model="parentRoleName" />
			</div>
		</div>
	</div>

	<div class="col2 f-clearfix">
		<div class="control">
			<label class="label">联系电话</label>
			<div class="txts">
				<input type="text" class="ipt" placeholder="请输入联系电话" v-model.trim="telephone" maxlength="13" @focus="clearErrorTips" />
				<span class="imptat">*</span>
			</div>
		</div>
		<div class="control">
			<label class="label">账号密码</label>
			<div class="txts">
				<input type="text" class="ipt ipt-disabled" disabled="disabled" placeholder="请修改初始密码" v-if="passwordUpdated===false"/>
				<input type="text" class="ipt ipt-disabled" disabled="disabled" placeholder="初始密码已修改" v-else/>
			</div>
		</div>
	</div>

	<!-- 提交及错误提示 -->
	<div class="g-account-submit">
		<p class="g-mb10 t-error" v-show="hasError">*{{errorTips}}</p>
		<a href="#" @click.prevent="save" v-show="showInfo" class="btn btn-green" :class="{'btn-disabled': isSaving}">{{btnText}}</a>
	</div>

</div>
<!-- 表单1/ -->
</template>

<script>
import Vue from 'vue'
//表单校验
import validator from '@/components/Validator.js'
Vue.use(validator)
//集成api
import apiUrl from '@/api/url.js'
//引入弹窗
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);
	
export default {
	data: function() {
		return {
			showInfo: true,
			showEditPwd: false,
			roleName: '',
			username: '',
			name: '',
			jobNumber: '',
			parentName: '',
			parentRoleName: '',
			passwordUpdated: '',
			telephone: '',
			hasError: false,
			errorTips: '必填项请填写完整',
			isSaving: false,
			btnText: '更新保存',
		};
	},
	components: {
		//    singleSelect
	},
	methods: {
		getPersonalInfo: function() {
			var self = this;

			apiUrl.getPersonalInfo().then(function (res) {
			
			var _result = res.data.user;
			self.roleName = _result.roleName;
			self.username = _result.username;
			self.name = _result.name;
			self.jobNumber = _result.jobNumber;
			self.parentName = _result.parentName;
			self.parentRoleName = _result.parentRoleName;
			self.passwordUpdated = _result.passwordUpdated;
			self.telephone = _result.telephone;				
			
			}, function (res) {
			console.log('err:' + res);
			});
		},
		//清除错误提示
		clearErrorTips: function () {
			this.hasError = false;
			this.errorTips = '';
		},
		//修改电话号码
		save: function() {
			var self = this,
				params = {
					telephone: this.telephone,
				},
        checkMap = {
          telephone: ['requried,phone', '联系电话不能为空']
        };
			//校验不通过
			//if(!this.checkForm(params)) {
			if (!this.$validator(checkMap, this).test) {
				//提示
				this.hasError = true;
				this.errorTips = this.$validator(checkMap, this).tips || '必填项请填写完整';
				return false;
			}else{
				this.isSaving = true;
				this.btnText = '保存中...';

				apiUrl.saveTelephone(params).then(function(res) {
					console.log(res);
					self.isSaving = false;
					self.btnText = '更新保存';

					self.$myMsgBox({
	          message: '<p><i class="icon-pop-succ"></i></p>\
	                    <p>资料已更新成功。</p>'
	        });
				}, function(res) {
					console.log('err:' + res.message);
					self.isSaving = false;
					self.btnText = '更新保存';
				});
			}				
		},
		//校验
		checkForm: function(checkObj) {
			if(!checkObj) {
				return false;
			}

			//简单校验不为空
			for(var item in checkObj) {
				if(!checkObj[item]) {
					return false;
				}
			}

			return true;
		}
	},
	mounted: function() {
		var self = this;

		this.$nextTick(function() {
			//获取角色列表
			self.getPersonalInfo();
		});
	}
}
</script>

<style>
	.g-form .select-newrole,
	.g-form .select-newrole .u-select-name,
	.g-form .select-newrole .u-select-list {
		width: 200px;
	}
	.g-mb50{
		margin-bottom: 0;
	}
	.form-2 .txts {
		position: relative;
	}
	.form-2 .label {
		text-align: left;
	}
	.form-2 .control {
		text-align: center;
		margin-left: 130px;
	}
	.tips-img {
		position: absolute;
		right: 5px;
		top: 10px;
		width: 22px;
		height: 17px;
		display: inline-block;
		background: url(../../../../static/images/icons.png) -76px -300px;
		vertical-align: sub;
	}
	
	.f-tips {
		line-height: 12px;
		height: 12px;
		color: #f25454;
		font-size: 12px;
		position: absolute;
		right: 0px;
		bottom: -15px;
	}
	/*弹窗style*/
.m-popup-mini {
  background: #ffffff url(../../../../static/images/icon_modifysuccessfully.png) no-repeat 50%;
}
.a-img {
  position: absolute;
  bottom: 0px;
  right: 7px;
}
</style>