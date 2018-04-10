/**
 * Created by Echonessy on 2018/4/9.
 */
var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(server);
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config/index');
global.config = config;
//包体解析中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,limit:'1024kb'}));

//静态目录
var staticDir = path.join(__dirname, 'assets');
app.use('/assets', express.static(staticDir));
//渲染引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
//session存储
app.use(session({
    resave: false,
    name: config.auth_cookie_name,
    saveUninitialized: true,
    secret: config.session_secret,
    cookie: {expires: new Date(Date.now() + config.expires), maxAge: config.expires}
}));
//路由
var mount = require('mount-routes');
mount(app, __dirname + '/routes', false);

//socket session 共享中间件
var sessionMiddleware = session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
});
// 使用socket session 共享中间件
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
//监听客户端的连接事件
var users = [];                    //用来保存所有的用户信息
var usersNum = 0;                    //统计在线登录人数
io.on('connection', function(socket){
    console.log('一位用户连接成功....');
    socket.on('disconnect', function(){
        console.log('用户离线......');
    });
    //用户登录
    socket.on('Login',function(data){
        var TestUser = [
            {"UserName":"Echonessy","Pass":"000000"},
            {"UserName":"User001","Pass":"000000"},
            {"UserName":"User002","Pass":"000000"},
            {"UserName":"User003","Pass":"000000"},
            {"UserName":"User004","Pass":"000000"},
            {"UserName":"User005","Pass":"000000"},
            {"UserName":"User006","Pass":"000000"}
        ];
        var UserName = data.UserName;
        var Pass = data.Pass;
        var IsExit = 0;
        if(socket.request.session.User) {
            //返回登录结果
            socket.emit('IsLogIn',{code:1});   //code=1 用户已登录
        } else {
            for(var i=0;i<TestUser.length;i++) {
                var NowUser = TestUser[i].UserName;
                var NowPass = TestUser[i].Pass;
                if(UserName == NowUser) {
                    if(Pass == NowPass) {
                        socket.request.session.User = UserName;
                        console.log(socket.request.session.User)
                        //将该用户的信息存进数组中
                        users.push({
                            UserName: data.UserName,
                            Msg: []
                        });
                        socket.emit('IsLogIn',{code:0,User:UserName});   //code=0 用户登录成功
                        usersNum = users.length;
                        console.log('用户'+data.UserName+'登录成功，进入聊天室，当前在线登录人数'+usersNum);
                    }else {
                        socket.emit('IsLogIn',{code:2});   //code=2 密码错误
                    }
                } else {
                    IsExit++;
                }
            }
            if(IsExit == TestUser.length) {
                socket.emit('IsLogIn',{code:3});   //code=3 找不到该用户
                return
            }
        }
    });
    //发送消息
    socket.on('SendMsg',function(data){
        console.log('SendMsg：'+data.UserName);
        console.log('SendMsg：'+data.Msg);
        for(var i=0;i<users.length;i++) {
            var NowUser = users[i];
            if(NowUser.UserName == data.UserName) {
                NowUser.Msg.push(data.Msg);
                //返回信息接收
                io.emit('ReceiveMsg',data);
                break;
            }
        }
        console.log(users)
});
});

server.listen(config.port, function(){
    console.log('监听：'+config.protocol+'://'+config.host+':'+config.port);
});