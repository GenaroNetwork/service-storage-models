'use strict';

const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const errors = require('storj-service-error-types');

var Share = new mongoose.Schema({
    fromAddress: {
        type: String,
        ref: 'User',
        required: true
    },
    fromBucket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bucket'
    },
    toAddress: {
        type: String,
        ref: 'User',
        required: true
    },
    toBucket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bucket'
    },
    price: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    bucketEntryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BucketEntry'
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        default: 0
    },
    key: {
        type: String,
        required: true
    },
    ctr: {
        type: String,
        required: true
    },
    agree: {
        type: Boolean,
        default: false
    },
    agreeTime: {
        type: Date
    },
    reject: {
        type: Boolean,
        default: false
    },
    rejectTime: {
        type: Date
    },
    fromDelete: {
        type: Boolean,
        default: false
    },
    toDelete: {
        type: Boolean,
        default: false
    },
    valid: {
        type: Boolean,
        default: false
    }
});

Share.plugin(SchemaOptions);

Share.statics.create = function (fromAddress, fromBucket, toAddress, price, bucketEntryId, fileName, key, ctr, fileSize, callback) {
    const Share = this;

    if (!fromAddress) {
        return callback(new errors.BadRequestError('"fromAddress" is necessary to create a new share.'));
    }

    if (!fromBucket) {
        return callback(new errors.BadRequestError('"fromBucket" is necessary to create a new share.'));
    }

    if (!toAddress) {
        return callback(new errors.BadRequestError('"toAddress" is necessary to create a new share.'));
    }

    if (!price) {
        return callback(new errors.BadRequestError('"price" is necessary to create a new share.'));
    }

    if (!bucketEntryId) {
        return callback(new errors.BadRequestError('"bucketEntryId" is necessary to create a new share.'));
    }

    if (!key) {
        return callback(new errors.BadRequestError('"key" is necessary to create a new share.'));
    }

    if (!ctr) {
        return callback(new errors.BadRequestError('"ctr" is necessary to create a new share.'));
    }

    let shareObj = {
        fromAddress: fromAddress,
        fromBucket: fromBucket,
        toAddress: toAddress,
        price: price,
        bucketEntryId: bucketEntryId,
        key: key,
        ctr: ctr,
        fileName: fileName,
        fileSize: fileSize
    };

    let share = new Share(shareObj);

    share.save(function (err) {
        if (err) {
            return callback(new errors.InternalError(err.message));
        }

        return callback(null, share);
    });
}

module.exports = function (connection) {
    return connection.model('Share', Share);
};