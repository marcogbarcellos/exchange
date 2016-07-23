'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {

            db.users.find((err, users) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(users);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.findOne({
                _id: request.params.id
            }, (err, user) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!user) {
                    return reply(Boom.notFound());
                }

                reply(user);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/users',
        handler: function (request, reply) {

            const user = request.payload;

            //Create an id
            user._id = uuid.v1();

            db.users.save(user, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(user);
            });
        },
        config: {
            validate: {
                payload: {
                    username: Joi.string().alphanum().min(3).max(30).required(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
                    firstName: Joi.string().min(7).max(30).required(),
                    lastName: Joi.string().min(7).max(30).required(),
                    email: Joi.string().email()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/users/{id}',
        handler: function (request, reply) {
            //TODO 
            db.users.update({
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
                    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
                    firstName: Joi.string().min(7).max(30).required(),
                    lastName: Joi.string().min(7).max(30).required()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.remove({
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

    //TODO
    server.route({
        method: 'POST',
        path: '/users/login',
        handler: function (request, reply) {

            reply('TO DO');
        }
    });

    //TODO
    server.route({
        method: 'POST',
        path: '/users/logout',
        handler: function (request, reply) {
            reply('TO DO');
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-users'
};
