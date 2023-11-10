const Quote = require("../entities/schemas/QuoteSchema");
const Model = require("./Model");
const mongoose = require("mongoose");
const QuoteDto = require("../entities/dtos/QuoteDto");
const User = require("../entities/schemas/UserSchema");
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
  async getQuote(username) {
    await this.checkMongoose("Quote", Quote);
    let filter = { _id: `${username}` };
    let quoteResult = await this.entityMongooseModel.find(filter);
    if (quoteResult.length === 1) return new QuoteDto(quoteResult[0]);
    return {};
  }

  /**
   * @param quoteObj {QuoteDto}
   * @return {Promise<boolean>}
   */
  async createQuote(quoteObj) {
    await this.checkMongoose("Quote", Quote);
    quoteObj = this.mongo_escape(quoteObj.getDocument());
    let newQuote = new this.entityMongooseModel(quoteObj);

    try {
      await newQuote.save();
    } catch (ignored) {
      return false;
    }

    return true;
  }

  /**
   * @param username {string}
   * @return {Promise<boolean>}
   */
  async deleteQuote(username) {
    await this.checkMongoose("Quote", Quote);
    let filter = { _id: `${username}` };
    filter = this.mongo_escape(filter);
    try {
      await this.entityMongooseModel.deleteOne(filter);
    } catch (ignored) {
      return false;
    }
    return true;
  }

  /**
   * @param oldUsername {string}
   * @param newUsername {string}
   * @return {Promise<boolean>}
   */
  async changeUsernameQuote(oldUsername, newUsername){
    await this.checkMongoose("Quote", Quote);
    let filter = { _id: `${oldUsername}` };
    filter = this.mongo_escape(filter);
    let replace = {
      $set: {
        _id: `${newUsername}`
      }
    }
    replace = this.mongo_escape(replace);
    try {
      await this.entityMongooseModel.updateOne(filter, replace);
    } catch (ignored) {
      return false;
    }
    return true;
  }

  /**
   * @param {QuoteDto} quoteDto
   * @return {Promise<boolean>}
   */
  async patchQuote(quoteDto) {
    await this.checkMongoose("Quote", Quote);
    let filter = { _id: `${quoteDto.id}` };
    filter = this.mongo_escape(filter);
    let quoteObj = this.mongo_escape(quoteDto.getDocument());
    try {
      await this.entityMongooseModel.replaceOne(filter, quoteObj);
    } catch (ignored) {
      return false;
    }
    return true;
  }
};
