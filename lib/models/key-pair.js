'use strict';

const storj = require('storj-lib');
const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const crypto = require('crypto');
/**
 * Represents a storage bucket
 * @constructor
 */
let KeyPair = new mongoose.Schema({
    apikey: {
        type: String,
        unique: true,
        default: "xx0000000000000000000000000000000000000000", // 0x means Auth, 1 => read , 2 => write, 3(1+2)means read and write ,x => all
    },
    secretkey: {
        type: String,
        default: "xx0000000000000000000000000000000000000000", // 0x means Auth, 1 => read , 2 => write, 3(1+2)means read and write ,x => all
    },
    user: {
        type: String,
        required: true,
        default: "",
    },
    prefix: {
        type: String,
        default: "",
    },
    suffix: {
        type: String,
        default: "",
    },
    limit: {
        type: Number,
        default: Infinity,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    deadline: {
        type: Number,
        default: 0,
    }
});

Bucket.plugin(SchemaOptions);

ShardSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.secretkey;
    }
});

ShardSchema.set('toJson', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.secretkey;
    }
});

/**
 * Generate a key pair
 * @param {storage.models.User} user
 * @param {Object} options
 * @param {Function} callback
 */
KeyPair.statics.generate = function (user, options, callback) {
    let KeyPair = this;

    let hmac = require('crypto').createHmac("sha1", user.uuid);
    hmac.update(user.uuid);
    hmac.update(Date.now());
    hmac.update(Math.random());
    let secretKey = hmac.digest('hex');

    hmac.update(user._id);
    hmac.update(Date.now());
    hmac.update(Math.random());
    let apiKey = hmac.digest('hex');

    let auth = options.auth || "xx";

    secretKey = auth + secretKey;
    apiKey = auth + apiKey;

    let keypair = new KeyPair({
        apiKey: apiKey,
        secretKey: secretKey,
        user: user._id,
        prefix: options.prefix | "",
        suffix: options.suffix | "",
        limit: options.limit | Infinity,
        deadline: options.deadline | 0,
    });

    // XXX THIS WILL BE DEPRECATED IN THE NEXT MAJOR RELEASE
    // XXX Make sure to update any code that depends on this being
    // XXX based on the name as soon as possible. Once this is
    // XXX deprecated the id will be a unique ObjectId

    keypair.save(function (err) {
        if (err) {
            if (err.code === 11000) return callback(new Error('Apikey already in used.'));
            return callback(err);
        }

        callback(null, keypair);
    });
};

module.exports = function (connection) {
    return connection.model('KeyPair', KeyPair);
};
