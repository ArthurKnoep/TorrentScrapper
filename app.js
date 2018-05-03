const static = require('serve-static');
const express = require('express');
const i18n = require('i18n');
const util = require('./utils');
const setupRoute = require('./setup');
const apiSetupRoute = require('./apiSetup');

i18n.configure({
    locales:['en', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    register: global,
    cookie: 'lang'
});

const app = express();
app.use(i18n.init);

app
.use('/api/setup', apiSetupRoute)
.use('/assets', static('public'))
.use((req, res, next) => {res.locals.setLocale(util.getLang()); next()})
.use('/setup', setupRoute)
.use((req, res, next) => {
    let configState = util.checkConfig();
    if (util.checkConfig() >= 0) {
        return res.redirect('/setup/' + configState);
    }
    next();
})
.all('/', (req, res) => {
    res.render('window.ejs', {view: 'index.ejs', title_page: "Test"});
});

app.listen(8086);
