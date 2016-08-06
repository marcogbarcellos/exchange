'use strict';

const async    = require('async');
const _        = require('lodash');
const mongoose = require('mongoose');

const resetDatabase = function(callback) {
  var collections = _.keys(mongoose.connection.collections)
  async.forEach(collections, function(collectionName, done) {
    
    // console.log('collection being deleted: ',collectionName);
    const collection = mongoose.connection.collections[collectionName];
    collection.drop(function(err) {
      done(null);
    })
  }, callback);
};


module.exports.resetDatabase = resetDatabase;