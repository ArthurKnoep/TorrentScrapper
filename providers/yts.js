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
    getIcon() {
        return "https://yts.am/assets/images/website/favicon.ico";
    }
    getCategories() {
        return [provider.cat.movies];
    }
    getLoginType() {
        return provider.authent.none;
    }
    search(query, cat, baseUrl) {
        return new Promise((resolve, reject) => {
            let ep = "/api/v2/list_movies.json?query_term={query}";
            ep = ep.replace('{query}', query);
            provider.query(url.resolve(baseUrl, ep), "get", undefined, this.getLoginType(), "")
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
                        rst.push({
                            name: elem.title,
                            path: elem.url,
                            quality: elem.torrents[j].quality,
                            torrent: elem.torrents[j].url,
                            size: elem.torrents[j].size,
                            language: elem.language,
                            seeds: elem.torrents[j].seeds,
                            peers: elem.torrents[j].peers
                        });
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