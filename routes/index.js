module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts');
  });
  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));

  /*小程序接口提供*/
  app.use('/wxposts', require('./wechat/wxposts'));
  app.use('/wxlogin', require('./wechat/wxlogin'));
  /*book相关*/
  app.use('/wxbooks', require('./wechat/wxbooks'));
  /*cos auth相关*/
  app.use('/cosauth', require('./wechat/cosauth'));
  /*photo相关*/
    app.use('/wxphoto', require('./wechat/wxphoto'));

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
