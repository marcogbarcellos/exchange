'use strict';

const Schedule      = require('../controllers/schedule');

// API Server Endpoints
exports.endpoints = [

  { method: 'GET',    path: '/schedules',      config: Schedule.getAll},
  { method: 'GET',    path: '/schedules/{id}', config: Schedule.getOne},
  { method: 'POST',   path: '/schedules',      config: Schedule.create},
  { method: 'PUT',    path: '/schedules/{id}', config: Schedule.update},
  { method: 'DELETE', path: '/schedules/{id}', config: Schedule.remove}
];
