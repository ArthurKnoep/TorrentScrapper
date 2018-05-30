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

module.exports = {
    cat: categories,
    head: head
};