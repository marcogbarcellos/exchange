const uuid 			 = require('node-uuid');
const Mongoose   = require('mongoose');
const Schema     = Mongoose.Schema;

// The data schema for an event that we're tracking in our analytics engine
const userSchema = new Schema({
	_id							 : { type: String, default: uuid.v1}
  firstUserId  		 : { type: Schema.ObjectId, required: true },
  secondUserId 		 : { type: Schema.ObjectId },
  currencyWanted   : { type: String, required: true },
  value 			 		 : { type: Number, required: true },
  dateFrom     		 : { type: Date, required: true },
  dateTo   		 		 : { type: Date, required: true },
  latitude     		 : { type: Number },
  longitude    		 : { type: Number },
  dateCreated  		 : { type: Date, required: true, default: Date.now }
});

const user = Mongoose.model('user', userSchema);

module.exports = {
  User: user
};