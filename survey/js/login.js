$("#login_bt").click(function () {
    const username = $("#login_name").val();
    const pwd = $("#login_word").val();

    $.post("/manage/account/user/preview/{{userId}}",{
        username: username,
        pwd: pwd
    },function (data, message) {
        if(username === "" && pwd === ""){//判断输入框是否为空值
            $("#err_tips").text("*请输入正确的账号和密码");
        }else {
            if(username.message === "false"){//判断账号是否正确
                if(pwd.message === "false"){//判断密码是否正确
                    window.location.href="main.html";//账号密码都正确，就跳转到首页
                }else {
                    $("#err_tips").text("*请输入正确的密码");
                }
            }else {
                $("#err_tips").text("*请输入正确的账号");
            }
        }
    })
});