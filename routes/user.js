'use strict';

const User      = require('../controllers/user');

// API Server Endpoints
exports.endpoints = [

  { method: 'GET',    path: '/users',      					 config: User.getAll},
  { method: 'GET',    path: '/users/{id}', 					 config: User.getOne},
  { method: 'GET',    path: '/users/{id}/schedules', config: User.getUserSchedules},
  { method: 'POST',   path: '/users',      					 config: User.create},
  { method: 'POST',   path: '/users/login',      		 config: User.login},
  { method: 'PUT',    path: '/users/{id}', 					 config: User.update},
  { method: 'DELETE', path: '/users/{id}', 					 config: User.remove}
];
