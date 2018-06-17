const axios = require('axios');

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

module.exports = {
    test: test
};