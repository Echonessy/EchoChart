/**
 * Created by Echonessy on 2018/4/9.
 */
var express = require('express');
var router = express.Router();
var common = require('../controller/common')
//登录页面
router.get('/',common.CheckLog,common.LoginPage);
//聊天页面
router.get('/index',common.CheckLog,common.Index);
//存缓存
router.post('/Session',common.SaveSession);
//退出
router.post('/SingnOut',common.SingnOut);

module.exports = router;