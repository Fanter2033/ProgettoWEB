const {schema} = require("mongoose");

module.export = new schema({
   _id : {type: String, unique: true},
   linkedSmm : {type: String, default: null},
   linkedUsers: {type: [String], default: null}
});