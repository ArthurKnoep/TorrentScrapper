const route = require('express').Router();
const bodyParser = require('body-parser');
const hash = require('sha256');
const deluge = require('./deluge');
const transmission = require('./transmission');
const db = require('./database');
const download = require('./apiDownload');

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
            return res.json({success: false, data: {code: "NEED_LOGIN", msg: __("Please login first")}});
        }
        next();
    })
    .use('/dl', download)
    .post('/config/account', (req, res) => {
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
    .post('/config/dlsoft/deluge', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.host || !req.body.path || !req.body.password)
                return reject({code: "INV_PARAM"});
            deluge.test(req.body.host, req.body.password)
                .then(() => {
                    db.push("/config/dlsoft/deluge", {
                        host: req.body.host,
                        path: req.body.path,
                        password: req.body.password
                    });
                    resolve({msg: __("Configured with: ") + req.body.host.substr(0, req.body.host.length - 5)});
                })
                .catch(() => {
                    return reject({code: "ERR_DELUGE"});
                });
        })
            .then((data) => {
                res.json({
                    success: true,
                    data: data
                });
            })
            .catch((data) => {
                console.log(data);
                res.json({
                    success: false,
                    data: data
                });
            });
    })
    .delete('/config/dlsoft/deluge', (req, res) => {
        db.delete('/config/dlsoft/deluge');
        res.json({success: true, data: {msg: __("Server information deleted")}});
    })
    .post('/config/dlsoft/transmission', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.host || !req.body.login || !req.body.path || !req.body.password)
                return reject({code: "INV_PARAM"});
            transmission.test(req.body.host, req.body.login, req.body.password)
                .then(() => {
                    db.push("/config/dlsoft/transmission", {
                        host: req.body.host,
                        login: req.body.login,
                        path: req.body.path,
                        password: req.body.password
                    });
                    resolve({msg: __("Configured with: ") + req.body.host.substr(0, req.body.host.length - 17)});
                })
                .catch(reject);
        })
            .then((data) => {
                res.json({
                    success: true,
                    data: data
                });
            })
            .catch((data) => {
                console.log(data);
                res.json({
                    success: false,
                    data: data
                });
            });
    })
    .delete('/config/dlsoft/transmission', (req, res) => {
        db.delete('/config/dlsoft/transmission');
        res.json({success: true, data: {msg: __("Server information deleted")}});
    })
    .post('/config/menu', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.title || !req.body.url || !req.body.new_tab)
                return reject({code: "INV_PARAM", msg: __("Missing parameter")});
            if (req.body.title.length < 1)
                return reject({code: "TITLE_TOO_SHORT", msg: __("Invalid value for title field")});
            if (req.body.new_tab !== "false" && req.body.new_tab !== "true")
                return reject({code: "NEW_TAB_ERROR", msg: __("Invalid value for new tab field")});
            db.push('/config/menu[]', {text: req.body.title, url: req.body.url, new_tab: req.body.new_tab});
            resolve();
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
    .delete('/config/menu', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.id || !Number.isInteger(parseInt(req.body.id)))
                reject ({code: "INV_PARAM"});
            try {
                db.delete('/config/menu[' + req.body.id + "]");
            } catch (e) {
                return reject({code: "DB_ERROR"});
            }
            resolve();
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
    });

module.exports = route;