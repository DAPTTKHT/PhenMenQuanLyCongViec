var express = require('express')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('./configuration/config')
var mysql = require('mysql')
var app = express()
var register = require('./routes/register')
var logout = require('./routes/logout')
var saveProfile = require('./routes/saveProfile');
var auth = require('./routes/auth')
var update = require('./routes/update')
const { authenticate } = require('passport');
var broads_home = require('./routes/broads_home')
var broad = require('./routes/broad')
var get = require('./routes/get')
var forgot = require('./routes/send_email')

//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

function check_email(email) {
    connection.query("SELECT * from accounts where email = ?", email, (error, results, fields) => {
        console.log(results)
        console.log(results.length)
        return results.length
    })
};

// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    if (req.cookies.username === undefined) {
        res.render('index', {
            username: '10-DTP helps teams be more collaborative and do more' +
                '10-DTP boards, lists, and cards enable fun, flexible, and worthy project organizations to team and prioritize project'
        });
    } else {
        res.redirect("/home");
    }
});

app.get('/forgot', function(req, res) {
    res.render('forgot')
});


// thiết lập sau khi đăng nhập bằng gmail
app.get('/gmail', function(req, res) {
    try {
        connection.query("SELECT * from accounts where email = ?", req.user.emails[0]['value'], (error, results, fields) => {
            console.log(results)
            console.log(results.length)
            if (results.length > 0) {
                //tai khoan da ton tai
                res.cookie('username', results[0]['username'], { expire: 900000 + Date.now() });
                res.cookie('email', results[0]['email'], { expire: 900000 + Date.now() });
                res.cookie('sdt', results[0]['sdt'], { expire: 900000 + Date.now() });
                res.cookie('fullname', results[0]['fullname'], { expire: 900000 + Date.now() });
                res.render('home', { fullname: results[0]['fullname'] })
            } else {
                // tai khoan chua ton tai
                res.render('loginGmail', { check: '' })
            }
        })
    } catch {
        res.render("login", { thongBao: '', color: 'red' })
    }
});

app.get('/home', function(req, res) {
    if (req.cookies.username === undefined) {
        res.redirect("/");
    } else {
        res.render('home', { fullname: req.cookies['fullname'] });
    }
});

// xử lý phần đăng nhập bằng facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/facebook', failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

// thiết lập sau khi đăng nhập bằng facebook
app.get('/facebook', function(req, res) {
    res.render('home', { username: req.user.displayName });
});

// xử lý phần đăng nhập
app.use('/auth', auth)

// thiet lap chuc nang dang suat
app.use('/logout', logout)

// thiet lap chuc nang login
app.get('/login.html', function(req, res) {
    res.render('login', { thongBao: '' });
})

// thiet lap chuc nang xem profile
app.get('/profile', function(req, res) {
    res.render('profile', {
        fullname: req.cookies.fullname,
        email: req.cookies.email,
        sdt: req.cookies.sdt,
        profile: 'active',
        activity: '',
        card: '',
        setting: '',
        err: '',
        classProfile: 'tab-pane active',
        classActivity: 'container tab-pane fade',
        classCard: 'container tab-pane fade'

    })
});

// thiet lap chuc nang activity
app.get('/activity', function(req, res) {
    res.render('profile', {
        fullname: req.cookies.fullname,
        email: req.cookies.email,
        sdt: req.cookies.sdt,
        profile: '',
        activity: 'active',
        card: '',
        setting: '',
        err: '',
        classProfile: 'container tab-pane fade',
        classActivity: 'tab-pane active',
        classCard: 'container tab-pane fade'
    })
})

app.get('/card', function(req, res) {
    res.render('profile', {
        fullname: req.cookies.fullname,
        email: req.cookies.email,
        sdt: req.cookies.sdt,
        profile: '',
        activity: '',
        card: 'active',
        setting: '',
        err: '',
        classProfile: 'container tab-pane fade',
        classActivity: 'container tab-pane fade',
        classCard: 'tab-pane active'
    })
})

// bang
app.use('/broad', broad)

// get
app.use('/get', get)

// xử lý phần đăng kí
app.use('/register', register)

// xu ly phan update
app.use('/update', update)

// xu ly phan luu profile
app.use('/saveProfile', saveProfile)

//api cua broad
app.use('/api', broads_home)

// chuc nang quen mat khau
app.use('/forgot', forgot)

module.exports = app;