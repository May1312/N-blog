var express = require('express');
var router = express.Router();

var BookModel = require('../../models/books');
var checkNotLogin = require('../../middlewares/check').checkNotLogin;

//get books 分页查询
router.get('/search', function(req, res) {
    BookModel.getBooksByParam(req,function(books){
        if (!books) {
            return res.json({code:500});
        }else{
            console.info("分页查询,当前页:"+req.query.page+" 数据:"+JSON.stringify(books));
            res.json(books);
        }
    });
});

//根据id查询book
router.get('/search/:bookid', function(req, res) {
    var bookid = req.params.bookid;
    if(bookid){
        BookModel.getBookById(bookid).then(function (book) {
            if (!book) {
                return res.json({code:500});
            }else{
                res.json({book:book,code:200});
            }
        })
    }
});

module.exports = router;
