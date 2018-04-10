/**
 * Created by Echonessy on 2018/4/10.
 */
$(function () {
    var socket = io();
    var User =  $('#User').html();
    $(document).ready(function(e) {
        $(this).keydown(function (e){
            if(e.which == "13"){
                SendEvt();
            }
        })
    });
    function SendEvt() {
        var Msg = $('#TextBox').text();
        if(Msg.length == 0) {
            return
        }
        var Sub = {}
        Sub.UserName = User;
        Sub.Msg = Msg;
        socket.emit('SendMsg', Sub);
        $('#TextBox').html('');
        return;
    }
    ListenEvt();
    function ListenEvt() {
        $('#Send').on('click',function(){
            SendEvt()
        });
        $('#Quit').on('click',function(){
            $.ajax({
                "type":"post",
                "url":'/SingnOut' ,
                "dataType":"json",
                "data":null,
                success:function(result){
                    if(result.Result == 'Success') {
                        window.location.href = '/'
                    }
                }
            })
        });
    }
    function CreatHtml(Flag,data) {
        var Html = '';
        if(Flag == '0') {
            Html += '<li class="You">';
        } else {
            Html += '<li class="Her">';
        }
        Html +='<p class="ImgBox">';
        if(Flag =='0') {
            Html +='<img src="/assets/img/1.jpg" alt="">';
        } else {
            Html +='<img src="/assets/img/2.jpg" alt="">';
        }
        Html +='</p>';
        Html +='<p class="Name">'+data.UserName+'</p>';
        Html +='<p class="Msg">'+data.Msg+'</p>';
        Html += '</li>';
        return Html;
    }
    socket.on('ReceiveMsg',function(data){
        if(data.UserName == User) {
            $('#MessageBox').append(CreatHtml(0,data))
        } else {
            $('#MessageBox').append(CreatHtml(1,data))
        }
    })
});