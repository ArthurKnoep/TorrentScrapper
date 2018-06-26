const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8086, () => {
    console.log("Webserver started on *:8086");
});

const staticS = require('serve-static');
const cookieSession = require('cookie-session');
const i18n = require('i18n');
const path = require('path');
const util = require('./utils');
const setupRoute = require('./setup');
const apiSetupRoute = require('./apiSetup');
const apiRoute = require('./api');
const apiSearch = require('./apiSearch');
const configRoute = require('./configRoute');
const provider = require('./provider');
const socketHandler = require('./searchSock');

const transmission = require('./transmission');
const deluge = require('./deluge');

// deluge.getSpaceLeft("https://deluge.knoepflin.eu/json", "test1234")
//     .then((data) => {
//
//     });
// deluge.addTorrent("https://deluge.knoepflin.eu/json", "test1234", "http://www.torrent9.ec/downloading/c59631d45139b9e264bf7d4748f18d789dafd1ba/62079", "/home/pi")
//     .then((d) => {
//         // console.log("s", d);
//     })
//     .catch((err) => {
//         // console.log("e", err);
//     });

// transmission.getSpaceLeft("http://localhost:9091", "transmission", "transmission", "/home/arthur")
//     .then(data => console.log(((data / 1024) / 1024) / 1024));
// transmission.addTorrent("http://localhost:9091", "transmission", "transmission", "http://www.torrent9.ec/downloading/c59631d45139b9e264bf7d4748f18d789dafd1ba/62079", "/home/arthur")
//     .then((d) => {
//         console.log(d);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

i18n.configure({
    locales: ['en', 'fr'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    register: global,
    cookie: 'lang'
});

app.use(i18n.init);
app.use(cookieSession({
    name: 'session',
    httpOnly: false,
    keys: util.getCookie(),
    maxAge: 24 * 60 * 60 * 1000
}));

app.set('views', path.join(__dirname, "views"));

io.on('connection', (socket) => {
    socketHandler(socket);
});

app
    .use((req, res, next) => {
        res.locals.setLocale(util.getLang());
        next()
    })
    .use('/api/setup', apiSetupRoute)
    .use('/api/search', apiSearch)
    .use('/api', apiRoute)
    .use('/assets', staticS('assets', {fallthrough: false}))
    .use('/setup', setupRoute)
    .use((req, res, next) => {
        let configState = util.checkConfig();
        if (util.checkConfig() >= 0) {
            return res.redirect('/setup/' + configState);
        }
        next();
    })
    .all('/login', (req, res) => {
        res.render('window.ejs', {
            view: 'index.ejs', view_i: 'pages/login.ejs', is_connected: req.session.connected,
            custom_scripts: ["/assets/js/pages/login.js"], title_page: util.getName()
        });
    })
    .use((req, res, next) => {
        if (!req.session || req.session.connected !== true) {
            return res.redirect('/login');
        }
        next();
    })
    .use('/config', configRoute)
    .all('/', (req, res) => {
        res.render('window.ejs', {
            view: 'index.ejs', view_i: 'pages/home.ejs', menu: util.getMenu(), is_connected: req.session.connected,
            custom_scripts: ["https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js", "http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", "/assets/js/pages/home-http.js"],
            title_page: util.getName(), cat: provider.cat
        });
    })
    .all('/logout', (req, res) => {
        req.session.connected = undefined;
        req.session = null;
        res.redirect('/');
    })
    .use((req, res) => {
        res.status(404).send('<h1>Not found</h1>');
    });
