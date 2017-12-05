$("#login_bt").click(function () {
    const username = $("#login_name").val();
    const password = $("#login_word").val();

    if(username === "" && password === ""){//判断输入框是否为空值
        $("#err_tips").text("*请输入正确的账号和密码");
    }

    $.ajax({
        type: "post",
        url: "",
        dataType: "json",
        data: {username: username, password: password},
        success: function () {
            if(data){
                if(data.username.message === "false"){
<<<<<<< HEAD
                    $("#err_tips").text("*请输入正确的账号和密码");
                    if(data.password.message === "false"){
                        $("#err_tips").text("*请输入正确的密码");
=======
                    $("#err_name").val("*请输入正确的账号");
                    if(data.password.message === "false"){
                        $("#err_word").val("*请输入正确的密码");
>>>>>>> e9835297b4d892d647d7574aee859d3a0dfec3b3
                    }
                }else {
                    window.location.href="main.html"
                }
            }
        }
    })
});