const axios = require('axios');
const HTMLParser = require('fast-html-parser');
const url = require('url');
const provider = require('../provider');

function parseName(name) {
    let quality = __("Unknown");
    let language;
    if (/hdtv/i.exec(name)) {
        quality = "HDTV";
    }
    if (/720/.exec(name)) {
        quality = "720p";
    }
    if (/1080/.exec(name)) {
        quality = "1080p";
    }
    if (/vost/i.exec(name)) {
        language = "VOSTFR";
    }
    if (/multi/i.exec(name)) {
        language = "Multi";
    }
    if (/french/i.exec(name)) {
        language = "French";
    }
    return {quality: quality, language: language};
}

function parseUrl(attr) {

}

class Torrent9 {
    getName() {
        return "Torrent9";
    }
    getBaseUrl() {
        return "http://www.torrent9.ec/";
    }
    getCategories() {
        return [provider.cat.movies, provider.cat.series, provider.cat.animes, provider.cat.music, provider.cat.ebook];
    }
    getIcon() {
        return "http://www.torrent9.ec/favicon.ico";
    }
    needLogged() {
        return false;
    }
    _convertCat(cat) {
        let tab = [];
        tab[provider.cat.movies] = "films";
        tab[provider.cat.series] = "series";
        tab[provider.cat.ebook] = "ebook";
        return (tab[cat] || "");
    }

    _parseUrl(attr) {
        let u = /.*href="([^"]*)".*/.exec(attr)[1];

        if (!u.startsWith("http")) {
            return url.resolve(this.getBaseUrl(), u);
        }
        return u;
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
                    let name = "";
                    let quality = "Unknown";
                    let language = "Unknown";
                    let size = "";
                    let seeds = -1;
                    let peers = -1;
                    let path = "#";
                    try {
                        name = elem.childNodes[1].childNodes[2].text;
                        if (cat == provider.cat.movies || cat == provider.cat.series) {
                            quality = parseName(name).quality;
                            language = parseName(name).language;
                        } else {
                            quality = undefined;
                            language = undefined;
                        }
                    } catch (err) {
                        continue;
                    }
                    try {
                        path = this._parseUrl(elem.childNodes[1].childNodes[2].rawAttrs);
                    } catch (err) {}
                    try {
                        size = elem.childNodes[3].childNodes[0].text;
                    } catch (err) {}
                    try {
                        seeds = parseInt(elem.childNodes[5].childNodes[0].text);
                    } catch (err) {}
                    try {
                        peers = parseInt(elem.childNodes[7].childNodes[0].text);
                    } catch (err) {}
                    rst.push({
                        name: name,
                        path: path,
                        quality: quality,
                        size: size,
                        language: language,
                        seeds: seeds,
                        peers: peers
                    });
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