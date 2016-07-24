'use strict';

const dbClient = require('mongodb').MongoClient;
const Countries = require('./Countries');


dbClient.connect('mongodb://localhost:27017/test', function(err, db) {

    if (err) {
        return console.log(err);
    }

    let countries = new Countries(db);
    countries.get()
        .then((countries) => {
            console.log(`${countries.length} countries`);
            // console.log(countries[3]);
            // db.close();
        })
        .then(() => {
            return countries.getOne('Q228');
        })
        .then((country) => {
            console.log(country);
            db.close();
        });
});