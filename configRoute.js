const route = require('express').Router();
const util = require('./utils');
const db = require('./database');
const fs = require('fs');
const path = require('path');
const provider = require('./provider');

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
    .all('/sources', (req, res) => {
        fs.readdir(path.join(__dirname, 'providers'), (err, rst) => {
            if (err) {
                return res.status(500).send("Internal server error");
            }
            let sources;
            try {
                sources = db.getData('/config/provider');
            } catch (e) {
                return res.status(500).send("<h1>Missing configuration</h1>");
            }
            let source_desactiv = [];
            rst.forEach((elem) => {
                let file = path.resolve(__dirname, 'providers', elem);
                let key = Object.keys(sources);
                for (let i = 0; key[i]; i++) {
                    if (file === sources[key[i]].file)
                        return;
                }
                let prov;
                try {
                    let Construct = require(file);
                    prov = new Construct();
                } catch (e) {
                    return;
                }
                source_desactiv.push({file: elem, name: prov.getName(), authent: (prov.getLoginType() !== provider.authent.none)});
            });
            res.render('window.ejs', {
                view: 'index.ejs',
                view_i: 'pages/config/sources.ejs',
                menu: util.getMenu(),
                is_connected: req.session.connected,
                title_page: util.getName(),
                custom_scripts: ["http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", '/assets/js/pages/sources.js'],
                sources_loaded: sources,
                source_desactiv: source_desactiv
            });
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
        res.status(404).send('<h1>Not found</h1>');
    });

module.exports = route;