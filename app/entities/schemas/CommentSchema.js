const {Schema} = require("mongoose");

module.exports = new Schema({
    squeal_id: {type: Number, index: true},
    username: {type: String, index: true},
    comment: {type: String}
})