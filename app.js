const static = require('serve-static');
const express = require('express');
const cookieSession = require('cookie-session');
const i18n = require('i18n');
const path = require('path');
const util = require('./utils');
const setupRoute = require('./setup');
const apiSetupRoute = require('./apiSetup');
const apiRoute = require('./api');
const configRoute = require('./configRoute');
const provider = require('./provider');

const torrent9 = require('./providers/torrent9');
const yts = require('./providers/yts');
const ygg = require('./providers/ygg');

// const tmp = new torrent9();
// const tmp = new yts();
// const tmp = new ygg();
// console.log(tmp.getName());
// tmp.search('harry potter', provider.movies, tmp.getBaseUrl())
// .then((data) => { console.log(data); }).catch((err) => console.error(err));


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

app.set('views', path.join(__dirname, "views"));

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
})
.all('/logout', (req, res) => {
    req.session.connected = undefined;
    req.session = null;
    res.redirect('/');
})

app.listen(8086);
