/*モデル読み込み*/
var model = require('../model.js'),
    User  = model.User;

/*ログイン後ページ*/
exports.index = function(req, res) {
    res.render('index', { userName: req.session.user, title: "Lunch Log"});
    console.log(req.session.user);
};

/*ユーザー登録機能*/
exports.userRegister = function(req, res) {
    var newUser = new User(req.body);
    newUser.save(function(err) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/');
        }
    });
};

// 初回アクセスget
exports.getLogin = function(req, res) {
    res.render('login');
};

/*ログイン機能 post*/
exports.postLogin = function(req, res) {
    var email    = req.body.email;
    var password = req.body.password;
    var query = { "email": email, "password": password };
    User.find(query, function(err, data) {
        if (err) {
            console.log(err);
        }
        if (data == "") {
            res.render('login');
        } else {
            var userName = data[0].name;
            req.session.user = userName;
            res.redirect('/');
        }
    });
};
