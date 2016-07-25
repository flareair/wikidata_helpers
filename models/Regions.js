'use strict';

const WikiData = require('./WikiData');
const queries = require('../queries.js');

const request = require('request');

class Regions extends WikiData {
    constructor(db, collection) {

        super(db, collection);


        this.collection = this.db.collection(collection);
        this.url = this.wdk.sparqlQuery(queries.regions);
    }


    __parseData(rawData) {
        return rawData.map(region => {
            region.name = region._idLabel.value;
            region._id = this.helper.parseId(region._id.value);
            region.secondsubs = this.helper.parseIds(region.secondsubs.value.split(', ').filter(Boolean));

            delete region._idLabel;
            return region;
        });
    }


    __getSparql(url) {

        let promise = new Promise((resolve, reject) => {
            request(url, (err, res, body) => {

                if (err) {
                    return reject(err);
                }

                let data;

                try {
                    data = JSON.parse(body);
                    console.log(data.results.bindings[0]);
                } catch (err) {
                    console.error(err);
                    return reject(err);
                }

                return resolve(data.results.bindings);
            });
        });

        return promise;


    }

}


module.exports = Regions;