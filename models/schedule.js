const uuid 			 = require('node-uuid');
const Mongoose   = require('mongoose');
Mongoose.Promise = require('bluebird');
const Schema     = Mongoose.Schema;

const scheduleSchema = new Schema({
	_id              : { type: String, unique : true, required : true, dropDups: true, default: uuid.v1},
  firstUserId  		 : { type: String, required: true },
  secondUserId 		 : { type: String },
  currencyWanted   : { type: String, required: true },
  value 			 		 : { type: Number, required: true },
  dateFrom     		 : { type: Date,   required: true },
  dateTo   		 		 : { type: Date,   required: true },
  latitude     		 : { type: Number, required: true },
  longitude    		 : { type: Number, required: true },
  dateCreated  		 : { type: Date,   required: true, default: Date.now },
  dateUpdated      : { type: Date }
});

const schedule = Mongoose.model('schedule', scheduleSchema);

module.exports = {
  Schedule: schedule
};