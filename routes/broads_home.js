// cac router nhu la mot controller

var express = require('express')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('../configuration/config')
var mysql = require('mysql');
const e = require('express')
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


app.get('/', function(req, res, next) {
    connection.query('SELECT broad.id, broad.email , broad.broadName FROM broad WHERE broad.email = ? ',
        req.cookies['email'], (error, results, fields) => {
            let task = []
            var same_id = {}

            results.forEach(element => {
                same_id[element['id']] = 0
            });

            for (var id_ in same_id) {
                let obj_same_id = results.filter(function(x) {
                    return x['id'] == id_
                })
                let obj = {}
                obj['id'] = obj_same_id[0]['id']
                obj['broadName'] = obj_same_id[0]['broadName']
                task.push(obj)
            }

            res.json(task)

        });
})

//lay id cuoi cung cua title
app.get('/get_id_title', function(req, res, next) {
    var email = req.cookies['email']
    var query = 'SELECT title.id_card FROM broad, title WHERE broad.id= title.id AND broad.email= ?'
    connection.query(query, email, (error, results, fields) => {
        res.json(results)
    })
})

// lay id board cuoi cung theo email
app.get('/get_id_broad', function(req, res, next) {
    var query = 'select id from broad where email = ?'
    connection.query(query, req.cookies['email'], (error, results, fields) => {
        var id = {}
        results.forEach(element => {
            id['id'] = element['id']
        });
        res.json(id)
    })
})

//lay ten broad cuoi cung theo email
app.get('/get_broadName', function(req, res, next) {
    var query = 'select broadName from broad where email = ?'
    connection.query(query, req.cookies['email'], (error, results, fields) => {
        var broadName = {}
        results.forEach(element => {
            broadName['broadName'] = element['broadName']
        });
        res.json(broadName)
    })
})

//lay cac board cua email
app.get('/broad', function(req, res, next) {
    connection.query('SELECT broad.id, broad.email , broad.broadName, title.title, title.id_card FROM broad, title WHERE broad.id = title.id and broad.email = ? ',
        req.cookies['email'], (error, results, fields) => {
            let task = []
            var same_id = {}
            console.log(results)

            results.forEach(element => {
                same_id[element['id']] = 0
            });

            for (var id_ in same_id) {
                let obj_same_id = results.filter(function(x) {
                    return x['id'] == id_
                })
                let obj = {}
                obj['id'] = obj_same_id[0]['id']
                obj['broadName'] = obj_same_id[0]['broadName']
                obj['email'] = obj_same_id[0]['email']
                obj['title'] = []

                obj_same_id.forEach(element => {
                    let obj_title = {}
                    obj_title['title'] = element['title']
                    obj_title['id_card'] = element['id_card']

                    obj_title['text_card'] = []

                    obj['title'].push(obj_title)
                });

                task.push(obj)
            }
            task.forEach(element => {
                if (element['id'] == req.cookies['id_broad']) {
                    let title = element['title']
                    var id_cards = []
                    title.forEach(element => {
                        id_cards.push(element['id_card'])
                    });
                    res.cookie('id_cards', id_cards)
                    res.json(element)
                }
            });
        });
})

// lay tat ca cac text card theo id_card
app.get('/textCard', function(req, res, next) {

    connection.query('SELECT * FROM card ',
        req.cookies['email'], (error, results, fields) => {
            var id_cards = req.cookies['id_cards']
            let task = []
            id_cards.forEach(element => {
                let same_id_card = results.filter(function(x) {
                    return x['id_card'] == element
                })
                let obj = {}
                obj['id_card'] = element
                obj['text_card'] = []
                obj['id'] = []
                same_id_card.forEach(element => {
                    obj['text_card'].push(element['text_card'])
                    obj['id'].push(element['id'])
                });
                task.push(obj)
            });

            res.json(task)
        });
})

// lay thong tin vavourite theo id_board
app.get('/favourite', function(req, res, next) {
    var id_board = req.cookies['id_broad']
    var query = 'SELECT favourite FROM broad WHERE id=?'
    connection.query(query, id_board, (error, results, fields) => {
        res.json(results)
    })
})

app.get('/get_broad_star', function(req, res, next) {
    var email = req.cookies['email']
    var query = 'SELECT * FROM broad WHERE broad.favourite=? and broad.email = ?'
    connection.query(query, ['1', email], (error, results, fields) => {
        res.json(results)
    })
})

app.post('/search', function(req, res, next) {
    var data = {
        'name_search': req.body.name_search,
    };
    connection.query("select * from accounts where username like '%" + data['name_search'] + "%' or " + "email LIKE '%" + data['name_search'] + "%'",
        (err, results, fields) => {
            if (err) throw err
            console.log("success");
            res.json(results)
        });

})

//moi them thanh vien bang cach tim kiem theo username
app.post('/invite', function(req, res, next) {
    var username = req.body.username

    connection.query('select * from accounts where username=?', username, (error, results, next) => {
        var email = results[0]['email']
        var broad = {
            'id': req.cookies['id_broad'],
            'email': email,
            'broadName': req.cookies['broadName'],
            'favourite': '0'
        }
        try {
            connection.query('insert into broad set ?', broad, (error, results, next) => {
                console.log('invite success')
            })
        } catch {}

    })
})

app.get('/get_user', function(req, res, next) {
    var id_board = req.cookies['id_broad']
    var query = 'SELECT accounts.username, accounts.email, broad.id, broad.broadName, broad.favourite FROM accounts, broad WHERE accounts.email=broad.email and broad.id=?'
    connection.query(query, id_board, (error, results, next) => {
        if (error) throw error
        res.json(results)
    })
})

// thay doi text card theo id
app.post('/change_text_card', function(req, res, next) {
    var card = {
        'id': req.body.id,
        'text_card': req.body.text
    }
    var query = 'UPDATE card set text_card = ? where id=?'
    connection.query(query, [card['text_card'], card['id']], (error, results, next) => {
        if (error) throw error
        console.log('update success')
    })
})

app.get('/memberteam', function(req, res, next) {
    var id_broad = req.cookies['id_broad'];
    connection.query("select * from accounts where email in(select email from broad where broad.id =?) ", id_broad, (error, results, fields) => {

        console.log(results[0]['username']);
        res.json(results)
    })
})

// thay doi description theo id
app.post('/change_description', function(req, res, next) {
    var card = {
        'id': req.body.id,
        'description': req.body.text
    }
    console.log(card)
    var query = 'UPDATE detail_card set description = ? where id=?'
    connection.query(query, [card['description'], card['id']], (error, results, next) => {
        if (error) throw error
        console.log('update success')
    })
})

// lay description theo id
app.post('/get_description', function(req, res, next) {
    var id = req.body.id
    connection.query('SELECT card.id, detail_card.description, card.text_card FROM card, detail_card WHERE card.id = detail_card.id and card.id=?', id, (error, results, fields) => {
        console.log(results)
        res.json(results)
    })
})

// xu ly phan startDate va endStart theo id
app.post('/date_detail_card', function(req, res, next) {
    var id = req.body.id
    connection.query('SELECT * FROM detail_card WHERE  detail_card.id=?', id, (error, results, fields) => {
        // console.log(results)
        res.json(results[0])
    })
})

// update date time cua card
app.post('/update_date_time', function(req, res, next) {
    var id = req.body.id
    console.log(id)
    var start = req.body.start
    var end = req.body.end
    console.log(typeof start)
    console.log(typeof end)
    connection.query('UPDATE detail_card  set start=?, end=? where id= ?', [start, end, id], (error, results, fields) => {
        if (error) throw error
            // console.log(results)
            // res.json(results[0])
        else console.log('update date tiem success!')
    })
})

// lay check list theo id
app.post('/checklist', function(req, res, next) {
    var id = req.body.id
    console.log(id)
    var query = 'select * from check_list where id=?'
    connection.query(query, id, (error, results, fields) => {
        if (error) throw error
        else {
            console.log(results)
            res.json(results)
        }
    })
})


// them check list
app.post('/insert_checklist', function(req, res, next) {
    var id = req.body.id
    var checklist_name = req.body.checklist_name
    var tick = req.body.tick
    var check_list = {
        'id': id,
        'checklist_name': checklist_name,
        'tick': tick
    }
    console.log(check_list)
    connection.query('insert into check_list set ? ', check_list, (error, results, fields) => {
        // neu thay co loi xay ra
        if (error) throw error
        else
        // neu khong co loi xay ra
            connection.query('SELECT id_checklist FROM check_list ORDER BY check_list.id_checklist DESC LIMIT 1', (error, results, fields) => {
            console.log('insert checklist thanh cong')
            res.json(results[0])
        })
    })
})

///????????
app.post('/memberOfCard', function(req, res, next) {
    var id = req.body.id_card;
    var query = 'select * from accounts where username in (select username from member_card where id = ?)';
    connection.query(query, id, (err, results, fields) => {
        res.json(results);
        console.log(results);
    });
})

// cap nhat check box 
app.post('/update_checkbox', function(req, res, next) {
    var id_checklist = req.body.id_checklist.split(' ')[1]
    console.log(id_checklist)
    connection.query("SELECT * FROM check_list WHERE id_checklist = ?", id_checklist, (error, results, next) => {
        var tick = results[0]['tick']
        if (tick != 'checked') {
            //neu chua checked
            connection.query('update check_list set tick = ? where id_checklist = ?', ['checked', results[0]['id_checklist']],
                (error, results, fields) => {
                    // neu loi
                    if (error) throw error
                    else console.log('update check box success! null --> checked')
                }
            )
        } else {
            //neu da checked
            connection.query('update check_list set tick = ? where id_checklist = ?', [' ', results[0]['id_checklist']],
                (error, results, fields) => {
                    //neu loi
                    if (error) throw error
                    else console.log('update check box success! check --> null')
                }
            )
        }
    })
})

//lay username
app.get('/get_username', function(req, res, next) {
    res.json(req.cookies['username'])
})

app.post('/comment', function(req, res, next) {
    var id = req.body.id
    console.log('comment : ' + id)
    connection.query('SELECT * FROM comment WHERE id = ? ORDER BY id_comment DESC', id, (error, results, fields) => {
        // neu loi
        if (error) throw error
            // neu khong loi chuyen du lieu len cho ajax    
        else { res.json(results) }
    })
})

// them comment vao co so du lieuj
app.post('/insert_comment', function(req, res, next) {
    var new_comment = {
            'id': req.body.id,
            'username': req.body.username,
            'date': req.body.date,
            'text_comment': req.body.text
        }
        //truy van

    connection.query("insert into comment set ?", new_comment, (error, results, fields) => {
        // neu loi
        if (error) throw error
        else {
            console.log('insert comment success!!')
        }
    })
})

// thay doi background
app.post('/change_background', function(req, res, next) {
    var id_background = req.body.id_background
    var id = req.cookies['id_broad']
    var background = {
        'id': id,
        'id_background': id_background
    }
    console.log(background)
    connection.query('select * from background where id = ?', id, (error, results, fields) => {
        if (error) throw error
        else {
            // neu co ket qua thi ton tai back ground
            if (results.length == 0) {
                // neu khong ton tai thi insert them background
                connection.query('insert into background set ?', background, (error, results, fields) => {
                    if (error) throw error
                    else {
                        console.log('insert background success!!')
                    }
                })
            } else {
                //neu ton tai thi cap nhau background
                connection.query('update background set id_background = ? where id = ?', [id_background, id], (error, results, fields) => {
                    if (error) throw error
                    else {
                        console.log('update background success!!')
                    }
                })
            }
        }
    })

})

// lay id background
app.get('/id_background', function(req, res, next) {
    var id = req.cookies['id_broad']
    console.log(id)
    connection.query("SELECT id_background FROM background WHERE id = ?", id, (error, results, fields) => {
        //neu loi
        if (error) throw error
        else {
            // neu khong loi thi chuyen du lieu cho ajax
            console.log('OK!!' + results)
            res.json(results[0])
        }
    })
})

// lay ra broad_start
app.get('/get_broad_star', function(req, res, next) {
    var email = req.cookies['email']
    connection.query('select * from broad where email = ? and favourite=1', email, (error, results, fields) => {
        // neu loi
        if (error) throw error
        res.json(results)
    })
})

//lay tat ca cac bang cua broad
app.get('/get_broad_personal', function(req, res, next) {
    var email = req.cookies['email']
    connection.query('select * from broad where email = ?', email, (error, results, fields) => {
        if (error) throw error
        res.json(results)
    })
})

app.post('/invite_member_join_card', function(req, res, next) {
    var id_broad = req.cookies['id_broad'];
    var data = {
        'name_search': req.body.name_search,
        'id_card': req.body.id_card
    };
    //var query = "select * from (select * from broad where id = " + id_broad + ") where username like '%" + data['name_search'] + "%' and username not in (select username from member_card where id = " +  data['id_card'] + ")";
    var query = "select * from accounts where email in (select email from broad where id =" + id_broad + ") AND username like '%" + data['name_search'] + "%'";
    connection.query(query, (error, results, fields) => {
        console.log("show member join card success");
        res.json(results);
    })
})

//sau khi click them thanh vien vao card
app.post('/invitejoincard', function(req, res, next) {
    var data = {
        'id': req.body.id_card,
        'username': req.body.username

    };
    connection.query("insert into member_card set ?", data, (error, results, next) => {
        console.log("invite member join card success ");
    })
})

app.post('/get_post_board', function(req, res, next) {
    var email = req.cookies['email']
    var broadName = req.body.broadName
    console.log('email: ' + email)
    console.log('broadName: ' + broadName)
    connection.query('select * from broad where email = "' + email + '" and broadName like "%' + broadName + '%"', (error, results, fields) => {
        console.log(results)
        res.json(results)
    })
})

// thay doi title card theo id
app.post('/change_title', function(req, res, next) {
    var title = {
        'id_card': req.body.id,
        'title': req.body.text
    }
    var query = 'UPDATE title set title = ? where id_card=?'
    connection.query(query, [title['title'], title['id_card']], (error, results, next) => {
        if (error) throw error
        console.log('update success')
    })
})

module.exports = app;