'use strict';

const mongoose = require('mongoose');

var FarmerSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    heft: {
        type: Number,
        required: true,
        default: 0,
    },
    created: {
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
    txhash: {
        type: String,
    },
    txsucc: {
        type: Boolean,
        default: false,
    },
    data_size: {
        type: Number,
    }
});

module.exports = function (connection) {
    return connection.model('Farmer', FarmerSchema);
};
