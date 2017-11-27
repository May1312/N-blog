var express = require('express');
var router = express.Router();

var PhotoModel = require('../../models/photo');

router.post('/upload',function (req,res,next) {

    var author = req.session.user._id;
    var address = req.fields.address;
    var url = req.fields.url;
    var photo = {
        author: author,
        address: address,
        url: url,
    };
    PhotoModel.create(photo)
        .then(function (result) {
            // 此 user 是插入 mongodb 后的值，包含 _id
            photo = result.ops[0];
            res.json({code:200});
        })
        .catch(function (e) {
            console.info("上传图片异常:"+e);
            next(e);
        });
});
//get photoes 分页查询
router.get('/search', function(req, res) {
    PhotoModel.getPhotoes(req,function(photoes){
        if (!photoes) {
            return res.json({code:500});
        }else{
            console.info("分页查询,当前页:"+req.query.page+" 数据:"+JSON.stringify(photoes));
            res.json(photoes);
        }
    });
});

//根据id查询
router.get('/search/:photoid', function(req, res) {
    var photoid = req.params.photoid;
    if(photoid){
        PhotoModel.getBookById(photoid).then(function (photo) {
            if (!photo) {
                return res.json({code:500});
            }else{
                res.json({photo:photo,code:200});
            }
        })
    }
});

module.exports = router;
