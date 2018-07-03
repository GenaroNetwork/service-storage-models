'use strict';

const ms = require('ms');
const errors = require('storj-service-error-types');
const crypto = require('crypto');
const mongoose = require('mongoose');
const uuid = require('uuid/v4');
const validateUUID = require('uuid-validate');
const SchemaOptions = require('../options');
const { isValidEmail } = require('../utils');

/**
 * Represents a user
 * @constructor
 */
let UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true,
    default: uuid,
    validate: {
      validator: value => validateUUID(value, 4),
      message: 'Invalid UUID'
    }
  },
  publicKey: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  isFreeTier: {
    type: Boolean,
    default: false
  },
  preferences: {
    dnt: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  bytesUploaded: {
    lastHourStarted: {
      type: Date,
      required: false
    },
    lastHourBytes: {
      type: Number,
      default: 0
    },
    lastDayStarted: {
      type: Date,
      required: false
    },
    lastDayBytes: {
      type: Number,
      default: 0
    },
    lastMonthStarted: {
      type: Date,
      required: false
    },
    lastMonthBytes: {
      type: Number,
      default: 0
    },
    totalBytes: {
      type: Number,
      default: 0
    }
  },
  bytesDownloaded: {
    lastHourStarted: {
      type: Date,
      required: false
    },
    lastHourBytes: {
      type: Number,
      default: 0
    },
    lastDayStarted: {
      type: Date,
      required: false
    },
    lastDayBytes: {
      type: Number,
      default: 0
    },
    lastMonthStarted: {
      type: Date,
      required: false
    },
    lastMonthBytes: {
      type: Number,
      default: 0
    },
    totalBytes: {
      type: Number,
      default: 0
    }
  },
  referralPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    default: null
  },
  freeGnx: {
    type: Number,
    default: 0
  },
  limitBytes: {
    type: Number,
    default: 0
  }
});

UserSchema.plugin(SchemaOptions);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
    delete ret.bytesDownloaded;
    delete ret.bytesUploaded;
  }
});

UserSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
    delete ret.bytesDownloaded;
    delete ret.bytesUploaded;
  }
});

UserSchema.virtual('totalBytes').get(function() {
  let upload = 0;
  if(this.bytesUploaded && this.bytesUploaded.totalBytes) {
    upload = this.bytesUploaded.totalBytes;
  }
  let download = 0;
  if(this.bytesDownloaded && this.bytesDownloaded.totalBytes ) {
    download = this.bytesDownloaded.totalBytes;
  }
  return upload + download;
});

/**
 * Increments the bytes transferred
 * @param {Number} bytes
 * @param {String} prop
 * @private
 */
/* jshint maxstatements:50, maxcomplexity:15 */
UserSchema.methods._recordBytes = function (bytes, prop, callback) {
  let now = Date.now();
  let { lastHourStarted, lastDayStarted, lastMonthStarted } = this[prop];

  if (!lastHourStarted) {
    this[prop].lastHourStarted = Date.now();
    this[prop].lastHourBytes = 0;
  }

  if (!lastDayStarted) {
    this[prop].lastDayStarted = Date.now();
    this[prop].lastDayBytes = 0;
  }

  if (!lastMonthStarted) {
    this[prop].lastMonthStarted = Date.now();
    this[prop].lastMonthBytes = 0;
  }

  let hourReset = false;
  let dayReset = false;
  let monthReset = false;


  if (now - lastHourStarted >= ms('1h')) {
    this[prop].lastHourStarted = Date.now();
    this[prop].lastHourBytes = 0;
    hourReset = true;
  }

  if (now - lastDayStarted >= ms('24h')) {
    this[prop].lastDayStarted = Date.now();
    this[prop].lastDayBytes = 0;
    dayReset = true;
  }

  if (now - lastMonthStarted >= ms('30d')) {
    this[prop].lastMonthStarted = Date.now();
    this[prop].lastMonthBytes = 0;
    monthReset = true;
  }

  this[prop].lastHourBytes += bytes;
  this[prop].lastDayBytes += bytes;
  this[prop].lastMonthBytes += bytes;

  if (callback) {
    let set = {};
    set[prop + '.lastHourStarted'] = this[prop].lastHourStarted;
    set[prop + '.lastDayStarted'] = this[prop].lastDayStarted;
    set[prop + '.lastMonthStarted'] = this[prop].lastMonthStarted;

    let inc = {};
    if (hourReset) {
      set[prop + '.lastHourBytes'] = bytes;
    } else {
      inc[prop + '.lastHourBytes'] = bytes;
    }

    if (dayReset) {
      set[prop + '.lastDayBytes'] = bytes;
    } else {
      inc[prop + '.lastDayBytes'] = bytes;
    }

    if (monthReset) {
      set[prop + '.lastMonthBytes'] = bytes;
    } else {
      inc[prop + '.lastMonthBytes'] = bytes;
    }

    inc[prop + '.totalBytes'] = bytes;

    const update = { $set: set };
    if (Object.keys(inc).length > 0) {
      update.$inc = inc;
    }
    this.update(update, callback);
  }

  return this;
};

/**
 * Record upload transfer
 * @param {Number} bytes
 * @param callback
 */
UserSchema.methods.recordUploadBytes = function (bytes, callback) {
  return this._recordBytes(bytes, 'bytesUploaded', callback);
};

/**
 * Record upload transfer
 * @param {Number} bytes
 * @param callback
 */
UserSchema.methods.recordDownloadBytes = function (bytes, callback) {
  return this._recordBytes(bytes, 'bytesDownloaded', callback);
};

/**
 * Check if the user is rate limited for the upload
 * @returns {Boolean}
 */
UserSchema.methods._isRateLimited = function (hourlyB, dailyB, monthlyB, prop) {
  const now = Date.now();

  let { lastHourStarted, lastDayStarted, lastMonthStarted } = this[prop];
  let { lastHourBytes, lastDayBytes, lastMonthBytes } = this[prop];

  if (now - lastHourStarted >= ms('1h')) {
    lastHourBytes = 0;
  }

  if (now - lastDayStarted >= ms('24h')) {
    lastDayBytes = 0;
  }

  if (now - lastMonthStarted >= ms('30d')) {
    lastMonthBytes = 0;
  }

  return this.isFreeTier ?
    (lastHourBytes >= hourlyB) ||
    (lastDayBytes >= dailyB) ||
    (lastMonthBytes >= monthlyB)
    : false;
};

/**
 * Check if the user is rate limited for the upload
 * @returns {Boolean}
 */
UserSchema.methods.isUploadRateLimited = function (hourlyB, dailyB, monthlyB) {
  return this._isRateLimited(hourlyB, dailyB, monthlyB, 'bytesUploaded');
};

/**
 * Check if the user is rate limited for the upload
 * @returns {Boolean}
 */
UserSchema.methods.isDownloadRateLimited = function (hourlyB, dailyB, monthlyB) {
  return this._isRateLimited(hourlyB, dailyB, monthlyB, 'bytesDownloaded');
};

UserSchema.statics.create = function (opts, wallet, publicKey, callback) {
  const User = this;

  const a = arguments;
  const hasOpts = a.length === 2;
  wallet = hasOpts ? opts.wallet : a[0];
  publicKey = hasOpts ? opts.publicKey : a[1];
  callback = hasOpts ? a[1] : a[2];

  if(!wallet) {
    return callback(new errors.BadRequestError('"Wallet" is necessary to create a new user.'));
  }

  // if(!publicKey) {
  //   return callback(new errors.BadRequestError('"PublicKey" is necessary to create a new user.'));
  // }

  let userObj = {
    _id: wallet,
    publicKey: publicKey
  };

  userObj.referralPartner = opts && opts.referralPartner ? opts.referralPartner : null;

  let user = new User(userObj);

  User.findOne({
    _id: wallet
  }, function (err, result) {
    if (err) {
      return callback(new errors.InternalError(err.message));
    }

    if (result) {
      return callback(new errors.BadRequestError(
        'Wallet is already registered')
      );
    }

    user.save(function (err) {
      if (err) {
        return callback(new errors.InternalError(err.message));
      }

      return callback(null, user);
    });
  });
};

UserSchema.statics.transformFromOldUser = function (oldUser, publicKey, callback) {
  let wallet = oldUser.wallet;

  if(!wallet) {
    return callback(new errors.InternalError('Transform user error: No wallet address.'));
  }

  const User = this;
  User.findOne({_id: wallet}, function(err, user) {
    if(err) {
      return callback(new errors.InternalError(err.message));
    }
    if(user) {
      return callback(new errors.InternalError('Transform user error: User has been transformed.'));
    }
    let uuid = oldUser.uuid,
        created = oldUser.created,
        isFreeTier = oldUser.isFreeTier,
        preferences = oldUser.preferences,
        bytesUploaded = oldUser.bytesUploaded,
        bytesDownloaded = oldUser.bytesDownloaded,
        referralPartner = oldUser.referralPartner,
        freeGnx = oldUser.freeGnx;
    
    let usrObj = new User({
      _id: wallet,
      publicKey,
      uuid,
      created,
      isFreeTier,
      preferences,
      bytesUploaded,
      bytesDownloaded,
      referralPartner,
      freeGnx
    });

    usrObj.save(function(err) {
      if (err) {
        return callback(new errors.InternalError(err.message));
      }

      return callback(null, usrObj);
    });
  });
};

module.exports = function (connection) {
  return connection.model('User', UserSchema);
};

exports.Schema = UserSchema;
