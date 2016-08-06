'use strict';

const users = require('./user');
const schedules = require('./schedule');

module.exports = [].concat(users.endpoints, schedules.endpoints);