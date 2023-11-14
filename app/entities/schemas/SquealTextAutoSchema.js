const {Schema} = require("mongoose");

module.exports = new Schema({
    _id: {type: Number, unique: true},
    iteration: {type: Number},
    iteration_end: {type: Number},
    quota_update_cost: {type: Number},
    next_scheduled_operation: {type: Number, index: true}
})