var express = require('express');//引入express
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    dbOptions = {
        host: 'localhost',
        user: 'root',//root用户
        password: '123456',//密码
        port: 3306,//端口
        database: 's_db'//数据库
    };

//引入路由
var index = require('./routes/index');
var users = require('./routes/users');
//初始化express
var app = express();

// 模板引擎
//__dirname是node.js中的全局变量，表示取当前执行文件的路径
app.set('views', path.join(__dirname, 'views'));//设置视图存放的目录
app.engine('.html', require('ejs').__express);//引擎设置为ejs并且后缀还是保持.html的配置
app.set('view engine', 'html');

// 使用中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//静态资源存放的目录
app.use(myConnection(mysql, dbOptions, 'single')); //作为中间件来使用
// app.use('/static',express.static('public'));
// 定义使用哪些路由文件
app.use('/', index);
app.use('/users', users);


// 生产环境错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境错误处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 输出错误页面
  res.status(err.status || 500);
  res.render('error');
});
//输出app对象
module.exports = app;
