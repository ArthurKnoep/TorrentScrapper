const route = require('express').Router();
const bodyParser = require('body-parser');
const hash = require('sha256');
const db = require('./database');

route
.use(bodyParser.urlencoded({extended: false}))
.post('/auth/login', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.login || !req.body.password) {
            return reject({code: "INV_PARAM"});
        }
        let auth;
        try {
            auth = db.getData('/config/auth');
        } catch (err) {
            return reject({code: "ERR_MISSCONFIG"});
        }
        if (req.body.login === auth.login && hash(req.body.password) === auth.password) {
            req.session.connected = true;
            req.session.date_login = new Date();
            resolve();
        } else {
            reject({code: "BAD_LOGIN"});
        }
    })
    .then((data) => {
        res.json({
            success: true,
            data: data
        });
    })
    .catch((data) => {
        res.json({
            success: false,
            data: data
        });
    });
})
.use((req, res, next) => {
    if (!req.session || req.session.connected !== true) {
        return res.redirect('/login');
    }
    next();
})
.post('/account', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.actual_password || !req.body.new_login || !req.body.new_password) {
            return reject({code: "INV_PARAM", msg: __("Invalid message")});
        }
        let password = "";
        try {
            password = db.getData('/config/auth/password');
        } catch (err) {
            return reject({code: "DB_ERROR", msg: __("Database error")});
        }
        if (password !== hash(req.body.actual_password)) {
            return reject({code: "BAD_PASSWORD", msg: __("Bad Password")});
        }
        db.push('/config/auth/', {login: req.body.new_login, password: hash(req.body.new_password)});
        resolve({msg: __("Login information changed with success")});
    })
    .then((data) => {
        res.json({
            success: true,
            data: data
        });
    })
    .catch((data) => {
        res.json({
            success: false,
            data: data
        });
    });
})
.use((req, res) => {
    res.status(404).json({
        success: false,
        code: "ERR_NOT_FOUND"
    });
})

module.exports = route;