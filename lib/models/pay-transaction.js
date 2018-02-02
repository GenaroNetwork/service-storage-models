'use strict';

const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const DEBIT_TYPES = require('../constants').DEBIT_TYPES;
const utils = require('../utils');
const errors = require('storj-service-error-types');


var PayTransactions = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User',
        validate: {
            validator: value => utils.isValidEmail(value),
            message: 'Invalid user email address'
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    payMethod: {
        type: String,
        enum: ['freeGNX', 'wallet', 'freeGNXAndWallet', 'none'],
        default: 'none'
    },
    payAmount: {
        freeGNXAmount: {
            type: Number,
            required: false
        },
        walletAmount: {
            type: Number,
            required: false
        }
    },
    ethTransactionHash: {
        type: String,
        required: false,
        default: null
    },
    state: {
        type: String,
        enum: ['init', 'pending', 'success', 'fail'],
        default: 'init'
    },
    comment: {
        type: String,
        required: false,
        default: null
    },
    tryCount: {
        type: Number,
        required: true,
        default: 0
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = function(connection) {
 return connection.model('PayTransactions', PayTransactions);
};
