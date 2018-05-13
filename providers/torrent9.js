const axios = require('axios');
const HTMLParser = require('fast-html-parser');
const url = require('url');
const provider = require('../provider');

class Torrent9 {
    getName() {
        return "Torrent9";
    }
    getBaseUrl() {
        return "http://www.torrent9.red/";
    }
    getCategories() {
        return [provider.movies, provider.series, provider.animes, provider.music, provider.ebook];
    }
    needLogged() {
        return false;
    }
    _convertCat(cat) {
        let tab = [];
        tab[provider.movies] = "films";
        tab[provider.series] = "series";
        return (tab[cat] || "");
    }
    search(query, cat, baseUrl) {
        return new Promise((resolve, reject) => {
            let ep = "/search_torrent/{cat}/{query}/page-0";
            ep = ep.replace('{cat}', this._convertCat(cat));
            ep = ep.replace('{query}', query);
            axios.get(url.resolve(baseUrl, ep))
            .then((resp) => {
                if (!resp.data) {
                    return reject();
                }
                let rst = [];
                let doc;
                try {
                    doc = HTMLParser.parse(resp.data);
                } catch (err) {
                    return reject();
                }
                let rstList = doc.querySelectorAll(".table tr");
                for (let i = 0; rstList[i]; i++) {
                    let elem = rstList[i];
                    // // elem.querySelector();
                    let name = "";
                    let quality = "Unkown";
                    let size = "";
                    let seeds = -1;
                    let peers = -1;
                    try {
                        name = elem.childNodes[1].childNodes[2].text;
                        if (name.search(/720/) == 1) {
                            quality = "720p";
                        }
                        if (name.search(/1080/) == 1) {
                            quality = "1080p";
                        }
                    } catch (err) {
                        name = "Error";
                    }
                    try {
                        size = elem.childNodes[3].childNodes[0].text;
                    } catch (err) {}
                    try {
                        seeds = parseInt(elem.childNodes[5].childNodes[0].text);
                    } catch (err) {}
                    try {
                        peers = parseInt(elem.childNodes[7].childNodes[0].text);
                    } catch (err) {}
                    rst.push({name: name, quality: quality, size: size, seeds: seeds, peers: peers});
                }
                resolve(rst);
            })
            .catch((err) => {
                reject();
            });
        });
    }
}
module.exports = Torrent9;