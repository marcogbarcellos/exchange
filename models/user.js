'use strict';

const uuid = require('node-uuid');
const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
Mongoose.Promise = require('bluebird');


const Schema = Mongoose.Schema;

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const UserSchema = new Schema({
  _id: { type: String, unique: true, required: true, dropDups: true, default: uuid.v1 },
  email: { type: String, trim: true, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  dateCreated: { type: Date, required: true, default: Date.now },
  dateUpdated: { type: Date },
  lockUntil: { type: Number },
  removed: {type: Boolean, required: true, default: false}
});


UserSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next) {
  var self = this;
  // console.log('pre save user:'+self);
  // console.log('pre save user.isModifies("password"):'+self.isModified('password'));
  // only hash the password if it has been modified (or is new)
  if (!self.isModified('password')) {
    // console.log('Password not modified:');
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(self.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      self.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.methods.incLoginAttempts = function(cb) {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, cb);
  }
  var updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference 
var reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(email, password, cb) {
  this.findOne({ email: email }, function(err, user) {
    if (err) {
      return cb(err);
    }

    // make sure the user exists
    if (!user) {
      return cb(null, null, reasons.NOT_FOUND);
    }

    if (user.isLocked) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function(err) {
        if (err) {
          return cb(err);
        }
        return cb(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      if (isMatch) {
        if (!user.loginAttempts && !user.lockUntil) {
          return cb(null, user);
        }
        var updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };
        return user.update(updates, function(err) {
          if (err) {
            return cb(err);
          }
          return cb(null, user);
        });
      }
      user.incLoginAttempts(function(err) {
        if (err) {
          return cb(err);
        }
        return cb(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
};

const user = Mongoose.model('user', UserSchema);

module.exports = {
  User: user
};
