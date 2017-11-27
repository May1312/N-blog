var Book = require('../lib/mongo').Book;

//Love is composed of a single soul inhabiting two bodies
module.exports = {

  // 通过用户名获取用户信息
  getUserByName: function getUserByName(name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec();
  },

    // 分页查询
    getBooksByParam: function getUserByOpenid(req,callback) {
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
      /*查询条件*/
        var bookname;
        if(typeof (req.query.bookname)!='undefined'){
            bookname = req.query.bookname;
        }
      /*模糊查询*/
      var query;
        if (bookname) {
            query = Book.find({'bookname':new RegExp(bookname)}).sort({ _id: -1 });
        }else{
            query = Book.find({}).sort({ _id: -1 });
        }
        query.skip((page - 1) * rows);
        query.limit(rows);

        //计算分页数据
        query.exec(function (err, rs) {
            if (err) {
                callback (err);
            } else {
                //计算数据总数
                Book.find().exec(function (err, result) {
                    var jsonArray = {booksList: rs, pagesTotal: result.length,pageCurrent:page,code:200};
                    callback (jsonArray);
                });
            }
        });
    },
    getBookById: function getBookById(id) {
        Book
            .update({ _id: id }, { $inc: { pv: 1 } })
            .exec();
        return Book
            .findOne({ _id: id })
            .exec();
    },
    //浏览量
    incPv: function incPv(id) {
        return Book
            .update({ _id: id }, { $inc: { pv: 1 } })
            .exec();
    },
};
