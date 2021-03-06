var express = require('express')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('../configuration/config')
var mysql = require('mysql');
const { render } = require('./register')
var app = express()
    // thiet lap views va public
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../public'));

var connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

// app.get('/', function(req, res, next) {
//     // render('broad', { fullname: req.cookies['fullname'] })
// })

app.get('/:id', function(req, res, next) {
    res.cookie('id_broad', req.params.id)
    var email = req.cookies['email']
    console.log(email)
    console.log(req.params.id)
    connection.query('SELECT * FROM broad WHERE id = ? and email=?', [req.params.id, email], (error, results, fields) => {
        if (error) throw error
        else {
            if (results.length != 0) {
                var query = 'select * from broad where id = ?'
                connection.query(query, req.params.id, (error, results, fields) => {
                    if (error) throw error
                    res.cookie('broadName', results[0]['broadName'])
                    res.render('broad', { fullname: req.cookies.fullname })
                })
            } else {
                res.render('home', { fullname: req.cookies['fullname'] });
            }
        }
    })
})

app.post('/createTodo', function(req, res, next) {
    var titleName = req.body.titleName
    var id_broad = req.cookies.id_broad
    var title = {
        'id': id_broad,
        'title': titleName
    }
    if (title['title'].length == 0) {
        res.render('broad', { fullname: req.cookies.fullname })
    } else {
        connection.query('INSERT INTO title SET ?', title, function(error, results, fields) {
            if (error) throw error
            else {
                console.log('insert title success!')
            }
        })
    }

})


app.post('/invite', function(req, res, next) {
    var newmember = {
        'id': req.cookies.id_broad,
        'email': req.body.email,
        'broadName': req.cookies.broadName
    }
    console.log(newmember['id']);
    console.log(newmember['email']);
    console.log(newmember['broadName']);
    connection.query('insert into broad set ?', newmember, (err, results, fields) => {
        if (err) throw err
        console.log('Invite Sucess!!!');
    })
})

app.post('/create_card', function(req, res, next) {
    var card = {
        'id_card': req.body.id_card,
        'text_card': req.body.text_card
    }
    connection.query('insert into card set ?', card, function(error, results, fields) {
        if (error) throw error
        connection.query('SELECT * FROM card ORDER BY card.id DESC LIMIT 1', (error, results, fields) => {
            var description = {
                'id': results[0]['id'],
                'description': 'Click to write a description...'
            }
            connection.query('insert into detail_card set ?', description, (error, results, fields) => {
                if (error) throw error
                else {
                    console.log('OK')
                    connection.query('SELECT card.id, detail_card.description FROM card, detail_card WHERE card.id = detail_card.id and card.id=?', description['id'], (error, results, fields) => {
                        console.log(results)
                        res.json(results[0])
                    })
                }
            })
        })
    })
})


app.post('/draggable', function(req, res, next) {
    var card = {
        'id': req.body.id.split('/')[1],
        'id_card': req.body.id_card
    }
    console.log(card['id_card'])
    console.log(card['id'])
    connection.query('UPDATE card set id_card=? where id=?', [card['id_card'], card['id']], (error, results, fields) => {
        if (error) throw error
        console.log('draggable success')
    })
})

app.post('/delete_card', function(req, res, next) {
    var id = req.body.id
    connection.query('delete from card where id =? ', id, (err, results, fields) => {
        if (err) throw err
        console.log('delete card success')
    })
    connection.query('delete from detail_card where id =? ', id, (err, results, fields) => {
        if (err) throw err
        console.log('delete card success')
    })
})

app.post('/create_broad', function(req, res, next) {
    var email = req.body.email
    var broadName = req.body.broadName
    var favourite = req.body.favourite
    var broad = {
        'email': email,
        'broadName': broadName,
        'favourite': favourite
    }
    console.log(broad)
    connection.query('INSERT INTO broad SET ?', broad, function(error, results, fields) {
        if (error) throw error
        else {
            console.log('create broad success!!')
                // res.render('home', { fullname: req.cookies.fullname });
        }
    })
})

app.post('/update_favourite', function(req, res, next) {
    var favourite = req.body.favourite
    var id = req.cookies['id_broad']
    console.log(favourite)
    var query = 'update broad set favourite = ? where id = ?'
    connection.query(query, [favourite, id], (error, results, fields) => {
        if (error) throw error
        console.log('update favourtie success!')
    })
})

module.exports = app;