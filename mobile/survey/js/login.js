$('#login_bt').click(function () {
    const username = $('.login_name').val();
    const password = $('.login_word').val();

    $.ajax({
        type: "post",
        url: "",
        dataType: "json",
        data: {username: username, password: password},
        success: function () {
            if(data){
                if(data.username.message === "false"){
                    $("#err_name").val("*请输入正确的账号");
                }else {
                    window.location.href="html/main.html"
                }
            }
        }
    })
})