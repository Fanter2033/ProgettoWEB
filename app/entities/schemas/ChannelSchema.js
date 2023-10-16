/* Channel SCHEMA */

const {Schema} = require("mongoose");

module.exports = new Schema({
    channel_name: {type: String, index: true, unique: true},
    type: {type: String},
    private: {type: Boolean, default: false},
});