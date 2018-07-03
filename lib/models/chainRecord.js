'use strict';

const mongoose = require('mongoose');
const SchemaOptions = require('../options');

var ChainRecord = new mongoose.Schema({
    currentReadBlock: {
        type: Number,
        default: 0
    }
});

ChainRecord.plugin(SchemaOptions);

module.exports = function (connection) {
    return connection.model('ChainRecord', ChainRecord);
};