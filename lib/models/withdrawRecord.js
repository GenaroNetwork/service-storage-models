'use strict';

const storj = require('storj-lib');
const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const crypto = require('crypto');
/**
 * Represents a payment info
 * @constructor
 */
var WithdrawRecord = new mongoose.Schema({
    farmerId: {
        type: String,
        ref: 'contact'
    },
    paymentAddr: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    gnx: {
        type: Number,
        default: 0
    },
    txHash: {
        type: String,
    }
});

WithdrawRecord.plugin(SchemaOptions);

WithdrawRecord.index({ farmerId: 1 });
WithdrawRecord.index({ paymentAddr: 1 });

module.exports = function (connection) {
    return connection.model('WithdrawRecord', WithdrawRecord);
};