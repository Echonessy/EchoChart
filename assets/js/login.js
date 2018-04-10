/**
 * Created by Echonessy on 2018/4/10.
 */

$(function (){
    var socket = io();
    LogInEvt();
    function LogInEvt() {
        $('#LoginBtn').on('click',function () {
            var Name = $('#Name').val()
            var Pass = $('#Pass').val()
            if(!Name) {
                $("#NameError").html('请输入用户名');
                return;
            }
            if(!Pass) {
                $("#PassError").html('请输入密码');
                return;
            }
            var SubData = {};
            SubData.UserName = Name;
            SubData.Pass = Pass;
            socket.emit('Login',SubData);
        });
    }
    socket.on('IsLogIn',function(data){
        if(data.code === 0) {
            var SubData = {}
            SubData.UserName = data.User;
            console.log(SubData)
            $.ajax({
                "type":"post",
                "url":'/Session' ,
                "dataType":"json",
                "data":SubData,
                success:function(result){
                    console.log(result)
                    if(result.Result == 'Success') {
                        window.location.href = '/index'
                    }
                }
            })
        }
        else if(data.code ===1){
            $('#PassError').html('用户已登录');
        }
        else if(data.code ===2){
            $('#PassError').html('密码错误');
        }
        else if(data.code ===3){
            $('#PassError').html('用户不存在');
        }
    })
})