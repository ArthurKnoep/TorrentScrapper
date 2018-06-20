const axios = require('axios');
const url = require('url');
const HTMLParser = require('fast-html-parser');
const cheerio = require('cheerio');
const provider = require('../provider');

function parseName(name) {
    let quality = __("Unknown");
    let language = __("Unknown");
    if (/hdtv/i.exec(name)) {
        quality = "HDTV";
    }
    if (/720/.exec(name)) {
        quality = "720p";
    }
    if (/1080/.exec(name)) {
        quality = "1080p";
    }
    if (/2160/.exec(name)) {
        quality = "4k";
    }
    if (/vost/i.exec(name)) {
        language = "VOSTFR";
    }
    if (/french/i.exec(name)) {
        language = "French";
    }
    if (/VFF/.exec(name)) {
        language = "French";
    }
    if (/VFQ/.exec(name)) {
        language = "French - Quebec";
    }
    if (/multi/i.exec(name)) {
        language = "Multi";
    }
    return {quality: quality, language: language};
}

class Ygg {
    getName() {
        return "YGG";
    }

    getIcon() {
        return "https://yggtorrent.is/static/img/logotype-mobile.png";
    }

    getBaseUrl() {
        return "https://yggtorrent.io/";
    }

    getCategories() {
        return [provider.cat.movies, provider.cat.series, provider.cat.animes, provider.cat.music, provider.cat.ebook];
    }

    getLoginType() {
        return provider.authent.cookie;
    }

    getLoginInformation(baseUrl, login, password) {
        return new Promise((resolve, reject) => {
            axios({
                url: url.resolve(baseUrl, '/user/login'),
                method: 'POST',
                header: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    id: login,
                    pass: password
                }
            }).then((resp) => {
                console.log(resp.request._header);
                console.log(resp.data);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    _convertCat(cat) {
        let tab = [];
        tab[provider.cat.movies] = "category=2145&sub_category=2183";
        tab[provider.cat.series] = "category=2145&sub_category=2184";
        tab[provider.cat.animes] = "category=2145&sub_category=2179";
        tab[provider.cat.music] = "category=2139&sub_category=2148";
        tab[provider.cat.ebook] = "category=2140";
        return (tab[cat] || "");
    }

    search(query, cat, baseUrl) {
        return new Promise((resolve, reject) => {
            let ep = "/engine/search?name={query}&{cat}&do=search";
            ep = ep.replace('{cat}', this._convertCat(cat));
            ep = ep.replace('{query}', query);
            axios.get(url.resolve(baseUrl, ep))
                .then((resp) => {
                    if (!resp.data) {
                        return reject();
                    }
                    let $;
                    try {
                        $ = cheerio.load(resp.data);
                    } catch (err) {
                        return reject();
                    }
                    let ret = [];
                    let rstList = $('.results table tbody tr');
                    for (let i = 0; i < rstList.length; i++) {
                        let name = "";
                        let size = "";
                        let peers = -1;
                        let seeds = -1;
                        let path = "";
                        let quality = "Unknown";
                        let language = "Unknown";
                        try {
                            name = rstList[i].childNodes[3].childNodes[0].childNodes[0].data;
                            path = url.resolve(baseUrl, rstList[i].childNodes[3].childNodes[0].attribs.href);
                            if (parseInt(cat) === provider.cat.movies || parseInt(cat) === provider.cat.series || parseInt(cat) === provider.cat.animes) {
                                quality = parseName(name).quality;
                                language = parseName(name).language;
                            } else {
                                quality = undefined;
                                language = undefined;
                            }
                        } catch (err) {
                        }
                        try {
                            size = rstList[i].childNodes[11].childNodes[0].data;
                        } catch (err) {
                        }
                        try {
                            seeds = rstList[i].childNodes[15].childNodes[0].data;
                            peers = rstList[i].childNodes[17].childNodes[0].data;
                        } catch (e) {
                        }
                        if (!name.length || !path.length)
                            continue;
                        ret.push({
                            name: name,
                            size: size,
                            path: path,
                            quality: quality,
                            language: language,
                            seeds: seeds,
                            peers: peers
                        });
                    }
                    resolve(ret);
                })
                .catch((rst) => {
                    reject();
                })
            // console.log(url.resolve(baseUrl, ep));
        });
    }
}

module.exports = Ygg;