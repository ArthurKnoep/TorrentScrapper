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
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step1.ejs', title_page: __("Configuration"), custom_scripts: [
        "/assets/js/step1.js"
    ], step_setup: 1});
})
.all('/2', (req, res) => {
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step2.ejs', title_page: __("Configuration - %s", utils.getName()), custom_scripts: [
        "/assets/js/step2.js"
    ], step_setup: 2})
})
.all('/3', (req, res) => {
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step3.ejs', title_page: __("Configuration - %s", utils.getName()), custom_scripts: [
        "/assets/js/step3.js"
    ], step_setup: 3})
})
.all('/4', (req, res) => {
    let deluge = {};
    let transmi = {};
    try {
        deluge = db.getData('/config/dlsoft/deluge');
    } catch (err) {}
    try {
        transmi = db.getData('/config/dlsoft/transmission');
    } catch (err) {}
    res.render('window.ejs', {view: 'setup/setup.ejs', step_view: 'step4.ejs', title_page: __("Configuration - %s", utils.getName()), custom_scripts: [
        "/assets/js/step4.js"
    ], deluge: deluge, transmission: transmi, step_setup: 4})
})
.use((req, res) => {
    res.status(404).render('window.ejs', {view: 'setup/setup.ejs', step_view: 'nonstep.ejs', title_page: __("Configuration")});
})

module.exports = app;