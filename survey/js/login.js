$(document).ready(function() {
    var urlPre = 'http://192.168.13.233';
    var url = urlPre + '/login';
    $('.login_bt').click(function() {
        var username = $('.login_name').val();
        var password = $('.login_word').val();
        if (username === '' || password === '') {
            $(".login_err").text("请输入正确的账号和密码");
            return;
        }

        $.ajax({
            url: url,
            data: {
                username: username,
                password: password
            },
            type: 'POST',
            success: function(data) {
                if (data.resultCode != 'SUCCESS') {
                    $(".login_err").text(data.message);
                } else {
                    window.location.href = 'main.html'
                }
            }
        })
    })
})
