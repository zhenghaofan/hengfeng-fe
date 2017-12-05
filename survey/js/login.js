$("#login_bt").click(function () {
    const username = $("#login_name").val();
    const pwd = $("#login_word").val();

    // $.ajax({
    //     type: "post",
    //     url: "",
    //     dataType: "json",
    //     data: {username: username, password: password},
    //     success: function () {
    //         if (data) {
    //             if (data.username.message === "false") {
    //                 $("#err_tips").text("*请输入正确的账号和密码");
    //                 if (data.password.message === "false") {
    //                     $("#err_tips").text("*请输入正确的密码");
    //                     $("#err_name").val("*请输入正确的账号");
    //                     if (data.password.message === "false") {
    //                         $("#err_word").val("*请输入正确的密码");
    //                     }
    //                 } else {
    //                     window.location.href = "main.html"
    //                 }
    //             }
    //         }
    //     }
    // })

    $.get("./mock-data.json",function (data, status) {
        alert(data,status);
        if(username === "" && pwd === ""){//判断输入框是否为空值
            $("#err_tips").text("*请输入正确的账号和密码");
        }else {
            if(username === data.username){//判断账号是否正确
                if(pwd === data.password){//判断密码是否正确
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