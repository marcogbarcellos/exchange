'use strict';

const constants 		 = require('./helper/constants');
const Hapi 					 = require('hapi');
const Mongoose  		 = require('mongoose');
const routes 				 = require('./routes/index');
const config 				 = require('./config/config')[process.env.NODE_ENV];
const db 						 = require('./config/database');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: config.server.host,
		port: config.server.port
});

//Starting Database
db.startDb();

server.route(routes);

server.start((err) => {
    console.log('listening on: http://127.0.0.1:'+config.server.port);
});

exports.server = server;