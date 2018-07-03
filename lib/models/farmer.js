'use strict';

const mongoose = require('mongoose');

var Farmer = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: false
    },
    heft: {
        type: Number,
        required: true,
        default: 0,
    },
    updated: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    nodes: [{
        _id: false,
        id: {
            type: String,
            require: true,
        },
        heft: {
            type: Number,
            require: true,
            default: 0,
        },
    }],
    data_size: {
        type: Number,
    },
    bJoinMatch: {
        type: Boolean,
        default: false
    }
});

module.exports = function (connection) {
    return connection.model('Farmer', Farmer);
};
