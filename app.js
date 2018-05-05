const static = require('serve-static');
const express = require('express');
const cookieSession = require('cookie-session');
const i18n = require('i18n');
const util = require('./utils');
const setupRoute = require('./setup');
const apiSetupRoute = require('./apiSetup');
const apiRoute = require('./api');
const configRoute = require('./configRoute');

i18n.configure({
    locales:['en', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    register: global,
    cookie: 'lang'
});

const app = express();
app.use(i18n.init);
app.use(cookieSession({
    name: 'session',
    keys: ["fezfe"],
    maxAge: 24 * 60 * 60 * 1000
}));

app
.use((req, res, next) => {res.locals.setLocale(util.getLang()); next()})
.use('/api/setup', apiSetupRoute)
.use('/api', apiRoute)
.use('/assets', static('public', {fallthrough: false}))
.use('/setup', setupRoute)
.use((req, res, next) => {
    let configState = util.checkConfig();
    if (util.checkConfig() >= 0) {
        return res.redirect('/setup/' + configState);
    }
    next();
})
.all('/login', (req, res) => {
    res.render('window.ejs', {view: 'index.ejs', view_i: 'pages/login.ejs', is_connected: req.session.connected,
    custom_scripts: ["/assets/js/pages/login.js"], title_page: util.getName()});
})
.use((req, res, next) => {
    if (!req.session || req.session.connected !== true) {
        return res.redirect('/login');
    }
    next();
})
.use('/config', configRoute)
.all('/', (req, res) => {
    res.render('window.ejs', {view: 'index.ejs', view_i: 'pages/home.ejs', menu: util.getMenu(),  is_connected: req.session.connected,
    title_page: util.getName()});
});

app.listen(8086);
