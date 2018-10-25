'use strict';

const storj = require('genaro-lib');
const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const crypto = require('crypto');
/**
 * Represents a storage bucket
 * @constructor
 */
var Bucket = new mongoose.Schema({
  bucketId: {
    type: String,
    required: true
  },
  storage: {
    type: Number,
    default: 0
  },
  transfer: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  pubkeys: [{
    type: String,
    ref: 'PublicKey'
  }],
  user: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String,
    default: function() {
      return 'Bucket-' + crypto.randomBytes(3).toString('hex');
    }
  },
  created: {
    type: Date,
    default: Date.now
  },
  publicPermissions: {
    type: [{
      type: String,
      enum: ['PUSH', 'PULL'],
    }],
    default: []
  },
  encryptionKey: {
    type: String,
    default: ''
  },
  nameIsEncrypted: {
    type: Boolean,
    default: true
  },
  limitStorage: {
    type: Number,
    default: 0
  },
  timeStart : {
    type: Number,
    default: 0
  },
  timeEnd: {
    type: Number,
    default: 0
  },
  backup: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    enum: [0, 1, 2],    // 0: normal; 1: outbox; 2: inbox;
    default: 0
  }
});

Bucket.plugin(SchemaOptions);

Bucket.index({ bucketId: 1 });
Bucket.index({ user: 1 });
Bucket.index({ created: 1 });
Bucket.index({ user: 1, name: 1 }, { unique: true });

Bucket.set('toObject', {
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret._id;

    ret.id = doc._id;
  }
});

/**
 * Creates a Bucket
 * @param {storage.models.User} user
 * @param {Object} data
 * @param {Function} callback
 */
Bucket.statics.create = function(user, data, callback) {
  let Bucket = this;

  let bucket = new Bucket({
    bucketId: data.bucketId,
    status: 'Active',
    pubkeys: data.pubkeys,
    user: user._id,
    limitStorage: data.limitStorage || 0,
    timeStart: data.timeStart,
    timeEnd: data.timeEnd,
    backup: data.backup
  });

  if (data.name) {
    bucket.name = data.name;
    bucket.nameIsEncrypted = data.nameIsEncrypted === false ? false : true;
  }

  // XXX THIS WILL BE DEPRECATED IN THE NEXT MAJOR RELEASE
  // XXX Make sure to update any code that depends on this being
  // XXX based on the name as soon as possible. Once this is
  // XXX deprecated the id will be a unique ObjectId
  // bucket._id = mongoose.Types.ObjectId(
  //   storj.utils.calculateBucketId(user._id, bucket.name)
  // );

  bucket.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        return callback(new Error('Name already used by another bucket'));
      }

      return callback(err);
    }

    Bucket.findOne({ _id: bucket._id }, function(err, bucket) {
      if (err) {
        return callback(err);
      }

      if (!bucket) {
        return callback(new Error('Failed to load created bucket'));
      }

      callback(null, bucket);
    });
  });
};

module.exports = function(connection) {
  return connection.model('Bucket', Bucket);
};
