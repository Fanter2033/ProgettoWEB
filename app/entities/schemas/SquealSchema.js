const {Schema} = require("mongoose");

const reaction_type = ['LIKE_A_LOT', 'LIKE', 'DO_NOT_LIKE', 'DISGUSTED'];
const message_type = ['MESSAGE_TEXT', 'IMAGE_URL', 'VIDEO_URL', 'POSITION'];

module.exports = new Schema({
    _id: {type: Number, unique: true},
    date: {type: Date},
    destinations: { linkedUsers: [String]  },
    sender: {type: String},
    reactions: {type: String, enum: reaction_type},
    message_type: {type: String, enum: message_type},
    positive_value: {type: Number},
    negative_value: {type: Number},
    critical_mass: {type: Number},
    quote_cost: {type: Number}
})