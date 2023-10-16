/* AUTHENTICATION SCHEMA */
const {Schema} = require( "mongoose");

module.exports = new Schema({
    ipAddress: {type: String, index: true},
    timestampStart: {type: Number, index: true},
    timestampEnd: {type: Number},
    serverResponseCode: {type: Number, index: true},
    requestedUsername: {type: String, index: true},
    requestedRole: {type: Number}
});