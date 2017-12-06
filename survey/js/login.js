$(document).ready(function() {
    let url = '/login';
    $('.login_bt').click(function() {
        let username = $('.login_name').val();
        let password = $('.login_word').val();
        if (username === '' || password === '') {
            $(".err_tips").html("请输入正确的账号和密码");
            return;
        }

        $.ajax({
            url: url,
            data: {
                username: username,
                password: password,
            },
            type: 'POST',
            success: function(data) {
                if (data.resultCode != 'SUCCESS') {
                    $(".err_tips").html(data.message);
                } else {
                    window.location.href = 'main.html'
                }
            }
        })
    })
})