'use strict';

const WikiData = require('./WikiData');
const queries = require('../queries.js');



class Cities extends WikiData {
    constructor(db, collection) {

        super(db, collection);


        this.collection = this.db.collection(collection);
        this.url = this.wdk.sparqlQuery(queries.cities);
    }


    __parseData(rawData) {
        return rawData.map(city => {
            city.name = city._id.label;
            city._id = city._id.value;

            city.regions = this.helper.parseIds(city.regions.split(', ').filter(Boolean));

            return city;
        });
    }

}


module.exports = Cities;