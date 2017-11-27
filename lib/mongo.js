var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});

exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' },
    //新增wx属性
openid: { type: 'string' },
//手机
model: { type: 'string' },
//操作系统版本
system: { type: 'string' },
});

exports.User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一
//wx 暂时无用
exports.WXUser = mongolass.model('WXUser', {
  /*昵称*/
    nickName: { type: 'string' },
    /*头像*/
    avatarUrl: { type: 'string' },
    /*性别*/
    gender: { type: 'string', enum: ['1', '0', 'x'] },
    /*所在地区*/
    country: { type: 'string' },
    province: { type: 'string' },
    city: { type: 'string' },
    bio: { type: 'string' },
    openid: { type: 'string' },
    //手机
    model: { type: 'string' },
    //操作系统版本
    system: { type: 'string' },
});
exports.WXUser.index({ openid: 1 }, { unique: true }).exec();// 根据openid找到用户，用户名全局唯一

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId }
});
exports.Comment.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言

/*创建图书book*/
exports.Book = mongolass.model('Book', {
    author: { type: Mongolass.Types.ObjectId },
    /*作者*/
    writer: { type: 'string' },
    /*书名*/
    bookname: { type: 'string' },
    /*简介*/
    description: { type: 'string' },
    /*封面*/
    cover: { type: 'string'},
    /*浏览数*/
    pv: { type: 'number' }
});
exports.Book.index({bookname: 1, _id: -1 }).exec();

/*photo*/
exports.Photo = mongolass.model('Photo', {
    author: { type: Mongolass.Types.ObjectId },
    /*address*/
    address: { type: 'string' },
    /*文件路径*/
    url: { type: 'string' },
    /*浏览数*/
    pv: { type: 'number' }
});
exports.Book.index({author: 1, _id: -1 }).exec();