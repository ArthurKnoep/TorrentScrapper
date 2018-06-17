const axios = require('axios');

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

module.exports = {
    test: test
};