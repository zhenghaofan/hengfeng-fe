//TODO生产环境时 isProEnv改为true
(function () {
  var isProEnv =  false,//是否是生产环境
    loginUrl = isProEnv ? '/login' : 'http://192.168.12.58/login';

  //测试环境需要设置跨域
  if (!isProEnv) {
    $.ajaxSetup({
      type: 'POST',
      dataType: 'json',
      crossDomain: true,//支持跨域
      xhrFields: {
        withCredentials: true//Cookie验证需要设置为true
      }
    });
  }

  //变量定义
  var $username = $('.j-ipt-username'),//用户名输入框
      $pwd = $('.j-ipt-pwd'),//密码输入框
      $btnLogin = $('.j-btn-login'),//登录按钮
      $usernameTips = $('.j-username-tips'),//用户名提示区域
      $pwdTips = $('.j-pwd-tips'),//密码提示区域
      $commonTips = $('.j-common-tips'),//公共提示区
      //错误提示
      errorTips = {
        'usernameEmpt': '账号不能为空',
        'pwdEmpt': '密码不能为空'
      };

  //用户名
  $username.focus();//输入焦点
  $username.on('blur', function (e) {
    if (!$.trim($(this).val())) {
      $usernameTips.text(errorTips.usernameEmpt).show();
    } else {
      $usernameTips.text('').hide();
    }
  });
  $username.on('keyup', function (e) {
    $commonTips.text('').hide();

    //输入框只能输入字母和数字
    this.value = this.value.replace(/[^\w\.\/]/ig, '');

    if ($.trim($(this).val())) {
      $usernameTips.text('').hide();
    }
  });


  //密码
  $pwd.on('blur', function (e) {
    if (!$.trim($(this).val())) {
      $pwdTips.text(errorTips.pwdEmpt).show();
    } else {
      $pwdTips.text('').hide();
    }
  });
  $pwd.on('keyup', function (e) {
    $commonTips.text('').hide();

    //输入框只能输入字母和数字
    this.value = this.value.replace(/[^\w\.\/]/ig, '');

    if ($.trim($(this).val())) {
      $pwdTips.text('').hide();
    }
  });


  //登录
  $btnLogin.click(function (e) { //“登录”按钮单击事件
    e.preventDefault();

    //重置提示消息
    $commonTips.text('').hide();

    var self = $(this),
        usernameVal = $username.val(),//用户名的值
        pwdVal = $pwd.val();//密码的值

    //正在登录中...
    if (self.hasClass('btn-disabled')) {
      return;
    }

    //获取账号
    var username = $('.j-ipt-username').val();
    //获取输入密码
    var pwd = $('.j-ipt-pwd').val();
    var $tipsNode = $('.j-common-tips');

    //账号或密码为空
    if (!$.trim(usernameVal)) {
      $usernameTips.text(errorTips.usernameEmpt).show();
      return false;
    }

    if (!$.trim(pwdVal)) {
      $pwdTips.text(errorTips.pwdEmpt).show();
      return false;
    }

    self.val('登录中...').addClass('btn-disabled');

    //请求登录
    $.ajax({
      url: loginUrl,
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: {
        username: usernameVal,
        password: pwdVal,
      }
    }).
    done(function (res) { //登录成功后返回的数据
      //根据返回值进行状态显示
      if (res.resultCode === "SUCCESS") {
        var result = res.data,
            userInfo,
            passwordUpdated,
            gotoUrl;

        if(result && result.user){
          userInfo = result.user;
          passwordUpdated = userInfo.passwordUpdated;

          //储存用户名和密码
          localStorage.setItem('userId', userInfo.id);
          localStorage.setItem('userName', userInfo.name);
          localStorage.setItem('roleName', userInfo.roleName);
          //标记密码是否更新过
          localStorage.setItem('passwordUpdated', passwordUpdated);
          localStorage.setItem('authorityIds', JSON.stringify(result.authorityIds));

          //如果是首次登录就需要修改密码
          if(!passwordUpdated){
            gotoUrl = '/views/account/editpwd.html';
          }else{
            //非首次
            //gotoUrl = '/views/resourcelibs/resourcemanage/avairesource.html';
            gotoUrl = '/views/home.html';
          }
          //跳转至登录后的页面
          window.location.href = gotoUrl;
        } else {
          console.log('登录成功，但未拿到用户数据');
        }
      } else {
        $commonTips.text(res.message).show();
        return false;
      }
    }).
    fail(function (res) {
      $commonTips.text(res.message).show();
    }).
    always(function (res) {
      self.val('登录').removeClass('btn-disabled');
    });

  });

  //判断是否敲击了Enter键
  $(document).keyup(function(event){
    if(event.keyCode == 13){
      $btnLogin.trigger('click');
    }
  });
})();
