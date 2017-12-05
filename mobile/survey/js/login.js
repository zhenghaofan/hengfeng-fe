function setCookie() {
    const loginName = $(".login_name").val();//获取用户名
    const loginWord = $(".login_word").val();//获取密码
    const checked = $("[name='checkbox']:checked");//获取是否下次自动登录

    if(checked) {//判断复选框是否选中，选中则保存密码，并下次自动登录
        //记住账号密码
        $.cookie("login_name",loginName);
        $.cookie("login_word",$.base64.encode(loginWord));
    }else {//没有选中就账号密码都为空
        $.cookie("login_name",null);
        $.cookie("login_word",null);
    }
}

function getCookie() {
    const loginName = $.cookie("login_name");
    const loginWord = $.cookie("login_word");
    if (loginWord) {
        $("[name = 'checkbox']").attr("checked","true");
    }
    if (loginName) {
        $(".login_name").val(loginName);
    }
    if (loginWord) {
        $(".login_word").val($.base64.decode(loginWord));
    }
}

function login() {
    const userName = $('.login_name').value;
    if(userName === '') {
        alert("请输入正确的账号");
    }
    const password = $('.login_word').value;
    if(password === ''){
        alert("请输入正确的密码");
    }

    if($("[name = 'checkbox']").attr("checked","true")){
        setCookie();
    }
}