'use strict';

const Boom     = require('boom');
const uuid     = require('node-uuid');
const Joi      = require('joi');
const Promise  = require('bluebird');
const User     = require('../models/user').User;
const Schedule = require('../models/schedule').Schedule;

exports.getAll = {
  handler: function(request, reply) {
    User.find({removed:false}, function(err, users) {
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
    .then(function(schedules) {
      return reply(schedules);
    })
    .catch(function(err) {
       reply(Boom.wrap(err));
    });
  }
};

exports.create = {
  validate: {
    payload: {
      password      : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      firstName     : Joi.string().min(3).max(30),
      lastName      : Joi.string().min(3).max(30),
      email         : Joi.string().email().required(),
      lockUntil     : Joi.number(),
      loginAttempts : Joi.number()
    }
  },
  handler: function(request, reply) {
    var user = new User(request.payload);
    User.find({email:user.email})
    .then(function(result) {
      if(result && result.length > 0){
        return Boom.wrap('user already exists');
      }
      return user.save();
    })
    .then(function(user) {
      if (!user) {

        return Promise.reject('could not create user.');
      } 
      return reply(user);
    })
    .catch(function(err) {
      reply(Boom.create(500, 'Internal MongoDB error',err));
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
    
    User.findById(request.params.id)
    .then(function (user){
      if(!user){
        return reply(Boom.notFound());
      }
      for (var k in request.payload) {
        user[k] = request.payload[k];
      }
      return user.save(); 
    })
    .then(function (user) {
      if(user) {
       return reply(user);
      }
      return Promise.reject(new Error('could not update user.'));  
    })
    .catch(function(err) {

       reply(Boom.wrap(err));
    });
  }
};

exports.remove = {
  handler: function(request, reply) {
    User.findById(request.params.id)
    .then(function (user){
      if(!user || user.removed){
        return reply(Boom.notFound());
      }
      user.removed = true;
      return user.save(); 
    })
    .then(function (user) {
      if(user) {
        reply(user);
      }  
    })
    .catch(function(err) {
       reply(Boom.wrap(err));
    });
  }
};

exports.login = {
  validate: {
    payload: {
      password  : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      email     : Joi.string().email().required()
    }
  },
  handler: function(request, reply) {
    User.getAuthenticated(request.payload.email, request.payload.password , function(err, user, reason) {
      if(err){
        return reply(Boom.forbidden('Login failed.'));
      }
      if(user){
        return reply(user);
      }
      // otherwise we can determine why we failed
      var reasons = User.failedLogin;
      switch (reason) {
          case reasons.NOT_FOUND:
              return reply(Boom.notFound('User not Found.'));
          case reasons.PASSWORD_INCORRECT:
              return reply(Boom.forbidden('Incorrect Password'));
          case reasons.MAX_ATTEMPTS:
              return reply(Boom.forbidden('You\'ve tried to login several times.Please wait for a while and try later.'));
      }

    });
  }
};
