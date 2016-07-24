'use strict';

/*const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');*/


const User      = require('../controllers/user');

// API Server Endpoints
exports.endpoints = [

  { method: 'POST',   path: '/users',      config: User.create},
  { method: 'GET',    path: '/users',      config: User.getAll},
  { method: 'GET',    path: '/users/{id}', config: User.getOne},
  { method: 'PUT',    path: '/users/{id}', config: User.update},
  { method: 'DELETE', path: '/users/{id}', config: User.remove}
];
