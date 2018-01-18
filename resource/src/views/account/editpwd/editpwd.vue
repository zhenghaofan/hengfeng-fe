<template>
<!-- 表单2 -->
<div class="g-form form-2">
	<div class="control" v-if="passwordUpdated">
		<label class="label">旧密码</label>
		<div class="txts">
			<input type="password" placeholder="请输入原密码" id="oldPwd" class="ipt" maxlength="8" @blur="inputBlur('chkOldPwd',oldPassword)" @keyup="inputBlur('chkOldPwd',oldPassword)" v-model="oldPassword" autocomplete="off" /><span v-show="oldTips"  class="tips-img"></span>
			<span v-show="oldTips" class="f-tips">{{oldPasswordErr}}</span>
		</div>
	</div>

	<div class="control">
		<label class="label">新密码</label>
		<div class="txts">
			<input type="password" placeholder="请输入6~8位字母数字组合" id="newPwd" maxlength="8" class="ipt" @blur="inputBlur('chkNewPwd',password)" @keyup="inputBlur('chkNewPwd',password)" v-model="password" autocomplete="off" /><span v-show="newTips" class="tips-img"></span>
			<span v-show="newTips" class="f-tips">{{passwordErr}}</span>
		</div>
	</div>

	<div class="control">
		<label class="label">确认新密码</label>
		<div class="txts">
			<input type="password" placeholder="请再次输入新密码" id="rePwd" class="ipt" maxlength="8" @blur="inputBlur('chkRePwd',repassword)" @keyup="inputBlur('chkRePwd',repassword)" v-model="repassword" autocomplete="off" /><span v-show="reTips" class="tips-img"></span>
			<span v-show="reTips" class="f-tips">{{repasswordErr}}</span>
		</div>
	</div>

	<div class="control g-mt30">
		<label class="label">&nbsp;</label>
		<div class="txts">
			<p class="g-mb10 t-error" v-show="hasError">*{{errorTips}}</p>
			<a href="#" @click.prevent="reset" class="btn btn-green" :class="{'btn-disabled': btnDisabled}">{{btnText2}}</a>
		</div>
	</div>

</div>
<!-- 表单2 /-->
</template>

<script>
import Vue from 'vue'
//表单校验
import validator from '@/components/Validator.js'
Vue.use(validator)
//集成api
import apiUrl from '@/api/url.js'
//引入弹窗提示
import MyMsgBox from '@/components/MyMsgBox/index.js'
Vue.use(MyMsgBox);
	
	export default {
		data: function() {
			return {
				oldPasswordErr:'',
				passwordErr:'',
				repasswordErr:'',
				showBox: false,
				oldTips: false,
				newTips: false,
				reTips: false,
				oldPassword: '',
				password: '',
				repassword: '',
				hasError: false,
				errorTips: '必填项请填写完整',
				btnDisabled: true,
				btnText2: '确认修改',
				passwordUpdated: localStorage.getItem('passwordUpdated') === 'true' ? true : false
			};
		},
		components: {
			//    singleSelect
		},
		methods: {
			//input非空校验
			inputBlur: function(errItem,inputContent){
				this.oldTips = false;
				this.newTips = false;
				this.reTips = false;
				this.hasError = false;

				if(errItem === 'chkOldPwd'){
					if(inputContent===''){
						this.oldPasswordErr = '此项不能为空',
						this.oldTips = true
					}else{
						this.oldPasswordErr = '',
						this.oldTips = false
					}	
				}else if(errItem === 'chkNewPwd'){
					if(inputContent === ''){
						this.passwordErr = '请输入6~8位字母数字组合新密码',
						this.newTips = true
					}else if(this.repassword && this.repassword != this.password){
						this.passwordErr = '两次输入的密码不一致，请重新输入',
						this.newTips = true
					}else{
						this.passwordErr = '',
						this.newTips = false
					}
				}else if(errItem === 'chkRePwd'){
					if(inputContent === ''){
						this.repasswordErr = '请输入确认密码',
						this.reTips = true
					}else if(this.repassword != this.password){
						this.repasswordErr = '两次输入的密码不一致，请重新输入',
						this.reTips = true
					}else{
						this.repasswordErr = '',
						this.reTips = false
					}
				}
				
				//如果都不为空，改变按钮状态
				//修改过密码
				if (this.passwordUpdated) {
					if(this.oldPassword!='' && this.password!='' && this.repassword !='' && this.password === this.repassword){
						this.btnDisabled = false;
					}else{
						this.btnDisabled = true;
						return false;
					}
				}else{
					if(this.password!='' && this.repassword !='' && this.password === this.repassword){
						this.btnDisabled = false;
					}else{
						this.btnDisabled = true;
						return false;
					}
				}
			},
			chkequal: function(){
				if(this.repassword != this.password){
						this.repasswordErr = '请输入与新密码相同的密码',
						this.reTips = true
						return false;
					}else{
						this.repasswordErr = '',
						this.reTips = false
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
			},
			//修改密码
			reset: function(){
				var self = this,
						params = {
							password : self.password,
						},
						checkMap = {	            
	            password: ['requried,pwd', '请输入新密码'],           
	            repassword: ['requried,pwd', '请再次输入新密码']
		        };

		    //已修改过密码
		    if (this.passwordUpdated) {
		    	params.oldPassword = self.oldPassword;
		    	checkMap.oldPassword = ['requried,pwd', '请输入原密码'];
		    }

        if(this.repassword != this.password){
        	this.errorTips = '两次输入密码不一致，请重新输入！'
        	return false;
        }

				//校验不通过
				//if(!this.checkForm(params)) {
				if (!this.$validator(checkMap, this).test) {
					//提示
					this.hasError = true;
					this.errorTips = this.$validator(checkMap, this).tips || '必填项请填写完整';
					return false;
				}else{
					this.btnText2 = '修改中...';
					this.btnDisabled = true;
				};

				apiUrl.resetPwd(params).then(function(res) {
					//标记密码已更新过
					localStorage.setItem('passwordUpdated', true);

					self.btnDisabled = false;
					self.btnText2 = '确认修改';

					self.$myMsgBox({
		        message: '<p><i class="icon-pop-pwdsuc"></i></p><p class="g-mt20">密码修改成功！</p>',
		        confirmTxt: '返回首页',
		        callback: function () {
		          window.location.href = '/views/home.html';
		        }
		      });					
				}, function(res) {
					console.log('err:' + res.message);
					self.hasError = true;
					self.errorTips = res.message;
					self.btnDisabled = false;
					self.btnText2 = '确认修改';
				});
			},
			
		},
		watch:{
			//限制输入框只能输入字母和数字
      oldPassword:function(){
      		this.oldPassword=this.oldPassword.replace(/[\W]/g,'');
      },
       password:function(){
      		this.password=this.password.replace(/[\W]/g,'');
      },
       repassword:function(){
      		this.repassword=this.repassword.replace(/[\W]/g,'');
      },
		},
		mounted: function() {
			var self = this;

			this.$nextTick(function() {
				//获取角色列表
				
			});
		},
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
.form-2 {
	width: 420px;
  margin: 40px 0 0 90px;
}
.form-2 .txts {
	position: relative;
}
.tips-img {
	position: absolute;
	right: 5px;
	top: 10px;
	width: 20px;
	height: 17px;
	display: inline-block;
	background: url(../../../../static/images/icons.png) -182px 0px;
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
.a-img {
  position: absolute;
  bottom: 0px;
  right: 7px;
}
.g-account-submit {
  margin-top: 0px;
}
</style>