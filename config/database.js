'use strict';

const mongoose = require('mongoose');
const config 	 = require('./config')[process.env.NODE_ENV];

let db = null;

function startDb() {
	db = mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db);
	
	db.connection.on('error', console.error.bind(console, 'connection error'));

	db.connection.once('open', function callback() {
	    console.log("Connection with database succeeded.");
	});

}

module.exports.startDb = startDb;
module.exports.db 		 = db;
