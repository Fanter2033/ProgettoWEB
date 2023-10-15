const Quote = require("../entities/schemas/QuoteSchema");
const Model = require("./Model");
const mongoose = require("mongoose");
const QuoteDto = require("../entities/dtos/QuoteDto");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }
}

