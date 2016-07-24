const uuid 			 = require('node-uuid');
const Mongoose   = require('mongoose');
const Schema     = Mongoose.Schema;
// The data schema for an event that we're tracking in our analytics engine
const userSchema = new Schema({
	_id						: { type: String, unique : true, required : true, dropDups: true, default: uuid.v1},
  email        	: { type: String, trim: true, unique : true, required : true, dropDups: true  },
  password      : { type: String, required: true },
  firstName     : { type: String, trim: true },
  lastName      : { type: String, trim: true  },
  dateCreated   : { type: Date,   required: true, default: Date.now },
  dateUpdated   : { type: Date }
});

const user = Mongoose.model('user', userSchema);

module.exports = {
  User: user
};