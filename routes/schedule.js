'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/schedules',
        handler: function (request, reply) {

            db.schedules.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/schedules/{id}',
        handler: function (request, reply) {

            db.schedules.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/schedules',
        handler: function (request, reply) {

            const schedule = request.payload;

            //Create an id
            schedule._id = uuid.v1();

            db.schedules.save(schedule, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(schedule);
            });
        },
        config: {
            validate: {
                payload: {
                    from: Joi.date().timestamp('unix'),
                    to: Joi.date().timestamp('unix'),
                    lat: Joi.number(),
                    long: Joi.number()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/schedules/{id}',
        handler: function (request, reply) {

            db.schedules.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    from: Joi.date().timestamp('unix'),
                    to: Joi.date().timestamp('unix'),
                    lat: Joi.number(),
                    long: Joi.number()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/schedules/{id}',
        handler: function (request, reply) {

            db.schedules.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-schedules'
};
