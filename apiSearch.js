const express = require('express');
const provider = require('./provider');
const db = require('./database');

const route = express.Router({});

function checkProviderCat(sources, cat) {
    let nbProviderOk = 0;
    let providerName = [];
    let sourcesName = Object.keys(sources);
    for (let i = 0; sourcesName[i]; i++) {
        if (sources[sourcesName[i]].active) {
            try {
                let Provider = require(sources[sourcesName[i]].file);
                let tmp = new Provider();
                if (tmp.getCategories().indexOf(cat) !== -1) {
                    nbProviderOk += 1;
                    providerName.push(sourcesName[i]);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    return ({nb: nbProviderOk, provider: providerName});
}

function getHeader(cat) {
    let head = [];

    for (let i = 0; provider.head[cat][i]; i++) {
        head.push(__(provider.head[cat][i]));
    }
    return head;
}

route
    .use((req, res, next) => {
        if (!req.session || req.session.connected !== true) {
            return res.json({success: false, code: "NEED_LOGIN"});
        }
        next();
    })
    .get('/providers', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.query.categorie)
                return reject({code: "INV_PARAM"});
            try {
                sources = db.getData('/config/provider');
            } catch (err) {
                return reject({code: "CONF_ERR", msg: __("Unkown error in configuration file")});
            }
            let check = checkProviderCat(sources, parseInt(req.query.categorie));
            if (check.nb === 0) {
                return reject({code: "NO_PROVIDER", msg: __("No provider available for this search")});
            }
            resolve({providers: check, head: getHeader(req.query.categorie)});
        })
            .then((data) => {
                res.json({
                    success: true,
                    data: data
                });
            })
            .catch((data) => {
                res.json({
                    success: false,
                    data: data
                });
            });
    })
    .get('/provider/:name', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.params.name || !req.query.categorie || !req.query.query)
                return reject({code: "INV_PARAM"});
            let providerDB;
            let provider;

            try {
                providerDB = db.getData('/config/provider/' + req.params.name);
                if (!providerDB.active)
                    return reject({code: "PROVIDER_DISABLED", msg: __("The provider is currently disabled")})
            } catch (e) {
                return reject({code: "PROVIDER_NOT_FOUND", msg: __("The provider requested was not found")});
            }
            try {
                let Construct = require(providerDB.file);
                provider = new Construct();
            } catch (err) {
                return reject({code: "PROVIDER_MISSING_FILE", msg: __("Missing file for the provider")});
            }

            // SEARCH
            let icon = "#";
            try {
                icon = provider.getIcon();
            } catch (e) {}
            provider.search(req.query.query, req.query.categorie, providerDB.baseUrl)
                .then((data) => {
                    for (let i = 0; data[i]; i++) {
                        data[i].quality = __(data[i].quality);
                        data[i].language = __(data[i].language);
                    }
                    resolve({source: req.params.name, icon: icon, data: data});
                })
                .catch((err) => {
                    console.log(err);
                    reject({source: req.params.name, msg: err});
                });
        })
            .then((data) => {
                res.json({
                    success: true,
                    data: data
                });
            })
            .catch((data) => {
                res.json({
                    success: false,
                    data: data
                });
            });
    })
    .use((req, res) => {
        res.status(404).json({
            success: false,
            code: "ERR_NOT_FOUND"
        });
    });

module.exports = route;