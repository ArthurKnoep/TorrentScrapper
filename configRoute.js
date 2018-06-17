const route = require('express').Router();
const util = require('./utils');
const db = require('./database');

route
    .all('/account', (req, res) => {
        let login = "";
        try {
            login = db.getData('/config/auth/login')
        } catch (e) {
        }
        res.render('window.ejs', {
            view: 'index.ejs',
            view_i: 'pages/config/account.ejs',
            menu: util.getMenu(),
            is_connected: req.session.connected,
            title_page: util.getName(),
            login_user: login,
            custom_scripts: ["http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", '/assets/js/pages/account.js']
        });
    })
    .all('/dlsoft', (req, res) => {
        let deluge = {};
        let transmi = {};
        try {
            deluge = db.getData('/config/dlsoft/deluge');
        } catch (err) {
        }
        try {
            transmi = db.getData('/config/dlsoft/transmission');
        } catch (err) {
        }
        res.render('window.ejs', {
            view: 'index.ejs',
            view_i: 'pages/config/dlsoft.ejs',
            menu: util.getMenu(),
            is_connected: req.session.connected,
            title_page: util.getName(),
            custom_scripts: ["http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", '/assets/js/pages/dlsoft.js'],
            deluge: deluge,
            transmission: transmi
        });
    })
    .all('/menu', (req, res) => {
        res.render('window.ejs', {
            view: 'index.ejs',
            view_i: 'pages/config/menu.ejs',
            menu: util.getMenu(),
            is_connected: req.session.connected,
            custom_scripts: ['/assets/js/pages/menu.js'],
            title_page: util.getName()
        });
    })
    .use((req, res) => {
        res.status(404).send('not found');
    });

module.exports = route;