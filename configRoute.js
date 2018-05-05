const route = require('express').Router();
const util = require('./utils');

route
.all('/menu', (req, res) => {
    res.render('window.ejs', {view: 'index.ejs', view_i: 'pages/config/menu.ejs', menu: util.getMenu(),  is_connected: req.session.connected,
    title_page: util.getName()});
})
.use((req, res) => {
    res.status(404).send('not found');
})

module.exports = route;