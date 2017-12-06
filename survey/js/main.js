$(document).ready(function() {
  var urlPre = 'http://192.168.13.233';
  $.ajax({
    url: urlPre + '/survey/qnaire/count',
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      if(data.resultCode === 'SUCCESS') {
        var res = data.data;
        $('.num').html(res.todoQnaireCount);
      }
    }
  })
})
