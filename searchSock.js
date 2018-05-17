const cookieSession = require('cookie-session');
const db = require('./database');
const utils = require('./utils');

const CookieSession = cookieSession({
    name: 'session',
    keys: utils.getCookie(),
    maxAge: 24 * 60 * 60 * 1000
});

function checkProviderCat(sources, cat) {
    let nbProviderOk = 0;
    let providerName = [];
    let construct = [];
    let baseUrl = [];
    let sourcesName = Object.keys(sources);
    for (let i = 0; sourcesName[i]; i++) {
        if (sources[sourcesName[i]].active) {
            try {
                let Provider = require(sources[sourcesName[i]].file);
                let tmp = new Provider();
                if (tmp.getCategories().indexOf(cat) !== -1) {
                    providerName.push(sourcesName[i]);
                    baseUrl.push(sources[sourcesName[i]].baseUrl);
                    construct.push(Provider);
                    nbProviderOk += 1;
                }
            } catch (err) {
                console.log(err);
                continue;
            }
        }
    }
    return ({nb: nbProviderOk, provider: providerName, baseUrl: baseUrl, construct: construct});
}

function launchQuery(socket, providerList, query, cat) {
    for (let i = 0; i < providerList.nb; i++) {
        let provider = new providerList.construct[i]();
        let name = providerList.provider[i];
        provider.search(query, cat, providerList.baseUrl[i])
        .then((data) => {
            socket.emit('resp', {source: name, code: "OK", data: data});
        })
        .catch((err) => {
            socket.emit('resp', {source: name, code: "KO", msg: err});
        });
    }
}

function listen(socket) {
    socket.on('search', (data) => {
        let sources;

        if (!data.session1 || !data.session2 || !data.query || typeof data.categorie != "number") {
            socket.emit('resp', {code: "INV_PARAM"});
            return;
        }
        let req = {headers: {cookie: "session="+data.session1+"; session.sig="+data.session2}}, res = {}, next = () => {};
        CookieSession(req, res, next);
        if (!req.session || !req.session.connected) {
            socket.emit('resp', {code: "NOT_CONNECTED"});
            return;
        }
        try {
            sources = db.getData('/config/provider');
        } catch (err) {
            socket.emit('resp', {code: "CONF_ERR"});
            return;
        }
        let check = checkProviderCat(sources, data.categorie);
        if (check.nb == 0) {
            socket.emit('resp', {code: "NO_PROVIDER"});
            return;
        }
        launchQuery(socket, check, data.query, data.categorie);
        socket.emit('resp', {code: 'OK', sourceIncomming: check.provider});
    });
}

module.exports = listen;