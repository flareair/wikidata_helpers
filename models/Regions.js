'use strict';

const WikiData = require('./WikiData');
const queries = require('../queries.js');



class Regions extends WikiData {
    constructor(db, collection) {

        super(db, collection);


        this.collection = this.db.collection(collection);
        this.url = this.wdk.sparqlQuery(queries.regions);
    }


    __parseData(rawData) {
        return rawData.map(region => {
            region.name = region._id.label;
            region._id = region._id.value;

            region.flag = this.helper.makeImgUrl(region.flag);

            return region;
        });
    }

}


module.exports = Regions;