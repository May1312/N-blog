/**
 * Created by yhang on 2017/11/23.
 */

var Photo = require('../lib/mongo').Photo;

//Love is composed of a single soul inhabiting two bodies
module.exports = {

    create: function create(photo) {
        return Photo.create(photo).exec();
    },

    // 分页查询
    getPhotoes: function getPhotoes(req,callback) {
        /*总记录数*/
        var count = 0;
        /*当前页数*/
        var page = 1;
        if(typeof (req.query.page)!='undefined'){
            page = parseInt(req.query.page);
        }
        /*每页条数*/
        var rows = 1;
        if(typeof (req.query.rows)!='undefined'){
            rows = parseInt(req.query.rows);
        }

        var query = Photo.find({}).addCreatedAt().populate({ path: 'author', model: 'User' }).sort({ _id: -1 });
        query.skip((page - 1) * rows);
        query.limit(rows);

        //计算分页数据
        query.exec(function (err, rs) {
            if (err) {
                callback (err);
            } else {
                //计算数据总数
                Photo.find().exec(function (err, result) {
                    var jsonArray = {photoesList: rs, pagesTotal: result.length,pageCurrent:page,code:200};
                    callback (jsonArray);
                });
            }
        });
    },
    getPhotoById: function getPhotoById(id) {
        Photo
            .update({ _id: id }, { $inc: { pv: 1 } })
            .exec();
        return Photo
            .findOne({ _id: id })
            .exec();
    },
    //浏览量
    incPv: function incPv(id) {
        return Photo
            .update({ _id: id }, { $inc: { pv: 1 } })
            .exec();
    },
};
