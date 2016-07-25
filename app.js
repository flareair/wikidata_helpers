'use strict';

const dbClient = require('mongodb').MongoClient;
const Countries = require('./models/Countries');
const Regions = require('./models/Regions');
const Cities = require('./models/Cities');


dbClient.connect('mongodb://localhost:27017/test', function(err, db) {

    if (err) {
        return console.log(err);
    }

    let countries = new Countries(db, 'countries');
    countries.get()
        .then((countries) => {
            console.log(`${countries.length} countries`);
        });


    let regions = new Regions(db, 'regions');
    regions.get()
        .then((regions) => {
            console.log(`${regions.length} regions`);
        });

    let cities = new Cities(db, 'cities');
    cities.get()
        .then((cities) => {
            console.log(`${cities.length} cities`);
        });
});