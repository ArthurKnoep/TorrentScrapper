const express = require('express');
const db = require('./database');
const deluge = require('./deluge');
const transmi = require('./transmission');

const route = express.Router();

route
    .get('/list', (req, res) => {
        new Promise(((resolve, reject) => {
            let dl;
            try {
                dl = db.getData('/config/dlsoft');
            } catch (e) {
                return reject({code: "BAD_CONFIG", msg: __("Error in configuration")});
            }
            let resp = {
                deluge: false,
                transmission: false
            };
            if (typeof dl.deluge !== "undefined")
                resp.deluge = true;
            if (typeof dl.transmission !== "undefined")
                resp.transmission = true;
            resolve(resp);
        }))
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
    .post('/deluge', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.url || !req.body.provider)
                return reject({code: "INV_PARAM"});
            let delugeInfo;
            let providerDB;
            let provider;
            try {
                delugeInfo = db.getData('/config/dlsoft/deluge');
            } catch (err) {
                return reject({code: "DB_ERROR", msg: __("Error in the configuration")});
            }
            try {
                providerDB = db.getData('/config/provider/' + req.body.provider);
                if (!providerDB.active)
                    return reject({code: "PROVIDER_DISABLED", msg: __("The provider is currently disabled")})
            } catch (e) {
                return reject({code: "DB_ERROR", msg: __("Error in the configuration")});
            }
            try {
                let Construct = require(providerDB.file);
                provider = new Construct();
            } catch (err) {
                return reject({code: "PROVIDER_MISSING_FILE", msg: __("Missing file for the provider")});
            }
            provider.getTorrentFromUrl(req.body.url)
                .then((data) => {
                    deluge.addTorrent(delugeInfo.host, delugeInfo.password, data, delugeInfo.path)
                        .then(() => {
                            return resolve({msg: __("Starting download")});
                        })
                        .catch((err) => {
                            return reject({code: "DELUGE_ERROR", msg: __(err)});
                        })
                })
                .catch((err) => {
                    return reject(err);
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
    .post('/deluge/torrent', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.url)
                reject({code: "INV_PARAM"});
            let delugeInfo;
            try {
                delugeInfo = db.getData('/config/dlsoft/deluge');
            } catch (err) {
                return reject({code: "DB_ERROR", msg: __("Error in the configuration")});
            }
            deluge.addTorrent(delugeInfo.host, delugeInfo.password, req.body.url, delugeInfo.path)
                .then(() => {
                    return resolve({msg: __("Starting download")});
                })
                .catch((err) => {
                    return reject({code: "DELUGE_ERROR", msg: __(err)});
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
    .post('/transmission', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.url || !req.body.provider)
                return reject({code: "INV_PARAM"});
            let transmissionInfo;
            let providerDB;
            let provider;
            try {
                transmissionInfo = db.getData('/config/dlsoft/transmission');
            } catch (err) {
                return reject({code: "DB_ERROR", msg: __("Error in the configuration")});
            }
            try {
                providerDB = db.getData('/config/provider/' + req.body.provider);
                if (!providerDB.active)
                    return reject({code: "PROVIDER_DISABLED", msg: __("The provider is currently disabled")})
            } catch (e) {
                return reject({code: "DB_ERROR", msg: __("Error in the configuration")});
            }
            try {
                let Construct = require(providerDB.file);
                provider = new Construct();
            } catch (err) {
                return reject({code: "PROVIDER_MISSING_FILE", msg: __("Missing file for the provider")});
            }
            provider.getTorrentFromUrl(req.body.url)
                .then((data) => {
                    transmi.addTorrent(transmissionInfo.host, transmissionInfo.login, transmissionInfo.password, data, transmissionInfo.path)
                        .then(() => {
                            return resolve({msg: __("Starting download")});
                        })
                        .catch((err) => {
                            return reject({code: "TRANSMI_ERROR", msg: __(err)});
                        })
                })
                .catch((err) => {
                    return reject(err);
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
    .post('/transmission/torrent', (req, res) => {
        new Promise((resolve, reject) => {
            if (!req.body.url)
                reject({code: "INV_PARAM"});
            let transmiInfo;
            try {
                transmiInfo = db.getData('/config/dlsoft/transmission');
            } catch (err) {
                return reject({code: "DB_ERROR", msg: __("Error in the configuration")});
            }
            transmi.addTorrent(transmiInfo.host, transmiInfo.login, transmiInfo.password, req.body.url, transmiInfo.path)
                .then(() => {
                    return resolve({msg: __("Starting download")});
                })
                .catch((err) => {
                    return reject({code: "TRANSMI_ERROR", msg: __(err)});
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