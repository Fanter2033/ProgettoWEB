const Quote = require("../entities/schemas/QuoteSchema");
const Model = require("./Model");
const mongoose = require("mongoose");
const QuoteDto = require("../entities/dtos/QuoteDto");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

    /**
     *
     * @param username
     * @return {Promise<{}|QuoteDto>}
     *
     * return the quote of a specified user
     */
    async getQuote(username){
        await this.checkMongoose("Quote", Quote);
        let filter = {"_id":`${username}`};
        let quoteResult = await this.entityMongooseModel.find(filter);
        if (quoteResult.length === 1)
            return new QuoteDto(quoteResult[0]);
        return {}
    }
}

