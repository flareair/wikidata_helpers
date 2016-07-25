'use strict';

const WikiData = require('./WikiData');
const queries = require('../queries.js');



class Countries extends WikiData {
    constructor(db, collection) {

        super(db, collection);


        this.collection = this.db.collection(collection);
        this.url = this.wdk.sparqlQuery(queries.countries);
    }


    __parseData(rawData) {
        return rawData.map(country => {
            country.name = country._id.label;
            country._id = country._id.value;

            let regions = country.regions.split(', ').filter(Boolean);

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

}


module.exports = Countries;