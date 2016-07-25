'use strict';

const dbClient = require('mongodb').MongoClient;
const Countries = require('./models/Countries');
const Regions = require('./models/Regions');
const Cities = require('./models/Cities');


dbClient.connect('mongodb://localhost:27017/test', function(err, db) {

    if (err) {
        return console.log(err);
    }

    let regions = new Regions(db, 'regions');
    regions.getByIds(["Q121104",
        "Q139126",
        "Q165376",
        "Q167485",
        "Q170309",
        "Q171382",
        "Q172052",
        "Q173808",
        "Q173816",
        "Q173821",
        "Q173830",
        "Q178471",
        "Q180330",
        "Q180415",
        "Q181220",
        "Q181235",
        "Q182487",
        "Q182493",
        "Q182844",
        "Q183015",
        "Q183021",
        "Q183028",
        "Q183036",
        "Q183056",
        "Q185442",
        "Q185575",
        "Q185752",
        "Q186392",
        "Q186395",
        "Q186418",
        "Q188147",
        "Q188157",
        "Q188933",
        "Q6667298"])
        .then((siblings) => {
            console.log(siblings.length);
        });
});