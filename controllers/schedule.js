'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const Schedule = require('../models/schedule').Schedule;

exports.getAll = {
  handler: function(request, reply) {
    Schedule.find({}, function(err, schedules) {
      if (err) {
        return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
      }
      return reply(schedules);
    });
  }
};

exports.getOne = {
  handler: function(request, reply) {
    Schedule.findOne({
      '_id': request.params.id
    }, function(err, schedule) {
      if (err) {
        return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
      }
      if (!schedule) {
        return reply(Boom.notFound());
      }
      return reply(schedule);
    });
  }
};

exports.create = {
  validate: {
    payload: {
      firstUserId:    Joi.string().required(),
      currencyWanted: Joi.string().required(),
      value:          Joi.number().min(20).max(10000).required(),
      dateFrom:       Joi.date().required(),
      dateTo:         Joi.date().required(),
      latitude:       Joi.number().required(),
      longitude:      Joi.number().required()
    }
  },
  handler: function(request, reply) {
    var schedule = new Schedule(request.payload);
    schedule.save(function(err, schedule) {
      if (err) {
        return reply(Boom.forbidden(err));
      }
      return reply(schedule);
    });
  }
};

exports.update = {
  validate: {
    payload: Joi.object({
      currencyWanted: Joi.string(),
      value:          Joi.number().integer().min(20).max(10000),
      dateFrom:       Joi.date(),
      dateTo:         Joi.date(),
      latitude:       Joi.number(),
      longitude:      Joi.number(),
    }).required().min(1)
  },
  handler: function(request, reply) {
    request.payload.dateUpdated = new Date();
    Schedule.findByIdAndUpdate(request.params.id, { $set: request.payload},{new: true},
      function (err, schedule) {
        if (err) {
          return reply(Boom.forbidden(err)); 
        }
        if(!schedule){
          return reply(Boom.notFound());
        }  
        return reply(schedule); 
      }
    );
  }
};

exports.remove = {
  handler: function(request, reply) {
    Schedule.findByIdAndRemove(request.params.id, function(err, schedule) {
      if(err){
        return reply(Boom.wrap(err, 500, 'Internal MongoDB error'));
      }
      if(!schedule){
        return reply(Boom.notFound());
      }
      return reply( { message: "User deleted successfully" } );
    });
  }
};
