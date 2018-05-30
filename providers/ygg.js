const axios = require('axios');
const url = require('url');
const HTMLParser = require('fast-html-parser');
const cheerio = require('cheerio');
const provider = require('../provider');

class Ygg {
    getName() {
        return "YGG";
    }
    getBaseUrl() {
        return "https://yggtorrent.io/";
    }
    getCategories() {
        return [provider.cat.movies, provider.cat.series, provider.cat.animes, provider.cat.music, provider.cat.ebook];
    }
    needLogged() {
        return true;
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
                let rst = [];
                let $;
                try {
                    $ = cheerio.load(resp.data);
                } catch (err) {
                    return reject();
                }
                let ret = [];
                let rstList = $('.results table tbody tr');
                // console.log(rstList[0]);
                for (let i = 0; i < rstList.length; i++) {
                    let name = "";
                    let size = "";
                    try {
                        name = rstList[i].childNodes[3].childNodes[0].childNodes[0].data;
                    } catch (err) {}
                    try {
                        size = rstList[i].childNodes[11].childNodes[0].data;
                    } catch (err) {}
                    ret.push({name: name, size: size});
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