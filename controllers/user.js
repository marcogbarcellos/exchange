'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const User = require('../models/user').User;

exports.getAll = {
  handler: function(request, reply) {
    User.find({}, function(err, users) {
      if (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
      reply(users);
    });
  }
};

exports.getOne = {
  handler: function(request, reply) {
    User.findOne({
      '_id': request.params.id
    }, function(err, user) {
      if (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
      if (!user) {
        return reply(Boom.notFound());
      }
      reply(user);
    });
  }
};

exports.create = {
  validate: {
    payload: {
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      firstName: Joi.string().min(3).max(30),
      lastName: Joi.string().min(3).max(30),
      email: Joi.string().email().required()
    }
  },
  handler: function(request, reply) {
    var user = new User(request.payload);
    user.save(function(err, user) {
      if (err) {
        if (11000 === err.code || 11001 === err.code) {
          reply(Boom.forbidden("please provide another user id, it already exist"));
        } else {
          reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
        }
      } else {
        reply(user); // HTTP 201
      }
    });
  }
};

exports.update = {
  validate: {
    payload: Joi.object({
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      firstName: Joi.string().min(7).max(30),
      lastName: Joi.string().min(7).max(30)
    }).required().min(1)
  },
  handler: function(request, reply) {
    request.payload.dateUpdated = new Date();
    User.findByIdAndUpdate(request.params.id, { $set: request.payload},{new: true},
      function (err, user) {
        if (err) {
          reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
        } 
        console.log('err',err);
        console.log('user',user);
        reply(user); // HTTP 201
      }
    );
  }
};

exports.remove = {
  handler: function(request, reply) {
    User.findById(request.params.id, function(err, user) {
      if (!err && user) {
        user.remove();
        reply({
          message: "User deleted successfully"
        });
      } else if (!err) {
        // Couldn't find the object.
        reply(Boom.notFound());
      } else {
        reply(Boom.badRequest("Could not delete user"));
      }
    });
  }
};
