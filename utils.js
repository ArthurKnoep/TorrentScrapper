const db = require('./database');

function checkConfigBasic() {
    try {
        db.getData('/config/basic');
        return (1);
    } catch (err) {
        return (0);
    }
}

function checkConfigAuth() {
    try {
        db.getData('/config/auth');
        return (1);
    } catch (err) {
        return (0);
    }
}

function checkConfigSource() {
    try {
        db.getData('/config/source');
        return (1);
    } catch (err) {
        return (0);
    }
}

function checkConfigDlSoft() {
    try {
        db.getData('/config/dlsoft');
        return (1);
    } catch (err) {
        return (0);
    }
}

function checkConfigMenu() {
    try {
        db.getData('/config/menu');
        return (1);
    } catch (err) {
        return (0);
    }
}

function checkConfig() {
    try {
        if (db.getData('/configured'))
            return (-1);
        if (!checkConfigBasic()) {
            return (1);
        }
        if (!checkConfigAuth()) {
            return (2);
        }
        if (!checkConfigSource()) {
            return (3);
        }
        return (1);
    } catch (err) {
        if (!checkConfigBasic()) {
            return (1);
        }
        if (!checkConfigAuth()) {
            return (2);
        }
        if (!checkConfigSource()) {
            return (3);
        }
        return (1);
    }
}

function getName() {
    try {
        return db.getData('/config/basic/name');
    } catch (err) {
        return "";
    }
}

function getLang() {
    try {
        return db.getData('/config/basic/language');
    } catch (err) {
        return "en";
    }
}

function getMenu() {
    try {
        return db.getData('/config/menu');
    } catch (err) {
        return [];
    }
}

module.exports = {
    checkConfig: checkConfig,
    getName: getName,
    getLang: getLang,
    getMenu: getMenu
};