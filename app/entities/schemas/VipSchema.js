const {Schema} = require("mongoose");

module.export = new Schema({
   _id : {type: String, unique: true},
   linkedSmm : {type: String, default: null},
   linkedUsers: {type: [String], default: null}
});