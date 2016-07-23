'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');
const routes = require('./routes');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
		port: Number(process.env.PORT)
});

//Connect to db
server.app.db = mongojs('exchange', ['users','schedules']);

 
//Load plugins and start server
server.register(routes, (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {

        console.log('listening on: http://127.0.0.1:'+process.env.PORT);
    });

});
