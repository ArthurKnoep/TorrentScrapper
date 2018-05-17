const axios = require('axios');
const url = require('url');
const provider = require('../provider');

class YTS {
    getName() {
        return "YTS";
    }
    getBaseUrl() {
        return "https://yts.am/";
    }
    getCategories() {
        return [provider.movies];
    }
    needLogged() {
        return false;
    }
    search(query, cat, baseUrl) {
        return new Promise((resolve, reject) => {
            let ep = "/api/v2/list_movies.json?query_term={query}";
            ep = ep.replace('{query}', query);
            axios.get(url.resolve(baseUrl, ep))
            .then((resp) => {
                let jr = resp.data;
                if (!jr || jr.status !== "ok") {
                    return reject();
                }
                if (jr.data.movie_count === 0) {
                    return resolve([]);
                }
                let rst = [];
                for (let i = 0; jr.data.movies[i]; i++) {
                    let elem = jr.data.movies[i];
                    for (let j = 0; elem.torrents[j]; j++) {
                        rst.push({name: elem.title, quality: elem.torrents[j].quality, size: elem.torrents[j].size, seeds: elem.torrents[j].seeds, peers: elem.torrents[j].peers});
                    }
                }
                resolve(rst);
            })
            .catch((err) => {
                console.error(err);
                reject();
            })
        });
    }
}

module.exports = YTS;