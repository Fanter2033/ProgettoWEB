const {Schema} = require("mongoose");

const message_type = ['MESSAGE_TEXT', 'IMAGE_URL', 'VIDEO_URL', 'POSITION'];

module.exports = new Schema({
    _id: {type: Number, unique: true},
    date: {type: Number},
    destinations: { linkedUsers: [String]  },
    sender: {type: String},
    reactions: {type: [String]},
    message_type: {type: String, enum: message_type},
    positive_value: {type: Number},
    negative_value: {type: Number},
    critical_mass: {type: Number},
    quote_cost: {type: Number},
    content: {type: String},
})