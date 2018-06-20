const axios = require('axios');
const Url = require('url');
const Transmission = require('transmission');

function test(host, login, password) {
    return new Promise((resolve, reject) => {
        axios({
            url: host,
            method: "POST",
            auth: {username: login, password: password}
        })
            .then((resp) => {
                reject({
                    code: "ERR",
                    msg: __("The host is reachable, but it does not seem to be a transmission server")
                });
            })
            .catch((data) => {
                try {
                    if (!data || !data.response) {
                        return reject({code: "ERR", msg: __("The host is unreachable")});
                    }
                    if (data.response.status === 409 && typeof data.response.headers["x-transmission-session-id"] === "string") {
                        return resolve();
                    } else {
                        if (data.response.status === 401)
                            return reject({code: "ERR", msg: __("Bad login or bad password")});
                        else
                            return reject({code: "ERR", msg: __("This server is not a valid transmission server")});
                    }
                } catch (err) {
                    return reject({code: "UNK_ERR", msg: __("Unknown error")});
                }
            });
    });
}

function getSpaceLeft(host, login, password, filepath) {
    return new Promise((resolve, reject) => {
        const u = new Url.parse(host);
        transmission = new Transmission({
            host: u.hostname,
            port: u.port,
            username: login,
            password: password
        });

        transmission.freeSpace(filepath, (err, rst) => {
            if (err)
                return reject(err);
            resolve(rst["size-bytes"]);
        });
    });
}

function addTorrent(host, login, password, url, filepath) {
    return new Promise((resolve, reject) => {
        const u = new Url.parse(host);
        transmission = new Transmission({
            host: u.hostname,
            port: u.port,
            username: login,
            password: password
        });

        transmission.addUrl(url, {"download-dir": filepath}, (err, rst) => {
            if (err) {
                return console.log(err);
            }
            var id = rst.id;
            console.log('Just added a new torrent.');
            console.log('Torrent ID: ' + id);
            // console.log('ok2');
            // if (err)
            //     return reject(err);
            // resolve(rst);
        })
    });
}

module.exports = {
    test: test,
    addTorrent: addTorrent,
    getSpaceLeft: getSpaceLeft
};