/* USER SCHEMA */

const {Schema} = require( "mongoose");

module.exports = new Schema({
    username: {type: String, index: true, unique: true},
    email: {type: String, index: true, unique: true},
    first_name: String,
    last_name: String,
    psw_shadow: String,
    registration_timestamp: Number,
    isUser: Boolean,
    isSmm: Boolean,
    isAdmin: Boolean,
    pro: {type: Boolean, required: true},
    locked: {type: Boolean, required: true}
});