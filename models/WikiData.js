'use strict';

const wdk = require('wikidata-sdk');
const request = require('request');

const queries = require('../queries.js');

const WikidataHelper = require('./WikidataHelper');


class WikiData {
    constructor(db, collection) {
        this.wdk = wdk;
        this.helper = new WikidataHelper();
        this.db = db;


        this.collection = {};
        this.url = '';
    }


    __getSparql(url) {

        let promise = new Promise((resolve, reject) => {
            request(url, (err, res, body) => {

                if (err) {
                    return reject(err);
                }

                let data;

                try {
                    data = this.wdk.simplifySparqlResults(JSON.parse(body));
                } catch (err) {
                    console.error(err);
                    return reject(err);
                }

                return resolve(data);
            });
        });

        return promise;


    }


    __parseData(rawData) {
        return rawData.map(country => {
            country.name = country._id.label;
            country._id = country._id.value;

            let regions = country.regions.split(', ');

            let siblingsIds = this.helper.parseIds(country.siblings.split(', '));
            let siblingsNames = country.siblingLabels.split(', ');

            let siblings = siblingsIds.map((id, index) => {
                return {
                    _id: id,
                    name: siblingsNames[index],
                };
            });



            country.regions = this.helper.parseIds(regions);
            country.siblings = siblings;

            delete country.siblingLabels;

            country.flag = this.helper.makeImgUrl(country.flag);

            return country;
        });
    }



    __saveToDb(data) {
        return new Promise((resolve, reject) => {

            this.collection.insertMany(data, function(err, result) {
                if (err) {
                    console.log(err);
                    return reject(err);
                }

                return resolve(data);
            });
        });

    }

    __dropCollection(data) {
        return new Promise((resolve, reject) => {

            this.collection.remove({}, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });
    }


    __isCollectionEmpty() {

        return new Promise((resolve, reject) => {
                this.collection.count(function (err, count) {
                if (err) {
                    return reject(err);
                }

                return resolve(count > 0);
            });
        });
    }

    populateDb() {
        console.log('start to populate db!');
        return this.__getSparql(this.url)
            .then(data => {
                let parsed = this.__parseData(data);
                return parsed;
            })
            .then(data => {
                data = this.helper.removeDups(data);
                return this.__dropCollection(data);
            })
            .then(data => {
                return this.__saveToDb(data);
            })
            .catch(console.error);
    }


    __getData(ids) {

        let query = {};

        if (Array.isArray(ids) && ids.length > 0) {
            query = {_id: {$in: ids}};
        }

        return new Promise((resolve, reject) => {

            this.collection.find(query).toArray((err, data) => {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });
    }

    get() {
        return this.__isCollectionEmpty()
            .then((notEmpty) => {
                if (notEmpty) {
                    return this.__getData();
                }

                return this.populateDb();
            });
    }

    getOne(id) {
        return this.__getData([id]);
    }
}


module.exports = WikiData;