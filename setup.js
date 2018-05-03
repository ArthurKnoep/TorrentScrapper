const app = require('express').Router();
const utils = require('./utils');
const db = require('./database');

app
.use((req, res, next) => {
    try {
        if (db.getData('/configured'))
            return res.redirect('/');
        next();
    } catch (err) {
        next();
    }
})
.all('/1', (req, res) => {
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step1.ejs', title_page: "Configuration", custom_scripts: [
        "/assets/js/step1.js"
    ]});
})
.all('/2', (req, res) => {
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step2.ejs', title_page: "Configuration - " + utils.getName(), custom_scripts: [
        "/assets/js/step2.js"
    ]})
})
.all('/3', (req, res) => {
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step3.ejs', title_page: "Configuration - " + utils.getName(), custom_scripts: [
        "/assets/js/step3.js"
    ]})
})
.all('/4', (req, res) => {
    let deluge = {};
    try {
        deluge = db.getData('/config/dlsoft/deluge');
    } catch (err) {}
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step4.ejs', title_page: "Configuration - " + utils.getName(), custom_scripts: [
        "/assets/js/step4.js"
    ], deluge: deluge})
})
.use((req, res) => {
    res.status(404).render('window.ejs', {view: 'setup/setup.ejs', step_view: 'nonstep.ejs', title_page: "Configuration"});
})

module.exports = app;