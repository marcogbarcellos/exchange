'use strict';

const constants 		 = require('./helper/constants');
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : constants.DEFAULT_ENV;
const Hapi 					 = require('hapi');
const Mongoose  		 = require('mongoose');
const routes 				 = require('./routes/index');
const config 				 = require('./config/config')[process.env.NODE_ENV];
const Db 						 = require('./config/database');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: config.server.host,
		port: config.server.port
});

server.route(routes);

server.start((err) => {
    console.log('listening on: http://127.0.0.1:'+config.server.port);
});

exports.server = server;