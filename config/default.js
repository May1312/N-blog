module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'hang',//sessionid
    maxAge: 2592000000
  },
  mongodb: 'mongodb://hellohang.win:27018/myblog',
  /*cos相关*/
  secretId: 'AKIDeUPPHJAaEYs5jelu57O35DnFQ57TNNTm',
  secretKey: 'SB8eVE8PB5jDwaSdwM0rH4lBhMVmRC7J',
  appid: '1253270175',
  bucket: 'wxphoto',
  folder: '/'
};
