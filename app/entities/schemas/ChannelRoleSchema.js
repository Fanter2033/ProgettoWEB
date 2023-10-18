/* Channel SCHEMA */

const {Schema} = require("mongoose");

module.exports = new Schema({
    channel_name: {type: String, index: true, unique: false},
    type: {type: String},
    username : {type: String, index: true, unique: false},
    role : {type: Number, index: true, unique: false},
});

