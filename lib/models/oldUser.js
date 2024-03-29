'use strict';

const ms = require('ms');
const errors = require('storj-service-error-types');
const activator = require('hat').rack(256);
const crypto = require('crypto');
const mongoose = require('mongoose');
const SchemaOptions = require('../options');
const { isValidEmail } = require('../utils');
const uuid = require('uuid/v4');
const validateUUID = require('uuid-validate');

/**
 * Represents a user
 * @constructor
 */
var OldUserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    validate: {
      validator: value => isValidEmail(value),
      message: 'Invalid user email address'
    }
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
  hashpass: {
    type: String,
    validate: {
      validator: value => (value === null) ? true : (value.length === 64),
      message: '{VALUE} must either be 64 characters in length or null'
    }
  },
  pendingHashPass: {
    type: String,
    default: null
  },
  wallet: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  },
  activator: {
    type: mongoose.Schema.Types.Mixed,
    default: activator
  },
  deactivator: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  resetter: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  activated: {
    type: Boolean,
    default: false
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
  }
});

OldUserSchema.plugin(SchemaOptions);

OldUserSchema.index({
  resetter: 1
});

OldUserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret._id;
    delete ret.hashpass;
    delete ret.activator;
    delete ret.deactivator;
    delete ret.resetter;
    delete ret.pendingHashPass;
    delete ret.bytesDownloaded;
    delete ret.bytesUploaded;
  }
});

OldUserSchema.set('toObject', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret._id;
    delete ret.hashpass;
    delete ret.activator;
    delete ret.deactivator;
    delete ret.resetter;
    delete ret.pendingHashPass;
    delete ret.bytesDownloaded;
    delete ret.bytesUploaded;
  }
});

OldUserSchema.virtual('email').get(function() {
  return this._id;
});

OldUserSchema.virtual('totalBytes').get(function() {
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
 * Activates a user
 * @param {Function} callback
 */
OldUserSchema.methods.activate = function(callback) {
  this.activated = true;
  this.activator = null;
  this.save(callback);
};

/**
 * Increments the bytes transferred
 * @param {Number} bytes
 * @param {String} prop
 * @private
 */
/* jshint maxstatements:50, maxcomplexity:15 */
OldUserSchema.methods._recordBytes = function(bytes, prop, callback) {
  let now = Date.now();
  let {lastHourStarted, lastDayStarted, lastMonthStarted} = this[prop];

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
 */
OldUserSchema.methods.recordUploadBytes = function(bytes, callback) {
  return this._recordBytes(bytes, 'bytesUploaded', callback);
};

/**
 * Record upload transfer
 * @param {Number} bytes
 */
OldUserSchema.methods.recordDownloadBytes = function(bytes, callback) {
  return this._recordBytes(bytes, 'bytesDownloaded', callback);
};

/**
 * Check if the user is rate limited for the upload
 * @returns {Boolean}
 */
OldUserSchema.methods._isRateLimited = function(hourlyB, dailyB, monthlyB, prop) {
  const now = Date.now();

  let {lastHourStarted, lastDayStarted, lastMonthStarted} = this[prop];
  let {lastHourBytes, lastDayBytes, lastMonthBytes} = this[prop];

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
OldUserSchema.methods.isUploadRateLimited = function(hourlyB, dailyB, monthlyB) {
  return this._isRateLimited(hourlyB, dailyB, monthlyB, 'bytesUploaded');
};

/**
 * Check if the user is rate limited for the upload
 * @returns {Boolean}
 */
OldUserSchema.methods.isDownloadRateLimited = function(hourlyB, dailyB, monthlyB) {
  return this._isRateLimited(hourlyB, dailyB, monthlyB, 'bytesDownloaded');
};

/**
 * Deactivates a user
 * @param {Function} callback
 */
OldUserSchema.methods.deactivate = function(callback) {
  this.activated = false;
  this.activator = activator();
  this.save(callback);
};

OldUserSchema.statics.create = function(opts, email, passwd, callback) {
  const OldUser = this;
  const a = arguments;
  const hasOpts = a.length === 2;

  email = hasOpts ? opts.email : a[0];
  passwd = hasOpts ? opts.password : a[1];
  callback = hasOpts ? a[1] : a[2];

  const userObj = {
    _id: email,
    hashpass: crypto.createHash('sha256').update(passwd).digest('hex')
  };

  userObj.referralPartner = opts && opts.referralPartner ?
    opts.referralPartner : null;

  let user = new OldUser(userObj);

  if (!email) {
    return callback(new errors.BadRequestError('Must supply an email'));
  }

  // Check to make sure the password is already SHA-256 (or at least is the
  // correct number of bits).
  if (Buffer(passwd, 'hex').length * 8 !== 256) {
    return callback(new errors.BadRequestError(
      'Password must be hex encoded SHA-256 hash')
    );
  }

  OldUser.findOne({
    _id: email
  }, function(err, result) {
    if (err) {
      return callback(new errors.InternalError(err.message));
    }

    if (result) {
      return callback(new errors.BadRequestError(
        'Email is already registered')
      );
    }

    if (!isValidEmail(email)) {
      return callback(new errors.BadRequestError('Invalid email'));
    }

    user.save(function(err) {
      if (err) {
        return callback(new errors.InternalError(err.message));
      }

      return callback(null, user);
    });
  });
};

/**
 * Lookup a OldUser
 * @param {String} email
 * @param {String} password (hashed on client)
 * @param {Function} callback
 */
OldUserSchema.statics.lookup = function(email, passwd, callback) {
  let OldUser = this;

  if (!passwd) {
    return callback(new errors.NotAuthorizedError(
      'Invalid email or password')
    );
  }

  OldUser.findOne({
    _id: email,
    hashpass: crypto.createHash('sha256').update(passwd).digest('hex')
  }, function(err, user) {
    if (err) {
      return callback(new errors.InternalError(err.message));
    }

    if (!user) {
      return callback(new errors.NotAuthorizedError(
        'Invalid email or password')
      );
    }

    callback(null, user);
  });
};

module.exports = function(connection) {
  return connection.model('OldUser', OldUserSchema);
};

exports.Schema = OldUserSchema;
