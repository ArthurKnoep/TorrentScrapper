const axios = require('axios');
const deluge = require('deluge');

function test(host, password) {
    return new Promise((resolve, reject) => {
        axios({
            url: host,
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {method: "auth.login", params: [password], id: 1}
        })
            .then((resp) => {
                if (resp.data.error || !resp.data.result) {
                    return reject();
                }
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}

function _internal_add(resolve, reject, dl, url, filepath) {
    dl.add(url, filepath, (err, rst) => {
        if (err)
            return reject(err);
        resolve(rst);
    });
}

function getSpaceLeft(host, password) {
    return new Promise((resolve, reject) => {
        let dl = deluge(host, password);

        dl.getTorrentRecord((err, rst) => {
            if (err)
                return reject(err);
            resolve(rst.stats.free_space);
        });
    });
}

function addTorrent(host, password, url, filepath) {
    return new Promise((resolve, reject) => {
        let dl = deluge(host, password);

        dl.isConnected((err, rst) => {
            if (err)
                return reject(err);
            if (rst)
                _internal_add(resolve, reject, dl, url, filepath);
            else {
                dl.getHosts((err, host) => {
                    if (err)
                        return reject(err);
                    if (host.length === 0)
                        return reject("No daemon");
                    dl.connect(host[0].id, (err, rst) => {
                        if (err)
                            return reject(err);
                        if (!rst)
                            return reject("Cannot connect to daemon");
                        _internal_add(resolve, reject, dl, url, filepath);
                    });
                });
            }
        });
    });
}

module.exports = {
    test: test,
    addTorrent: addTorrent,
    getSpaceLeft: getSpaceLeft
};