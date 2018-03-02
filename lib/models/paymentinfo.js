'use strict';

const storj = require('storj-lib');
const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const crypto = require('crypto');
/**
 * Represents a payment info
 * @constructor
 */
var PaymentInfo = new mongoose.Schema({
    nodeID: [{
        type: String,
        ref: 'nodeID'
    }],
    paymentAddr: {
        type: String,
        ref: 'paymentAddr'
    },
    timestamp: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    Paid: {
        type: Boolean,
        default: false
    },
    txHash: {
        type: String,
    }
});

PaymentInfo.plugin(SchemaOptions);

PaymentInfo.index({ nodeID: 1 });
PaymentInfo.index({ PaymentAddr: 1 });

/**
 * Creates a PaymentInfo
 * @param {Object} contract
 * @param {Function} callback
 */
PaymentInfo.statics.create = function (contract, callback) {
    let PaymentInfo = this;


    PaymentInfo.findOne({ nodeID: paymentInfo.nodeID }, function (err, paymentInfo) {
        if (err) {
            return callback(err);
        }
        if (paymentInfo) {
            if (paymentInfo.timestamp >= contract.store_begin) {
                return callback(null, paymentInfo);
            }
            else {
                paymentInfo.paymentAddr = contract.payment_destination
                paymentInfo.save(function (err) {
                    if (err) {
                        if (err.code === 11000) {
                            return callback(new Error('Name already used by another nodeID'));
                        }
                        return callback(err);
                    }
                })
            }
        }
        else {
            let paymentInfo = new PaymentInfo({
                nodeID: contract.farmer_id,
                paymentAddr: contract.payment_destination,
                timestamp: contract.store_begin,
            });

            paymentInfo.save(function (err) {
                if (err) {
                    if (err.code === 11000) {
                        return callback(new Error('Name already used by another nodeID'));
                    }

                    return callback(err);
                }

            })
        }


    });

    PaymentInfo.statics.search = function (data, callback) {
        let PaymentInfo = this;

        PaymentInfo.findOne({ nodeID: data.nodeID }, function (err, paymentInfo) {
            if (err) {
                return callback(err);
            }

            if (!paymentInfo) {
                return callback(new Error('Failed to find the paymentInfo'));
            }

            callback(null, paymentInfo.paymentAddr);
        })
    };
};

PaymentInfo.static.settle = function (data, callback) {
    let PaymentInfo = this;

    PaymentInfo.findOne({ nodeID: data.nodeID }, function (err, paymentInfo) {
        if (err) {
            return callback(err);
        }

        if (!paymentInfo) {
            return callback(new Error('Fail to find the paymentInfo'));
        }

        paymentInfo.amount = paymentInfo.amount + data.size;
        paymentInfo.save(function (err) { return callback(err) });

    })
}
module.exports = function (connection) {
    return connection.model('PaymentInfo', PaymentInfo);
};
