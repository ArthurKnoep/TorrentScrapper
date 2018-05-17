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
.use((req, res) => {
    res.status(404).json({
        success: false,
        code: "ERR_NOT_FOUND"
    });
})

module.exports = route;