var config = require('../../configuration/config')
var mysql = require('mysql');
const { database } = require('../../configuration/config');
const e = require('express');

var connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database

});
var email =
    connection.query("SELECT broad.id, broad.email, broad.broadName, title.title, title.id_card, " +
        "card.text_card FROM broad, title, card WHERE broad.id = title.id " +
        "and card.id_card = title.id_card and broad.email = ?",
        email, (error, results, fields) => {
            var task = []

            var id = {}
            var id_card = {}
            results.forEach(element => {
                id[element['id']] = 0
                id_card[element['id_card']] = 0
            });

            for (i in id) {
                var same_id = results.filter(function(x) {
                    return x['id'] == i
                })
                var obj = {}
                obj['id'] = i
                obj['email'] = same_id[0]['email']
                obj['broadName'] = same_id[0]['broadName']
                obj['title'] = []

                for (j in id_card) {
                    var same_id_card = same_id.filter(function(x) {
                            return x['id_card'] == j
                        })
                        // console.log(j)
                    var obj_title = {}

                    try {
                        obj_title['title'] = same_id_card[0]['title']
                        obj_title['id_card'] = same_id_card[0]['id_card']
                        obj_title['text_card'] = []
                        same_id_card.forEach(element => {
                            obj_title['text_card'].push(element['text_card'])
                        });
                        obj['title'].push(obj_title)
                    } catch {
                        continue
                    }
                }

                task.push(obj)
            }
            console.log(task)
        });