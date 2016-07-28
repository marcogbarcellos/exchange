'use strict';

const Boom     = require('boom');
const uuid     = require('node-uuid');
const Joi      = require('joi');
const Promise  = require('bluebird');
const User     = require('../models/user').User;
const Schedule = require('../models/schedule').Schedule;

exports.getAll = {
  handler: function(request, reply) {
    User.find({}, function(err, users) {
      if (err) {
        return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
      }
      return reply(users);
    });
  }
};

exports.getOne = {
  handler: function(request, reply) {
    User.findOne({
      '_id': request.params.id
    }, function(err, user) {
      if (err) {
        return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
      }
      if (!user) {
        return reply(Boom.notFound());
      }
      return reply(user);
    });
  }
};

exports.getUserSchedules = {
  handler: function(request, reply) {
    User.findOne({ '_id': request.params.id })
    .then(function(user) {
      if (!user) {
        return reply(Boom.notFound());
      }
      return Schedule.find({ firstUserId: user._id });
    })
    .then(function(err,schedules) {
      
      return reply(schedules);
    })
    .catch(function(err) {
      return reply(Boom.wrap(err));
    });
  }
};

exports.create = {
  validate: {
    payload: {
      password  : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      firstName : Joi.string().min(3).max(30),
      lastName  : Joi.string().min(3).max(30),
      email     : Joi.string().email().required()
    }
  },
  handler: function(request, reply) {
    var user = new User(request.payload);
    user.save(function(err, user) {
      if (err) {
        return reply(Boom.forbidden(err));
      } 
      return reply(user);
    });
  }
};

exports.update = {
  validate: {
    payload: Joi.object({
      password  : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      firstName : Joi.string().min(7).max(30),
      lastName  : Joi.string().min(7).max(30)
    }).required().min(1)
  },
  handler: function(request, reply) {
    
    request.payload.dateUpdated = new Date();
    User.findByIdAndUpdate(request.params.id, { $set: request.payload},{new: true},
      function (err, user) {
        if (err) {
          return reply(Boom.forbidden(err)); 
        }
        if(!user){
          return reply(Boom.notFound());
        } 
        return reply(user); 
      }
    );
  }
};

exports.remove = {
  handler: function(request, reply) {
    User.findByIdAndRemove(request.params.id, function(err, user) {
      if(err){
        return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
      }
      if(!user){
        return reply(Boom.notFound());
      }
      return reply( { message: "User deleted successfully" } );
    });
  }
};
