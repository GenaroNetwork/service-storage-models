'use strict';

const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const errors = require('storj-service-error-types');

var NickName = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
});

NickName.index({ nickName: 1 }, { unique: true });

NickName.plugin(SchemaOptions);

NickName.statics.create = function (user, name, hash, callback) {
    const NickName = this;

    if (!user) {
        return callback(new errors.BadRequestError('"user" is necessary to create a new nick.'));
    }

    if (!name) {
        return callback(new errors.BadRequestError('"name" is necessary to create a new nick.'));
    }

    if (!hash) {
        return callback(new errors.BadRequestError('"hash" is necessary to create a new nick.'));
    }

    let nickObj = {
        user: user,
        nickName: name,
        hash: hash
    };

    let nickName = new NickName(nickObj);

    nickName.save(function (err) {
        if (err) {
            return callback(new errors.InternalError(err.message));
        }

        return callback(null, nickName);
    });
}

module.exports = function (connection) {
    return connection.model('NickName', NickName);
};