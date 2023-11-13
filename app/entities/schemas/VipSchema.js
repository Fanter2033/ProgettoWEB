const {Schema} = require("mongoose");

module.exports = new Schema({
   user: {type: String, unique: true},
   linkedSmm : {type: String},
   linkedUsers: {type: Array}
});