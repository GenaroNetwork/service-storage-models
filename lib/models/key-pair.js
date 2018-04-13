'use strict';

const storj = require('storj-lib');
const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const crypto = require('crypto');
const utils = require('../utils');
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
        ref: 'User',
        validate: {
            validator: function (v) {
                return utils.isValidEmail(v);
            },
            message: 'Invalid user email address'
        },
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

KeyPair.plugin(SchemaOptions);

KeyPair.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.secretkey;
    }
});

KeyPair.set('toJson', {
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
    hmac.update(Date.now().toString());
    hmac.update(Math.random().toString());
    let secretKey = hmac.digest('hex');

    hmac = require('crypto').createHmac("sha1", user.uuid);
    hmac.update(user.uuid);
    hmac.update(Date.now().toString());
    hmac.update(Math.random().toString());
    hmac.update(user._id);
    let apiKey = hmac.digest('hex');

    let auth = options.auth || "xx";

    secretKey = auth + secretKey;
    apiKey = auth + apiKey;

    let keypair = new KeyPair({
        apikey: apiKey,
        secretkey: secretKey,
        user: user._id,
        prefix: options.prefix || "",
        suffix: options.suffix || "",
        limit: options.limit || Infinity,
        deadline: options.deadline || 0,
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




/**
 * Validate a key
 * @param {String} apiKey
 * @param {String} request
 * @param {String} apiHash 
 * @param {Function} callback
 */
KeyPair.statics.validateSecret = function (apiKey, request, apiHash, callback) {
    let KeyPair = this;
    new Promise((resolve, reject) => {
        let keyPair = KeyPair.findOne({ apikey: apiKey }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
        .then(keyPair => {
            let sha256 = require("crypto").createHash("sha256");
            sha256.update(request + keyPair.secretkey);
            let hash = sha256.digest("hex");
            if (hash !== apiHash) throw new Error("Permission denied");
            callback(null, keyPair);
        })
        .catch(err => callback(err, null));
}

/**
 * Validate a key
 * @param {String} apiKey
 * @param {String} auth
 * @param {String} path
 * @param {Function} callback
 */
KeyPair.statics.validateAuth = function (apiKey, auth, path, callback) {
    let KeyPair = this;
    new Promise((resolve, reject) => {
        let keyPair = KeyPair.findOne({ apikey: apiKey }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
        .then(keyPair => {
            let auth0 = keyPair.secretkey.substr(0, 1);
            let auth1 = keyPair.secretkey.substr(1, 1);

            let check0 = apiKey.substr(0, 1);
            let check1 = apiKey.substr(1, 1);

            let checked0 = false;
            let checked1 = false;
            let checkedPath = false;
            let checkedTime = false;
            let checkedLimit = false;

            if (auth0 === "x" || Number("0x" + auth0) & Number("0x" + check0) === Number("0x" + check0)) checked0 = true;

            if (auth1 === "x" || Number("0x" + auth1) & Number("0x" + check1) === Number("0x" + check1)) checked1 = true;

            if (path.startsWith(keyPair.prefix) && path.endsWith(keyPair.suffix)) checkedPath = true;

            if (keyPair.deadline === 0 || Date.now() <= new Date(keyPair.created).getTime() + keyPair.deadline) checkedTime = true;

            if (keyPair.limit > 0) checkedLimit = true;

            if (!(checked0 && checked1 && checkedPath && checkedTime && checkedLimit)) throw new Error("Permission denied");

            return new Promise((resolve, reject) => {
                let keyPair = KeyPair.findOneAndUpdate({ apikey: apiKey }, {
                    $inc: {
                        limit: -1
                    }
                }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            })
        })
        .catch(err => callback(err, null));
}

module.exports = function (connection) {
    return connection.model('KeyPair', KeyPair);
};
