  $(document).ready(function() {
    var tpl = [
      '<div class="item">',
      '    <div class="item-head">',
      '      <img src="./img/icon_Questionnaireinformation@2x.png" alt="">',
      '      <div class="info">',
      '        <p>问卷信息</p>',
      '        <p>%(startDate)</p>',
      '      </div>',
      '    </div>',
      '    <div class="item-title">',
      '      %(qnaireTitle)',
      '    </div>',
      '    <div class="item-detail">',
      '      <ul>',
      '        <li>问卷发起时间：%(startDate)</li>',
      '        <li>问卷截止时间：%(endDate)</li>',
      '        <li>问卷指派人数：%(assignNum)人</li>',
      '        <li>问卷作答人数：%(doneNum)人</li>',
      '        <li>未答问卷人数：%(todoNum)人</li>',
      '        <li>有效问卷份数: %(vaildNum)份</li>',
      '      </ul>',
      '    </div>',
      '    <div class="buttons">',
      '      <div class="stop-answer btn">',
      '        <img class="stop-sel" src="img/stop_sel@2x.png">',
      '        <img class="pic-stop" src="img/stop@2x.png"> 停止作答',
      '      </div>',
      '      <div class="delete-paper btn">',
      '        <img class="del-sel" src="img/del_sel@2x.png">',
      '        <img class="pic-del" src="img/del@2x.png"> 删除问卷',
      '      </div>',
      '      <div class="change-time btn">',
      '        <img class="modify-sel" src="img/modify_sel@2x.png">',
      '        <img class="pic-modify" src="img/modify@2x.png"> 修改时间',
      '      </div>',
      '    </div>',
      '  </div>'
    ].join('');
    var urlPre = 'http://192.168.13.233';
    $.ajax({
      url: urlPre + '/survey/qnaire/list/mobile',
      type: 'GET',
      data: {
        status: 1,
      },
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if (data.resultCode === 'SUCCESS') {
          var res = data.data || {}, list = res.qnaireList,
            html = [];
          $(list).each(function(index, item) {
            html.push(tpl.jstpl_format(item));
          });
          $('.list').html(html.join(''));
        }
      }
    })
  })
