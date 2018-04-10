/**
 * Created by Echonessy on 2018/4/9.
 */


exports.LoginPage=function(req, res){
    return res.render('login');
};

exports.Index=function(req, res){
    console.log('---------------Index--------------')
    console.log('跳转聊天室')
    console.log('---------------Index--------------')
    return res.render('index',{'User':req.session.User});
};

exports.CheckLog=function(req, res,next){
    //判断用户是否有session
    var Result = req.session && req.session.User;
    if(!Result) {
        return res.render('login');
    }else {
        console.log('---------------CheckLog--------------')
        console.log(Result)
        console.log('---------------CheckLog--------------')
        next();
    }

};
//用户登录成功后session存储
exports.SaveSession=function(req,res){
    console.log('-----------------SaveSession----------------')
    console.log(req.body)
    console.log('-----------------SaveSession----------------')
    req.session.User = req.body.UserName;
    res.json({"Result":'Success'})
    return
};//用户登录成功后session存储
exports.SingnOut=function(req,res){
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.json({"Result":'Success'});
    return
};