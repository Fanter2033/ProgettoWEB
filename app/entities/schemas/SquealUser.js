const {Schema} = require("mongoose");

module.exports = new Schema({
    squeal_id: {type: Number, index: true},
    destination_username: {type: String, index: true}
})