const {Schema} = require("mongoose");

module.exports = new Schema({
    squeal_id: {type: Number, index: true},
    channel_type: {type: String, index: true},
    channel_name: {type: String, index: true}
})