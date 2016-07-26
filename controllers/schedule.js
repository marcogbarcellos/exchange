'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const Schedule = require('../models/schedule').Schedule;

exports.getAll = {
  handler: function(request, reply) {
    Schedule.find({}, function(err, schedules) {
      if (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
      reply(schedules);
    });
  }
};

exports.getOne = {
  handler: function(request, reply) {
    Schedule.findOne({
      '_id': request.params.id
    }, function(err, schedule) {
      if (err) {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
      }
      if (!schedule) {
        return reply(Boom.notFound());
      }
      reply(schedule);
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
        if (11000 === err.code || 11001 === err.code) {
          reply(Boom.forbidden("please provide another schedule, it already exist"));
        } else {
          reply(Boom.forbidden(err)); // HTTP 403
        }
      } else {
        reply(schedule); // HTTP 201
      }
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
    if(request.payload.firstUserId){
        reply(Boom.forbidden('Initial User cannot be changed'));
    }
    request.payload.dateUpdated = new Date();
    Schedule.findByIdAndUpdate(request.params.id, { $set: request.payload},{new: true},
      function (err, schedule) {
        if (err) {
          reply(Boom.forbidden(err)); // HTTP 403
        } 
        reply(schedule); // HTTP 201
      }
    );
  }
};

exports.remove = {
  handler: function(request, reply) {
    Schedule.findById(request.params.id, function(err, schedule) {
      if (!err && schedule) {
        schedule.remove();
        reply({
          message: "Schedule deleted successfully"
        });
      } else if (!err) {
        // Couldn't find the object.
        reply(Boom.notFound());
      } else {
        reply(Boom.badRequest("Could not delete schedule"));
      }
    });
  }
};
