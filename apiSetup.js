const app = require('express').Router();
const bodyParser = require('body-parser');
const hash = require('sha256');
const deluge = require('deluge');
const axios = require('axios');
const qs = require('query-string');
const url = require('url');
const db = require('./database');

const language = ["en", "fr"];

app
.use((req, res, next) => {
    try {
        if (db.getData('/configured'))
            return res.json({success: false, code: "SETUP_DISABLED"});
        next();
    } catch (err) {
        next();
    }
})
.use(bodyParser.json())
// .use(bodyParser.urlencoded({extended: false}))
.post('/1', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.name || req.body.name.length < 4 || !req.body.language) {
            return reject({code: "INV_PARAM"});
        }
        if (language.indexOf(req.body.language) == -1) {
            return reject({code: "INV_PARAM"});
        }
        try {
            db.push('/config/basic', {name: req.body.name, language: req.body.language})
            return resolve();
        } catch (err) {
            return reject({code: "UNK_ERR"});
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
.post('/2', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.login || req.body.login.length < 3 || !req.body.password || req.body.password.length < 3) {
            return reject({code: "INV_PARAM"});
        }
        try {
            db.push('/config/auth', {login: req.body.login, password: hash(req.body.password)})
            return resolve();
        } catch (err) {
            return reject({code: "UNK_ERR"});
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
.post('/3', (req, res) => {
    new Promise((resolve, reject) => {
        let key = Object.keys(req.body);
        for (let i = 0; key[i]; i++) {
            let tmp;
            try {
                let Provid = require(req.body[key[i]].file);
                tmp = new Provid();
            } catch (err) {
                continue;
            }
            let data = {
                file: req.body[key[i]].file,
                baseUrl: req.body[key[i]].baseUrl,
                active: req.body[key[i]].checked,
                needLogged: req.body[key[i]].needLogged
            };
            if (req.body[key[i]].needLogged) {
                if (req.body[key[i]].checked)
                    data.auth = {
                        login: req.body[key[i]].login,
                        password: req.body[key[i]].password,
                    }
                else
                    data.auth = {};
            }
            db.push('/config/provider/'+key[i], data);
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
.post('/4/deluge', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.host || req.body.host.length < 3 || !req.body.password || req.body.password.length < 3) {
            return reject({code: "INV_PARAM"});
        }
        axios({
            url: req.body.host,
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {method: "auth.login", params: [req.body.password], id: 1}
        })
        .then((resp) => {
            if (resp.data.error || !resp.data.result) {
                return reject();
            }
            db.push("/config/dlsoft/deluge", {
                host: req.body.host,
                password: req.body.password
            });
            resolve();
        })
        .catch((data) => {
            reject();
        });
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
.post('/4/transmission', (req, res) => {
    new Promise((resolve, reject) => {
        if (!req.body.host || req.body.host.length < 3 || !req.body.login || req.body.login.length < 3 || !req.body.password || req.body.password.length < 3) {
            return reject({code: "INV_PARAM"});
        }
        axios({
            url: req.body.host,
            method: "POST",
            auth: {username: req.body.login, password: req.body.password}
        })
        .then((resp) => {
            reject({code: "ERR", msg: __("The host is reachable, but it does not seem to be a transmission server")});
        })
        .catch((data) => {
            try {
                if (!data || !data.response) {
                    return reject({code: "ERR", msg: __("The host is unreachable")});
                }
                if (data.response.status == 409 && typeof data.response.headers["x-transmission-session-id"] == "string") {
                    db.push("/config/dlsoft/transmission", {
                        host: req.body.host,
                        login: req.body.login,
                        password: req.body.password
                    });
                    return resolve();
                } else {
                    if (data.response.status == 401)
                        return reject({code: "ERR", msg: __("Bad login or bad password")});
                    else
                        return reject({code: "ERR", msg: __("This server is not a valid transmission server")});
                }
            } catch (err) {
                return reject({code: "UNK_ERR", msg: __("Unknown error")});
            }
        });
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
.post('/end', (req, res) => {
    try {
        db.push("/configured", true);
        res.json({success: true});
    } catch (err) {
        res.json({success: false});
    }
})
.use((req, res) => {
    res.status(404).json({
        success: false,
        data: {
            code: "ERR_NOT_FOUND"
        }
    });
})

module.exports = app;