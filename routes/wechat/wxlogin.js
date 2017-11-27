var sha1 = require('sha1');
var express = require('express');
var request = require('request');
var router = express.Router();

var UserModel = require('../../models/users');
var checkNotLogin = require('../../middlewares/check').checkNotLogin;

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  var password = req.fields.password;

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('back');
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }
      req.flash('success', '登录成功');
      // 用户信息写入 session
      delete user.password;
      req.session.user = user;
      // 跳转到主页
      res.redirect('/posts');
    })
    .catch(next);
});

/*wechat code登陆 生成session*/
router.get('/', function (req, res, next) {
    let code = req.query.code
    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: 'wxc3678086223f1e2c',
            secret: 'dfd7ceda58038df4e893b23aa304ef69',
            js_code: code
        }
    }, (err, response, data) => {
        if (response.statusCode === 200) {
            console.log("[openid]", data.openid)
            console.log("[session_key]", data.session_key)
            //TODO: 生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
            //mongo 存储session
            req.session.user = data;
            res.send({ sessionid: req.session.id,code:200})
        } else {
            console.log("[error]", err)
            res.json(err)
        }
    })
});

router.get("/checkuser",function (req,res,next) {
    //获取sessionid
        /*根据openid 判断用户是否存在*/
        if(req.session.user){
            UserModel.getUserByOpenid(req.session.user.openid)
                .then(function (user) {
                    if (!user) {
                        res.json({code:200,userexist:0})
                    }else{
                        /*添加user进session*/
                        req.session.user = user;
                        res.json({code:200,userexist:1})
                    }
                }).catch(next);
        }
});

router.post("/regist",function (req,res) {
    var userInfo = JSON.parse(req.fields.userInfo);
    var systemInfo = JSON.parse(req.fields.systemInfo);
    /*昵称*/
    var name = userInfo.nickName;
    /*性别*/
    var gender='x';
    if(userInfo.gender==1){
        gender = 'f';
    }else if(userInfo.gender==0){
        gender = 'm';
    }else{
        gender = 'x';
    }

    var openid = req.session.user.openid;
    var avatar = userInfo.avatarUrl;
    /*国籍*/
    var country = userInfo.country;
    /*省*/
    var province = userInfo.province;
    /*市*/
    var city = userInfo.city;
    /*系统版本*/
    var system = systemInfo.system;
    /*机型*/
    var model = systemInfo.model;

    var user = {
        name: name,
        gender: gender,
        avatar: avatar,
        country: country,
        province: province,
        city: city,
        system: system,
        model:model,
        openid:openid
    };
    // 用户信息写入数据库
    UserModel.create(user)
        .then(function (result) {
            // 此 user 是插入 mongodb 后的值，包含 _id
            user = result.ops[0];
            if(user){
                req.session.user = user;
                res.json({code:200});
            }else{
                res.json({code:500});
            }
        })
})

module.exports = router;
