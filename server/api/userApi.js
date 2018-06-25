var models = require('../db');
var express = require('express')
var router = express.Router();
var mysql = require('mysql')
var sql = require('../sqlmap')

var bodyParser = require('body-parser');
var conn = mysql.createConnection(models.mysql)

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
conn.connect();

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
}
router.post('/addUser', (req, res) => {
    var sqljquery = sql.user.add;
    var params = req.body;
    console.log(params)
    conn.query(sqljquery, [params.username, params.password], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/selectUser', (req, res) => {
    var sql = sql.user.select;
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
module.exports = router;