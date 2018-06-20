const axios = require('axios');

const categories = {
    "movies": 0,
    "series": 1,
    "animes": 2,
    "music": 3,
    "ebook": 4
};

const head = {
    0: ["Name", "Size", "Quality", "Language", "Seeds / Peers", "Actions"],
    1: ["Name", "Size", "Quality", "Language", "Seeds / Peers", "Actions"],
    2: ["Name", "Size", "Quality", "Language", "Seeds / Peers", "Actions"],
    3: ["Name", "Size", "Seeds / Peers", "Actions"],
    4: ["Name", "Size", "Seeds / Peers", "Actions"]
};

const authent = {
    "none": 0,
    "cookie": 1,
    "bearer": 2,
    "basic": 3
};

function cookieAuthent(req, loginInformation) {
    req.headers = (req.headers || {});
    req.headers['Cookie'] = "ygg_=" + loginInformation;
}

function basicAuthent(req, loginInformation) {
    req.headers = (req.headers || {});
    req.headers['Authorization'] = "Basic " + loginInformation;
}

function bearerAuthent(req, loginInformation) {
    req.headers = (req.headers || {});
    req.headers['Authorization'] = "Bearer " + loginInformation;
}

function addAuthentInfo(loginMethod, req, loginInformation) {
    if (typeof loginMethod === "undefined" || loginMethod === authent.none) {
        // There is nothing to do
    } else if (loginMethod === authent.cookie) {
        cookieAuthent(req, loginInformation);
    } else if (loginMethod === authent.basic) {
        basicAuthent(req, loginInformation);
    } else if (loginMethod === authent.bearer) {
        bearerAuthent(req, loginInformation);
    }
}

function query(url, method, data, loginMethod, loginInformation) {
    return new Promise((resolve, reject) => {
        let req = {
            url: url,
            method: method,
            data: data
        };
        addAuthentInfo(loginMethod, req, loginInformation);
        axios(req).then(resolve).catch(reject);
    });
}

module.exports = {
    cat: categories,
    authent: authent,
    query: query,
    head: head
};