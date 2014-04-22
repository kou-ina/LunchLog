
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// cookie,sessionのミドルウェア
app.use(express.cookieParser());
app.use(express.session({
    secret: 'secret',
    store: new MongoStore({
        db: 'session',
        host: 'localhost',
        clear_interval: 60 * 60
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    }
}));


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
// ルーティング設定 -------------------------------------------------------------------------------
// loginCheck関数
var loginCheck = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/', loginCheck, routes.index);
app.get('/login', routes.getLogin);
app.post('/login', routes.postLogin);
app.post('/userRegister', routes.userRegister);
app.get('/logout', function(req, res){
    req.session.destroy();
    console.log('deleted sesstion');
    res.redirect('/');
});
app.get('/users', user.list);

// ------------------------------------------------------------------------------------------------

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
