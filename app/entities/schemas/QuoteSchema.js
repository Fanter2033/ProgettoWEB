/* QUOTE\ SCHEMA */

const {Schema} = require( "mongoose");

module.exports = new Schema({
    id: {type: String, index: true, unique: true},
    limit_daily: Number,
    limit_weekly: Number,
    limit_monthly: Number,
    remaining_daily: Number,
    remaining_weekly: Number,
    remaining_monthly: Number
});