'use strict';

const md5 = require('md5');

class WikidataHelper {
    constructor() {
        this.md5 = md5;
    }

    makeImgUrl(url) {
        let filename = url.slice(url.lastIndexOf('/') + 1).split('%20').join('_');

        let hash = this.md5(filename);

        let firstChar = hash.charAt(0);
        let secondChar = hash.charAt(1);

        return `https://upload.wikimedia.org/wikipedia/commons/${firstChar}/${firstChar}${secondChar}/${filename}`;
    }

    parseIds(urls) {
        return urls.map(url => {
            return url.slice(url.indexOf('Q'));
        });
    }

    removeDups(data) {
        let prev = data[0];
        return data.filter((current, index) => {
            if (index !== 0 && prev._id === current._id) {
                return false;
            }

            prev = current;
            return true;
        });
    }
}

module.exports = WikidataHelper;