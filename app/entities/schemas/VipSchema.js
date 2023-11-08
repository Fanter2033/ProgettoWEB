const {Schema} = require("mongoose");

module.export = new Schema({
   _id : {type: String, index:true, unique: true},
   linkedSmm : {type: String, default: null},
   linkedUsers: {type: [String], default: null}
}, {_id: false});