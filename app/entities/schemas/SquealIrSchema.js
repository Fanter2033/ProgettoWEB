const {Schema} = require("mongoose");

module.exports = new Schema({
    squeal_id: {type: Number, index: true},
    is_session_id: {type: Boolean},
    value: {type: String, index: true},
    reaction: {type: String, default: null}
});
